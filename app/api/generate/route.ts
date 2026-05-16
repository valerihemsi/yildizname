import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { hesaplaTumVeriler, buildPrompt, type KullaniciVerisi } from "@/lib/prompt";

export const runtime = "nodejs";
export const maxDuration = 60;

const encoder = new TextEncoder();

function sseEvent(event: string, data: unknown): Uint8Array {
  const payload = typeof data === "string" ? data : JSON.stringify(data);
  return encoder.encode(`event: ${event}\ndata: ${payload}\n\n`);
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as KullaniciVerisi;

  if (!body.isim || !body.anneAdi || !body.dogumTarihi || !body.dogumSaati || !body.dogumYeri) {
    return new Response(
      JSON.stringify({ error: "Tüm alanlar zorunlu — isim, anne adı, doğum tarihi, saati ve yeri" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "API yapılandırması eksik — ANTHROPIC_API_KEY tanımlı değil" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  const veriler = hesaplaTumVeriler(body);
  const { system, user } = buildPrompt(veriler);
  const client = new Anthropic({ apiKey });

  const stream = new ReadableStream({
    async start(controller) {
      try {
        controller.enqueue(sseEvent("veriler", veriler));

        const messageStream = client.messages.stream({
          model: "claude-sonnet-4-6",
          max_tokens: 8000,
          system,
          messages: [{ role: "user", content: user }],
        });

        for await (const event of messageStream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            controller.enqueue(sseEvent("delta", event.delta.text));
          }
        }

        controller.enqueue(sseEvent("done", {}));
        controller.close();
      } catch (err) {
        const message = err instanceof Error ? err.message : "Bilinmeyen bir hata oluştu";
        controller.enqueue(sseEvent("error", { error: message }));
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
