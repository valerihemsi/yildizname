"use client";

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  pdf,
} from "@react-pdf/renderer";
import type { Style } from "@react-pdf/types";
import type { HesaplananVeriler } from "@/lib/prompt";

type PdfStyle = Style | Style[];

/**
 * Branded, vector PDF of a yıldızname reading — dark "modern mistik" aesthetic,
 * selectable text. We embed Cormorant Garamond (Latin-Extended, so Turkish
 * ş/ğ/ı/İ render) rather than rasterising the page (Tailwind v4 oklch colours
 * break html2canvas, and a vector PDF stays crisp + light).
 */

let registered = false;
function ensureFonts() {
  if (registered) return;
  Font.register({
    family: "Cormorant",
    fonts: [
      { src: "/fonts/CormorantGaramond.ttf" },
      { src: "/fonts/CormorantGaramond-Italic.ttf", fontStyle: "italic" },
    ],
  });
  // Arabic-capable face for the ebced (arapça) spelling — Cormorant has no
  // Arabic glyphs, so without this the arapçaYazım renders as tofu.
  Font.register({ family: "Amiri", fonts: [{ src: "/fonts/Amiri-Regular.ttf" }] });
  // Keep Turkish words whole — no hyphenation.
  Font.registerHyphenationCallback((word) => [word]);
  registered = true;
}

const C = {
  bg: "#050309",
  text: "#ddd5c4",
  muted: "#8c8472",
  accent: "#d4c4a0",
  pastel: "#c4b8d6",
  line: "#2a2433",
};

const s = StyleSheet.create({
  page: {
    backgroundColor: C.bg,
    color: C.text,
    fontFamily: "Cormorant",
    fontSize: 11.5,
    lineHeight: 1.6,
    paddingTop: 52,
    paddingBottom: 64,
    paddingHorizontal: 54,
  },
  center: { textAlign: "center" },
  title: {
    fontSize: 22,
    letterSpacing: 8,
    color: C.text,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 8,
    letterSpacing: 4,
    color: C.muted,
    textAlign: "center",
    marginTop: 6,
    textTransform: "uppercase",
  },
  rule: {
    borderBottomWidth: 0.6,
    borderBottomColor: C.accent,
    opacity: 0.45,
    width: 90,
    alignSelf: "center",
    marginVertical: 14,
  },
  meta: {
    fontSize: 9.5,
    color: C.muted,
    textAlign: "center",
    marginTop: 2,
  },
  grid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 22,
    marginBottom: 6,
    paddingVertical: 14,
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: C.line,
  },
  cell: { width: "25%", textAlign: "center", paddingHorizontal: 4 },
  cellLabel: {
    fontSize: 6.5,
    letterSpacing: 1.5,
    color: C.accent,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  cellValue: { fontSize: 13, color: C.text },
  cellSub: { fontSize: 7.5, color: C.muted, fontStyle: "italic", marginTop: 2 },
  arabic: { fontFamily: "Amiri", fontStyle: "normal", fontSize: 11, marginTop: 3 },
  sectionTitle: {
    fontSize: 13,
    letterSpacing: 3,
    color: C.accent,
    textTransform: "uppercase",
    marginTop: 22,
    marginBottom: 8,
  },
  h3: { fontSize: 11.5, color: C.pastel, marginTop: 10, marginBottom: 3, letterSpacing: 1 },
  p: { marginBottom: 9, textAlign: "justify" },
  intro: { marginBottom: 6, fontStyle: "italic", color: C.text },
  listRow: { flexDirection: "row", marginBottom: 5, paddingLeft: 6 },
  bullet: { color: C.accent, marginRight: 7 },
  bold: { color: C.accent },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 54,
    right: 54,
    textAlign: "center",
    fontSize: 7.5,
    color: C.muted,
  },
});

// ---- markdown → react-pdf ---------------------------------------------------

interface Section {
  title: string;
  body: string;
}

