// Gezegenler — Klasik 7 Seyyâre + Gün-Gezegen Eşleşmeleri + Gezegen Saatleri
// Geleneksel Kaldeo sıralaması: Zühal → Müşteri → Merih → Şems → Zühre → Utarit → Kamer

export type Gezegen = "Şems" | "Kamer" | "Merih" | "Utarit" | "Müşteri" | "Zühre" | "Zühal";

// Haftanın günleri → gezegen sahibi
export const GUN_GEZEGEN: Record<number, Gezegen> = {
  0: "Şems",    // Pazar
  1: "Kamer",   // Pazartesi
  2: "Merih",   // Salı
  3: "Utarit",  // Çarşamba
  4: "Müşteri", // Perşembe
  5: "Zühre",   // Cuma
  6: "Zühal",   // Cumartesi
};

export const GUN_ADLARI = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];

// Gezegen özellikleri (LLM hint)
export const GEZEGEN_OZELLIKLERI: Record<Gezegen, {
  modernAd: string;
  tabiat: string;
  unsur: string;
  metaller: string;
  taslar: string;
  renkler: string;
  organlar: string;
  mizac: string;
  hayrSer: string;
  rolu: string;
}> = {
  "Şems": {
    modernAd: "Güneş",
    tabiat: "Sıcak, kuru, eril, gündüz seyyaresi",
    unsur: "Ateş",
    metaller: "Altın",
    taslar: "Yakut, sarı yakut",
    renkler: "Altın sarısı, turuncu",
    organlar: "Kalp, sırt, gözler",
    mizac: "İhtişam, otorite, ışık, parlaklık, gurur, başkanlık",
    hayrSer: "Saadet-i kübra (büyük hayır)",
    rolu: "Şah, hükümdar, baba, lider, kalp merkezi",
  },
  "Kamer": {
    modernAd: "Ay",
    tabiat: "Soğuk, nemli, dişil, gece seyyaresi",
    unsur: "Su",
    metaller: "Gümüş",
    taslar: "İnci, ay taşı",
    renkler: "Beyaz, gümüş, ince mavi",
    organlar: "Beyin, sinir, mide, rahim",
    mizac: "Sezgi, duygu, değişkenlik, hatırat, halk",
    hayrSer: "Naima küçük hayır, halka tesir",
    rolu: "Anne, halk, ruh, bilinçaltı, gece",
  },
  "Merih": {
    modernAd: "Mars",
    tabiat: "Sıcak, kuru, eril, gece seyyaresi — küçük şer",
    unsur: "Ateş",
    metaller: "Demir, çelik",
    taslar: "Kanlı yakut, kırmızı mercan",
    renkler: "Kan kırmızısı, koyu kızıl",
    organlar: "Kas, kan, cinsel organlar, safra",
    mizac: "Cesaret, öfke, ihtirâs, savaş, kıvılcım, atılganlık",
    hayrSer: "Nehs-i asgar (küçük şer)",
    rolu: "Asker, cerrah, demirci, fail, atılgan",
  },
  "Utarit": {
    modernAd: "Merkür",
    tabiat: "Soğuk-kuru, çift cinsiyetli, kâtip seyyare",
    unsur: "Hava",
    metaller: "Cıva, alüminyum",
    taslar: "Akik, sarı zümrüt",
    renkler: "Yeşil, gri, çok-renkli",
    organlar: "Akciğer, sinirler, eller, dil",
    mizac: "Zekâ, kâtiplik, hesap, ticaret, dil ustalığı, hile",
    hayrSer: "Bağlı olduğu gezegene göre değişir",
    rolu: "Kâtip, tüccar, hekim, hitabetçi, elçi",
  },
  "Müşteri": {
    modernAd: "Jüpiter",
    tabiat: "Sıcak, nemli, eril — büyük hayır",
    unsur: "Hava (bazılarına göre ateş)",
    metaller: "Kalay",
    taslar: "Firuze, sarı yakut, lapis",
    renkler: "Lacivert, sarı, mor",
    organlar: "Karaciğer, kan, sağ taraf",
    mizac: "Bilgelik, adalet, cömertlik, din, tövbe, genişleme",
    hayrSer: "Sa'd-i ekber (büyük hayır)",
    rolu: "Kadı, âlim, vezir, dindar, üstad",
  },
  "Zühre": {
    modernAd: "Venüs",
    tabiat: "Soğuk-nemli, dişil — küçük hayır",
    unsur: "Hava (bazılarına göre toprak)",
    metaller: "Bakır",
    taslar: "Zümrüt, akik, pembe inci",
    renkler: "Yeşil, pembe, fildişi",
    organlar: "Boğaz, böbrek, üreme",
    mizac: "Aşk, güzellik, sanat, lezzet, eğlence, naz",
    hayrSer: "Sa'd-i asgar (küçük hayır)",
    rolu: "Sevgili, sanatçı, hanım, mücevherci, eğlenceci",
  },
  "Zühal": {
    modernAd: "Satürn",
    tabiat: "Soğuk, kuru, eril — büyük şer",
    unsur: "Toprak",
    metaller: "Kurşun",
    taslar: "Siyah inci, oniks, hacer-ül esved",
    renkler: "Siyah, koyu lacivert, kahverengi",
    organlar: "Kemik, dalak, deri, dizler",
    mizac: "Hüzün, derinlik, sabır, mahrumiyet, ölüm, eskilik",
    hayrSer: "Nehs-i ekber (büyük şer) — ama olgunluk veren",
    rolu: "Yaşlı, çiftçi, mezarcı, münzevi, hâkim-i adalet",
  },
};

