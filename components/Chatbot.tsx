"use client";

import { useEffect, useRef, useState } from "react";
import type { HesaplananVeriler } from "@/lib/prompt";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface ChatbotProps {
  veriler: HesaplananVeriler;
  yorum: string;
}

const BOLUMLER = [
  "İsmin Sırrı",
  "Karakter ve Kader",
  "Sağlık ve Enerji",
  "Kader Yolu",
  "Evlilik ve Aşk",
  "Çocuk ve Yuva",
  "Kariyer ve Para",
];

export default function Chatbot({ veriler, yorum }: ChatbotProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [hata, setHata] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, streaming]);

  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  const sendMessage = async (text: string) => {
    if (streaming || !text.trim()) return;
    setHata(null);

    const userMessage: ChatMessage = { role: "user", content: text.trim() };
    const updated = [...messages, userMessage];
    setMessages([...updated, { role: "assistant", content: "" }]);
    setStreaming(true);
    setInput("");

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ veriler, yorum, messages: updated }),
        signal: controller.signal,
      });

      const contentType = res.headers.get("Content-Type") ?? "";
      if (!res.ok || !contentType.includes("text/event-stream")) {
        const err = await res.json().catch(() => ({ error: "Bilinmeyen hata" }));
        throw new Error(err.error ?? "Bilinmeyen hata");
      }
      if (!res.body) throw new Error("Akış başlatılamadı");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let sepIndex: number;
        while ((sepIndex = buffer.indexOf("\n\n")) !== -1) {
          const chunk = buffer.slice(0, sepIndex);
          buffer = buffer.slice(sepIndex + 2);

          let eventName = "message";
          let dataStr = "";
          for (const line of chunk.split("\n")) {
            if (line.startsWith("event: ")) eventName = line.slice(7).trim();
            else if (line.startsWith("data: ")) dataStr += line.slice(6);
          }
          if (!dataStr) continue;

          if (eventName === "delta") {
            const piece = JSON.parse(dataStr) as string;
            setMessages((prev) => {
              const next = [...prev];
              const last = next[next.length - 1];
              if (last && last.role === "assistant") {
                next[next.length - 1] = { ...last, content: last.content + piece };
              }
              return next;
            });
          } else if (eventName === "error") {
            const parsed = JSON.parse(dataStr) as { error?: string };
            throw new Error(parsed.error ?? "Akış hatası");
          }
        }
      }
    } catch (err) {
      if ((err as { name?: string }).name === "AbortError") return;
      const msg = err instanceof Error ? err.message : "Bilinmeyen hata";
      setHata(msg);
      setMessages((prev) => {
        const next = [...prev];
        if (next[next.length - 1]?.role === "assistant" && !next[next.length - 1].content) {
          next.pop();
        }
        return next;
      });
    } finally {
      setStreaming(false);
      abortRef.current = null;
    }
  };

  const askSection = (bolum: string) => {
    sendMessage(`"${bolum}" bölümünü çok daha derinlemesine aç. Yüzeydeki bilgilerin altına in, yeni sembolik bağlantılar kur, somut hayata yansımalarını söyle.`);
  };

  return (
    <section className="mt-16 giris-3">
      <div className="text-center mb-10">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="hat-yatay w-16" />
          <div className="w-1 h-1 rounded-full bg-vurgu/60" />
          <div className="hat-yatay w-16" />
        </div>
        <h2 className="font-display text-xl text-metin tracking-[0.3em] uppercase font-light">
          Sırrı Derinleştir
        </h2>
        <p className="text-metin-soluk/60 text-xs mt-3 italic font-light">
          bir bölüm seç ya da kendi sorunu sor
        </p>
      </div>

      <div className="flex flex-wrap gap-2 justify-center mb-8">
        {BOLUMLER.map((bolum) => (
          <button
            key={bolum}
            onClick={() => askSection(bolum)}
            disabled={streaming}
            className="text-[10px] tracking-[0.25em] uppercase px-3 py-2 border border-vurgu/25 text-metin-soluk hover:text-vurgu hover:border-vurgu/60 hover:bg-vurgu/[0.04] transition-all duration-500 rounded-full font-light disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:text-metin-soluk disabled:hover:border-vurgu/25 disabled:hover:bg-transparent"
          >
            {bolum}
          </button>
        ))}
      </div>

      {messages.length > 0 && (
        <div className="cam rounded-2xl p-6 md:p-10 mb-8 space-y-8">
          {messages.map((msg, i) => (
            <div key={i}>
              {msg.role === "user" ? (
                <div className="border-l-2 border-vurgu/40 pl-5 py-1">
                  <p className="text-vurgu/60 text-[9px] tracking-[0.3em] uppercase mb-2 font-light">
                    Soru
                  </p>
                  <p className="text-metin/90 italic font-light leading-relaxed">{msg.content}</p>
                </div>
              ) : (
                <div className="rapor-icerik">
                  {msg.content ? (
                    <div dangerouslySetInnerHTML={{ __html: markdownToHtml(msg.content) }} />
                  ) : (
                    <div className="flex items-center gap-2 opacity-60">
                      <span className="w-1 h-1 rounded-full bg-vurgu nefes" />
                      <span className="text-vurgu/60 text-[10px] tracking-[0.4em] uppercase font-light">
                        düşünülüyor
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
          <div ref={endRef} />
        </div>
      )}

      {hata && (
        <p className="text-rose-300/70 text-sm italic text-center mb-6">{hata}</p>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage(input);
        }}
        className="flex gap-3 items-end max-w-2xl mx-auto"
      >
        <div className="flex-1">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage(input);
              }
            }}
            placeholder="kendi sorunu yaz…"
            rows={1}
            disabled={streaming}
            className="w-full bg-transparent border-b border-vurgu/20 px-1 py-2.5 text-metin placeholder-metin-soluk/30 focus:outline-none focus:border-vurgu/60 transition-all duration-500 font-light resize-none disabled:opacity-40"
          />
        </div>
        <button
          type="submit"
          disabled={streaming || !input.trim()}
          className="text-vurgu/80 hover:text-vurgu text-xs tracking-[0.3em] uppercase font-light disabled:opacity-30 disabled:cursor-not-allowed transition-colors pb-2"
        >
          {streaming ? "..." : "sor"}
        </button>
      </form>
    </section>
  );
}

function markdownToHtml(md: string): string {
  return md
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/^- (.+)$/gm, "<li>$1</li>")
    .replace(/(<li>.*<\/li>\n?)+/gs, (m) => `<ul>${m}</ul>`)
    .split(/\n\n+/)
    .map((block) => {
      const trimmed = block.trim();
      if (
        trimmed.startsWith("<h") ||
        trimmed.startsWith("<ul") ||
        trimmed.startsWith("<li")
      ) {
        return trimmed;
      }
      return `<p>${trimmed.replace(/\n/g, "<br/>")}</p>`;
    })
    .join("\n");
}
