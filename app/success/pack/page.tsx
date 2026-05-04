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
        <h1 style={successTitleStyle}>Scan pack ready</h1>
        <p style={successParagraphStyle}>
          Your auto scan pack payment was processed successfully.
        </p>
        <p style={{ ...successParagraphStyle, marginTop: 12 }}>Thank you for your purchase.</p>
        <p style={successMutedParagraphStyle}>
          We added 50 extra auto scans to help analyze photos of your diecast models. These credits
          should appear in your account within a few seconds.
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
            After you use your 50 monthly Pro scans, your extra auto scan credits will be applied
            automatically when analyzing packaged diecast photos.
          </p>
        </div>

        <Link href="/" style={successPrimaryLinkStyle}>
          Back to Home
        </Link>
        <Link href="/capture-packed" style={successSecondaryLinkStyle}>
          Go to Packed Capture
        </Link>
      </div>
    </div>
  );
}
