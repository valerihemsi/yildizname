"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import LoadingAnimation from "@/components/LoadingAnimation";
import Disclaimer from "@/components/Disclaimer";
import Chatbot from "@/components/Chatbot";
import SectionedRapor from "@/components/SectionedRapor";
import type { HesaplananVeriler } from "@/lib/prompt";

export default function RaporPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [streaming, setStreaming] = useState(false);
  const [yorum, setYorum] = useState("");
  const [veriler, setVeriler] = useState<HesaplananVeriler | null>(null);
  const [hata, setHata] = useState<string | null>(null);
  const [pdfYapiliyor, setPdfYapiliyor] = useState(false);
  const startedRef = useRef(false);

  async function indirPdf() {
    if (!veriler || !yorum || pdfYapiliyor) return;
    setPdfYapiliyor(true);
    try {
      const { downloadRaporPdf } = await import("@/components/RaporPdf");
      await downloadRaporPdf(veriler, yorum);
    } catch {
      setHata("PDF oluşturulamadı. Lütfen tekrar deneyin.");
    } finally {
      setPdfYapiliyor(false);
    }
  }

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    const inputRaw = sessionStorage.getItem("yildizname-input");
    if (!inputRaw) {
      router.replace("/");
      return;
    }

    const input = JSON.parse(inputRaw);
    const controller = new AbortController();

    (async () => {
      try {
        const res = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(input),
          signal: controller.signal,
        });

        const contentType = res.headers.get("Content-Type") ?? "";
        if (!res.ok || !contentType.includes("text/event-stream")) {
          const errBody = await res.json().catch(() => ({ error: "Bilinmeyen hata" }));
          throw new Error(errBody.error ?? "Bilinmeyen hata");
        }

        if (!res.body) throw new Error("Akış başlatılamadı");

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let firstDelta = true;

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

            if (eventName === "veriler") {
              setVeriler(JSON.parse(dataStr) as HesaplananVeriler);
            } else if (eventName === "delta") {
              const text = JSON.parse(dataStr) as string;
              if (firstDelta) {
                firstDelta = false;
                setLoading(false);
                setStreaming(true);
              }
              setYorum((prev) => prev + text);
            } else if (eventName === "error") {
              const parsed = JSON.parse(dataStr) as { error?: string };
              throw new Error(parsed.error ?? "Akış sırasında hata");
            } else if (eventName === "done") {
              setStreaming(false);
            }
          }
        }
      } catch (err) {
        if ((err as { name?: string }).name === "AbortError") return;
        const msg = err instanceof Error ? err.message : "Bilinmeyen hata";
        setHata(msg);
        setLoading(false);
        setStreaming(false);
      }
    })();

    return () => controller.abort();
  }, [router]);

  if (loading) {
    return (
      <main className="min-h-screen">
        <LoadingAnimation />
      </main>
    );
  }

  if (hata) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
        <div className="cam rounded-2xl p-10 max-w-md text-center giris">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="hat-yatay w-12" />
            <div className="w-1 h-1 rounded-full bg-vurgu/60" />
            <div className="hat-yatay w-12" />
          </div>
          <h2 className="font-display text-vurgu text-base tracking-[0.3em] uppercase mb-4 font-light">
            Mani Çıktı
          </h2>
          <p className="text-metin/80 mb-8 italic text-sm font-light">{hata}</p>
          <button
            onClick={() => router.push("/")}
            className="text-metin-soluk hover:text-vurgu text-xs tracking-[0.4em] uppercase transition-colors"
          >
            başa dön
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-4 md:px-8 py-16">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-16 giris">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="hat-yatay w-20" />
            <div className="cember-isaret" />
            <div className="hat-yatay w-20" />
          </div>
          <h1 className="font-display text-3xl md:text-4xl text-metin tracking-[0.3em] font-light parla-yumusak">
            YILDIZNAME
          </h1>
          <p className="text-metin-soluk/60 text-xs mt-4 tracking-[0.3em] uppercase font-light">
            harflerin sırrı
          </p>
        </div>

        {veriler && (
          <div className="cam rounded-2xl p-8 mb-12 grid grid-cols-2 md:grid-cols-4 gap-6 text-center giris-2">
            <DataItem
              label="İsim Ebcedi"
              value={veriler.ebced.isim.toplamDeger.toString()}
              sub={veriler.ebced.isim.arapcaYazim}
            />
            <DataItem
              label="Kader Yolu"
              value={veriler.kaderYolu.kaderYoluSayisi.toString()}
              sub={veriler.kaderYolu.isMasterNumber ? "master sayı" : ""}
            />
            <DataItem
              label="Baskın Unsur"
              value={veriler.unsur.baskinUnsur}
              sub={veriler.unsur.eksikUnsur ? `eksik: ${veriler.unsur.eksikUnsur}` : "dengeli"}
            />
            <DataItem
              label="Gün Gezegeni"
              value={veriler.gezegen.dogumGunuGezegeni}
              sub={veriler.gezegen.gunAdi}
            />
          </div>
        )}

        {veriler && (
          <SectionedRapor yorum={yorum} streaming={streaming} veriler={veriler} />
        )}

        {!streaming && veriler && yorum && (
          <Chatbot veriler={veriler} yorum={yorum} />
        )}

        {!streaming && veriler && yorum && (
          <div className="flex items-center justify-center my-12">
            <span className="hat-yatay flex-1 max-w-[60px]" />
            <button
              onClick={indirPdf}
              disabled={pdfYapiliyor}
              className="group inline-flex items-center gap-3 mx-4 px-7 py-3.5 text-[11px] tracking-[0.35em] uppercase font-light border border-vurgu/40 text-vurgu/90 hover:text-vurgu hover:border-vurgu/80 hover:bg-vurgu/[0.06] transition-all duration-500 rounded-sm disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {pdfYapiliyor ? (
                <>
                  <span className="w-1 h-1 rounded-full bg-vurgu nefes" />
                  <span>hazırlanıyor</span>
                  <span className="w-1 h-1 rounded-full bg-vurgu nefes" />
                </>
              ) : (
                <>
                  <span>PDF olarak indir</span>
                  <span className="opacity-70 group-hover:translate-y-0.5 transition-transform duration-500">
                    ↓
                  </span>
                </>
              )}
            </button>
            <span className="hat-yatay flex-1 max-w-[60px]" />
          </div>
        )}

        <Disclaimer />

        <div className="text-center mt-12">
          <button
            onClick={() => {
              sessionStorage.removeItem("yildizname-input");
              router.push("/");
            }}
            className="text-metin-soluk hover:text-vurgu text-xs tracking-[0.4em] uppercase transition-colors"
          >
            yeniden başla
          </button>
        </div>
      </div>
    </main>
  );
}

function DataItem({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div>
      <p className="text-vurgu/60 text-[9px] tracking-[0.3em] uppercase mb-2 font-light">
        {label}
      </p>
      <p className="font-display text-metin text-lg tracking-wider font-light">{value}</p>
      {sub && <p className="text-metin-soluk/50 text-[10px] mt-1.5 italic font-light">{sub}</p>}
    </div>
  );
}

