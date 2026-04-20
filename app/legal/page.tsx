import { t } from "../ui/dv-tokens";
import { dvAppPageShell, dvBodyFont, dvDashboardInner, dvDisplayFont } from "../ui/dv-visual";

const h1Style = {
  fontFamily: dvDisplayFont,
  color: t.textPrimary,
  fontSize: 26,
  fontWeight: 700,
  margin: "0 0 12px",
} as const;

const h2Style = {
  fontFamily: dvDisplayFont,
  color: t.textPrimary,
  fontSize: 17,
  fontWeight: 700,
  margin: "24px 0 8px",
} as const;

const paragraphStyle = {
  margin: 0,
  color: t.textSecondary,
  fontFamily: dvBodyFont,
  lineHeight: 1.6,
} as const;

export default function LegalPage() {
  return (
    <div style={dvAppPageShell}>
      <div style={dvDashboardInner}>
        <h1 style={h1Style}>Privacy Policy</h1>

        <p style={paragraphStyle}>
          This app allows users to store and manage personal collection data, including images, notes,
          and item details.
        </p>

        <h2 style={h2Style}>Data We Collect</h2>
        <p style={paragraphStyle}>
          We may collect and store information such as collection items, images, notes, and basic
          account data required to provide the service.
        </p>

        <h2 style={h2Style}>How We Use Your Data</h2>
        <p style={paragraphStyle}>
          Your data is used solely to operate and improve the app experience. We do not sell or share
          your personal data with third parties.
        </p>

        <h2 style={h2Style}>Third-Party Services</h2>
        <p style={paragraphStyle}>
          We use third-party services such as Supabase to securely store and manage data. These
          services may process your data in accordance with their own privacy policies.
        </p>

        <h2 style={h2Style}>Data Security</h2>
        <p style={paragraphStyle}>
          We take reasonable measures to protect your data, but we cannot guarantee absolute security.
        </p>

        <h2 style={h2Style}>Your Responsibility</h2>
        <p style={paragraphStyle}>
          You are responsible for the content you upload, including images and descriptions.
        </p>

        <h2 style={h2Style}>Changes to This Policy</h2>
        <p style={paragraphStyle}>
          We may update this policy from time to time. Continued use of the app means you accept those
          changes.
        </p>

        <h2 style={h2Style}>Contact</h2>
        <p style={paragraphStyle}>If you have questions, contact: your@email.com</p>

        <h1 style={{ ...h1Style, marginTop: 40 }}>Terms of Service</h1>

        <h2 style={h2Style}>Use of the App</h2>
        <p style={paragraphStyle}>
          This app is intended for personal collection management. You agree to use it responsibly and
          not for unlawful purposes.
        </p>

        <h2 style={h2Style}>Account and Data</h2>
        <p style={paragraphStyle}>You are responsible for maintaining your account and the data you store.</p>

        <h2 style={h2Style}>Service Availability</h2>
        <p style={paragraphStyle}>
          The app is provided &quot;as is&quot; without guarantees of uptime, availability, or accuracy.
        </p>

        <h2 style={h2Style}>Modifications</h2>
        <p style={paragraphStyle}>We reserve the right to modify or discontinue the service at any time.</p>

        <h2 style={h2Style}>Limitation of Liability</h2>
        <p style={paragraphStyle}>
          We are not liable for any loss of data or damages resulting from the use of the app.
        </p>

        <h2 style={h2Style}>Contact</h2>
        <p style={paragraphStyle}>your@email.com</p>
      </div>
    </div>
  );
}
