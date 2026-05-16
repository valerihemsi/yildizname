// LLM Prompt Builder — Yıldızname Yorum Sistemi

import { ikiliEbcedAnalizi } from "./ebced";
import { kaderYoluHesapla, dogumSaatiSembolu, KADER_YOLU_SEMBOLLERI } from "./kader-yolu";
import { isimUnsurAnalizi, UNSUR_OZELLIKLERI, type UnsurAnalizi } from "./element";
import { gezegenAnaliziYap, type GezegenAnalizi } from "./gezegen";

export interface KullaniciVerisi {
  isim: string;
  anneAdi: string;
  dogumTarihi: string; // YYYY-MM-DD
  dogumSaati: string;  // HH:MM
  dogumYeri: string;
}

export interface HesaplananVeriler {
  kullanici: KullaniciVerisi;
  ebced: ReturnType<typeof ikiliEbcedAnalizi>;
  kaderYolu: ReturnType<typeof kaderYoluHesapla>;
  unsur: UnsurAnalizi;
  gezegen: GezegenAnalizi;
  saat: ReturnType<typeof dogumSaatiSembolu>;
}

export function hesaplaTumVeriler(kullanici: KullaniciVerisi): HesaplananVeriler {
  const ebced = ikiliEbcedAnalizi(kullanici.isim, kullanici.anneAdi);
  const kaderYolu = kaderYoluHesapla(kullanici.dogumTarihi);
  const unsur = isimUnsurAnalizi(ebced.isim.arapcaYazim);
  const gezegen = gezegenAnaliziYap(kullanici.dogumTarihi, kullanici.dogumSaati);
  const saat = dogumSaatiSembolu(kullanici.dogumSaati);

  return { kullanici, ebced, kaderYolu, unsur, gezegen, saat };
}

const SYSTEM_PROMPT = `Sen klasik yıldızname, ebced ve ilm-i hurûf geleneğinde yetişmiş bir yorumcusun. Sembolleri, harf değerlerini, gezegen tesirlerini ve kader etkilerini okuyup yorumluyorsun.

YASAK İFADELER — Bunları KESİNLİKLE KULLANMA:
- "Bismillâhirrahmânirrahîm", "Bismillah" veya benzeri dini başlangıç formülleri
- "Vallâhu a'lemu bi's-savâb", "Allahu a'lem" veya benzeri Arapça kapanış/ihtirazî formüller
- "Levh-i mahfûzun", "Levh-i mahfuz" veya gaybî kitap göndermeleri
- "İnşallah", "Maşallah", "Subhanallah", "Estağfirullah" gibi Arapça dini ifadeler
- Ayet alıntıları, hadis alıntıları, Arapça dualar
- "Ey falanca" tarzı Arapça/Osmanlı hitap kalıpları
- Vacib, farz, sünnet, mübah gibi fıkhî terimler

DİL TONU — Şöyle yaz:
- Türkçe, akıcı, modern ama sembolik
- Eski yıldızname üslubunun **dili** değil **sezgisini** kullan
- Müneccim-bilge gibi, ama dini-vaiz gibi değil
- Gezegen, harf, unsur, çakra gibi semboller serbest
- Felsefi, derin, katmanlı; ama dini-hutbe değil

YAPI — Bu 7 başlığı kullan (sırasıyla):

## İSMİN SIRRI
**Tek paragraf** — kısa ve özlü. İsmin Arapça yazımı, toplam ebced değeri, baskın unsur ve ismin taşıdığı temel mizaç tek bir akıcı paragrafta özetlenir. Liste yapma, alt başlık koyma. 4-6 cümle yeter.

## KARAKTER VE KADER
- İç yapı
- Gizlediği huylar
- Öfke, sezgi, kin, merhamet yapısı
- Hayattaki ana sınavı
- Ruhsal yükü ve kader izi
(3-4 paragraf, derin)

## SAĞLIK VE ENERJİ
- Bedende zayıf düşen bölgeler
- Ruhsal yorgunluk işaretleri
- Nazar, ağırlık veya iç sıkışması belirtileri
- Uykusuzluk, stres, iç daralması eğilimleri
- Enerjiyi toparlayan unsurlar
(3-4 paragraf)

## KADER YOLU
- Hayatın dönüm noktaları
- Asıl sınav
- Gizli yükseliş dönemleri
- Tekrar eden döngüler
(3-4 paragraf)

## EVLİLİK VE AŞK
- Evlilik enerjisi
- Kaç büyük aşk
- Ruh eşi / kadersel eş ihtimali
- Eşinin karakteri ve baskın harfleri
- Eşinin fiziksel enerjisi
- Evliliğin huzurlu mu yoksa karmik mi olduğu
- Aldatma, sadakat, kıskançlık eğilimleri
- Ayrılık riski ve nedeni
- Evlilik zamanı için sezgisel dönemler
(4-5 paragraf)

## ÇOCUK VE YUVA
- Çocuk kısmeti
- Çocuk enerjisi gücü
- Muhtemel çocuk sayısı
- Erkek/dişi enerji
- Anne/baba olarak kader rolü
- Hanedeki huzur ve bereket
(3-4 paragraf)

## KARİYER VE PARA
- Yükselme alanları
- Parayı nasıl çektiği veya kaybettiği
- Para üzerindeki gizli düğümler
- Bereket noktaları
(3-4 paragraf)

GENEL KURALLAR:
- Kesin bilim dili kullanma
- "Enerjin yüksek", "ışığını yay" gibi New Age dilinden kaçın
- Yüzeysel olumlama yapma — hem iyi hem zor ihtimalleri söyle
- Kişinin kaderindeki karanlık tarafları gizleme
- Harf, gezegen, unsur, çakra metaforları serbest
- Çıktı: düz markdown — başlıklar ## ile, vurgular **kalın**, italic *eğik*
- İSMİN SIRRI hariç her başlık altında 3-4 paragraf yaz

Yoruma "## İSMİN SIRRI" başlığıyla başla. Açılış paragrafı, takdim cümlesi, selamlama, hitap KOYMA.`;

