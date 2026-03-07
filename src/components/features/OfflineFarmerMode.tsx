import { useMemo } from "react";
import { CheckCircle2, Download, HardDriveDownload, RefreshCcw, Smartphone, Wifi, WifiOff } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { usePwaStatus } from "@/hooks/usePwaStatus";
import { getExpertBookings, getGeoPreference, getPhase1Summary } from "@/lib/phase1-storage";

export const OfflineFarmerMode = () => {
  const { toast } = useToast();
  const { isOnline, isInstalled, canInstall, installApp } = usePwaStatus();

  const summary = useMemo(() => getPhase1Summary(), []);
  const geoPreference = useMemo(() => getGeoPreference(), []);
  const bookings = useMemo(() => getExpertBookings(), []);

  const cachedModules = [
    { label: "Crop planner", value: summary.cropPlans, note: "Saved locally for no-network planning" },
    { label: "Field history", value: summary.fieldEvents, note: "Timeline remains reviewable offline" },
    { label: "Scheme matches", value: summary.schemeMatches, note: "Last eligibility result stays available" },
    { label: "Expert bookings", value: bookings.length, note: "Upcoming consultations remain visible" },
  ];

  const handleInstall = async () => {
    const result = await installApp();

    toast({
      title:
        result === "accepted"
          ? "Farmer app installed"
          : result === "dismissed"
            ? "Install skipped"
            : "Install currently unavailable",
      description:
        result === "accepted"
          ? "Farm Intellect is ready for home-screen and offline use."
          : result === "dismissed"
            ? "You can install the farmer app any time later from your browser menu."
            : "This browser already installed the app or does not expose the install prompt.",
    });
  };

  return (
    <div className="space-y-6">
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 via-background to-accent/10">
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="h-5 w-5 text-primary" />
                Offline / PWA-first farmer mode
              </CardTitle>
              <CardDescription>
                Keep critical farmer workflows available during low connectivity and install the app for one-tap field access.
              </CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant={isOnline ? "default" : "secondary"}>
                {isOnline ? <Wifi className="mr-1 h-3.5 w-3.5" /> : <WifiOff className="mr-1 h-3.5 w-3.5" />}
                {isOnline ? "Online now" : "Currently offline"}
              </Badge>
              <Badge variant="outline">Village: {geoPreference.village}</Badge>
              <Badge variant="outline">Market: {geoPreference.preferredMarket}</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {cachedModules.map((item) => (
              <div key={item.label} className="rounded-xl border bg-background/80 p-4 shadow-sm">
                <div className="text-2xl font-bold">{item.value}</div>
                <h3 className="mt-2 font-semibold">{item.label}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{item.note}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-xl border p-4">
              <h3 className="font-semibold">What stays usable without network</h3>
              <div className="mt-4 space-y-3">
                {[
                  "Saved crop plans and reminder milestones",
                  "Field history timeline and previous observations",
                  "Last matched scheme recommendations",
                  "Village and mandi personalization context",
                  "Confirmed expert consultation slots",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border p-4">
              <h3 className="font-semibold">PWA readiness</h3>
              <div className="mt-4 space-y-3 text-sm text-muted-foreground">
                <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                  <span>App installed</span>
                  <Badge variant={isInstalled ? "default" : "outline"}>{isInstalled ? "Yes" : "Not yet"}</Badge>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                  <span>Install prompt</span>
                  <Badge variant={canInstall ? "secondary" : "outline"}>{canInstall ? "Ready" : "Unavailable"}</Badge>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                  <span>Local sync pack</span>
                  <Badge variant="outline">
                    <HardDriveDownload className="mr-1 h-3.5 w-3.5" /> Enabled
                  </Badge>
                </div>
                <Button className="w-full" onClick={handleInstall} disabled={!canInstall || isInstalled}>
                  <Download className="mr-2 h-4 w-4" />
                  {isInstalled ? "App already installed" : "Install farmer app"}
                </Button>
                <Button variant="outline" className="w-full" onClick={() => window.location.reload()}>
                  <RefreshCcw className="mr-2 h-4 w-4" />
                  Refresh cached shell
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
