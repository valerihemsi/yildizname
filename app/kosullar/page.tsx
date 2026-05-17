import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Kullanım Koşulları — Yıldızname",
  description: "Yıldızname sitesinin kullanım koşulları ve sorumluluk reddi.",
};

export default function KosullarPage() {
  return (
    <main className="min-h-screen px-6 md:px-8 py-16">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-14 giris">
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="hat-yatay w-20" />
            <div className="cember-isaret" />
            <div className="hat-yatay w-20" />
          </div>
          <h1 className="font-display text-3xl md:text-4xl text-metin tracking-[0.25em] uppercase font-light parla-yumusak">
            Kullanım Koşulları
          </h1>
          <p className="text-metin-soluk/60 text-xs mt-4 tracking-[0.3em] uppercase font-light">
            ve sorumluluk reddi
          </p>
        </div>

        <article className="cam rounded-2xl p-8 md:p-14 giris-2 hukuk-icerik">
          <p className="kalin-not">
            Bu siteyi kullanarak aşağıdaki koşulları kabul etmiş sayılırsınız.
            Koşulları kabul etmiyorsanız lütfen siteyi kullanmayınız.
          </p>

          <h2>1. Hizmetin Niteliği</h2>
          <p>
            Yıldızname, klasik İslâmî <strong>ebced</strong>,{" "}
            <strong>ilm-i hurûf</strong> ve <strong>yıldızname</strong>{" "}
            geleneğinden ilham alarak yapay zekâ aracılığıyla üretilmiş
            kişiselleştirilmiş bir <strong>sembolik yorum</strong> sunar.
          </p>
          <p>
            Üretilen metinler <strong>sanatsal ve kültürel</strong> nitelikte
            bir tefekkür aracıdır. Bu metinler:
          </p>
          <ul>
            <li>Kehanet, fal veya geleceği bildirme iddiası taşımaz</li>
            <li>Dînî hüküm, fetva veya öğreti niteliğinde değildir</li>
            <li>Tıbbî, psikolojik veya psikiyatrik teşhis ya da tedavi yerine geçmez</li>
            <li>Hukukî, finansal veya mesleki tavsiye olarak yorumlanamaz</li>
            <li>Eğitim, kariyer, evlilik, sağlık veya yatırım kararlarına dayanak oluşturamaz</li>
          </ul>

          <h2>2. Yapay Zekâ Üretimi</h2>
          <p>
            Yorum metinleri, Anthropic firmasının <strong>Claude</strong> isimli
            büyük dil modeli tarafından gerçek zamanlı olarak üretilir. Bu
            tür modeller olasılığa dayalı çalışır; aynı veriler için farklı
            zamanlarda farklı çıktılar üretebilir. Üretilen metinde
            bilgi yanlışları, mantık tutarsızlıkları veya beklenmedik ifadeler
            bulunabilir. Site, üretilen metnin{" "}
            <strong>doğruluğu, tutarlılığı veya belirli bir niteliği
            taşıması</strong> yönünde hiçbir garanti sunmaz.
          </p>

          <h2>3. Yaş Sınırı</h2>
          <p>
            Bu hizmet yalnızca <strong>18 yaşını doldurmuş</strong> bireylerin
            kullanımına yöneliktir. 18 yaşından küçük kişilerin kişisel verilerinin
            işlenmesi için yasal temsilcilerinin açık rızası gerekir; site
            bu rızayı doğrulayacak bir mekanizma sunmadığı için reşit olmayan
            kişiler siteyi kullanmamalıdır.
          </p>

          <h2>4. Sorumluluk Reddi</h2>
          <p>
            Site sahibi; üretilen yorumlara dayanarak alınan veya alınmayan
            kararlardan, bu kararların doğurduğu maddi, manevi, sağlık veya
            ilişki kaynaklı sonuçlardan <strong>sorumlu tutulamaz</strong>.
            Yorumun yorumlanması, kullanıcının kendi sorumluluğundadır.
          </p>
          <p>
            Site sahibi, sunucu, ağ veya üçüncü taraf hizmetlerinden
            (Anthropic, Vercel) kaynaklanan kesinti, gecikme veya veri
            kaybından da sorumlu değildir.
          </p>

          <h2>5. Fikrî Haklar</h2>
          <p>
            Sitenin görsel kimliği, yazı kompozisyonları, prompt mimarisi ve
            sembolik şablonları; siteyi işleten kişiye aittir.
          </p>
          <p>
            Kullanıcı için anlık olarak üretilmiş yorum metni, kullanıcının
            kişisel kullanımı için serbestçe okunabilir, saklanabilir veya
            atıf vererek paylaşılabilir. Ticarî amaçla yeniden yayımlanması
            ya da yığın halinde otomatik üretim amacıyla siteye erişilmesi
            yasaktır.
          </p>

          <h2>6. Kötüye Kullanım</h2>
          <p>
            Aşağıdaki davranışlar yasaktır:
          </p>
          <ul>
            <li>
              Başka bir kişinin ismi veya doğum bilgilerini, o kişinin rızası
              olmadan girmek
            </li>
            <li>
              Bot, otomatik araç veya yığın istek üreten yöntemlerle siteye
              yüklenmek
            </li>
            <li>Hizmeti tersine mühendislikle çoğaltmaya çalışmak</li>
            <li>
              Üretilen metni, bir başkasını manipüle etmek veya zarar vermek
              amacıyla kullanmak
            </li>
          </ul>

          <h2>7. Geri Bildirim ve İletişim</h2>
          <p>
            Yorumların tonu, içeriği veya teknik sorunlar için iletişim:{" "}
            <a href="mailto:valerihemsi@gmail.com" className="vurgu-link">
              valerihemsi@gmail.com
            </a>
          </p>

          <h2>8. Uygulanacak Hukuk</h2>
          <p>
            Bu koşullara Türkiye Cumhuriyeti hukuku uygulanır. Doğacak
            uyuşmazlıklarda İstanbul Mahkemeleri ve İcra Daireleri yetkilidir.
          </p>

          <h2>9. Değişiklikler</h2>
          <p>
            Koşullar, ihtiyaç durumunda güncellenebilir; yürürlükteki sürüm her
            zaman bu sayfada bulunur. Önemli değişikliklerde sayfanın başına
            güncelleme tarihi eklenir.
          </p>

          <p className="son-not">Son güncelleme: 17 Mayıs 2026</p>

          <div className="geri-don">
            <Link href="/" className="vurgu-link-mini">
              ← ana sayfaya dön
            </Link>
          </div>
        </article>
      </div>
    </main>
  );
}
