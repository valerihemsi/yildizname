// Harflerin Tabiatı — Dört Unsur (Ateş, Hava, Su, Toprak)
// Klasik ilm-i hurûf'ta her harfin bir unsur tabiatı vardır

export type Unsur = "ateş" | "hava" | "su" | "toprak";

export const HARF_UNSURLARI: Record<string, Unsur> = {
  // Ateş (نارية) — sıcak, kuru, etkin, dışa dönük
  "ا": "ateş", "ه": "ateş", "ط": "ateş", "م": "ateş", "ف": "ateş", "ش": "ateş", "ذ": "ateş",
  // Hava (هوائية) — sıcak, nemli, iletişim, hareket
  "ب": "hava", "و": "hava", "ي": "hava", "ن": "hava", "ص": "hava", "ت": "hava", "ض": "hava",
  // Su (مائية) — soğuk, nemli, duygu, akış
  "ج": "su", "ز": "su", "ك": "su", "س": "su", "ق": "su", "ث": "su", "ظ": "su",
  // Toprak (ترابية) — soğuk, kuru, sebat, somut
  "د": "toprak", "ح": "toprak", "ل": "toprak", "ع": "toprak", "ر": "toprak", "خ": "toprak", "غ": "toprak",
};

// Unsur özellikleri (LLM yorumu için hint)
export const UNSUR_OZELLIKLERI: Record<Unsur, {
  sicaklik: string;
  rutubet: string;
  mizac: string;
  gezegenler: string[];
  burclar: string[];
  organlar: string;
  cuhrac: string; // klasik humoral karşılık
}> = {
  "ateş": {
    sicaklik: "sıcak",
    rutubet: "kuru",
    mizac: "Atılgan, gururlu, parlak, çabuk öfkelenen, ışık veren",
    gezegenler: ["Şems (Güneş)", "Merih (Mars)"],
    burclar: ["Koç", "Aslan", "Yay"],
    organlar: "Kalp, baş, atardamarlar",
    cuhrac: "Sufra (sarı safra) — hararet ve cüret",
  },
  "hava": {
    sicaklik: "sıcak",
    rutubet: "nemli",
    mizac: "Düşünen, konuşan, çok yönlü, sabit kalamayan, iletişimci",
    gezegenler: ["Utarit (Merkür)", "Zühre (Venüs)"],
    burclar: ["İkizler", "Terazi", "Kova"],
    organlar: "Akciğer, sinir sistemi, ses telleri",
    cuhrac: "Dem (kan) — neşe ve hareket",
  },
  "su": {
    sicaklik: "soğuk",
    rutubet: "nemli",
    mizac: "Duygusal, sezgili, hatırı sayar, kırılgan, derin",
    gezegenler: ["Kamer (Ay)", "Müşteri (Jüpiter) — bazı tasniflerde"],
    burclar: ["Yengeç", "Akrep", "Balık"],
    organlar: "Mide, böbrek, lenf sistemi",
    cuhrac: "Balgam — sükûnet ve derinlik",
  },
  "toprak": {
    sicaklik: "soğuk",
    rutubet: "kuru",
    mizac: "Sebatlı, pratik, sabırlı, ihtiyatlı, dayanıklı",
    gezegenler: ["Zühal (Satürn)"],
    burclar: ["Boğa", "Başak", "Oğlak"],
    organlar: "Kemik, dalak, deri",
    cuhrac: "Sevda (kara safra) — temkin ve derin düşünce",
  },
};

export interface UnsurAnalizi {
  ateş: number;
  hava: number;
  su: number;
  toprak: number;
  baskinUnsur: Unsur;
  ikinciUnsur: Unsur;
  eksikUnsur: Unsur | null;
  dengeYorumu: string;
}

export function isimUnsurAnalizi(arapcaYazim: string): UnsurAnalizi {
  const sayim: Record<Unsur, number> = { ateş: 0, hava: 0, su: 0, toprak: 0 };

  for (const char of arapcaYazim) {
    const unsur = HARF_UNSURLARI[char];
    if (unsur) sayim[unsur]++;
  }

  const siralanmis = (Object.entries(sayim) as [Unsur, number][])
    .sort((a, b) => b[1] - a[1]);

  const baskin = siralanmis[0][0];
  const ikinci = siralanmis[1][0];
  const eksik = siralanmis[3][1] === 0 ? siralanmis[3][0] : null;

  let dengeYorumu = "";
  const baskinSayi = siralanmis[0][1];
  const toplam = Object.values(sayim).reduce((a, b) => a + b, 0);

  if (toplam === 0) {
    dengeYorumu = "İsimde unsurlar belirsiz — yorum harf seviyesinde değil bütün üzerinden yapılmalı";
  } else if (baskinSayi / toplam > 0.6) {
    dengeYorumu = `${baskin} unsuru ezici biçimde baskın — bu mizacın tek yönlü gelişimi tehlikesi`;
  } else if (eksik) {
    dengeYorumu = `${eksik} unsuru zayıf — bu alanda kadersel sınav var`;
  } else {
    dengeYorumu = "Unsurlar dengeli — mizaçta uyum var, ama baskın yön belli";
  }

  return {
    ...sayim,
    baskinUnsur: baskin,
    ikinciUnsur: ikinci,
    eksikUnsur: eksik,
    dengeYorumu,
  };
}
