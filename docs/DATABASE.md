-- =====================================================
-- KisanMitra AI - Supabase Database Schema
-- =====================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. FARMERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS farmers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  phone TEXT UNIQUE NOT NULL,
  name TEXT,
  language TEXT CHECK (language IN ('hindi', 'marathi', 'telugu', 'english')) DEFAULT 'hindi',
  village TEXT,
  district TEXT,
  state TEXT DEFAULT 'Maharashtra',
  soil_type TEXT,
  farm_size_hectares DECIMAL(10, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_farmers_phone ON farmers(phone);
CREATE INDEX idx_farmers_district ON farmers(district);
CREATE INDEX idx_farmers_state ON farmers(state);

-- =====================================================
-- 2. FARMS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS farms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  farmer_id UUID REFERENCES farmers(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  area_hacres DECIMAL(10, 2) NOT NULL,
  soil_type TEXT,
  latitude DECIMAL(10, 7),
  longitude DECIMAL(10, 7),
  village TEXT,
  district TEXT,
  state TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_farms_farmer_id ON farms(farmer_id);
CREATE INDEX idx_farms_location ON farms(district, state);

-- =====================================================
-- 3. CROPS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS crops (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  scientific_name TEXT,
  family TEXT,
  sowing_season TEXT,
  growth_period_days INTEGER,
  varieties JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_crops_name ON crops(name);

-- =====================================================
-- 4. CROP_DISEASES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS crop_diseases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  crop_id UUID REFERENCES crops(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  scientific_name TEXT,
  local_name TEXT,
  symptoms JSONB NOT NULL,
  treatment JSONB NOT NULL,
  preventive_measures JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_diseases_crop_id ON crop_diseases(crop_id);
CREATE INDEX idx_diseases_name ON crop_diseases(name);

-- =====================================================
-- 5. ADVISORY_LOGS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS advisory_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  farmer_id UUID REFERENCES farmers(id) ON DELETE CASCADE,
  query TEXT,
  response TEXT,
  language TEXT,
  type TEXT CHECK (type IN ('voice', 'image', 'sms', 'web')) DEFAULT 'voice',
  image_url TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_advisory_farmer_id ON advisory_logs(farmer_id);
CREATE INDEX idx_advisory_created_at ON advisory_logs(created_at);
CREATE INDEX idx_advisory_type ON advisory_logs(type);

-- =====================================================
-- 6. CARBON_CREDIT_LOGS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS carbon_credit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  farm_id UUID REFERENCES farms(id) ON DELETE CASCADE,
  practice TEXT NOT NULL,
  area_hacres DECIMAL(10, 2) NOT NULL,
  estimated_kg_co2 DECIMAL(15, 2) NOT NULL,
  intensity TEXT CHECK (intensity IN ('low', 'medium', 'high')) DEFAULT 'medium',
  start_date DATE,
  end_date DATE,
  notes TEXT,
  verified BOOLEAN DEFAULT FALSE,
  verified_by UUID,
  verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_carbon_farm_id ON carbon_credit_logs(farm_id);
CREATE INDEX idx_carbon_practice ON carbon_credit_logs(practice);
CREATE INDEX idx_carbon_verified ON carbon_credit_logs(verified);

-- =====================================================
-- 7. ALERT_PREFERENCES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS alert_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  farmer_id UUID REFERENCES farmers(id) ON DELETE CASCADE UNIQUE,
  weather_alerts BOOLEAN DEFAULT TRUE,
  mandi_alerts BOOLEAN DEFAULT TRUE,
  disease_alerts BOOLEAN DEFAULT TRUE,
  preferred_time TIME DEFAULT '06:00:00',
  language TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_alert_prefs_farmer_id ON alert_preferences(farmer_id);

-- =====================================================
-- 8. WEATHER_DATA TABLE (for historical tracking)
-- =====================================================
CREATE TABLE IF NOT EXISTS weather_data (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  district TEXT NOT NULL,
  state TEXT NOT NULL,
  date DATE NOT NULL,
  temperature DECIMAL(5, 2),
  humidity INTEGER,
  rainfall DECIMAL(8, 2),
  wind_speed DECIMAL(5, 2),
  weather_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_weather_district_date ON weather_data(district, date);
CREATE UNIQUE INDEX idx_weather_unique ON weather_data(district, state, date);

-- =====================================================
-- 9. MANDI_PRICES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS mandi_prices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  commodity TEXT NOT NULL,
  state TEXT NOT NULL,
  district TEXT,
  market TEXT,
  price_per_quintal DECIMAL(10, 2),
  previous_price DECIMAL(10, 2),
  price_change_percent DECIMAL(5, 2),
  date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_mandi_commodity ON mandi_prices(commodity);
CREATE INDEX idx_mandi_state ON mandi_prices(state);
CREATE INDEX idx_mandi_date ON mandi_prices(date);

-- =====================================================
-- 10. ALERT_HISTORY TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS alert_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  farmer_id UUID REFERENCES farmers(id) ON DELETE CASCADE,
  alert_type TEXT NOT NULL,
  message TEXT,
  status TEXT CHECK (status IN ('sent', 'delivered', 'failed')) DEFAULT 'sent',
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_alert_history_farmer_id ON alert_history(farmer_id);
CREATE INDEX idx_alert_history_sent_at ON alert_history(sent_at);

-- =====================================================
-- ROW-LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE farmers ENABLE ROW LEVEL SECURITY;
ALTER TABLE farms ENABLE ROW LEVEL SECURITY;
ALTER TABLE crops ENABLE ROW LEVEL SECURITY;
ALTER TABLE crop_diseases ENABLE ROW LEVEL SECURITY;
ALTER TABLE advisory_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE carbon_credit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE alert_preferences ENABLE ROW LEVEL SECURITY;

-- Service role can do everything
CREATE POLICY "Service role full access" ON farmers FOR ALL USING (true);
CREATE POLICY "Service role full access" ON farms FOR ALL USING (true);
CREATE POLICY "Service role full access" ON crops FOR ALL USING (true);
CREATE POLICY "Service role full access" ON crop_diseases FOR ALL USING (true);
CREATE POLICY "Service role full access" ON advisory_logs FOR ALL USING (true);
CREATE POLICY "Service role full access" ON carbon_credit_logs FOR ALL USING (true);
CREATE POLICY "Service role full access" ON alert_preferences FOR ALL USING (true);

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Update updated_at on farmers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_farmers_updated_at BEFORE UPDATE ON farmers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_farms_updated_at BEFORE UPDATE ON farms
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_alert_preferences_updated_at BEFORE UPDATE ON alert_preferences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- SEED DATA: Common Indian Crops
-- =====================================================

INSERT INTO crops (name, scientific_name, family, sowing_season, growth_period_days, varieties) VALUES
  ('Tomato', 'Solanum lycopersicum', 'Solanaceae', 'Kharif, Rabi', 90,
   '["Pusa Ruby", "Arka Vikas", "Heem Sohna", "Dhanashree", "Vaishali"]'::jsonb),
  ('Onion', 'Allium cepa', 'Amaryllidaceae', 'Kharif, Rabi', 120,
   '["N-53", "Bhima Super", "Phule Samarth", "Akola Safed"]'::jsonb),
  ('Wheat', 'Triticum aestivum', 'Poaceae', 'Rabi', 130,
   '["HD-2967", "Lokwan", "Sharbati", "Durum"]'::jsonb),
  ('Rice', 'Oryza sativa', 'Poaceae', 'Kharif', 120,
   '["Basmati", "IR-64", "MTU-7029", "Ponni"]'::jsonb),
  ('Cotton', 'Gossypium hirsutum', 'Malvaceae', 'Kharif', 180,
   '["Bt Cotton", "Suraj", "NHH-44", "DCH-32"]'::jsonb),
  ('Sugarcane', 'Saccharum officinarum', 'Poaceae', 'Year-round', 365,
   '["Co-86032", "CoM-0265", "Co-92005", "Co-8021"]'::jsonb),
  ('Soybean', 'Glycine max', 'Fabaceae', 'Kharif', 90,
   '["JS-335", "NRC-7", "MACS-450", "JS-9305"]'::jsonb),
  ('Maize', 'Zea mays', 'Poaceae', 'Kharif, Rabi', 100,
   '["HQPM-1", "Dekalb", "Pioneer", "NK-6240"]'::jsonb),
  ('Groundnut', 'Arachis hypogaea', 'Fabaceae', 'Kharif, Rabi', 120,
   '["GG-20", "TG-37A", "JL-24", "Kadiri-6"]'::jsonb),
  ('Pigeon Pea', 'Cajanus cajan', 'Fabaceae', 'Kharif', 180,
   '["ICPL-87", "BSMR-736", "Asha", "Maruti"]'::jsonb)
ON CONFLICT (name) DO NOTHING;

-- =====================================================
-- SEED DATA: Common Diseases
-- =====================================================

INSERT INTO crop_diseases (crop_id, name, scientific_name, local_name, symptoms, treatment, preventive_measures)
SELECT
  c.id,
  'Late Blight',
  'Phytophthora infestans',
  'झुलसा रोग',
  '["Water-soaked spots on leaves", "White fungal growth underneath", "Brown lesions on stems"]'::jsonb,
  '{"type": "fungicide", "name": "Metalaxyl + Mancozeb", "dosage": "2g/liter water", "application_method": "Foliar spray", "timing": "Every 7-10 days during humid weather"}'::jsonb,
  '["Use resistant varieties", "Crop rotation", "Avoid overhead irrigation", "Remove infected plant debris"]'::jsonb
FROM crops c WHERE c.name = 'Tomato'
ON CONFLICT DO NOTHING;

INSERT INTO crop_diseases (crop_id, name, scientific_name, local_name, symptoms, treatment, preventive_measures)
SELECT
  c.id,
  'Powdery Mildew',
  'Erysiphe spp',
  'चूर्णिल आसिता',
  '["White powdery coating on leaves", "Yellowing of leaves", "Stunted growth"]'::jsonb,
  '{"type": "fungicide", "name": "Sulfur dust or Wettable sulfur", "dosage": "3g/liter water", "application_method": "Foliar spray", "timing": "At first sign of disease"}'::jsonb,
  '["Plant resistant varieties", "Ensure proper spacing", "Avoid excessive nitrogen"]'::jsonb
FROM crops c WHERE c.name IN ('Grape', 'Wheat')
ON CONFLICT DO NOTHING;

-- =====================================================
-- STORAGE BUCKETS
-- =====================================================

-- Create storage bucket for disease images
INSERT INTO storage.buckets (id, name, public) VALUES
  ('disease-images', 'disease-images', false),
  ('farmer-documents', 'farmer-documents', false),
  ('voice-recordings', 'voice-recordings', false)
ON CONFLICT (id) DO NOTHING;
