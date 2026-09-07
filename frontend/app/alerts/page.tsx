"use client";

import { useState, useEffect } from "react";
import {
  CloudRain,
  Cloud,
  Sun,
  Wind,
  Droplets,
  ThermometerSun,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Minus,
  Loader2,
  MapPin,
  Calendar,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MOCK_MANDI_DATA, MOCK_WEATHER_DATA } from "@/lib/client-data";

interface WeatherData {
  district: string;
  state: string;
  date: string;
  temperature: number;
  humidity: number;
  rainfall: number;
  wind_speed: number;
  weather_type: string;
  icon: string;
  disease_risk: string;
  recommendation: string;
  source?: string;
}

interface MandiPrice {
  commodity: string;
  state: string;
  market: string;
  price: number;
  unit: string;
  change: number;
  trend: "up" | "down" | "stable";
}

const DISTRICTS = [
  "Pune", "Nashik", "Nagpur", "Kolhapur", "Aurangabad", "Solapur",
  "Jalgaon", "Latur", "Ahmednagar", "Mumbai", "Delhi", "Lucknow",
  "Kanpur", "Varanasi", "Patna", "Bhopal", "Indore", "Jaipur",
  "Ahmedabad", "Surat", "Rajkot", "Vadodara", "Ludhiana", "Amritsar",
  "Bangalore", "Mysore", "Hyderabad", "Visakhapatnam", "Chennai", "Coimbatore",
];

const STATES = [
  "Maharashtra", "Gujarat", "Punjab", "Uttar Pradesh", "Rajasthan",
  "Karnataka", "Telangana", "Tamil Nadu", "Madhya Pradesh", "Bihar",
];

