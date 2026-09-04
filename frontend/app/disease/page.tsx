"use client";

import { useState, useCallback } from "react";
import {
  Upload,
  Camera,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Loader2,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface DiseaseResult {
  plant_type: string;
  disease_name: string;
  local_name?: string;
  confidence: "high" | "medium" | "low";
  symptoms: string[];
  treatment: {
    type: string;
    name: string;
    dosage: string;
    application_method: string;
    timing: string;
  };
  preventive_measures: string[];
  resistant_varieties: string[];
  economic_impact?: string;
}

export default function DiseasePage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<DiseaseResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Handle file selection
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError("File size too large. Please select an image under 10MB.");
      return;
    }

    setImageFile(file);
    setResult(null);
    setError(null);

    // Create preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  // Handle drag and drop
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    // Simulate file input
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    const input = document.getElementById("image-upload") as HTMLInputElement;
    input.files = dataTransfer.files;
    input.dispatchEvent(new Event("change", { bubbles: true }));
  }, []);

  // Analyze image
  const analyzeImage = useCallback(async () => {
    if (!imageFile) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 3000));

      // Simulated result (in production, this comes from Gemini Vision API)
      const mockResult: DiseaseResult = {
        plant_type: "Tomato",
        disease_name: "Late Blight",
        local_name: "झुलसा रोग",
        confidence: "high",
        symptoms: [
          "Water-soaked spots on leaves",
          "White fungal growth underneath leaves",
          "Brown lesions on stems",
          "Fruit rot with brown patches",
        ],
        treatment: {
          type: "Fungicide",
          name: "Metalaxyl + Mancozeb",
          dosage: "2g per liter water",
          application_method: "Foliar spray on both sides of leaves",
          timing: "Apply every 7-10 days during humid weather",
        },
        preventive_measures: [
          "Use resistant varieties like Pusa Ruby",
          "Practice crop rotation (3-4 years)",
          "Avoid overhead irrigation",
          "Ensure good air circulation between plants",
          "Remove and destroy infected plant debris",
        ],
        resistant_varieties: ["Pusa Ruby", "Arka Vikas", "Heem Sohna", "Dhanashree"],
        economic_impact:
          "Can cause up to 50% crop loss if untreated. Early detection and treatment is crucial.",
      };

      setResult(mockResult);
    } catch (err) {
      setError("Failed to analyze image. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  }, [imageFile]);

  // Reset form
  const resetForm = useCallback(() => {
    setSelectedImage(null);
    setImageFile(null);
    setResult(null);
    setError(null);
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-primary/5 to-background py-8 px-4">
      <div className="container mx-auto max-w-3xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">
            <span className="text-primary">Crop Disease</span> Detection
          </h1>
          <p className="text-muted-foreground">
            Upload a photo of your crop to identify diseases and get treatment advice
          </p>
        </div>

        {/* Upload Area */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Upload Crop Photo
            </CardTitle>
            <CardDescription>
              Take or upload a clear photo of the affected plant part
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!selectedImage ? (
              <div
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                className={cn(
                  "border-2 border-dashed rounded-xl p-12 text-center transition-colors cursor-pointer",
                  "hover:border-primary/50 hover:bg-primary/5"
                )}
              >
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-lg font-medium mb-2">
                    Drop your image here or click to upload
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Supports JPG, PNG, WebP (max 10MB)
                  </p>
                </label>
              </div>
            ) : (
              <div className="relative">
                <div className="relative aspect-video rounded-xl overflow-hidden bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={selectedImage}
                    alt="Selected crop"
                    className="w-full h-full object-contain"
                  />
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute top-3 right-3"
                  onClick={resetForm}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Change Image
                </Button>
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div className="mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                <p className="text-destructive text-sm flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  {error}
                </p>
              </div>
            )}

            {/* Analyze Button */}
            {selectedImage && !result && (
              <Button
                className="w-full mt-4"
                size="lg"
                onClick={analyzeImage}
                disabled={isAnalyzing}
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Analyzing Image...
                  </>
                ) : (
                  <>
                    <Camera className="h-5 w-5 mr-2" />
                    Analyze Crop
                  </>
                )}
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Results */}
        {result && (
          <div className="space-y-6 animate-fade-in">
            {/* Diagnosis Header */}
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl flex items-center gap-2">
                      {result.confidence === "high" ? (
                        <AlertTriangle className="h-6 w-6 text-amber-500" />
                      ) : (
                        <Info className="h-6 w-6 text-blue-500" />
                      )}
                      {result.disease_name}
                    </CardTitle>
                    {result.local_name && (
                      <p className="text-muted-foreground mt-1">{result.local_name}</p>
                    )}
                  </div>
                  <div
                    className={cn(
                      "px-3 py-1 rounded-full text-sm font-medium",
                      result.confidence === "high"
                        ? "bg-amber-100 text-amber-700"
                        : result.confidence === "medium"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-700"
                    )}
                  >
                    {result.confidence.toUpperCase()} CONFIDENCE
                  </div>
                </div>
                <CardDescription className="mt-2">
                  Plant: <span className="font-medium text-foreground">{result.plant_type}</span>
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Symptoms */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Symptoms Observed</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {result.symptoms.map((symptom, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>{symptom}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Treatment */}
            <Card className="border-green-200 bg-green-50/50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  Recommended Treatment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="bg-white rounded-lg p-4">
                    <p className="text-xs text-muted-foreground mb-1">Treatment Type</p>
                    <p className="font-medium">{result.treatment.type}</p>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <p className="text-xs text-muted-foreground mb-1">Product Name</p>
                    <p className="font-medium">{result.treatment.name}</p>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <p className="text-xs text-muted-foreground mb-1">Dosage</p>
                    <p className="font-medium">{result.treatment.dosage}</p>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <p className="text-xs text-muted-foreground mb-1">When to Apply</p>
                    <p className="font-medium">{result.treatment.timing}</p>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <p className="text-xs text-muted-foreground mb-1">Application Method</p>
                  <p>{result.treatment.application_method}</p>
                </div>
              </CardContent>
            </Card>

            {/* Prevention */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Prevention Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {result.preventive_measures.map((measure, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">✓</span>
                      <span>{measure}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Resistant Varieties */}
            {result.resistant_varieties.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Resistant Varieties</CardTitle>
                  <CardDescription>
                    Consider these varieties for future planting
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {result.resistant_varieties.map((variety) => (
                      <span
                        key={variety}
                        className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium"
                      >
                        {variety}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Economic Impact */}
            {result.economic_impact && (
              <Card className="border-amber-200 bg-amber-50/50">
                <CardContent className="p-4">
                  <p className="text-sm">
                    <span className="font-medium text-amber-800">Economic Impact: </span>
                    {result.economic_impact}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Actions */}
            <div className="flex gap-4">
              <Button variant="outline" className="flex-1" onClick={resetForm}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Analyze Another Image
              </Button>
              <Button className="flex-1">
                Get Voice Advice for This Disease
              </Button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
