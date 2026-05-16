// Kader Yolu Sayısı — doğum tarihinden klasik numeroloji hesabı
// Master sayılar (11, 22, 33) korunur

export interface KaderYoluSonuc {
  toplamHam: number;
  kaderYoluSayisi: number;
  isMasterNumber: boolean;
  adimlar: number[];
}

function rakamlariTopla(n: number): number {
  return n.toString().split("").reduce((sum, d) => sum + parseInt(d, 10), 0);
}

export function kaderYoluHesapla(dogumTarihi: string): KaderYoluSonuc {
  // dogumTarihi: "YYYY-MM-DD" formatında
  const sayilar = dogumTarihi.replace(/-/g, "");
  const ham = sayilar.split("").reduce((sum, d) => sum + parseInt(d, 10), 0);

  const adimlar: number[] = [ham];
  let current = ham;

  while (current > 9 && current !== 11 && current !== 22 && current !== 33) {
    current = rakamlariTopla(current);
    adimlar.push(current);
  }

  return {
    toplamHam: ham,
    kaderYoluSayisi: current,
    isMasterNumber: current === 11 || current === 22 || current === 33,
    adimlar,
  };
}

// Kader yolu sayısı yorumları (sembolik anahtarlar — LLM'ye hint olarak gider)
export const KADER_YOLU_SEMBOLLERI: Record<number, string> = {
  1: "Önder, yalnız yürüyen, ilk adımı atan. Ateşten bir mizaç.",
  2: "Köprü kuran, denge arayan, hassas. Su gibi yumuşak.",
  3: "İfade eden, yaratan, neşeli. Hava gibi hafif.",
  4: "Kuran, sağlam, disiplinli. Toprak gibi sebatlı.",
  5: "Özgür, değişken, gezgin. Rüzgâr gibi savrulan.",
  6: "Sevecen, koruyan, sorumluluk taşıyan. Kalp gibi adanmış.",
  7: "Düşünen, derinleşen, münzevi. Bilgelik arayan.",
  8: "Güç sahibi, maddi ve manevi denge, otorite. Adalet terazisi.",
  9: "Tamamlanmış, evrensel, hizmet eden. Yaşlı bir ruh.",
  11: "Görmeyi bilen, ilham alan, sezgi ehli. Kandil gibi yanan.",
  22: "İnşa eden büyük usta, görünmezi madde yapan. Mimar bir kader.",
  33: "Üstad-ı şefkat, evrensel hizmetkâr. Rehber bir ruh.",
};

// Doğum saati → ruhsal/sembolik etki (klasik gezegen saatleri ile birlikte daha derin yorumlanır)
export function dogumSaatiSembolu(saat: string): {
  saat: string;
  vaktiSembolik: string;
  gunOgun: string;
} {
  const [hStr] = saat.split(":");
  const h = parseInt(hStr, 10);

  let vaktiSembolik = "";
  let gunOgun = "";

  if (h >= 4 && h < 6) {
    vaktiSembolik = "Seher vakti — perde aralanan an, dua kabul vakti";
    gunOgun = "Seher";
  } else if (h >= 6 && h < 9) {
    vaktiSembolik = "Güneşin doğuşu — yenilenme, bereket kapısı";
    gunOgun = "İşrak";
  } else if (h >= 9 && h < 12) {
    vaktiSembolik = "Kuşluk vakti — bolluğun, rızkın açıldığı dem";
    gunOgun = "Duha";
  } else if (h >= 12 && h < 15) {
    vaktiSembolik = "Öğle/Zeval — gücün doruğu, gölgesizlik anı";
    gunOgun = "Zeval";
  } else if (h >= 15 && h < 18) {
    vaktiSembolik = "İkindi — olgunluk, hesap vakti";
    gunOgun = "Asr";
  } else if (h >= 18 && h < 20) {
    vaktiSembolik = "Akşam — perde inmeye başlar, hüzün ve teslimiyet";
    gunOgun = "Mağrib";
  } else if (h >= 20 && h < 22) {
    vaktiSembolik = "Yatsı — gizemin başladığı, manevi yolculuk kapısı";
    gunOgun = "İşa";
  } else {
    vaktiSembolik = "Gece — yıldızların hükmettiği dem, rüya ve bilinçaltı";
    gunOgun = "Leyl";
  }

  return { saat, vaktiSembolik, gunOgun };
}