export default function AlertsPage() {
  const [selectedState, setSelectedState] = useState("Maharashtra");
  const [selectedDistrict, setSelectedDistrict] = useState("Pune");
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [mandiPrices, setMandiPrices] = useState<MandiPrice[]>([]);
  const [isLoadingWeather, setIsLoadingWeather] = useState(false);
  const [isLoadingMandi, setIsLoadingMandi] = useState(false);

  // Fetch weather
  useEffect(() => {
    const fetchWeather = async () => {
      setIsLoadingWeather(true);
      try {
        const response = await fetch(
          `/api/weather?district=${selectedDistrict}&state=${selectedState}`
        );
        if (response.ok) {
          const data = await response.json();
          setWeatherData(data);
        } else {
          setWeatherData(MOCK_WEATHER_DATA(selectedDistrict, selectedState) as any);
        }
      } catch (error) {
        setWeatherData(MOCK_WEATHER_DATA(selectedDistrict, selectedState) as any);
      } finally {
        setIsLoadingWeather(false);
      }
    };

    fetchWeather();
  }, [selectedDistrict, selectedState]);

  // Fetch mandi prices
  useEffect(() => {
    const fetchMandiPrices = async () => {
      setIsLoadingMandi(true);
      try {
        const response = await fetch(`/api/mandi?state=${selectedState}`);
        if (response.ok) {
          const data = await response.json();
          setMandiPrices(data.prices);
        } else {
          setMandiPrices(MOCK_MANDI_DATA.prices as any);
        }
      } catch (error) {
        setMandiPrices(MOCK_MANDI_DATA.prices as any);
      } finally {
        setIsLoadingMandi(false);
      }
    };

    fetchMandiPrices();
  }, [selectedState]);

  // Get icon for weather
  const getWeatherIcon = (weatherType: string) => {
    if (weatherType.includes("Cloud")) return <Cloud className="h-12 w-12 text-gray-500" />;
    if (weatherType.includes("Rain")) return <CloudRain className="h-12 w-12 text-blue-500" />;
    if (weatherType.includes("Clear") || weatherType.includes("Sunny")) return <Sun className="h-12 w-12 text-yellow-500" />;
    return <Cloud className="h-12 w-12 text-gray-400" />;
  };

  // Get trend icon
  const getTrendIcon = (trend: string) => {
    if (trend === "up") return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (trend === "down") return <TrendingDown className="h-4 w-4 text-red-600" />;
    return <Minus className="h-4 w-4 text-gray-500" />;
  };

  return (
    <main className="min-h-screen bg-muted/30 py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            <span className="text-primary">Weather</span> & Mandi Alerts
          </h1>
          <p className="text-muted-foreground">
            Daily weather forecasts and market prices for your region
          </p>
        </div>

        {/* Location Selector */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  State
                </label>
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {STATES.map((state) => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  District
                </label>
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {DISTRICTS.filter(d => d.toLowerCase().startsWith(selectedState.charAt(0).toLowerCase()) || true).map((district) => (
                    <option key={district} value={district}>{district}</option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Weather Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CloudRain className="h-5 w-5" />
              Current Weather - {selectedDistrict}
            </CardTitle>
            <CardDescription>
              <Calendar className="h-3 w-3 inline mr-1" />
              {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingWeather ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : weatherData ? (
              <div className="grid gap-6 md:grid-cols-2">
                <div className="flex items-center gap-6">
                  <div className="text-5xl">{weatherData.icon}</div>
                  <div>
                    <div className="text-4xl font-bold">{weatherData.temperature}°C</div>
                    <div className="text-muted-foreground">{weatherData.weather_type}</div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <Droplets className="h-6 w-6 mx-auto text-blue-500 mb-1" />
                    <div className="text-lg font-semibold">{weatherData.humidity}%</div>
                    <div className="text-xs text-muted-foreground">Humidity</div>
                  </div>
                  <div className="text-center">
                    <CloudRain className="h-6 w-6 mx-auto text-blue-600 mb-1" />
                    <div className="text-lg font-semibold">{weatherData.rainfall}mm</div>
                    <div className="text-xs text-muted-foreground">Rainfall</div>
                  </div>
                  <div className="text-center">
                    <Wind className="h-6 w-6 mx-auto text-gray-500 mb-1" />
                    <div className="text-lg font-semibold">{weatherData.wind_speed.toFixed(1)}</div>
                    <div className="text-xs text-muted-foreground">km/h</div>
                  </div>
                </div>
              </div>
            ) : null}

            {/* Disease Risk Alert */}
            {weatherData && (
              <div className="mt-6 space-y-3">
                <div
                  className={cn(
                    "p-4 rounded-lg border-l-4",
                    weatherData.disease_risk.includes("HIGH")
                      ? "bg-red-50 border-red-500"
                      : weatherData.disease_risk.includes("MEDIUM")
                      ? "bg-amber-50 border-amber-500"
                      : "bg-green-50 border-green-500"
                  )}
                >
                  <div className="flex items-start gap-2">
                    <AlertTriangle
                      className={cn(
                        "h-5 w-5 flex-shrink-0 mt-0.5",
                        weatherData.disease_risk.includes("HIGH")
                          ? "text-red-500"
                          : weatherData.disease_risk.includes("MEDIUM")
                          ? "text-amber-500"
                          : "text-green-500"
                      )}
                    />
                    <div>
                      <p className="font-medium">Disease Risk: {weatherData.disease_risk}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {weatherData.recommendation}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Mandi Prices */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Mandi Prices - {selectedState}
            </CardTitle>
            <CardDescription>
              Latest commodity prices from local markets
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingMandi ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : mandiPrices.length > 0 ? (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {mandiPrices.map((price) => (
                  <div
                    key={`${price.commodity}-${price.market}`}
                    className="p-4 rounded-lg border bg-card hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="font-semibold">{price.commodity}</div>
                        <div className="text-xs text-muted-foreground">{price.market}</div>
                      </div>
                      {getTrendIcon(price.trend)}
                    </div>
                    <div className="flex items-end justify-between">
                      <div>
                        <div className="text-2xl font-bold">₹{price.price.toLocaleString()}</div>
                        <div className="text-xs text-muted-foreground">{price.unit}</div>
                      </div>
                      <div
                        className={cn(
                          "text-sm font-medium",
                          price.trend === "up"
                            ? "text-green-600"
                            : price.trend === "down"
                            ? "text-red-600"
                            : "text-gray-500"
                        )}
                      >
                        {price.change > 0 ? "+" : ""}
                        {price.change}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No prices available for this state
              </div>
            )}
          </CardContent>
        </Card>

        {/* SMS Alert Info */}
        <Card className="mt-6 bg-primary/5 border-primary/20">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <ThermometerSun className="h-5 w-5" />
              📱 Get Daily SMS Alerts
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Register your phone number to receive daily weather and mandi price alerts at 6:00 AM.
              Free of cost, available in Hindi, Marathi, Telugu.
            </p>
            <div className="flex gap-2">
              <input
                type="tel"
                placeholder="+91 9876543210"
                className="flex-1 px-3 py-2 border rounded-lg bg-background"
              />
              <Button>Register</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