function parseReport(yorum: string): { intro: string; sections: Section[] } {
  const lines = yorum.split("\n");
  let intro = "";
  const sections: Section[] = [];
  let current: Section | null = null;
  for (const line of lines) {
    const m = line.match(/^## (.+)$/);
    if (m) {
      if (current) sections.push(current);
      current = { title: m[1].trim(), body: "" };
    } else if (current) {
      current.body += (current.body ? "\n" : "") + line;
    } else {
      intro += (intro ? "\n" : "") + line;
    }
  }
  if (current) sections.push(current);
  return { intro: intro.trim(), sections };
}

type Seg = { text: string; bold?: boolean; italic?: boolean };

function inlineSegments(text: string): Seg[] {
  const segs: Seg[] = [];
  let bold = false;
  let italic = false;
  let buf = "";
  const push = () => {
    if (buf) segs.push({ text: buf, bold, italic });
    buf = "";
  };
  for (let i = 0; i < text.length; ) {
    if (text.startsWith("**", i)) {
      push();
      bold = !bold;
      i += 2;
    } else if (text[i] === "*") {
      push();
      italic = !italic;
      i += 1;
    } else {
      buf += text[i];
      i += 1;
    }
  }
  push();
  return segs.length ? segs : [{ text }];
}

function InlineText({ text, style }: { text: string; style?: PdfStyle }) {
  return (
    <Text style={style}>
      {inlineSegments(text).map((seg, i) => (
        <Text
          key={i}
          style={[seg.bold ? s.bold : {}, seg.italic ? { fontStyle: "italic" } : {}]}
        >
          {seg.text}
        </Text>
      ))}
    </Text>
  );
}

function renderBlocks(body: string, pStyle: PdfStyle = s.p) {
  return body
    .split(/\n\n+/)
    .map((raw) => raw.trim())
    .filter(Boolean)
    .map((block, i) => {
      const h3 = block.match(/^### (.+)$/);
      if (h3) return <InlineText key={i} text={h3[1]} style={s.h3} />;

      const lines = block.split("\n");
      const isList = lines.every((l) => l.trim().startsWith("- "));
      if (isList) {
        return (
          <View key={i} style={{ marginBottom: 8 }}>
            {lines.map((l, j) => (
              <View key={j} style={s.listRow}>
                <Text style={s.bullet}>•</Text>
                <InlineText text={l.replace(/^-\s+/, "")} style={{ flex: 1 }} />
              </View>
            ))}
          </View>
        );
      }
      // paragraph — single newlines become spaces
      return <InlineText key={i} text={block.replace(/\n/g, " ")} style={pStyle} />;
    });
}

// ---- document ---------------------------------------------------------------

function Cell({
  label,
  value,
  sub,
  subArabic,
}: {
  label: string;
  value: string;
  sub?: string;
  subArabic?: boolean;
}) {
  return (
    <View style={s.cell}>
      <Text style={s.cellLabel}>{label}</Text>
      <Text style={s.cellValue}>{value}</Text>
      {sub ? (
        <Text style={[s.cellSub, subArabic ? s.arabic : {}]}>{sub}</Text>
      ) : null}
    </View>
  );
}

export function RaporDocument({
  veriler,
  yorum,
  tarih,
}: {
  veriler: HesaplananVeriler;
  yorum: string;
  tarih: string;
}) {
  ensureFonts();
  const { intro, sections } = parseReport(yorum);
  const k = veriler.kullanici;

  return (
    <Document
      title={`Yıldızname — ${k.isim}`}
      author="Yıldızname"
      subject="Sembolik yıldızname yorumu"
    >
      <Page size="A4" style={s.page}>
        <Text style={s.title}>YILDIZNAME</Text>
        <Text style={s.subtitle}>harflerin sırrı</Text>
        <View style={s.rule} />
        <Text style={s.meta}>{k.isim}</Text>
        <Text style={s.meta}>
          anne {k.anneAdi} · {k.dogumTarihi} {k.dogumSaati} · {k.dogumYeri}
        </Text>

        <View style={s.grid}>
          <Cell
            label="İsim Ebcedi"
            value={String(veriler.ebced.isim.toplamDeger)}
            sub={veriler.ebced.isim.arapcaYazim}
            subArabic
          />
          <Cell
            label="Kader Yolu"
            value={String(veriler.kaderYolu.kaderYoluSayisi)}
            sub={veriler.kaderYolu.isMasterNumber ? "master sayı" : ""}
          />
          <Cell
            label="Baskın Unsur"
            value={veriler.unsur.baskinUnsur}
            sub={
              veriler.unsur.eksikUnsur
                ? `eksik: ${veriler.unsur.eksikUnsur}`
                : "dengeli"
            }
          />
          <Cell
            label="Gün Gezegeni"
            value={veriler.gezegen.dogumGunuGezegeni}
            sub={veriler.gezegen.gunAdi}
          />
        </View>

        {intro ? <View>{renderBlocks(intro, s.intro)}</View> : null}

        {sections.map((sec, i) => (
          <View key={i} wrap>
            <Text style={s.sectionTitle}>{sec.title}</Text>
            {renderBlocks(sec.body)}
          </View>
        ))}

        <Text style={s.footer} fixed>
          yildizname-murex.vercel.app · {tarih}
          {"\n"}
          Bu yorum sembolik ve kültürel bir içeriktir; kesin yargı veya öngörü
          içermez.
        </Text>
      </Page>
    </Document>
  );
}

function safeName(name: string): string {
  return (
    name
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^\p{L}\p{N}\-]/gu, "") || "yildizname"
  );
}

/** Build the PDF in the browser and trigger a download. */
export async function downloadRaporPdf(
  veriler: HesaplananVeriler,
  yorum: string,
): Promise<void> {
  const tarih = new Date().toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const blob = await pdf(
    <RaporDocument veriler={veriler} yorum={yorum} tarih={tarih} />,
  ).toBlob();

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Yildizname-${safeName(veriler.kullanici.isim)}.pdf`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
