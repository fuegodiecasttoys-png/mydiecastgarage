import { t } from "../ui/dv-tokens";
import {
  dvAppPageShell,
  dvCardOrangeBorder,
  dvDashboardInner,
  dvDisplayFont,
} from "../ui/dv-visual";

export default function HowToPage() {
  return (
    <div style={dvAppPageShell}>
      <div style={dvDashboardInner}>
        <h1
          style={{
            textAlign: "center",
            fontFamily: dvDisplayFont,
            fontSize: 26,
            fontWeight: 700,
            color: t.textPrimary,
            margin: "0 0 8px",
          }}
        >
          How To Use
        </h1>

        <img
          src="/example.jpg"
          alt="Example"
          style={{
            width: "100%",
            borderRadius: t.radiusMd,
            marginTop: 20,
            border: `1px solid ${dvCardOrangeBorder}`,
          }}
        />

        <p style={{ marginTop: 16, color: t.textSecondary, lineHeight: 1.5 }}>
          Example of a good photo. Make sure the full card is visible, clear, and centered.
        </p>

        <div style={{ marginTop: 28 }}>
          <h3
            style={{
              fontFamily: dvDisplayFont,
              fontSize: 17,
              fontWeight: 700,
              color: t.textPrimary,
              margin: "0 0 8px",
            }}
          >
            Add Packed
          </h3>
          <p style={{ color: t.textSecondary, lineHeight: 1.55, margin: 0 }}>
            Use this when your car is still in the package. The app will help fill basic info
            automatically.
          </p>

          <h3
            style={{
              fontFamily: dvDisplayFont,
              fontSize: 17,
              fontWeight: 700,
              color: t.textPrimary,
              margin: "24px 0 8px",
            }}
          >
            Add Loose
          </h3>
          <p style={{ color: t.textSecondary, lineHeight: 1.55, margin: 0 }}>
            Use this for loose cars. You will enter all details manually.
          </p>

          <h3
            style={{
              fontFamily: dvDisplayFont,
              fontSize: 17,
              fontWeight: 700,
              color: t.textPrimary,
              margin: "24px 0 8px",
            }}
          >
            Photo Tips
          </h3>
          <ul style={{ color: t.textSecondary, lineHeight: 1.6, margin: 0, paddingLeft: 20 }}>
            <li>Use good lighting</li>
            <li>Keep background clean</li>
            <li>Show full card or car</li>
            <li>Avoid blurry photos</li>
          </ul>
          <div style={{ marginTop: 24 }}>
            <div
              style={{
                fontSize: 16,
                fontWeight: 700,
                marginBottom: 8,
                color: t.orange300,
                fontFamily: dvDisplayFont,
              }}
            >
              Export CSV
            </div>

            <div style={{ color: t.textSecondary, fontSize: 14, lineHeight: 1.55 }}>
              From <strong style={{ color: t.textPrimary }}>My Garage</strong>, use{" "}
              <strong style={{ color: t.textPrimary }}>Export CSV</strong> to download your
              collection.
              <br />
              <br />
              Open the file in Excel or Google Sheets to track your cars, share your list, or keep a
              backup.
            </div>
          </div>
          <h3
            style={{
              fontFamily: dvDisplayFont,
              fontSize: 17,
              fontWeight: 700,
              color: t.textPrimary,
              margin: "24px 0 8px",
            }}
          >
            Coming Soon
          </h3>
          <p style={{ color: t.textSecondary, lineHeight: 1.55, margin: 0 }}>
            Soon you&apos;ll be able to add friends and show off your collection.
          </p>
        </div>
      </div>
    </div>
  );
}
