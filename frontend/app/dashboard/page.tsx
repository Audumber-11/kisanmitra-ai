"use client";

import { useState, useEffect } from "react";
import {
  Users,
  MessageSquare,
  AlertTriangle,
  TrendingUp,
  CloudRain,
  MapPin,
  Activity,
  Leaf,
  BarChart3,
  Droplets,
  ThermometerSun,
  Mic,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// Mock data for dashboard
const mockStats = {
  totalFarmers: 1247,
  activeFarmers: 342,
  totalQueries: 8934,
  queriesToday: 127,
  diseaseReports: 234,
  activeOutbreaks: 3,
};

const mockTopConcerns = [
  { concern: "Pest attack", count: 145, change: 12 },
  { concern: "Yellow leaves", count: 98, change: -5 },
  { concern: "Irrigation", count: 76, change: 8 },
  { concern: "Fertilizer", count: 54, change: 3 },
  { concern: "Weather impact", count: 43, change: -2 },
];

const mockOutbreaks = [
  { district: "Pune", disease: "Late Blight", cases: 45, severity: "high", trend: "increasing" },
  { district: "Nashik", disease: "Powdery Mildew", cases: 32, severity: "medium", trend: "stable" },
  { district: "Kolhapur", disease: "Bacterial Wilt", cases: 18, severity: "low", trend: "decreasing" },
];

const mockMandiPrices = [
  { commodity: "Tomato", price: 2500, change: 8.7, trend: "up" },
  { commodity: "Onion", price: 1800, change: -5.2, trend: "down" },
  { commodity: "Potato", price: 1200, change: 2.1, trend: "up" },
  { commodity: "Wheat", price: 2200, change: 0, trend: "stable" },
  { commodity: "Soybean", price: 4500, change: 7.1, trend: "up" },
];

const mockWeather = {
  temperature: 28.5,
  humidity: 65,
  rainfall: 2.5,
  diseaseRisk: "Medium",
};

export default function DashboardPage() {
  const [selectedDistrict, setSelectedDistrict] = useState("all");
  const [weatherData, setWeatherData] = useState<any>(null);

  // Fetch real weather
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch("/api/weather?district=Pune");
        if (response.ok) {
          const data = await response.json();
          setWeatherData(data);
        }
      } catch (error) {
        console.error("Weather fetch error:", error);
      }
    };
    fetchWeather();
  }, []);

  return (
    <main className="min-h-screen bg-muted/30 py-8 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">District Officer Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor crop health, disease outbreaks, and farmer engagement across districts
          </p>
        </div>

        {/* District Selector */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="flex-1 max-w-xs px-3 py-2 rounded-lg border bg-background"
              >
                <option value="all">All Districts</option>
                <option value="pune">Pune</option>
                <option value="nashik">Nashik</option>
                <option value="kolhapur">Kolhapur</option>
                <option value="nagpur">Nagpur</option>
                <option value="aurangabad">Aurangabad</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
          <Card className="dashboard-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Farmers
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{mockStats.totalFarmers.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {mockStats.activeFarmers} active this month
              </p>
            </CardContent>
          </Card>

          <Card className="dashboard-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Queries
              </CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{mockStats.totalQueries.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">
                +{mockStats.queriesToday} today
              </p>
            </CardContent>
          </Card>

          <Card className="dashboard-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Disease Reports
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{mockStats.diseaseReports}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {mockStats.activeOutbreaks} active outbreaks
              </p>
            </CardContent>
          </Card>

          <Card className="dashboard-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Engagement Rate
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">27.4%</div>
              <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                +3.2% from last month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Top Concerns */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Top Farmer Concerns
                </CardTitle>
                <CardDescription>Most common queries this week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockTopConcerns.map((item, index) => (
                    <div key={item.concern} className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium">{item.concern}</span>
                          <span className="text-sm text-muted-foreground">
                            {item.count} queries
                          </span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full transition-all"
                            style={{ width: `${(item.count / 150) * 100}%` }}
                          />
                        </div>
                      </div>
                      <span
                        className={cn(
                          "text-sm font-medium",
                          item.change > 0 ? "text-red-600" : "text-green-600"
                        )}
                      >
                        {item.change > 0 ? "+" : ""}
                        {item.change}%
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Disease Outbreaks */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  Disease Outbreaks
                </CardTitle>
                <CardDescription>Active disease reports requiring attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockOutbreaks.map((outbreak) => (
                    <div
                      key={`${outbreak.district}-${outbreak.disease}`}
                      className="flex items-center gap-4 p-4 rounded-lg bg-muted/50"
                    >
                      <div
                        className={cn(
                          "w-12 h-12 rounded-lg flex items-center justify-center",
                          outbreak.severity === "high"
                            ? "bg-red-100 text-red-600"
                            : outbreak.severity === "medium"
                            ? "bg-amber-100 text-amber-600"
                            : "bg-green-100 text-green-600"
                        )}
                      >
                        <Leaf className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{outbreak.disease}</div>
                        <div className="text-sm text-muted-foreground">
                          {outbreak.district} District
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{outbreak.cases} cases</div>
                        <div
                          className={cn(
                            "text-xs capitalize",
                            outbreak.trend === "increasing"
                              ? "text-red-600"
                              : outbreak.trend === "decreasing"
                              ? "text-green-600"
                              : "text-gray-600"
                          )}
                        >
                          {outbreak.trend}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Mandi Prices */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Mandi Price Summary
                </CardTitle>
                <CardDescription>Latest prices from local markets (₹/Quintal)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {mockMandiPrices.map((item) => (
                    <div
                      key={item.commodity}
                      className="p-4 rounded-lg border bg-card"
                    >
                      <div className="font-medium mb-2">{item.commodity}</div>
                      <div className="flex items-end justify-between">
                        <span className="text-2xl font-bold">
                          ₹{item.price.toLocaleString()}
                        </span>
                        <span
                          className={cn(
                            "text-sm font-medium",
                            item.trend === "up"
                              ? "text-green-600"
                              : item.trend === "down"
                              ? "text-red-600"
                              : "text-gray-600"
                          )}
                        >
                          {item.trend === "up" && "↑"}
                          {item.trend === "down" && "↓"}
                          {item.change !== 0 ? `${Math.abs(item.change)}%` : "Stable"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Weather Summary - Live from API */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CloudRain className="h-5 w-5 text-blue-500" />
                  Weather Summary
                </CardTitle>
                <CardDescription>Live conditions</CardDescription>
              </CardHeader>
              <CardContent>
                {weatherData ? (
                  <>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <ThermometerSun className="h-8 w-8 mx-auto text-orange-500 mb-2" />
                        <div className="text-2xl font-bold">{weatherData.temperature}°C</div>
                        <div className="text-xs text-muted-foreground">Temperature</div>
                      </div>
                      <div className="text-center">
                        <Droplets className="h-8 w-8 mx-auto text-blue-500 mb-2" />
                        <div className="text-2xl font-bold">{weatherData.humidity}%</div>
                        <div className="text-xs text-muted-foreground">Humidity</div>
                      </div>
                      <div className="text-center">
                        <CloudRain className="h-8 w-8 mx-auto text-gray-500 mb-2" />
                        <div className="text-2xl font-bold">{weatherData.rainfall}mm</div>
                        <div className="text-xs text-muted-foreground">Rainfall</div>
                      </div>
                    </div>
                    <div className={cn(
                      "mt-4 p-3 rounded-lg border",
                      weatherData.disease_risk.includes("HIGH") && "bg-red-50 border-red-200",
                      weatherData.disease_risk.includes("MEDIUM") && "bg-amber-50 border-amber-200",
                      weatherData.disease_risk.includes("LOW") && "bg-green-50 border-green-200"
                    )}>
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" />
                        <span className="text-sm font-medium">{weatherData.disease_risk}</span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-4 text-muted-foreground">Loading...</div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <button className="w-full p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors text-left">
                  <div className="font-medium mb-1 flex items-center gap-2">
                    <Mic className="h-4 w-4" />
                    Send Bulk Voice Alert
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Notify farmers via voice call about disease outbreak
                  </div>
                </button>
                <button className="w-full p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors text-left">
                  <div className="font-medium mb-1 flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    Send SMS Alert
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Send weather and mandi updates to registered farmers
                  </div>
                </button>
                <button className="w-full p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors text-left">
                  <div className="font-medium mb-1 flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    Export Report
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Download district summary as PDF
                  </div>
                </button>
              </CardContent>
            </Card>

            {/* System Status */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">System Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Voice Service</span>
                    <span className="flex items-center gap-1 text-sm text-green-600">
                      <span className="w-2 h-2 rounded-full bg-green-500" />
                      Operational
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Disease Detection (Gemini Vision)</span>
                    <span className="flex items-center gap-1 text-sm text-green-600">
                      <span className="w-2 h-2 rounded-full bg-green-500" />
                      Operational
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Weather API</span>
                    <span className="flex items-center gap-1 text-sm text-green-600">
                      <span className="w-2 h-2 rounded-full bg-green-500" />
                      Operational
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Mandi Prices</span>
                    <span className="flex items-center gap-1 text-sm text-green-600">
                      <span className="w-2 h-2 rounded-full bg-green-500" />
                      Operational
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
