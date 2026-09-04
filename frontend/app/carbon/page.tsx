"use client";

import { useState } from "react";
import {
  Leaf,
  TreePine,
  Sprout,
  Trash2,
  Plus,
  Award,
  TrendingUp,
  Info,
  CheckCircle2,
  Circle,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Carbon sequestration factors (tCO2 per hectare per year)
const PRACTICES = [
  {
    id: "cover_crops",
    name: "Cover Crops",
    nameHi: "हरी खाद",
    icon: Sprout,
    factors: { low: 0.5, medium: 1.0, high: 2.0 },
    description: "Legume cover crops fix nitrogen and sequester carbon in soil",
    color: "text-green-600",
    bg: "bg-green-100",
  },
  {
    id: "reduced_tillage",
    name: "Reduced Tillage",
    nameHi: "कम जुताई",
    icon: TrendingUp,
    factors: { low: 0.3, medium: 0.6, high: 1.0 },
    description: "No-till or reduced tillage preserves soil organic matter",
    color: "text-amber-600",
    bg: "bg-amber-100",
  },
  {
    id: "compost",
    name: "Compost Application",
    nameHi: "खाद का उपयोग",
    icon: Leaf,
    factors: { low: 0.2, medium: 0.4, high: 0.5 },
    description: "Organic matter additions improve soil carbon content",
    color: "text-brown-600",
    bg: "bg-orange-100",
  },
  {
    id: "agroforestry",
    name: "Agroforestry",
    nameHi: "कृषि वानिकी",
    icon: TreePine,
    factors: { low: 1.0, medium: 3.0, high: 5.0 },
    description: "Trees on farmland sequester significant carbon",
    color: "text-emerald-600",
    bg: "bg-emerald-100",
  },
  {
    id: "biochar",
    name: "Biochar",
    nameHi: "बायोचार",
    icon: Trash2,
    factors: { low: 1.0, medium: 2.5, high: 4.0 },
    description: "Biochar application for long-term carbon storage",
    color: "text-purple-600",
    bg: "bg-purple-100",
  },
];

interface LoggedPractice {
  id: string;
  practice: typeof PRACTICES[0];
  area: number;
  intensity: "low" | "medium" | "high";
  date: string;
  tco2: number;
}

export default function CarbonPage() {
  const [loggedPractices, setLoggedPractices] = useState<LoggedPractice[]>([
    {
      id: "1",
      practice: PRACTICES[0],
      area: 2.0,
      intensity: "medium",
      date: "2024-08-15",
      tco2: 2.0,
    },
    {
      id: "2",
      practice: PRACTICES[1],
      area: 2.0,
      intensity: "high",
      date: "2024-08-10",
      tco2: 2.0,
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [selectedPractice, setSelectedPractice] = useState(PRACTICES[0]);
  const [area, setArea] = useState(1);
  const [intensity, setIntensity] = useState<"low" | "medium" | "high">("medium");

  // Calculate totals
  const totalTCO2 = loggedPractices.reduce((sum, p) => sum + p.tco2, 0);
  const totalArea = Math.max(...loggedPractices.map(p => p.area), 0);
  const totalPractices = loggedPractices.length;

  // Add new practice
  const handleAddPractice = () => {
    const tco2 = selectedPractice.factors[intensity] * area;
    const newPractice: LoggedPractice = {
      id: Date.now().toString(),
      practice: selectedPractice,
      area,
      intensity,
      date: new Date().toISOString().split("T")[0],
      tco2,
    };
    setLoggedPractices([newPractice, ...loggedPractices]);
    setShowForm(false);
    setArea(1);
    setIntensity("medium");
  };

  // Remove practice
  const handleRemove = (id: string) => {
    setLoggedPractices(loggedPractices.filter((p) => p.id !== id));
  };

  // Get equivalent metrics
  const equivalent = {
    cars: Math.round(totalTCO2 * 0.23), // 1 car = 4.3 tCO2/year
    trees: Math.round(totalTCO2 * 16.5), // 1 tree = 0.06 tCO2/year
    flights: Math.round(totalTCO2 * 1.5), // 1 flight = 0.67 tCO2
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-green-50 to-background py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">
            <span className="text-primary">Carbon Credit</span> Tracker
          </h1>
          <p className="text-muted-foreground">
            Track your regenerative practices and earn carbon credits
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-3 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Total CO₂ Sequestered</span>
                <Leaf className="h-5 w-5 text-green-600" />
              </div>
              <div className="text-3xl font-bold text-green-600">
                {totalTCO2.toFixed(1)}
              </div>
              <div className="text-xs text-muted-foreground">tCO₂ / year</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Practices Logged</span>
                <Sprout className="h-5 w-5 text-primary" />
              </div>
              <div className="text-3xl font-bold">{totalPractices}</div>
              <div className="text-xs text-muted-foreground">on {totalArea} hectares</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Estimated Value</span>
                <Award className="h-5 w-5 text-amber-500" />
              </div>
              <div className="text-3xl font-bold">₹{(totalTCO2 * 1500).toFixed(0)}</div>
              <div className="text-xs text-muted-foreground">@ ₹1,500/tCO₂</div>
            </CardContent>
          </Card>
        </div>

        {/* Equivalent Impact */}
        <Card className="mb-6 bg-green-50/50 border-green-200">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Info className="h-5 w-5 text-green-600" />
              Environmental Impact
            </CardTitle>
            <CardDescription>
              Your practices are equivalent to:
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="text-center p-4 bg-white rounded-lg">
                <div className="text-3xl mb-2">🚗</div>
                <div className="text-2xl font-bold text-green-700">{equivalent.cars}</div>
                <div className="text-sm text-muted-foreground">cars off road</div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg">
                <div className="text-3xl mb-2">🌳</div>
                <div className="text-2xl font-bold text-green-700">{equivalent.trees}</div>
                <div className="text-sm text-muted-foreground">trees planted</div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg">
                <div className="text-3xl mb-2">✈️</div>
                <div className="text-2xl font-bold text-green-700">{equivalent.flights}</div>
                <div className="text-sm text-muted-foreground">flights avoided</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Add Practice Button */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Your Practices</h2>
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="h-4 w-4 mr-2" />
            {showForm ? "Cancel" : "Log New Practice"}
          </Button>
        </div>

        {/* Add Practice Form */}
        {showForm && (
          <Card className="mb-6 animate-fade-in">
            <CardHeader>
              <CardTitle>Log Regenerative Practice</CardTitle>
              <CardDescription>
                Track a new sustainable practice to estimate carbon sequestration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Practice Selection */}
              <div>
                <label className="text-sm font-medium mb-2 block">Practice Type</label>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {PRACTICES.map((practice) => (
                    <button
                      key={practice.id}
                      onClick={() => setSelectedPractice(practice)}
                      className={cn(
                        "p-4 rounded-lg border-2 transition-all text-left",
                        selectedPractice.id === practice.id
                          ? "border-primary bg-primary/5"
                          : "border-muted hover:border-primary/30"
                      )}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className={cn("p-2 rounded-lg", practice.bg)}>
                          <practice.icon className={cn("h-5 w-5", practice.color)} />
                        </div>
                        <div>
                          <div className="font-medium">{practice.name}</div>
                          <div className="text-xs text-muted-foreground">{practice.nameHi}</div>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">{practice.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Area Input */}
              <div>
                <label className="text-sm font-medium mb-2 block">Area (Hectares)</label>
                <input
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={area}
                  onChange={(e) => setArea(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Intensity Selection */}
              <div>
                <label className="text-sm font-medium mb-2 block">Intensity Level</label>
                <div className="grid grid-cols-3 gap-3">
                  {(["low", "medium", "high"] as const).map((level) => (
                    <button
                      key={level}
                      onClick={() => setIntensity(level)}
                      className={cn(
                        "p-3 rounded-lg border-2 capitalize transition-all",
                        intensity === level
                          ? "border-primary bg-primary/5"
                          : "border-muted hover:border-primary/30"
                      )}
                    >
                      <div className="font-medium">{level}</div>
                      <div className="text-xs text-muted-foreground">
                        {selectedPractice.factors[level]} tCO₂/ha
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Estimate Display */}
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="text-sm text-muted-foreground">Estimated Carbon Sequestration</div>
                <div className="text-3xl font-bold text-green-700">
                  {(selectedPractice.factors[intensity] * area).toFixed(2)} tCO₂/year
                </div>
              </div>

              <Button onClick={handleAddPractice} className="w-full">
                Log This Practice
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Logged Practices List */}
        <div className="space-y-3">
          {loggedPractices.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Leaf className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No practices logged yet</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Start tracking your regenerative practices to earn carbon credits
                </p>
              </CardContent>
            </Card>
          ) : (
            loggedPractices.map((log) => (
              <Card key={log.id} className="dashboard-card">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className={cn("p-3 rounded-xl", log.practice.bg)}>
                      <log.practice.icon className={cn("h-6 w-6", log.practice.color)} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{log.practice.name}</span>
                        <span className="text-xs text-muted-foreground">
                          ({log.practice.nameHi})
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {log.area} ha • {log.intensity} intensity • {log.date}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-green-600">
                        {log.tco2.toFixed(2)}
                      </div>
                      <div className="text-xs text-muted-foreground">tCO₂/year</div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemove(log.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Info Card */}
        <Card className="mt-6 bg-blue-50/50 border-blue-200">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <Info className="h-4 w-4 text-blue-500" />
              About Carbon Credits
            </h3>
            <p className="text-sm text-muted-foreground">
              Carbon credits are issued for practices that remove CO₂ from the atmosphere.
              Our estimates are based on peer-reviewed research and field studies.
              Credits can be sold on carbon markets (current price: ~₹1,500/tCO₂) or used for sustainability certifications.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
