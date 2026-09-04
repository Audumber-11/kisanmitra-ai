import Link from "next/link";
import {
  Mic,
  MessageSquare,
  CloudSun,
  Sprout,
  BarChart3,
  Leaf,
  Phone,
  ArrowRight,
  Star,
  Heart,
} from "lucide-react";

const features = [
  {
    icon: Mic,
    title: "Voice Advisory",
    titleHi: "आवाज सलाह",
    description: "Call and speak in Hindi, Marathi, or Telugu. Get instant answers to your farming questions.",
    color: "text-primary",
    bg: "bg-primary/10",
    href: "/voice",
  },
  {
    icon: MessageSquare,
    title: "Disease Detection",
    titleHi: "रोग पहचान",
    description: "Upload a photo of your crop. AI identifies diseases and suggests treatments.",
    color: "text-green-600",
    bg: "bg-green-100",
    href: "/disease",
  },
  {
    icon: CloudSun,
    title: "Weather & Mandi Alerts",
    titleHi: "मौसम और मंडी",
    description: "Real-time weather forecasts and market prices for your district.",
    color: "text-blue-600",
    bg: "bg-blue-100",
    href: "/alerts",
  },
  {
    icon: Sprout,
    title: "Regenerative Coach",
    titleHi: "पुनर्जनन सलाह",
    description: "Learn about cover crops, crop rotation, and bio-fertilizers for your soil.",
    color: "text-amber-600",
    bg: "bg-amber-100",
    href: "/alerts",
  },
  {
    icon: BarChart3,
    title: "District Dashboard",
    titleHi: "जिला डैशबोर्ड",
    description: "Officers can monitor crop health, disease outbreaks, and farmer queries.",
    color: "text-purple-600",
    bg: "bg-purple-100",
    href: "/dashboard",
  },
  {
    icon: Leaf,
    title: "Carbon Credits",
    titleHi: "कार्बन क्रेडिट",
    description: "Track regenerative practices and earn carbon credits for sustainable farming.",
    color: "text-teal-600",
    bg: "bg-teal-100",
    href: "/carbon",
  },
];

const languages = [
  { name: "हिंदी", code: "Hindi" },
  { name: "मराठी", code: "Marathi" },
  { name: "తెలుగు", code: "Telugu" },
  { name: "English", code: "English" },
];

const stats = [
  { value: "10K+", label: "Farmers Reachable" },
  { value: "4", label: "Languages Supported" },
  { value: "24/7", label: "Always Available" },
  { value: "0₹", label: "Free to Use" },
];

