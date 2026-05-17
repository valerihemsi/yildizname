import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Aydınlatma Metni — Yıldızname",
  description: "KVKK kapsamında kişisel verilerin işlenmesine ilişkin aydınlatma metni.",
};

export default function AydinlatmaPage() {
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
            Aydınlatma Metni
          </h1>
          <p className="text-metin-soluk/60 text-xs mt-4 tracking-[0.3em] uppercase font-light">
            kişisel verilerin korunması kanunu kapsamında
          </p>
        </div>

        <article className="cam rounded-2xl p-8 md:p-14 giris-2 hukuk-icerik">
          <p className="kalin-not">
            6698 sayılı Kişisel Verilerin Korunması Kanunu&apos;nun (&ldquo;KVKK&rdquo;)
            10. maddesi uyarınca, veri sorumlusu sıfatıyla aşağıdaki bilgilendirme
            tarafınıza sunulmaktadır.
          </p>

          <h2>1. Veri Sorumlusu</h2>
          <p>
            Bu internet sitesi (&ldquo;Yıldızname&rdquo;) gerçek kişi veri
            sorumlusu Valeri Hemsi tarafından kişisel ve sanatsal amaçla
            işletilmektedir.
          </p>
          <p>
            <span className="vurgu-etiket">İletişim:</span>{" "}
            <a href="mailto:valerihemsi@gmail.com" className="vurgu-link">
              valerihemsi@gmail.com
            </a>
          </p>

          <h2>2. İşlenen Kişisel Veriler</h2>
          <p>
            Sembolik yorum üretebilmek için aşağıdaki kişisel verileriniz, yalnızca
            formu doldurmanız üzerine, talebiniz çerçevesinde işlenir:
          </p>
          <ul>
            <li>Ad ve soyad</li>
            <li>Anne adı</li>
            <li>Doğum tarihi</li>
            <li>Doğum saati</li>
            <li>Doğum yeri</li>
          </ul>
          <p>
            Bu verilerin tümünü siz, kendi rızanızla form aracılığıyla girersiniz.
            Site, kullanıcının adını veya doğum bilgilerini başka bir kaynaktan
            edinmez, doğrulamaz veya zenginleştirmez.
          </p>

          <h2>3. İşleme Amacı</h2>
          <p>
            Söz konusu veriler, yalnızca aşağıdaki amaçlarla işlenir:
          </p>
          <ul>
            <li>
              Ebced ve ilm-i hurûf geleneğinden ilham alan, klasik yıldızname
              sembollerine dayalı kişiselleştirilmiş bir yorum metni üretmek
            </li>
            <li>
              Bu yorum içinde geçen sembolik referansları (gezegen, unsur, kader
              yolu, ebced) anlamlandırmak üzere ek soruları yanıtlayabilmek
            </li>
          </ul>
          <p>
            Veriler; pazarlama, profilleme, reklam, üçüncü kişilere satış,
            istatistik veya analiz amacıyla{" "}
            <strong>hiçbir biçimde kullanılmaz</strong>.
          </p>

          <h2>4. İşlemenin Hukuki Sebebi</h2>
          <p>
            Verileriniz KVKK madde 5/1 uyarınca yalnızca{" "}
            <strong>açık rızanız</strong> hukuki sebebiyle işlenir. Formu
            göndermeden önce işaretlediğiniz onay kutusu, bu açık rızanın belgesi
            niteliğindedir.
          </p>

          <h2>5. Saklama Süresi</h2>
          <p className="vurgu-not">
            Site, kişisel verilerinizi <strong>hiçbir veritabanında, dosyada
            veya kalıcı bellekte saklamaz</strong>. Veriler, yalnızca yorum
            üretim isteğinin işlendiği birkaç saniye boyunca sunucu belleğinde
            tutulur ve istek tamamlandığında otomatik olarak silinir.
          </p>
          <p>
            Tarayıcınızdaki geçici oturum belleğinde (sessionStorage) tutulan
            veriler ise yalnızca sizin cihazınızda kalır; sekmeyi kapattığınızda
            kendiliğinden silinir. Bu veriler hiçbir aşamada Yıldızname
            sunucusuna kalıcı olarak iletilmez.
          </p>

          <h2>6. Aktarılan Taraflar — Yurt Dışı Aktarım</h2>
          <p className="kalin-not">
            Yorum metnini üretmek için yapay zekâ hizmeti veren{" "}
            <strong>Anthropic, PBC</strong> (Amerika Birleşik Devletleri merkezli)
            adlı şirketin Claude isimli büyük dil modeli kullanılmaktadır.
            Girdiğiniz veriler, yorum talebi sırasında bu şirketin sunucularına
            iletilir.
          </p>
          <p>
            Bu aktarım{" "}
            <strong>
              KVKK madde 9 kapsamında bir yurt dışı aktarımdır
            </strong>
            . Aktarım, formu göndermeden önce işaretlediğiniz açık rıza
            kutusuyla onaylanmaktadır. Anthropic, kendi gizlilik politikası
            çerçevesinde verileri 30 güne kadar güvenlik ve kötüye kullanım
            denetimi amacıyla saklayabilir; bu süre sonunda otomatik olarak
            siler. Anthropic, API üzerinden gelen müşteri verilerini varsayılan
            olarak model eğitimi için kullanmaz.
          </p>
          <p>
            <span className="vurgu-etiket">Anthropic gizlilik politikası:</span>{" "}
            <a
              href="https://www.anthropic.com/legal/privacy"
              className="vurgu-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              anthropic.com/legal/privacy
            </a>
          </p>
          <p>
            Sitenin barındırma altyapısı{" "}
            <strong>Vercel Inc.</strong> (ABD) tarafından sağlanmaktadır.
            Vercel, sunucu erişim kayıtlarında IP adresi, tarayıcı bilgisi ve
            erişim zamanı gibi teknik logları tutar; ancak form içerikleri bu
            loglara dahil edilmez.
          </p>

          <h2>7. Veri Sahibi Hakları (KVKK Md. 11)</h2>
          <p>
            KVKK&apos;nın 11. maddesi uyarınca her veri sahibi şu haklara sahiptir:
          </p>
          <ul>
            <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
            <li>İşlenmişse buna ilişkin bilgi talep etme</li>
            <li>İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme</li>
            <li>Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme</li>
            <li>Eksik veya yanlış işlenmişse düzeltilmesini isteme</li>
            <li>
              KVKK&apos;da öngörülen şartlar çerçevesinde silinmesini veya yok
              edilmesini isteme
            </li>
            <li>İşlemenin yalnızca otomatik sistemlerle analiziyle aleyhinize bir sonuç doğmasına itiraz etme</li>
            <li>Kanuna aykırı işleme sebebiyle zarara uğramışsanız tazminat talep etme</li>
          </ul>
          <p>
            Bu talepleri{" "}
            <a href="mailto:valerihemsi@gmail.com" className="vurgu-link">
              valerihemsi@gmail.com
            </a>{" "}
            adresine yazılı olarak iletebilirsiniz. Site veri saklamadığından
            silme/erişim talepleri çoğunlukla &ldquo;saklanan veri yok&rdquo;
            sonucuyla yanıtlanır.
          </p>

          <h2>8. Çerezler</h2>
          <p>
            Site, kullanıcı takibi veya analiz amaçlı çerez{" "}
            <strong>kullanmaz</strong>. Yalnızca, formu doldururken girdiğiniz
            verileri sonuç sayfasına taşımak için tarayıcınızın geçici oturum
            belleği (sessionStorage) kullanılır; bu mekanizma bir çerez değildir
            ve sekmeyi kapatınca silinir.
          </p>

          <h2>9. Açık Rızanın Geri Alınması</h2>
          <p>
            Vermiş olduğunuz açık rızayı dilediğiniz zaman geri alabilirsiniz.
            Geri alma, ileriye dönük etki doğurur. Site veri saklamadığından,
            geri alma talebiniz pratik olarak yeni yorum üretmemenizi sağlamak
            anlamına gelir; geçmişte üretilmiş ve sizin cihazınızda kalan
            metinler üzerinde sitenin tasarrufu yoktur.
          </p>

          <h2>10. Değişiklikler</h2>
          <p>
            Bu metnin yürürlükteki sürümü her zaman bu sayfada yayınlanır.
            Önemli değişiklikler olduğunda metnin başına güncelleme tarihi
            eklenir.
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
