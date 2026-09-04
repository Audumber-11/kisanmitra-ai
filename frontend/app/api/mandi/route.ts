// ============================================================
// KisanMitra AI - Mandi Prices API Route
// ============================================================

import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const state = searchParams.get("state") || "Maharashtra";
  const commodity = searchParams.get("commodity") || "";

  // Realistic mandi prices (updated regularly)
  const allPrices = [
    // Maharashtra
    { commodity: "Tomato", state: "Maharashtra", market: "Pune APMC", price: 2500, unit: "₹/Quintal", change: 8.7, trend: "up" },
    { commodity: "Onion", state: "Maharashtra", market: "Nashik APMC", price: 1800, unit: "₹/Quintal", change: -5.2, trend: "down" },
    { commodity: "Potato", state: "Maharashtra", market: "Ahmednagar APMC", price: 1200, unit: "₹/Quintal", change: 2.1, trend: "up" },
    { commodity: "Wheat", state: "Maharashtra", market: "Nagpur APMC", price: 2200, unit: "₹/Quintal", change: 0, trend: "stable" },
    { commodity: "Rice", state: "Maharashtra", market: "Kolhapur APMC", price: 2800, unit: "₹/Quintal", change: 3.5, trend: "up" },
    { commodity: "Soybean", state: "Maharashtra", market: "Akola APMC", price: 4500, unit: "₹/Quintal", change: 7.1, trend: "up" },
    { commodity: "Cotton", state: "Maharashtra", market: "Yavatmal APMC", price: 6200, unit: "₹/Quintal", change: 4.2, trend: "up" },
    { commodity: "Jowar", state: "Maharashtra", market: "Solapur APMC", price: 3000, unit: "₹/Quintal", change: -1.8, trend: "down" },
    { commodity: "Bajra", state: "Maharashtra", market: "Pune APMC", price: 2600, unit: "₹/Quintal", change: 1.5, trend: "up" },
    { commodity: "Tur Dal", state: "Maharashtra", market: "Latur APMC", price: 8500, unit: "₹/Quintal", change: -3.2, trend: "down" },
    { commodity: "Groundnut", state: "Maharashtra", market: "Jalgaon APMC", price: 5500, unit: "₹/Quintal", change: 5.8, trend: "up" },
    { commodity: "Sugarcane", state: "Maharashtra", market: "Pune APMC", price: 3500, unit: "₹/Quintal", change: 0, trend: "stable" },

    // Other states
    { commodity: "Tomato", state: "Gujarat", market: "Ahmedabad APMC", price: 2800, unit: "₹/Quintal", change: 12.3, trend: "up" },
    { commodity: "Onion", state: "Gujarat", market: "Surat APMC", price: 1600, unit: "₹/Quintal", change: -8.5, trend: "down" },
    { commodity: "Potato", state: "Gujarat", market: "Rajkot APMC", price: 1100, unit: "₹/Quintal", change: 4.5, trend: "up" },
    { commodity: "Wheat", state: "Punjab", market: "Ludhiana APMC", price: 2400, unit: "₹/Quintal", change: 2.3, trend: "up" },
    { commodity: "Rice", state: "Punjab", market: "Amritsar APMC", price: 3000, unit: "₹/Quintal", change: 1.8, trend: "up" },
    { commodity: "Wheat", state: "Uttar Pradesh", market: "Lucknow APMC", price: 2300, unit: "₹/Quintal", change: -0.5, trend: "stable" },
    { commodity: "Rice", state: "Uttar Pradesh", market: "Kanpur APMC", price: 2700, unit: "₹/Quintal", change: 2.1, trend: "up" },
    { commodity: "Onion", state: "Rajasthan", market: "Jaipur APMC", price: 2000, unit: "₹/Quintal", change: 6.7, trend: "up" },
    { commodity: "Potato", state: "Uttar Pradesh", market: "Agra APMC", price: 1000, unit: "₹/Quintal", change: -3.2, trend: "down" },
    { commodity: "Tomato", state: "Karnataka", market: "Bangalore APMC", price: 2200, unit: "₹/Quintal", change: -5.4, trend: "down" },
    { commodity: "Onion", state: "Karnataka", market: "Mysore APMC", price: 1900, unit: "₹/Quintal", change: 3.2, trend: "up" },
    { commodity: "Rice", state: "Telangana", market: "Hyderabad APMC", price: 2900, unit: "₹/Quintal", change: 1.2, trend: "up" },
    { commodity: "Cotton", state: "Telangana", market: "Warangal APMC", price: 6400, unit: "₹/Quintal", change: 5.8, trend: "up" },
    { commodity: "Rice", state: "Tamil Nadu", market: "Chennai APMC", price: 3200, unit: "₹/Quintal", change: 0.5, trend: "stable" },
    { commodity: "Onion", state: "Tamil Nadu", market: "Coimbatore APMC", price: 2100, unit: "₹/Quintal", change: 9.1, trend: "up" },
    { commodity: "Tomato", state: "Madhya Pradesh", market: "Bhopal APMC", price: 2300, unit: "₹/Quintal", change: 4.5, trend: "up" },
    { commodity: "Soybean", state: "Madhya Pradesh", market: "Indore APMC", price: 4700, unit: "₹/Quintal", change: 6.3, trend: "up" },
  ];

  // Filter by state and commodity
  let filtered = allPrices;

  if (state && state !== "all") {
    filtered = filtered.filter(
      (p) => p.state.toLowerCase() === state.toLowerCase()
    );
  }

  if (commodity) {
    filtered = filtered.filter(
      (p) => p.commodity.toLowerCase().includes(commodity.toLowerCase())
    );
  }

  return NextResponse.json({
    success: true,
    state: state === "all" ? "All States" : state,
    count: filtered.length,
    prices: filtered,
    date: new Date().toISOString().split("T")[0],
    note: "Prices are indicative. Actual prices may vary by market.",
    source: "KisanMitra Demo Data",
  });
}
