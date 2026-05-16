import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import type { HesaplananVeriler } from "@/lib/prompt";

export const runtime = "nodejs";
export const maxDuration = 300;

const encoder = new TextEncoder();

function sseEvent(event: string, data: unknown): Uint8Array {
  return encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface ChatBody {
  veriler: HesaplananVeriler;
  yorum: string;
  messages: ChatMessage[];
}

const CHAT_SYSTEM_BASE = `Sen klasik yıldızname, ebced ve ilm-i hurûf geleneğinde yetişmiş bir yorumcusun. Daha önce bu kişi için yedi bölümlük bir yıldızname yorumu ürettin. Şimdi kullanıcı, o yorumun belirli kısımları hakkında daha derin sorular soruyor.

GÖREVİN: Kullanıcının sorduğu konuyu ilk yorumdaki kısa hâlinden çok daha derinlemesine aç. Sembolik bağlantıları (ebced, gezegen, unsur, kader yolu) yeniden kullan ama bu kez yeni içgörüler getir — sadece tekrar etme.

YASAK İFADELER — Bunları KESİNLİKLE KULLANMA:
- "Bismillâhirrahmânirrahîm", "Bismillah" veya benzeri dini başlangıç formülleri
- "Vallâhu a'lemu bi's-savâb", "Allahu a'lem" veya benzeri Arapça kapanış/ihtirazî formüller
- "Levh-i mahfûzun", "Levh-i mahfuz" veya gaybî kitap göndermeleri
- "İnşallah", "Maşallah", "Subhanallah", "Estağfirullah" gibi Arapça dini ifadeler
- Ayet alıntıları, hadis alıntıları, Arapça dualar
- "Ey falanca" tarzı Arapça/Osmanlı hitap kalıpları
- Vacib, farz, sünnet, mübah gibi fıkhî terimler

DİL TONU:
- Türkçe, akıcı, modern ama sembolik
- Eski yıldızname üslubunun **dili** değil **sezgisini** kullan
- Müneccim-bilge gibi, ama dini-vaiz gibi değil
- Felsefi, derin, katmanlı; ama dini-hutbe değil
- Yüzeysel olumlama yapma — karanlık ihtimalleri de söyle

YANIT BİÇİMİ:
- Markdown kullan: ## başlıklar, **kalın**, *italik*
- 3-6 paragraf yeter; her paragraf yoğun ve özlü
- Sembolik referansları somut hayata bağla
- Açılış selamlamasıyla başlama, doğrudan içeriğe gir
- Sonda "başka bir şey?" gibi cliché kapanışlar koyma`;

function buildChatSystem(veriler: HesaplananVeriler, yorum: string): string {
  const { kullanici, ebced, kaderYolu, unsur, gezegen, saat } = veriler;

  const profile = `## KİŞİNİN SEMBOLİK PROFİLİ

- İsim: ${kullanici.isim} (Arapça: ${ebced.isim.arapcaYazim}, ebced: ${ebced.isim.toplamDeger})
- Anne adı: ${kullanici.anneAdi} (Arapça: ${ebced.anne.arapcaYazim}, ebced: ${ebced.anne.toplamDeger})
- Doğum: ${kullanici.dogumTarihi} ${kullanici.dogumSaati}, ${kullanici.dogumYeri}
- Birleşik ebced toplamı: ${ebced.birlesikToplam}
- Kader yolu sayısı: ${kaderYolu.kaderYoluSayisi}${kaderYolu.isMasterNumber ? " (MASTER SAYI)" : ""}
- Baskın unsur: ${unsur.baskinUnsur} | İkinci: ${unsur.ikinciUnsur} | Eksik: ${unsur.eksikUnsur ?? "yok"}
- Gün gezegeni: ${gezegen.dogumGunuGezegeni} (${gezegen.gunGezegenOzellikleri.modernAd}) — ${gezegen.gunGezegenOzellikleri.mizac}
- Saat gezegeni: ${gezegen.dogumSaatiGezegeni} (${gezegen.saatGezegenOzellikleri.modernAd}) — ${gezegen.saatGezegenOzellikleri.mizac}
- Doğum vakti: ${saat.gunOgun} — ${saat.vaktiSembolik}

## DAHA ÖNCE ÜRETİLEN YEDİ BÖLÜMLÜK YORUM

${yorum}`;

  return `${CHAT_SYSTEM_BASE}\n\n${profile}`;
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as ChatBody;

  if (!body.veriler || !body.yorum || !Array.isArray(body.messages) || body.messages.length === 0) {
    return new Response(
      JSON.stringify({ error: "Eksik bağlam — yıldızname yorumu, hesaplanan veriler ve mesaj listesi zorunlu" }),
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

  const client = new Anthropic({ apiKey });
  const system = buildChatSystem(body.veriler, body.yorum);
  const messages = body.messages.slice(-20);

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const messageStream = client.messages.stream({
          model: "claude-sonnet-4-6",
          max_tokens: 3000,
          system,
          messages,
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
