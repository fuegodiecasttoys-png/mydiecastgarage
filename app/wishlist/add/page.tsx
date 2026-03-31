"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

export default function AddWishlist() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [color, setColor] = useState("");
  const [scale, setScale] = useState("");
  const [mainNumber, setMainNumber] = useState("");
  const [subNumber, setSubNumber] = useState("");
  const [series, setSeries] = useState("");
  const [year, setYear] = useState("");
  const [notes, setNotes] = useState("");
  const [priority, setPriority] = useState<"high" | "medium" | "low">("medium");

  const handleSave = async () => {
    if (!name.trim()) {
      alert("Name is required");
      return;
    }

    const { error } = await supabase.from("wishlist").insert([
      {
        name,
        brand,
        color,
        scale,
        main_number: mainNumber,
        sub_number: subNumber,
        series,
        year,
        notes,
        priority,
      },
    ]);

    if (error) {
      alert("Error saving item");
      console.error(error);
      return;
    }

    router.push("/wishlist");
  };

  return (
    <div style={{ padding: 20, color: "#fff", background: "#0f0f0f", minHeight: "100vh" }}>
      
      <button onClick={() => router.push("/wishlist")}>← Back</button>

      <h1 style={{ marginTop: 20 }}>+ Add Wishlist Item</h1>

      <div style={{ display: "grid", gap: 12, marginTop: 20 }}>

        <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />

        <input placeholder="Brand" value={brand} onChange={(e) => setBrand(e.target.value)} />

        <input placeholder="Color" value={color} onChange={(e) => setColor(e.target.value)} />

        <input placeholder="Scale" value={scale} onChange={(e) => setScale(e.target.value)} />

        <input placeholder="Main Number" value={mainNumber} onChange={(e) => setMainNumber(e.target.value)} />

        <input placeholder="Sub Number" value={subNumber} onChange={(e) => setSubNumber(e.target.value)} />

        <input placeholder="Series" value={series} onChange={(e) => setSeries(e.target.value)} />

        <input placeholder="Year" value={year} onChange={(e) => setYear(e.target.value)} />

        <textarea placeholder="Notes" value={notes} onChange={(e) => setNotes(e.target.value)} />

        {/* PRIORITY */}
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => setPriority("high")}>🔴 High</button>
          <button onClick={() => setPriority("medium")}>🟡 Medium</button>
          <button onClick={() => setPriority("low")}>🟢 Low</button>
        </div>

        <button onClick={handleSave} style={{ marginTop: 20 }}>
          Save
        </button>

      </div>
    </div>
  );
}