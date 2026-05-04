import Link from "next/link";
import { t } from "../../ui/dv-tokens";
import { dvAppPageShell, dvBodyFont, dvDashboardInner } from "../../ui/dv-visual";
import {
  successLabelStyle,
  successMutedParagraphStyle,
  successParagraphStyle,
  successPrimaryLinkStyle,
  successSecondaryLinkStyle,
  successTitleStyle,
  successDetailCardStyle,
} from "../successPageStyles";

export default function ScanPackSuccessPage() {
  return (
    <div style={dvAppPageShell}>
      <div style={{ ...dvDashboardInner, textAlign: "center" }}>
        <p style={successLabelStyle}>My Diecast Garage</p>
        <h1 style={successTitleStyle}>Pack de escaneos listo</h1>
        <p style={successParagraphStyle}>
          Tu pago del pack de escaneos AI fue procesado correctamente.
        </p>
        <p style={successMutedParagraphStyle}>
          Se agregaron <strong style={{ color: t.textPrimary }}>50 escaneos extra</strong> para
          analizar fotos de tus modelos diecast. Deberían aparecer en tu cuenta en unos segundos,
          después de tu cupo mensual de Pro.
        </p>

        <div style={successDetailCardStyle}>
          <p
            style={{
              margin: 0,
              fontFamily: dvBodyFont,
              fontSize: 14,
              color: t.textSecondary,
              lineHeight: 1.55,
            }}
          >
            Cuando uses tus 50 escaneos incluidos por mes con Pro, estos créditos extra se aplican
            automáticamente en la captura empacada.
          </p>
        </div>

        <Link href="/" style={successPrimaryLinkStyle}>
          Ir al inicio
        </Link>
        <Link href="/capture-packed" style={successSecondaryLinkStyle}>
          Ir a captura empacada →
        </Link>
      </div>
    </div>
  );
}