export default function HomePage() {
  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-primary/10 to-background py-20 md:py-32">
        <div className="container relative mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary mb-8 animate-fade-in">
            <Star className="h-4 w-4" />
            <span>Built for Build with AI: Code for Communities Hackathon • Track 4 AgriN</span>
          </div>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl mb-6 animate-fade-in">
            <span className="text-foreground">Kisan</span>
            <span className="text-primary">Mitra</span>
            <span className="text-foreground"> AI</span>
          </h1>

          <p className="mx-auto max-w-2xl text-lg text-muted-foreground md:text-xl mb-8 animate-fade-in animate-delay-100">
            Your voice-first agricultural advisor. Speak in Hindi, Marathi, or Telugu — get expert farming guidance instantly.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in animate-delay-200">
            <Link
              href="/voice"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-lg font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5"
            >
              <Phone className="h-5 w-5" />
              Try Voice Advisory
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/disease"
              className="inline-flex items-center gap-2 rounded-full border-2 border-primary/20 bg-background px-8 py-4 text-lg font-semibold text-primary transition-all hover:border-primary/40 hover:bg-primary/5"
            >
              <MessageSquare className="h-5 w-5" />
              Detect Disease
            </Link>
          </div>

          {/* Language Support */}
          <div className="mt-12 flex flex-wrap justify-center gap-3 animate-fade-in animate-delay-300">
            <span className="text-sm text-muted-foreground">Available in:</span>
            {languages.map((lang) => (
              <span
                key={lang.code}
                className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-sm font-medium"
              >
                {lang.name}
              </span>
            ))}
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-secondary/10 blur-3xl" />
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary">{stat.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              Everything a Farmer Needs
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground text-lg">
              From voice queries to disease detection, weather alerts to carbon credits — all in one platform.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <Link
                key={feature.title}
                href={feature.href}
                className="group relative rounded-2xl border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:-translate-y-1 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`inline-flex rounded-xl ${feature.bg} p-3 mb-4`}>
                  <feature.icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-semibold mb-1">{feature.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">{feature.titleHi}</p>
                <p className="text-muted-foreground mb-4">{feature.description}</p>
                <div className="flex items-center text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  Try it now <ArrowRight className="h-4 w-4 ml-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-muted/50 py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              How It Works
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground text-lg">
              Get started in 3 simple steps — works in any browser, even on slow networks.
            </p>
          </div>

          <div className="mx-auto max-w-4xl">
            <div className="space-y-8">
              {[
                {
                  step: "1",
                  title: "Choose a Feature",
                  description: "Voice, Disease, Weather, or Carbon — pick what you need.",
                },
                {
                  step: "2",
                  title: "Speak or Upload",
                  description: "Use your voice (any language) or upload a crop photo.",
                },
                {
                  step: "3",
                  title: "Get Instant Advice",
                  description: "AI provides specific, actionable guidance in your language.",
                },
              ].map((item) => (
                <div key={item.step} className="flex gap-6 items-start">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold shadow-lg shadow-primary/25">
                    {item.step}
                  </div>
                  <div className="pt-2">
                    <h3 className="text-xl font-semibold mb-1">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why KisanMitra Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              Why KisanMitra AI?
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
            <div className="text-center p-6">
              <div className="text-5xl mb-4">🌾</div>
              <h3 className="font-semibold mb-2">Built for India</h3>
              <p className="text-sm text-muted-foreground">
                Designed for Indian crops, weather, soil types, and farming practices.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="text-5xl mb-4">🗣️</div>
              <h3 className="font-semibold mb-2">Voice-First</h3>
              <p className="text-sm text-muted-foreground">
                No need to read or type. Just speak in your language.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="text-5xl mb-4">📱</div>
              <h3 className="font-semibold mb-2">Works Everywhere</h3>
              <p className="text-sm text-muted-foreground">
                PWA that works on slow networks. Mobile-friendly.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="text-5xl mb-4">💰</div>
              <h3 className="font-semibold mb-2">100% Free</h3>
              <p className="text-sm text-muted-foreground">
                Free to use. No hidden charges for farmers.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="text-5xl mb-4">🌍</div>
              <h3 className="font-semibold mb-2">Sustainable</h3>
              <p className="text-sm text-muted-foreground">
                Promotes regenerative farming. Earn carbon credits.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="text-5xl mb-4">🤖</div>
              <h3 className="font-semibold mb-2">AI-Powered</h3>
              <p className="text-sm text-muted-foreground">
                Uses Google Gemini for accurate, context-aware advice.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <div className="mx-auto max-w-3xl rounded-3xl bg-gradient-to-br from-primary to-primary/80 p-12 text-center text-primary-foreground shadow-2xl">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              Ready to Transform Your Farming?
            </h2>
            <p className="text-lg text-primary-foreground/80 mb-8">
              Try KisanMitra AI now — completely free, works in your language.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/voice"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-lg font-semibold text-primary shadow-lg transition-all hover:bg-white/90 hover:-translate-y-0.5"
              >
                <Mic className="h-5 w-5" />
                Start Voice Call
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-white/30 bg-transparent px-8 py-4 text-lg font-semibold text-white transition-all hover:bg-white/10"
              >
                <BarChart3 className="h-5 w-5" />
                View Dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl font-bold text-primary">KisanMitra AI</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Voice-first agricultural advisory for Indian farmers.
              </p>
            </div>
            <div className="flex flex-wrap gap-6 text-sm text-muted-foreground justify-center">
              <Link href="/voice" className="hover:text-primary transition-colors">Voice</Link>
              <Link href="/disease" className="hover:text-primary transition-colors">Disease</Link>
              <Link href="/alerts" className="hover:text-primary transition-colors">Alerts</Link>
              <Link href="/carbon" className="hover:text-primary transition-colors">Carbon</Link>
              <Link href="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            <p className="flex items-center justify-center gap-1">
              Built with <Heart className="h-3 w-3 text-red-500 fill-red-500" /> for India&apos;s farmers | Build with AI Hackathon 2026
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
