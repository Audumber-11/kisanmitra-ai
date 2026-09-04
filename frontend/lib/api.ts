import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: "Request failed" }));
      return { error: error.detail || "Request failed" };
    }

    const data = await response.json();
    return { data };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Network error",
    };
  }
}

// Voice API
export const voiceApi = {
  processQuery: (audioData: string, phone: string, language: string) =>
    apiRequest("/api/v1/voice/query", {
      method: "POST",
      body: JSON.stringify({ audio_data: audioData, phone, language }),
    }),
};

// Disease API
export const diseaseApi = {
  analyze: async (imageFile: File, phone: string) => {
    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("phone", phone);

    const response = await fetch(`${API_BASE_URL}/api/v1/disease/analyze?phone=${phone}`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      return { error: "Analysis failed" };
    }

    return { data: await response.json() };
  },

  getHistory: (farmerId: string) =>
    apiRequest(`/api/v1/disease/history/${farmerId}`),
};

// Weather API
export const weatherApi = {
  getCurrent: (district: string, state?: string) =>
    apiRequest(`/api/v1/alerts/weather/current?district=${district}${state ? `&state=${state}` : ""}`),

  getForecast: (district: string, state?: string, days?: number) => {
    let url = `/api/v1/alerts/weather/forecast?district=${district}`;
    if (state) url += `&state=${state}`;
    if (days) url += `&days=${days}`;
    return apiRequest(url);
  },
};

// Dashboard API
export const dashboardApi = {
  getStats: (district?: string, state?: string) => {
    let url = "/api/v1/dashboard/stats";
    const params = new URLSearchParams();
    if (district) params.append("district", district);
    if (state) params.append("state", state);
    if (params.toString()) url += `?${params.toString()}`;
    return apiRequest(url);
  },

  getQueryHeatmap: (state?: string) =>
    apiRequest(`/api/v1/dashboard/query-heatmap${state ? `?state=${state}` : ""}`),

  getDiseaseOutbreaks: (state?: string, severity?: string) => {
    let url = "/api/v1/dashboard/disease-outbreaks";
    const params = new URLSearchParams();
    if (state) params.append("state", state);
    if (severity) params.append("severity", severity);
    if (params.toString()) url += `?${params.toString()}`;
    return apiRequest(url);
  },

  getWeatherTrends: (district: string, state?: string, days?: number) => {
    let url = `/api/v1/dashboard/weather-trends?district=${district}`;
    if (state) url += `&state=${state}`;
    if (days) url += `&days=${days}`;
    return apiRequest(url);
  },

  getMandiSummary: (state?: string) =>
    apiRequest(`/api/v1/dashboard/mandi-summary${state ? `?state=${state}` : ""}`),
};

// Carbon API
export const carbonApi = {
  logPractice: (data: {
    farm_id: string;
    practice_type: string;
    area_hectares: number;
    intensity: string;
    start_date: string;
    notes?: string;
  }) =>
    apiRequest("/api/v1/carbon/log", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getEstimate: (farmId: string, timeframeYears?: number) =>
    apiRequest(
      `/api/v1/carbon/estimate/${farmId}${timeframeYears ? `?timeframe_years=${timeframeYears}` : ""}`
    ),

  getReport: (farmId: string) =>
    apiRequest(`/api/v1/carbon/report/${farmId}`),

  getSummary: (district?: string, state?: string) => {
    let url = "/api/v1/carbon/summary";
    const params = new URLSearchParams();
    if (district) params.append("district", district);
    if (state) params.append("state", state);
    if (params.toString()) url += `?${params.toString()}`;
    return apiRequest(url);
  },

  getPractices: () =>
    apiRequest("/api/v1/carbon/practices"),
};
