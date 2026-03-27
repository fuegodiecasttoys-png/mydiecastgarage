export default function HowToPage() {
  return (
    <div style={{ padding: 20, color: "white", maxWidth: 500, margin: "0 auto" }}>
      
      <h1 style={{ textAlign: "center" }}>How To Use</h1>

      <img
        src="/example.jpg"
        alt="Example"
        style={{
          width: "100%",
          borderRadius: 12,
          marginTop: 20
        }}
      />

      <p style={{ marginTop: 15, opacity: 0.8 }}>
        Example of a good photo. Make sure the full card is visible, clear, and centered.
      </p>

      <div style={{ marginTop: 30 }}>
        
        <h3>📦 Add Packed</h3>
        <p style={{ opacity: 0.8 }}>
          Use this when your car is still in the package.  
          The app will help fill basic info automatically.
        </p>

        <h3 style={{ marginTop: 20 }}>🟢 Add Loose</h3>
        <p style={{ opacity: 0.8 }}>
          Use this for loose cars.  
          You will enter all details manually.
        </p>

        <h3 style={{ marginTop: 20 }}>📸 Photo Tips</h3>
        <ul style={{ opacity: 0.8 }}>
          <li>Use good lighting</li>
          <li>Keep background clean</li>
          <li>Show full card or car</li>
          <li>Avoid blurry photos</li>
        </ul>
        <div style={{ marginTop: 20 }}>
  <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>
    📊 Export to Excel
  </div>

  <div style={{ opacity: 0.8, fontSize: 14, lineHeight: 1.5 }}>
    You can export your collection to Excel anytime.
    <br /><br />
    This creates a file you can open in Excel or Google Sheets to:
    <br />
    - Track your cars
    <br />
    - Share your collection
    <br />
    - Keep a backup
    <br /><br />
    Works just like a normal spreadsheet.
    <br /><br />
    <span style={{ opacity: 0.6 }}>(Available in PRO)</span>
  </div>
</div>
        <h3 style={{ marginTop: 20 }}>🚀 Coming Soon</h3>
        <p style={{ opacity: 0.8 }}>
          Soon you'll be able to add friends and show off your collection.
        </p>

      </div>
    </div>
  );
}
