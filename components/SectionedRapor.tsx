"use client";

import { useRef, useState } from "react";
import type { HesaplananVeriler } from "@/lib/prompt";

interface Section {
  title: string;
  body: string;
}

interface ElaborationState {
  text: string;
  streaming: boolean;
  error: string | null;
}

interface SectionedRaporProps {
  yorum: string;
  streaming: boolean;
  veriler: HesaplananVeriler;
}

function parseReport(yorum: string): { intro: string; sections: Section[] } {
  const lines = yorum.split("\n");
  let intro = "";
  const sections: Section[] = [];
  let current: Section | null = null;

  for (const line of lines) {
    const m = line.match(/^## (.+)$/);
    if (m) {
      if (current) sections.push(current);
      current = { title: m[1].trim(), body: "" };
    } else if (current) {
      current.body += (current.body ? "\n" : "") + line;
    } else {
      intro += (intro ? "\n" : "") + line;
    }
  }
  if (current) sections.push(current);
  return { intro: intro.trim(), sections };
}

function markdownToHtml(md: string): string {
  return md
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/^- (.+)$/gm, "<li>$1</li>")
    .replace(/(<li>.*<\/li>\n?)+/gs, (m) => `<ul>${m}</ul>`)
    .split(/\n\n+/)
    .map((block) => {
      const trimmed = block.trim();
      if (!trimmed) return "";
      if (
        trimmed.startsWith("<h") ||
        trimmed.startsWith("<ul") ||
        trimmed.startsWith("<li")
      ) {
        return trimmed;
      }
      return `<p>${trimmed.replace(/\n/g, "<br/>")}</p>`;
    })
    .filter(Boolean)
    .join("\n");
}

export default function SectionedRapor({ yorum, streaming, veriler }: SectionedRaporProps) {
  const { intro, sections } = parseReport(yorum);
  const [elaborations, setElaborations] = useState<Record<number, ElaborationState>>({});
  const abortRefs = useRef<Record<number, AbortController>>({});

  const requestElaboration = async (index: number, title: string) => {
    if (elaborations[index]?.streaming) return;

    setElaborations((prev) => ({
      ...prev,
      [index]: { text: "", streaming: true, error: null },
    }));

    const controller = new AbortController();
    abortRefs.current[index] = controller;

    try {
      const userMessage = `"${title}" bölümünü çok daha derinlemesine aç. Yüzeydeki bilgilerin altına in, yeni sembolik bağlantılar kur, somut hayata yansımalarını söyle.`;

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          veriler,
          yorum,
          messages: [{ role: "user", content: userMessage }],
        }),
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
            setElaborations((prev) => ({
              ...prev,
              [index]: {
                ...(prev[index] ?? { text: "", streaming: true, error: null }),
                text: (prev[index]?.text ?? "") + piece,
              },
            }));
          } else if (eventName === "error") {
            const parsed = JSON.parse(dataStr) as { error?: string };
            throw new Error(parsed.error ?? "Akış hatası");
          }
        }
      }

      setElaborations((prev) => ({
        ...prev,
        [index]: { ...(prev[index] ?? { text: "", streaming: false, error: null }), streaming: false },
      }));
    } catch (err) {
      if ((err as { name?: string }).name === "AbortError") return;
      const msg = err instanceof Error ? err.message : "Bilinmeyen hata";
      setElaborations((prev) => ({
        ...prev,
        [index]: {
          ...(prev[index] ?? { text: "", streaming: false, error: null }),
          streaming: false,
          error: msg,
        },
      }));
    } finally {
      delete abortRefs.current[index];
    }
  };

  return (
    <article className="cam rounded-2xl p-8 md:p-14 mb-12 giris-3 relative">
      {intro && (
        <div
          className="rapor-icerik"
          dangerouslySetInnerHTML={{ __html: markdownToHtml(intro) }}
        />
      )}

      {sections.map((section, i) => {
        const isLast = i === sections.length - 1;
        const sectionComplete = !streaming || !isLast;
        const elab = elaborations[i];

        return (
          <div key={i} className="bolum">
            <div className="rapor-icerik">
              <h2>{section.title}</h2>
              <div dangerouslySetInnerHTML={{ __html: markdownToHtml(section.body) }} />
            </div>

            {sectionComplete && (
              <div className="mt-8 mb-2 flex items-center justify-center gap-4">
                <span className="hat-yatay flex-1 max-w-[60px]" />
                <button
                  onClick={() => requestElaboration(i, section.title)}
                  disabled={elab?.streaming}
                  className="group inline-flex items-center gap-2.5 px-5 py-2.5 text-[10px] tracking-[0.35em] uppercase font-light border border-vurgu/40 text-vurgu/90 hover:text-vurgu hover:border-vurgu/80 hover:bg-vurgu/[0.06] transition-all duration-500 rounded-sm disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-vurgu/90 disabled:hover:border-vurgu/40"
                >
                  {elab?.streaming ? (
                    <>
                      <span className="w-1 h-1 rounded-full bg-vurgu nefes" />
                      <span>derine iniliyor</span>
                      <span className="w-1 h-1 rounded-full bg-vurgu nefes" />
                    </>
                  ) : elab?.text ? (
                    <>
                      <span>tekrar detaylandır</span>
                      <span className="opacity-70 group-hover:translate-y-0.5 transition-transform duration-500">↓</span>
                    </>
                  ) : (
                    <>
                      <span>detaylandır</span>
                      <span className="opacity-70 group-hover:translate-y-0.5 transition-transform duration-500">↓</span>
                    </>
                  )}
                </button>
                <span className="hat-yatay flex-1 max-w-[60px]" />
              </div>
            )}

            {elab && (elab.text || elab.error) && (
              <div className="mt-6 ml-2 pl-6 border-l border-vurgu/20">
                {elab.error ? (
                  <p className="text-rose-300/70 text-sm italic">{elab.error}</p>
                ) : (
                  <>
                    <p className="text-vurgu/60 text-[9px] tracking-[0.3em] uppercase mb-3 font-light">
                      derin okuma
                    </p>
                    <div
                      className="rapor-icerik"
                      dangerouslySetInnerHTML={{ __html: markdownToHtml(elab.text) }}
                    />
                    {elab.streaming && (
                      <div className="flex items-center gap-2 mt-3 opacity-60">
                        <span className="w-1 h-1 rounded-full bg-vurgu nefes" />
                        <span className="text-vurgu/60 text-[10px] tracking-[0.4em] uppercase font-light">
                          yazılıyor
                        </span>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        );
      })}

      {streaming && sections.length === 0 && (
        <div className="flex items-center justify-center gap-2 mt-4 opacity-60">
          <span className="w-1 h-1 rounded-full bg-vurgu nefes" />
          <span className="text-vurgu/60 text-[10px] tracking-[0.4em] uppercase font-light">
            yazılıyor
          </span>
          <span className="w-1 h-1 rounded-full bg-vurgu nefes" />
        </div>
      )}

      {streaming && sections.length > 0 && (
        <div className="flex items-center justify-center gap-2 mt-8 opacity-60">
          <span className="w-1 h-1 rounded-full bg-vurgu nefes" />
          <span className="text-vurgu/60 text-[10px] tracking-[0.4em] uppercase font-light">
            yazılıyor
          </span>
          <span className="w-1 h-1 rounded-full bg-vurgu nefes" />
        </div>
      )}
    </article>
  );
}
