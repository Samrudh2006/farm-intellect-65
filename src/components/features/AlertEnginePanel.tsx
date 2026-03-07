import { useState } from "react";
import { differenceInCalendarDays, format, parseISO } from "date-fns";
import { AlertTriangle, BellRing, Bug, CalendarClock, Droplets, LineChart, RotateCcw, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getMandiPricesByMarket, getMandiPricesByCommodity } from "@/data/mandiPrices";
import {
  dismissAlert,
  getCropPlans,
  getDismissedAlertIds,
  getExpertBookings,
  getFieldHistoryEntries,
  getGeoPreference,
  restoreDismissedAlerts,
} from "@/lib/phase1-storage";

interface GeneratedAlert {
  id: string;
  title: string;
  message: string;
  priority: "low" | "medium" | "high";
  category: "pest" | "weather" | "market" | "irrigation" | "booking";
  action: string;
}

const categoryMeta = {
  pest: { icon: Bug, color: "destructive" as const },
  weather: { icon: AlertTriangle, color: "secondary" as const },
  market: { icon: LineChart, color: "outline" as const },
  irrigation: { icon: Droplets, color: "default" as const },
  booking: { icon: CalendarClock, color: "secondary" as const },
};

export const AlertEnginePanel = () => {
  const [refreshTick, setRefreshTick] = useState(0);

  void refreshTick;

  const alerts = (() => {
    const plans = getCropPlans();
    const fieldEvents = getFieldHistoryEntries();
    const geo = getGeoPreference();
    const bookings = getExpertBookings();
    const dismissed = new Set(getDismissedAlertIds());
    const generated: GeneratedAlert[] = [];

    plans.forEach((plan) => {
      const dueReminder = plan.reminders.find((reminder) => !reminder.completed && Math.abs(differenceInCalendarDays(parseISO(reminder.date), new Date())) <= 3);
      if (dueReminder) {
        generated.push({
          id: `irrigation-${plan.id}`,
          title: `${plan.cropType} task due soon`,
          message: `${dueReminder.task} for ${plan.fieldName} is scheduled on ${format(parseISO(dueReminder.date), "dd MMM")}.`,
          priority: dueReminder.priority === "high" ? "high" : "medium",
          category: "irrigation",
          action: "Open crop planner",
        });
      }
    });

    const stressedField = fieldEvents.find((event) => event.health < 70);
    if (stressedField) {
      generated.push({
        id: `field-${stressedField.id}`,
        title: `${stressedField.title}`,
        message: `${stressedField.detail} Current field health is ${stressedField.health}%.`,
        priority: "high",
        category: stressedField.type === "weather" ? "weather" : "pest",
        action: "Review field timeline",
      });
    }

    const marketPrices = getMandiPricesByMarket(geo.preferredMarket);
    const cropMarket = marketPrices.find((entry) => entry.commodity.toLowerCase().includes(geo.primaryCrop.toLowerCase()));
    const cropReference = getMandiPricesByCommodity(geo.primaryCrop);
    const marketPrice = cropMarket?.price.modalPrice;
    const msp = cropReference?.mspPrice;
    if (marketPrice && msp && marketPrice < msp) {
      generated.push({
        id: `market-${geo.preferredMarket}-${geo.primaryCrop}`,
        title: `Market drop for ${geo.primaryCrop}`,
        message: `${geo.preferredMarket} mandi is trading around ₹${marketPrice}/quintal, below the MSP of ₹${msp}.`,
        priority: "high",
        category: "market",
        action: "Review mandi strategy",
      });
    }

    const upcomingBooking = bookings.find((booking) => booking.status !== "completed" && differenceInCalendarDays(parseISO(booking.slot), new Date()) <= 2);
    if (upcomingBooking) {
      generated.push({
        id: `booking-${upcomingBooking.id}`,
        title: `Upcoming expert consultation`,
        message: `${upcomingBooking.expertName} is scheduled on ${format(parseISO(upcomingBooking.slot), "dd MMM, hh:mm a")} via ${upcomingBooking.mode.replace("_", " ")}.`,
        priority: "medium",
        category: "booking",
        action: "View booking workflow",
      });
    }

    return generated.filter((alert) => !dismissed.has(alert.id));
  })();

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <BellRing className="h-5 w-5 text-primary" />
              Smart alert engine
            </CardTitle>
            <CardDescription>
              Auto-generated warnings for pests, weather stress, market drops, irrigation tasks, and expert consultations.
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => { restoreDismissedAlerts(); setRefreshTick((value) => value + 1); }}>
              <RotateCcw className="mr-2 h-4 w-4" /> Restore alerts
            </Button>
            <Badge variant="secondary">{alerts.length} active</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {alerts.length > 0 ? alerts.map((alert) => {
          const meta = categoryMeta[alert.category];
          const Icon = meta.icon;
          return (
            <div key={alert.id} className="rounded-xl border p-4 shadow-sm">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <Icon className="h-4 w-4 text-primary" />
                    <h3 className="font-semibold">{alert.title}</h3>
                    <Badge variant={meta.color}>{alert.category}</Badge>
                    <Badge variant={alert.priority === "high" ? "destructive" : alert.priority === "medium" ? "secondary" : "outline"}>{alert.priority}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{alert.message}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">{alert.action}</Button>
                  <Button size="sm" variant="ghost" onClick={() => { dismissAlert(alert.id); setRefreshTick((value) => value + 1); }}>
                    Dismiss
                  </Button>
                </div>
              </div>
            </div>
          );
        }) : (
          <div className="rounded-xl border border-dashed p-8 text-center">
            <ShieldCheck className="mx-auto h-10 w-10 text-primary" />
            <h3 className="mt-4 text-lg font-semibold">No critical alerts right now</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Your current plans, market context, field history, and consultations do not require immediate action.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
