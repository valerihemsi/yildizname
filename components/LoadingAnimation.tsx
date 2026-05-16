"use client";

import { useEffect, useState } from "react";

const ASAMALAR = [
  "İsmin Arapça yazımı çözülüyor",
  "Harflerin değerleri tartılıyor",
  "Anne adının harfleri terazide",
  "Gün gezegeni belirleniyor",
  "Saat gezegeni okunuyor",
  "Dört unsur dengeleniyor",
  "Kader yolu açılıyor",
  "Yıldızname tablosu kuruluyor",
];

export default function LoadingAnimation() {
  const [asama, setAsama] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAsama((prev) => (prev + 1) % ASAMALAR.length);
    }, 2400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <div className="relative w-40 h-40 mb-12">
        {/* Dış halka — yavaş dönen */}
        <div className="absolute inset-0 sema">
          <svg viewBox="0 0 120 120" className="w-full h-full">
            <circle
              cx="60"
              cy="60"
              r="58"
              fill="none"
              stroke="rgba(212, 196, 160, 0.15)"
              strokeWidth="0.5"
              strokeDasharray="0.5 4"
            />
            <circle
              cx="60"
              cy="60"
              r="48"
              fill="none"
              stroke="rgba(212, 196, 160, 0.2)"
              strokeWidth="0.3"
            />
            {/* 7 gezegen noktası */}
            {[0, 1, 2, 3, 4, 5, 6].map((i) => {
              const angle = (i * 360) / 7 - 90;
              const rad = (angle * Math.PI) / 180;
              const x = 60 + 58 * Math.cos(rad);
              const y = 60 + 58 * Math.sin(rad);
              return (
                <circle
                  key={i}
                  cx={x}
                  cy={y}
                  r="1.2"
                  fill="rgba(212, 196, 160, 0.7)"
                />
              );
            })}
          </svg>
        </div>

        {/* İç halka — ters yöne dönen */}
        <div
          className="absolute inset-6 sema"
          style={{ animationDirection: "reverse", animationDuration: "120s" }}
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle
              cx="50"
              cy="50"
              r="48"
              fill="none"
              stroke="rgba(196, 184, 214, 0.15)"
              strokeWidth="0.3"
              strokeDasharray="1 6"
            />
            {/* 12 burç noktası */}
            {Array.from({ length: 12 }).map((_, i) => {
              const angle = (i * 360) / 12 - 90;
              const rad = (angle * Math.PI) / 180;
              const x = 50 + 48 * Math.cos(rad);
              const y = 50 + 48 * Math.sin(rad);
              return (
                <circle
                  key={i}
                  cx={x}
                  cy={y}
                  r="0.6"
                  fill="rgba(196, 184, 214, 0.5)"
                />
              );
            })}
          </svg>
        </div>

        {/* Merkez — nefes alan nokta */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="nefes">
            <div className="w-3 h-3 rounded-full bg-vurgu/80 shadow-[0_0_24px_rgba(212,196,160,0.5)]" />
          </div>
        </div>
      </div>

      <p className="text-center text-metin/70 text-base italic max-w-md font-light tracking-wide transition-opacity duration-700">
        {ASAMALAR[asama]}
      </p>

      <div className="flex items-center gap-3 mt-10">
        <div className="hat-yatay w-12" />
        <p className="text-vurgu/40 text-[10px] tracking-[0.5em] uppercase font-light">
          sabret
        </p>
        <div className="hat-yatay w-12" />
      </div>
    </div>
  );
}