// Gezegen saatleri — Kaldeo sıralamasıyla 24 saat boyunca dönen sistem
// Günün ilk saati o günün gezegenine aittir
// Sıralama: Zühal → Müşteri → Merih → Şems → Zühre → Utarit → Kamer → tekrar
const KALDEO_SIRA: Gezegen[] = ["Zühal", "Müşteri", "Merih", "Şems", "Zühre", "Utarit", "Kamer"];

export function gunGezegen(tarih: Date): Gezegen {
  return GUN_GEZEGEN[tarih.getDay()];
}

export function saatGezegen(tarih: Date): {
  saatGezegen: Gezegen;
  saatSiraIndex: number;
  gunGezegen: Gezegen;
} {
  const gunGez = gunGezegen(tarih);
  const baslangicIndex = KALDEO_SIRA.indexOf(gunGez);

  const hour = tarih.getHours();
  // Basitleştirilmiş: günün 1. saati gün gezegen, 24 saat boyunca döner
  // Klasikte gündoğumundan başlar, biz 06:00 referansı kullanıyoruz
  let saatNum = ((hour - 6 + 24) % 24);
  const saatGezegenIndex = (baslangicIndex + saatNum) % 7;

  return {
    saatGezegen: KALDEO_SIRA[saatGezegenIndex],
    saatSiraIndex: saatNum,
    gunGezegen: gunGez,
  };
}

export interface GezegenAnalizi {
  gunAdi: string;
  dogumGunuGezegeni: Gezegen;
  dogumSaatiGezegeni: Gezegen;
  gunGezegenOzellikleri: typeof GEZEGEN_OZELLIKLERI[Gezegen];
  saatGezegenOzellikleri: typeof GEZEGEN_OZELLIKLERI[Gezegen];
}

export function gezegenAnaliziYap(dogumTarihi: string, dogumSaati: string): GezegenAnalizi {
  // dogumTarihi: "YYYY-MM-DD", dogumSaati: "HH:MM"
  const [yyyy, mm, dd] = dogumTarihi.split("-").map(Number);
  const [hh, min] = dogumSaati.split(":").map(Number);
  const tarih = new Date(yyyy, mm - 1, dd, hh, min);

  const gunGez = gunGezegen(tarih);
  const saatInfo = saatGezegen(tarih);
  const gunAdi = GUN_ADLARI[tarih.getDay()];

  return {
    gunAdi,
    dogumGunuGezegeni: gunGez,
    dogumSaatiGezegeni: saatInfo.saatGezegen,
    gunGezegenOzellikleri: GEZEGEN_OZELLIKLERI[gunGez],
    saatGezegenOzellikleri: GEZEGEN_OZELLIKLERI[saatInfo.saatGezegen],
  };
}
