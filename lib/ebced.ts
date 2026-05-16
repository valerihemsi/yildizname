// Ebced (Abjad) — Arapça harflerin sayısal değerleri ve isim hesaplama
// Klasik İslami ilm-i hurûf geleneği

// Arapça harf → ebced değeri (kebir/büyük ebced)
export const EBCED_VALUES: Record<string, number> = {
  "ا": 1, "ب": 2, "ج": 3, "د": 4, "ه": 5, "و": 6, "ز": 7, "ح": 8, "ط": 9,
  "ي": 10, "ك": 20, "ل": 30, "م": 40, "ن": 50, "س": 60, "ع": 70, "ف": 80, "ص": 90,
  "ق": 100, "ر": 200, "ش": 300, "ت": 400, "ث": 500, "خ": 600, "ذ": 700, "ض": 800, "ظ": 900,
  "غ": 1000,
};

// Türkçe latin harfleri → Arapça (en yaygın transliterasyon)
// Not: Bağlam-bağımlı kararlar var (E/İ, U/Ü/O/Ö), basit kural seti kullanıyoruz
export const LATIN_TO_ARABIC: Record<string, string> = {
  "a": "ا", "â": "ا",
  "b": "ب",
  "c": "ج",
  "ç": "چ", // Farsça/Türkçe harf, ebced'de yoksa C değeri (3) ile değerlendirilir
  "d": "د",
  "e": "ه", // veya ي konuma göre
  "f": "ف",
  "g": "ك", // ya da گ
  "ğ": "غ",
  "h": "ح",
  "ı": "ا",
  "i": "ي",
  "î": "ي",
  "j": "ج", // Farsça ژ
  "k": "ك",
  "l": "ل",
  "m": "م",
  "n": "ن",
  "o": "و",
  "ö": "و",
  "p": "ب", // veya پ
  "r": "ر",
  "s": "س",
  "ş": "ش",
  "t": "ت",
  "u": "و",
  "ü": "و",
  "v": "و",
  "w": "و",
  "x": "كس",
  "y": "ي",
  "z": "ز",
};

// Türkçe latin → Arapça çevirisi (basit)
export function latinToArabic(name: string): string {
  const normalized = name.toLowerCase().trim();
  let result = "";
  for (const char of normalized) {
    if (char === " ") {
      result += " ";
      continue;
    }
    result += LATIN_TO_ARABIC[char] ?? "";
  }
  return result;
}

// Tek bir Arapça stringi için ebced değeri
export function ebcedDegeri(arabicText: string): number {
  let total = 0;
  for (const char of arabicText) {
    total += EBCED_VALUES[char] ?? 0;
  }
  return total;
}

// İsim için detaylı ebced analizi
export interface EbcedAnalizi {
  isim: string;
  arapcaYazim: string;
  toplamDeger: number;
  harfler: { harf: string; arapca: string; deger: number }[];
  bastakiHarf: { harf: string; arapca: string; deger: number };
  sondakiHarf: { harf: string; arapca: string; deger: number };
}

export function isimEbcedAnalizi(isim: string): EbcedAnalizi {
  const trimmed = isim.trim();
  const arabic = latinToArabic(trimmed);

  const harfler: { harf: string; arapca: string; deger: number }[] = [];
  const latinChars = trimmed.toLowerCase().split("").filter(c => c !== " ");

  for (const c of latinChars) {
    const ar = LATIN_TO_ARABIC[c] ?? "";
    let deger = 0;
    for (const arc of ar) {
      deger += EBCED_VALUES[arc] ?? 0;
    }
    if (ar) {
      harfler.push({ harf: c.toUpperCase(), arapca: ar, deger });
    }
  }

  const toplam = harfler.reduce((sum, h) => sum + h.deger, 0);

  return {
    isim: trimmed,
    arapcaYazim: arabic,
    toplamDeger: toplam,
    harfler,
    bastakiHarf: harfler[0] ?? { harf: "", arapca: "", deger: 0 },
    sondakiHarf: harfler[harfler.length - 1] ?? { harf: "", arapca: "", deger: 0 },
  };
}

// Anne adı ile kombine ebced (klasik müneccim hesabı)
export function ikiliEbcedAnalizi(isim: string, anneAdi: string): {
  isim: EbcedAnalizi;
  anne: EbcedAnalizi;
  birlesikToplam: number;
  fark: number;
  oran: string;
} {
  const isimAnaliz = isimEbcedAnalizi(isim);
  const anneAnaliz = isimEbcedAnalizi(anneAdi);
  const birlesik = isimAnaliz.toplamDeger + anneAnaliz.toplamDeger;
  const fark = Math.abs(isimAnaliz.toplamDeger - anneAnaliz.toplamDeger);
  const oran = anneAnaliz.toplamDeger > 0
    ? (isimAnaliz.toplamDeger / anneAnaliz.toplamDeger).toFixed(2)
    : "0";

  return {
    isim: isimAnaliz,
    anne: anneAnaliz,
    birlesikToplam: birlesik,
    fark,
    oran,
  };
}
