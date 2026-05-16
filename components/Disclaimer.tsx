export default function Disclaimer() {
  return (
    <div className="relative max-w-2xl mx-auto">
      {/* Dış çerçeve — köşe işaretleri */}
      <div className="absolute -top-1 -left-1 w-3 h-3 border-t border-l border-vurgu/40" />
      <div className="absolute -top-1 -right-1 w-3 h-3 border-t border-r border-vurgu/40" />
      <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b border-l border-vurgu/40" />
      <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b border-r border-vurgu/40" />

      <div className="cam rounded-2xl px-8 md:px-12 py-10 md:py-12">
        {/* Üst mühür — İHTAR */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="hat-yatay w-14" />
            <div className="flex items-center gap-1.5">
              <div className="w-1 h-1 rounded-full bg-vurgu/40" />
              <div className="w-1.5 h-1.5 rounded-full bg-vurgu/70" />
              <div className="w-1 h-1 rounded-full bg-vurgu/40" />
            </div>
            <div className="hat-yatay w-14" />
          </div>
          <p className="font-display text-vurgu/80 text-[11px] tracking-[0.6em] uppercase font-light">
            İhtar
          </p>
          <div className="hat-yatay w-24 mt-3" />
        </div>

        {/* İçerik */}
        <div className="space-y-5 text-metin-soluk/80 text-sm leading-[1.85] font-light text-center md:text-left">
          <p>
            Bu yıldızname, klasik İslâmî <em className="text-pasel/90 not-italic font-normal">ebced</em> ve{" "}
            <em className="text-pasel/90 not-italic font-normal">ilm-i hurûf</em> geleneğinden
            ilham alan ve yapay zekâ destekli bir{" "}
            <em className="text-vurgu/90 not-italic font-normal">sembolik yorum</em> aracıdır.
            Kesin kehanet, dînî hüküm veya tıbbî / psikolojik teşhis sunmaz.
          </p>

          {/* Ayraç */}
          <div className="flex items-center justify-center gap-2 py-1">
            <div className="hat-yatay w-8" />
            <div className="w-1 h-1 rounded-full bg-vurgu-soluk/50" />
            <div className="hat-yatay w-8" />
          </div>

          <p>
            Her yorum, geleneksel sembolleri ve harf yorumlarını yeniden
            seslendirme denemesidir; kişisel farkındalık, kültürel keşif ve mistik
            bir tefekkür vesilesi olarak okunmalıdır.
          </p>

          {/* Ayraç */}
          <div className="flex items-center justify-center gap-2 py-1">
            <div className="hat-yatay w-8" />
            <div className="w-1 h-1 rounded-full bg-vurgu-soluk/50" />
            <div className="hat-yatay w-8" />
          </div>

          <p>
            Hayatınızla ilgili kararları yalnızca bu metne dayanarak vermeyiniz.
          </p>

          <p className="text-center pt-3 italic text-pasel/70 text-[13px] tracking-wide">
            Her ruh kendi yolunun terazisidir.
          </p>
        </div>

        {/* Alt mühür */}
        <div className="flex items-center justify-center gap-3 mt-8">
          <div className="hat-yatay w-12" />
          <svg viewBox="0 0 24 24" className="w-3 h-3" fill="none">
            <circle cx="12" cy="12" r="2" fill="rgba(212, 196, 160, 0.5)" />
            <circle cx="12" cy="12" r="6" stroke="rgba(212, 196, 160, 0.3)" strokeWidth="0.5" />
            <circle cx="12" cy="12" r="10" stroke="rgba(212, 196, 160, 0.15)" strokeWidth="0.3" />
          </svg>
          <div className="hat-yatay w-12" />
        </div>
      </div>
    </div>
  );
}
