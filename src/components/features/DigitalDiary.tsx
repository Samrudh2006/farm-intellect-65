import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, BookOpen, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DiaryEntry {
  id: string;
  date: string;
  activity: string;
  crop: string;
  notes: string;
  weather: string;
  expenses: string;
}

export const DigitalDiary = () => {
  const { toast } = useToast();
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [newEntry, setNewEntry] = useState({
    activity: "",
    crop: "",
    notes: "",
    weather: "",
    expenses: ""
  });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    // Load entries from localStorage
    const savedEntries = localStorage.getItem('farmerDiary');
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries));
    }
  }, []);

  const saveEntry = () => {
    if (!newEntry.activity || !newEntry.crop) {
      toast({
        title: "Missing Information",
        description: "Please fill activity and crop fields",
        variant: "destructive"
      });
      return;
    }

    const entry: DiaryEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      ...newEntry
    };

    const updatedEntries = [entry, ...entries];
    setEntries(updatedEntries);
    localStorage.setItem('farmerDiary', JSON.stringify(updatedEntries));

    setNewEntry({
      activity: "",
      crop: "",
      notes: "",
      weather: "",
      expenses: ""
    });
    setShowForm(false);

    toast({
      title: "Entry Saved",
      description: "Your diary entry has been saved successfully"
    });
  };

  const deleteEntry = (id: string) => {
    const updatedEntries = entries.filter(entry => entry.id !== id);
    setEntries(updatedEntries);
    localStorage.setItem('farmerDiary', JSON.stringify(updatedEntries));
    
    toast({
      title: "Entry Deleted",
      description: "Diary entry has been removed"
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Digital Farmer Diary (डिजिटल किसान डायरी)
            </div>
            <Button onClick={() => setShowForm(!showForm)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Entry
            </Button>
          </CardTitle>
        </CardHeader>

        {showForm && (
          <CardContent className="border-t">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Activity Type</Label>
                  <Select value={newEntry.activity} onValueChange={(value) => setNewEntry(prev => ({ ...prev, activity: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select activity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sowing">Sowing (बुआई)</SelectItem>
                      <SelectItem value="irrigation">Irrigation (सिंचाई)</SelectItem>
                      <SelectItem value="fertilizer">Fertilizer (खाद)</SelectItem>
                      <SelectItem value="pesticide">Pesticide (दवा)</SelectItem>
                      <SelectItem value="harvesting">Harvesting (कटाई)</SelectItem>
                      <SelectItem value="other">Other (अन्य)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Crop</Label>
                  <Select value={newEntry.crop} onValueChange={(value) => setNewEntry(prev => ({ ...prev, crop: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select crop" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="wheat">Wheat (गेहूं)</SelectItem>
                      <SelectItem value="rice">Rice (धान)</SelectItem>
                      <SelectItem value="cotton">Cotton (कपास)</SelectItem>
                      <SelectItem value="sugarcane">Sugarcane (गन्ना)</SelectItem>
                      <SelectItem value="mustard">Mustard (सरसों)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Weather Condition</Label>
                  <Select value={newEntry.weather} onValueChange={(value) => setNewEntry(prev => ({ ...prev, weather: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select weather" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sunny">Sunny (धूप)</SelectItem>
                      <SelectItem value="cloudy">Cloudy (बादल)</SelectItem>
                      <SelectItem value="rainy">Rainy (बारिश)</SelectItem>
                      <SelectItem value="windy">Windy (हवा)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Expenses (₹)</Label>
                  <Input
                    placeholder="Enter amount spent"
                    value={newEntry.expenses}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, expenses: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea
                  placeholder="Write your observations, problems, or any other notes..."
                  value={newEntry.notes}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={saveEntry}>Save Entry</Button>
                <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Recent Entries</h3>
        {entries.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No diary entries yet. Start by adding your first entry!</p>
            </CardContent>
          </Card>
        ) : (
          entries.map((entry) => (
            <Card key={entry.id}>
              <CardContent className="pt-6">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="font-semibold">{entry.date}</span>
                    <span className="text-muted-foreground">•</span>
                    <span className="capitalize bg-green-100 text-green-700 px-2 py-1 rounded-full text-sm">
                      {entry.activity}
                    </span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => deleteEntry(entry.id)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                  <div>
                    <span className="text-sm text-muted-foreground">Crop:</span>
                    <div className="font-medium">{entry.crop}</div>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Weather:</span>
                    <div className="font-medium">{entry.weather}</div>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Expenses:</span>
                    <div className="font-medium">₹{entry.expenses || "0"}</div>
                  </div>
                </div>
                
                {entry.notes && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <span className="text-sm text-muted-foreground">Notes:</span>
                    <p className="mt-1">{entry.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};