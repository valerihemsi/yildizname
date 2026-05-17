import Link from "next/link";

export default function Footer() {
  return (
    <footer className="site-footer">
      <nav>
        <Link href="/">Ana sayfa</Link>
        <span className="ayrac" aria-hidden="true" />
        <Link href="/aydinlatma">Aydınlatma metni</Link>
        <span className="ayrac" aria-hidden="true" />
        <Link href="/kosullar">Kullanım koşulları</Link>
      </nav>
      <p className="footer-not">harflerin sırrı · sembolik tefekkür</p>
    </footer>
  );
}
