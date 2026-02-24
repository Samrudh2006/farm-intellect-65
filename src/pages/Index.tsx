import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AshokaChakra } from "@/components/ui/ashoka-chakra";
import { 
  Wheat, 
  Brain, 
  CloudSun, 
  TrendingUp, 
  Shield, 
  Users,
  ArrowRight,
  CheckCircle
} from "lucide-react";
import heroImage from "@/assets/hero-farming.jpg";

const Index = () => {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Recommendations",
      description: "Get personalized crop advice powered by machine learning algorithms",
      iconBg: "bg-accent/10",
      iconColor: "text-accent",
    },
    {
      icon: CloudSun,
      title: "Weather Integration",
      description: "Real-time weather data and forecasts for optimal farming decisions",
      iconBg: "bg-navy/10",
      iconColor: "text-navy",
    },
    {
      icon: TrendingUp,
      title: "Yield Optimization",
      description: "Maximize your crop yields with data-driven insights",
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
    },
    {
      icon: Shield,
      title: "Pest & Disease Control",
      description: "Early detection and prevention of crop threats",
      iconBg: "bg-accent/10",
      iconColor: "text-accent",
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Tricolor top bar */}
      <div className="tricolor-bar h-1.5" />

      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AshokaChakra size={36} />
            <h1 className="text-xl font-bold text-foreground">Smart Crop Advisory</h1>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost" className="text-foreground hover:text-primary">Sign In</Button>
            </Link>
            <Link to="/login">
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-md glow-saffron">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src={heroImage} alt="Smart farming technology" className="w-full h-full object-cover opacity-8" />
          <div className="absolute inset-0 bg-gradient-to-br from-accent/8 via-background/92 to-primary/8" />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            {/* Animated Ashoka Chakra hero */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <AshokaChakra size={80} className="drop-shadow-lg" />
                <div className="absolute -inset-4 rounded-full border-2 border-dashed border-navy/20 animate-[chakra-spin_20s_linear_infinite_reverse]" />
              </div>
            </div>
            <Badge className="mb-4 bg-accent/10 text-accent border-accent/30 text-sm px-4 py-1" variant="outline">
              🇮🇳 Proudly Indian — Next-Generation Farm Management
            </Badge>
            <h1 className="text-4xl lg:text-6xl font-bold text-foreground leading-tight">
              Smart Crop Advisory
              <span className="block text-gradient-tricolor mt-2">System</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Revolutionize your farming with AI-powered recommendations, 
              real-time monitoring, and expert guidance for optimal crop yields.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <Link to="/login">
                <Button size="lg" className="w-full sm:w-auto bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg glow-saffron text-base px-8">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-primary text-primary hover:bg-primary hover:text-primary-foreground text-base px-8">
                  View Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/40">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="flex justify-center mb-4">
              <AshokaChakra size={32} animate={false} />
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-foreground">
              Everything You Need for <span className="text-gradient-tricolor">Smart Farming</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Comprehensive tools and insights to help you make data-driven decisions
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="tricolor-card text-center p-6 cursor-pointer">
                <CardContent className="space-y-4 pt-6">
                  <div className={`inline-flex p-3 rounded-xl ${feature.iconBg}`}>
                    <feature.icon className={`h-10 w-10 ${feature.iconColor}`} />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
                Join Thousands of <span className="text-gradient-tricolor">Smart Farmers</span>
              </h2>
              <p className="text-xl text-muted-foreground">
                Our platform has helped farmers increase yields by up to 35% 
                while reducing costs and environmental impact.
              </p>
              <div className="space-y-4">
                {[
                  "AI-powered crop recommendations",
                  "Real-time weather monitoring",
                  "Pest and disease alerts",
                  "Expert consultation network"
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <span className="text-lg text-foreground">{benefit}</span>
                  </div>
                ))}
              </div>
              <Link to="/login">
                <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg glow-saffron mt-4">
                  Get Started Today
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="relative">
              <Card className="p-8 border-border shadow-lg tricolor-card">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <Users className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-foreground">10,000+</div>
                      <div className="text-muted-foreground">Active Farmers</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-accent/10">
                      <TrendingUp className="h-8 w-8 text-accent" />
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-foreground">35%</div>
                      <div className="text-muted-foreground">Average Yield Increase</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-navy/10">
                      <Shield className="h-8 w-8 text-navy" />
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-foreground">98%</div>
                      <div className="text-muted-foreground">Problem Detection Rate</div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer with tricolor */}
      <footer className="bg-card border-t border-border py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <AshokaChakra size={28} animate={false} />
            <span className="text-xl font-bold text-foreground">Smart Crop Advisory</span>
          </div>
          <p className="text-muted-foreground">
            Empowering farmers with intelligent technology for sustainable agriculture 🇮🇳
          </p>
        </div>
        <div className="tricolor-bar h-1.5 mt-8" />
      </footer>
    </div>
  );
};

export default Index;
