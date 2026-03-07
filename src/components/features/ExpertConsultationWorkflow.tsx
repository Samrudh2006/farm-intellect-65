import { useMemo, useState } from "react";
import { format, parseISO } from "date-fns";
import { CalendarDays, MessagesSquare, Phone, Stethoscope, Video } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ExpertBooking, appendExpertBooking, getExpertBookings } from "@/lib/phase1-storage";

const experts = [
  { name: "Dr. Kavita Sharma", expertise: "Plant pathology", mode: ["video", "chat"] },
  { name: "Dr. Arjun Patel", expertise: "Irrigation and soil health", mode: ["call", "video", "field_visit"] },
  { name: "Dr. Meera Singh", expertise: "Market linkage and schemes", mode: ["chat", "call"] },
];

export const ExpertConsultationWorkflow = () => {
  const { toast } = useToast();
  const [bookings, setBookings] = useState<ExpertBooking[]>(() => getExpertBookings());
  const [form, setForm] = useState({
    expertName: experts[0].name,
    expertise: experts[0].expertise,
    slot: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
    mode: "video" as ExpertBooking["mode"],
    issue: "",
    notes: "",
  });

  const selectedExpert = useMemo(() => experts.find((expert) => expert.name === form.expertName) ?? experts[0], [form.expertName]);

  const handleBook = () => {
    if (!form.issue.trim()) {
      toast({
        title: "Add the consultation issue",
        description: "Mention the field problem, crop stage, or business question you want the expert to review.",
        variant: "destructive",
      });
      return;
    }

    const booking: ExpertBooking = {
      id: `booking-${Date.now()}`,
      expertName: form.expertName,
      expertise: selectedExpert.expertise,
      slot: new Date(form.slot).toISOString(),
      mode: form.mode,
      issue: form.issue.trim(),
      notes: form.notes.trim(),
      status: "requested",
    };

    appendExpertBooking(booking);
    setBookings((current) => [booking, ...current]);
    setForm((current) => ({ ...current, issue: "", notes: "" }));
    toast({
      title: "Consultation requested",
      description: `${booking.expertName} received your ${booking.mode.replace("_", " ")} request for ${format(parseISO(booking.slot), "dd MMM, hh:mm a")}.`,
    });
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Stethoscope className="h-5 w-5 text-primary" />
            Expert booking & consultation workflow
          </CardTitle>
          <CardDescription>
            Raise a structured consultation request with mode, slot, and crop issue so experts can prepare before the session.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="booking-expert">Expert</Label>
              <Select value={form.expertName} onValueChange={(value) => {
                const expert = experts.find((item) => item.name === value) ?? experts[0];
                setForm((current) => ({ ...current, expertName: expert.name, expertise: expert.expertise, mode: expert.mode[0] as ExpertBooking["mode"] }));
              }}>
                <SelectTrigger id="booking-expert"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {experts.map((expert) => <SelectItem key={expert.name} value={expert.name}>{expert.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="booking-slot">Preferred slot</Label>
              <Input id="booking-slot" type="datetime-local" value={form.slot} onChange={(event) => setForm((current) => ({ ...current, slot: event.target.value }))} />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="booking-mode">Consultation mode</Label>
              <Select value={form.mode} onValueChange={(value) => setForm((current) => ({ ...current, mode: value as ExpertBooking["mode"] }))}>
                <SelectTrigger id="booking-mode"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {selectedExpert.mode.map((mode) => <SelectItem key={mode} value={mode}>{mode.replace("_", " ")}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="rounded-lg border p-3 text-sm text-muted-foreground">
              <p className="font-medium text-foreground">{selectedExpert.expertise}</p>
              <p className="mt-1">Best for disease diagnosis, irrigation planning, scheme guidance, and recovery steps.</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="booking-issue">Issue summary</Label>
            <Textarea id="booking-issue" rows={4} value={form.issue} onChange={(event) => setForm((current) => ({ ...current, issue: event.target.value }))} placeholder="Describe the crop, symptoms, irrigation problem, market concern, or scheme paperwork question." />
          </div>

          <div className="space-y-2">
            <Label htmlFor="booking-notes">Attachments / prep notes</Label>
            <Textarea id="booking-notes" rows={3} value={form.notes} onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))} placeholder="Mention field name, scanner result, village, or documents to keep ready." />
          </div>

          <Button onClick={handleBook}>Request consultation</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-primary" />
            Consultation timeline
          </CardTitle>
          <CardDescription>
            Track requested, confirmed, and completed sessions so nothing slips between advice and action.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {bookings.map((booking) => (
            <div key={booking.id} className="rounded-xl border p-4 shadow-sm">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold">{booking.expertName}</h3>
                    <Badge variant={booking.status === "confirmed" ? "default" : booking.status === "completed" ? "outline" : "secondary"}>{booking.status}</Badge>
                    <Badge variant="outline">{booking.expertise}</Badge>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{booking.issue}</p>
                  {booking.notes && <p className="mt-2 text-sm text-muted-foreground">Prep: {booking.notes}</p>}
                </div>
                <div className="space-y-2 text-sm text-muted-foreground md:text-right">
                  <div className="flex items-center gap-2 md:justify-end">
                    {booking.mode === "video" ? <Video className="h-4 w-4" /> : booking.mode === "call" ? <Phone className="h-4 w-4" /> : <MessagesSquare className="h-4 w-4" />}
                    <span>{booking.mode.replace("_", " ")}</span>
                  </div>
                  <div>{format(parseISO(booking.slot), "dd MMM yyyy, hh:mm a")}</div>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