export function buildPrompt(veriler: HesaplananVeriler): { system: string; user: string } {
  const { kullanici, ebced, kaderYolu, unsur, gezegen, saat } = veriler;

  const kaderYoluSembol = KADER_YOLU_SEMBOLLERI[kaderYolu.kaderYoluSayisi] ?? "Bilinmiyor";
  const baskinUnsurOzellikleri = UNSUR_OZELLIKLERI[unsur.baskinUnsur];

  const harfDokumu = ebced.isim.harfler
    .map(h => `${h.harf} (${h.arapca} = ${h.deger})`)
    .join(", ");

  const anneHarfDokumu = ebced.anne.harfler
    .map(h => `${h.harf} (${h.arapca} = ${h.deger})`)
    .join(", ");

  const userMessage = `İsim: ${kullanici.isim}
Anne adı: ${kullanici.anneAdi}
Doğum tarihi: ${kullanici.dogumTarihi}
Doğum saati: ${kullanici.dogumSaati}
Doğum yeri: ${kullanici.dogumYeri}

## HESAPLANAN VERİLER (yorumunda bu sembolleri kullan, kendi dilinle aktar)

### İsim Ebcedi
- Arapça yazımı: ${ebced.isim.arapcaYazim}
- Harf dökümü: ${harfDokumu}
- Toplam ebced değeri: ${ebced.isim.toplamDeger}
- Baştaki harf: ${ebced.isim.bastakiHarf.harf} (${ebced.isim.bastakiHarf.arapca} = ${ebced.isim.bastakiHarf.deger})
- Sondaki harf: ${ebced.isim.sondakiHarf.harf} (${ebced.isim.sondakiHarf.arapca} = ${ebced.isim.sondakiHarf.deger})

### Anne Adı Ebcedi
- Arapça yazımı: ${ebced.anne.arapcaYazim}
- Harf dökümü: ${anneHarfDokumu}
- Toplam: ${ebced.anne.toplamDeger}

### Birleşik Hesap
- Birleşik toplam (isim + anne): ${ebced.birlesikToplam}
- Aralarındaki fark: ${ebced.fark}
- Oran: ${ebced.oran}

### Unsurlar (Harflerin Tabiatı)
- Ateş: ${unsur.ateş}, Hava: ${unsur.hava}, Su: ${unsur.su}, Toprak: ${unsur.toprak}
- Baskın unsur: ${unsur.baskinUnsur} — ${baskinUnsurOzellikleri.mizac}
- İkinci unsur: ${unsur.ikinciUnsur}
- Eksik unsur: ${unsur.eksikUnsur ?? "yok (dengeli)"}
- Denge yorumu: ${unsur.dengeYorumu}

### Kader Yolu
- Ham toplam: ${kaderYolu.toplamHam}
- İndirgenme adımları: ${kaderYolu.adimlar.join(" → ")}
- Kader yolu sayısı: ${kaderYolu.kaderYoluSayisi} ${kaderYolu.isMasterNumber ? "(MASTER SAYI)" : ""}
- Sembolik anahtar: ${kaderYoluSembol}

### Gezegen Etkileri
- Doğum günü: ${gezegen.gunAdi} → Gün gezegeni: ${gezegen.dogumGunuGezegeni} (${gezegen.gunGezegenOzellikleri.modernAd})
  - Tabiat: ${gezegen.gunGezegenOzellikleri.tabiat}
  - Mizaç: ${gezegen.gunGezegenOzellikleri.mizac}
  - Rol: ${gezegen.gunGezegenOzellikleri.rolu}
- Doğum saati gezegeni: ${gezegen.dogumSaatiGezegeni} (${gezegen.saatGezegenOzellikleri.modernAd})
  - Mizaç: ${gezegen.saatGezegenOzellikleri.mizac}
  - Rol: ${gezegen.saatGezegenOzellikleri.rolu}

### Doğum Vakti Sembolü
- Vakit: ${saat.gunOgun}
- Sembolik anlamı: ${saat.vaktiSembolik}

---

Bu verileri kullanarak yukarıda belirtilen 7 başlık altında detaylı yıldızname yorumu yap. Müneccim üslubunu koru.`;

  return {
    system: SYSTEM_PROMPT,
    user: userMessage,
  };
}
