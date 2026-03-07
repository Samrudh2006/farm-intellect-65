import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { usePwaStatus } from "@/hooks/usePwaStatus";
import { PHASE1_STORAGE_EVENT, getPhase1Summary } from "@/lib/phase1-storage";
import { CheckCircle2, Download, Globe2, History, Leaf, ShieldCheck, Wifi, WifiOff } from "lucide-react";

export const FarmerPhaseOneOverview = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isOnline, isInstalled, canInstall, installApp } = usePwaStatus();
  const [summary, setSummary] = useState(() => getPhase1Summary());

  useEffect(() => {
    const refreshSummary = () => setSummary(getPhase1Summary());

    window.addEventListener(PHASE1_STORAGE_EVENT, refreshSummary);
    window.addEventListener("focus", refreshSummary);

    return () => {
      window.removeEventListener(PHASE1_STORAGE_EVENT, refreshSummary);
      window.removeEventListener("focus", refreshSummary);
    };
  }, []);

  const phaseCards = useMemo(
    () => [
      {
        title: "Offline-ready farmer mode",
        value: isOnline ? "Online" : "Offline",
        description: isInstalled
          ? "Installed for quick home-screen access"
          : canInstall
            ? "Ready to install for low-connectivity use"
            : "Service worker enabled for cached farmer flows",
        icon: isOnline ? Wifi : WifiOff,
      },
      {
        title: "Personalized crop plans",
        value: `${summary.cropPlans}`,
        description: `${summary.openTasks} open reminders across your saved plans`,
        icon: Leaf,
      },
      {
        title: "Field history events",
        value: `${summary.fieldEvents}`,
        description: "Timeline entries ready for field-by-field review",
        icon: History,
      },
      {
        title: "Scheme matches",
        value: `${summary.schemeMatches}`,
        description: summary.lastWizardRun
          ? `Wizard last updated on ${new Date(summary.lastWizardRun).toLocaleDateString()}`
          : "Run the eligibility wizard to get matched support",
        icon: ShieldCheck,
      },
    ],
    [canInstall, isInstalled, isOnline, summary],
  );

  const handleInstall = async () => {
    const result = await installApp();

    if (result === "accepted") {
      toast({
        title: "App installed",
        description: "Farm Intellect is now ready from your home screen.",
      });
      return;
    }

    if (result === "dismissed") {
      toast({
        title: "Install skipped",
        description: "No worries — you can install the app whenever you're ready.",
      });
      return;
    }

    toast({
      title: "Install unavailable",
      description: "Your browser has already installed the app or does not support the prompt.",
    });
  };

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 via-background to-accent/10">
      <CardHeader className="gap-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <CardTitle className="flex items-center gap-2 text-xl">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              Phase 1 rollout hub
            </CardTitle>
            <CardDescription>
              Multilingual, offline-first, planning, history, and schemes are now wired into the farmer journey.
            </CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={isOnline ? "default" : "secondary"}>
              {isOnline ? "Network available" : "Working offline"}
            </Badge>
            <Badge variant="outline" className="border-primary/30 text-primary">
              <Globe2 className="mr-1 h-3.5 w-3.5" />
              7 farmer languages
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {phaseCards.map((card) => (
            <div key={card.title} className="rounded-xl border bg-background/80 p-4 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <card.icon className="h-5 w-5 text-primary" />
                <span className="text-2xl font-bold">{card.value}</span>
              </div>
              <h3 className="font-semibold">{card.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{card.description}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          <Button onClick={() => navigate("/farmer/calendar")}>Open crop planner</Button>
          <Button variant="outline" onClick={() => navigate("/farmer/field-map")}>Review field history</Button>
          <Button variant="outline" onClick={() => navigate("/farmer/schemes")}>Run scheme wizard</Button>
          {canInstall && !isInstalled && (
            <Button variant="secondary" onClick={handleInstall}>
              <Download className="mr-2 h-4 w-4" />
              Install farmer app
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
