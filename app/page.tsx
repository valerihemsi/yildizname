"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Disclaimer from "@/components/Disclaimer";

export default function HomePage() {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [hata, setHata] = useState<string | null>(null);
  const [rizaVerildi, setRizaVerildi] = useState(false);
  const [form, setForm] = useState({
    isim: "",
    anneAdi: "",
    dogumTarihi: "",
    dogumSaati: "",
    dogumYeri: "",
  });

  const submitForm = () => {
    if (!rizaVerildi) {
      setHata("Devam etmek için onay kutusunu işaretlemeniz gerekir.");
      return;
    }
    setHata(null);
    setSubmitting(true);
    try {
      sessionStorage.setItem("yildizname-input", JSON.stringify(form));
      router.push("/rapor");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Bir hata oluştu";
      setHata(msg);
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-16">
      {!showForm ? (
        <div className="text-center max-w-2xl w-full">
          <div className="mb-14 giris">
            <div className="flex items-center justify-center gap-3 mb-10">
              <div className="hat-yatay w-16" />
              <div className="cember-isaret nefes" />
              <div className="hat-yatay w-16" />
            </div>

            <h1 className="font-display text-5xl md:text-7xl text-metin tracking-[0.25em] font-light mb-10 parla-yumusak">
              YILDIZNAME
            </h1>

            <div className="relative max-w-md mx-auto">
              {/* Köşe işaretleri — asimetrik */}
              <div className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t border-l border-vurgu/35" />
              <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b border-r border-vurgu/35" />

              <div className="cam rounded-xl px-8 py-7">
                {/* Üst süs */}
                <div className="flex items-center justify-center gap-2 mb-5">
                  <div className="hat-yatay w-8" />
                  <div className="w-1 h-1 rounded-full bg-vurgu/50" />
                  <div className="hat-yatay w-8" />
                </div>

                <p className="text-pasel/75 text-base md:text-lg italic leading-[1.9] font-light tracking-wide text-center">
                  harflerin sırrını çözen,
                  <br />
                  kaderin terazisinde tartılan,
                  <br />
                  gezegen saatlerinden okunan
                  <br />
                  <span className="text-vurgu/80 not-italic font-normal text-sm tracking-[0.25em] uppercase block mt-2">
                    sembolik tefekkür
                  </span>
                </p>

                {/* Alt süs */}
                <div className="flex items-center justify-center gap-2 mt-5">
                  <div className="hat-yatay w-8" />
                  <div className="w-1 h-1 rounded-full bg-vurgu/50" />
                  <div className="hat-yatay w-8" />
                </div>
              </div>
            </div>
          </div>

          <div className="giris-2">
            <button
              onClick={() => setShowForm(true)}
              className="group relative px-14 py-4 text-metin text-sm tracking-[0.4em] uppercase font-light hover:text-vurgu transition-all duration-700"
            >
              <span className="absolute inset-0 border border-vurgu/20 rounded-full group-hover:border-vurgu/50 transition-all duration-700" />
              <span className="absolute inset-0 rounded-full bg-vurgu/0 group-hover:bg-vurgu/[0.04] transition-all duration-700" />
              <span className="relative">başla</span>
            </button>
          </div>

          <div className="mt-20 giris-3">
            <Disclaimer />
          </div>
        </div>
      ) : (
        <div className="w-full max-w-xl giris">
          <button
            onClick={() => setShowForm(false)}
            className="text-metin-soluk hover:text-vurgu text-xs mb-8 tracking-[0.3em] uppercase transition-colors"
          >
            ← geri
          </button>

          <div className="cam rounded-3xl p-8 md:p-12">
            <div className="text-center mb-10">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="hat-yatay w-12" />
                <div className="w-1 h-1 rounded-full bg-vurgu/60" />
                <div className="hat-yatay w-12" />
              </div>
              <h2 className="font-display text-xl text-metin tracking-[0.3em] uppercase font-light">
                Sırrını Aç
              </h2>
              <p className="text-metin-soluk/60 text-xs mt-3 italic font-light">
                harflerin tartılması için
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                submitForm();
              }}
              className="space-y-6"
            >
              <FormField
                label="İsim"
                value={form.isim}
                onChange={(v) => setForm({ ...form, isim: v })}
                placeholder="ad ve soyad"
                required
              />
              <FormField
                label="Anne Adı"
                value={form.anneAdi}
                onChange={(v) => setForm({ ...form, anneAdi: v })}
                placeholder="annenin ismi"
                required
              />
              <FormField
                label="Doğum Tarihi"
                type="date"
                value={form.dogumTarihi}
                onChange={(v) => setForm({ ...form, dogumTarihi: v })}
                required
              />
              <FormField
                label="Doğum Saati"
                type="time"
                value={form.dogumSaati}
                onChange={(v) => setForm({ ...form, dogumSaati: v })}
                required
              />
              <FormField
                label="Doğum Yeri"
                value={form.dogumYeri}
                onChange={(v) => setForm({ ...form, dogumYeri: v })}
                placeholder="şehir / belde"
                required
              />

              <div className="pt-2">
                <label className="riza-kutu">
                  <input
                    type="checkbox"
                    checked={rizaVerildi}
                    onChange={(e) => setRizaVerildi(e.target.checked)}
                  />
                  <span className="riza-kutu-isaret" aria-hidden="true" />
                  <span className="riza-kutu-metin">
                    18 yaşımı doldurdum. Yukarıda girdiğim verilerin sembolik
                    yorum üretmek amacıyla işlenmesine ve bu amaçla Anthropic
                    (ABD) sunucularına aktarılmasına{" "}
                    <strong className="text-vurgu/90">açık rıza</strong>{" "}
                    veriyorum. Bunun kehanet, dînî fetva ya da tıbbî teşhis
                    olmadığını, yorumun yapay zekâ tarafından üretildiğini
                    anlıyorum.{" "}
                    <Link
                      href="/aydinlatma"
                      target="_blank"
                      className="riza-link"
                    >
                      Aydınlatma metni
                    </Link>
                    {" · "}
                    <Link
                      href="/kosullar"
                      target="_blank"
                      className="riza-link"
                    >
                      Kullanım koşulları
                    </Link>
                  </span>
                </label>
              </div>

              {hata && (
                <p className="text-rose-300/70 text-sm italic text-center">{hata}</p>
              )}

              <button
                type="submit"
                disabled={submitting || !rizaVerildi}
                className="group relative w-full mt-8 py-4 text-metin text-xs tracking-[0.5em] uppercase font-light hover:text-vurgu transition-all duration-700 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span className="absolute inset-0 border border-vurgu/25 rounded-full group-hover:border-vurgu/60 transition-all duration-700" />
                <span className="absolute inset-0 rounded-full bg-vurgu/0 group-hover:bg-vurgu/[0.05] transition-all duration-700" />
                <span className="relative">
                  {submitting ? "tartılıyor..." : "tartı kurulsun"}
                </span>
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

function FormField({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-vurgu/70 text-[10px] tracking-[0.35em] uppercase mb-2.5 font-light">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full bg-transparent border-b border-vurgu/20 px-1 py-2.5 text-metin placeholder-metin-soluk/30 focus:outline-none focus:border-vurgu/60 transition-all duration-500 font-light"
      />
    </div>
  );
}
