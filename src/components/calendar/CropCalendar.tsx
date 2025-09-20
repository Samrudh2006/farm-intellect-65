import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  CalendarDays, 
  Plus, 
  Bell, 
  Sprout, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  Edit,
  Trash2,
  Calendar as CalendarIcon
} from "lucide-react";
import { format } from "date-fns";

interface CropEntry {
  id: string;
  cropType: string;
  plantingDate: Date;
  harvestDate?: Date;
  stage: string;
  notes: string;
  reminders: Reminder[];
}

interface Reminder {
  id: string;
  date: Date;
  task: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
}

export const CropCalendar = () => {
  const [entries, setEntries] = useState<CropEntry[]>([]);
  const [showCreateEntry, setShowCreateEntry] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<CropEntry | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  
  const [newEntry, setNewEntry] = useState({
    cropType: "",
    plantingDate: new Date(),
    harvestDate: undefined as Date | undefined,
    stage: "",
    notes: "",
    reminders: [] as Omit<Reminder, 'id'>[]
  });

  const cropTypes = [
    "Rice", "Wheat", "Cotton", "Sugarcane", "Maize", "Soybean", 
    "Potato", "Onion", "Tomato", "Cabbage", "Carrots", "Beans"
  ];

  const cropStages = [
    { value: "planning", label: "Planning" },
    { value: "land-preparation", label: "Land Preparation" },
    { value: "sowing", label: "Sowing" },
    { value: "germination", label: "Germination" },
    { value: "vegetative", label: "Vegetative Growth" },
    { value: "flowering", label: "Flowering" },
    { value: "fruiting", label: "Fruiting" },
    { value: "maturation", label: "Maturation" },
    { value: "harvesting", label: "Harvesting" },
    { value: "post-harvest", label: "Post-Harvest" }
  ];

  const mockEntries: CropEntry[] = [
    {
      id: "1",
      cropType: "Wheat",
      plantingDate: new Date(2024, 0, 15),
      harvestDate: new Date(2024, 3, 20),
      stage: "vegetative",
      notes: "HD-2967 variety planted in Field A",
      reminders: [
        {
          id: "r1",
          date: new Date(2024, 1, 1),
          task: "First irrigation",
          priority: "high",
          completed: false
        },
        {
          id: "r2", 
          date: new Date(2024, 1, 15),
          task: "Apply nitrogen fertilizer",
          priority: "medium",
          completed: false
        }
      ]
    },
    {
      id: "2",
      cropType: "Tomato",
      plantingDate: new Date(2024, 0, 10),
      harvestDate: new Date(2024, 2, 25),
      stage: "flowering",
      notes: "Hybrid variety in greenhouse",
      reminders: [
        {
          id: "r3",
          date: new Date(2024, 1, 5),
          task: "Pruning and staking",
          priority: "medium",
          completed: true
        }
      ]
    }
  ];

  const handleCreateEntry = () => {
    if (!newEntry.cropType || !newEntry.stage) return;

    const entry: CropEntry = {
      id: Date.now().toString(),
      cropType: newEntry.cropType,
      plantingDate: newEntry.plantingDate,
      harvestDate: newEntry.harvestDate,
      stage: newEntry.stage,
      notes: newEntry.notes,
      reminders: newEntry.reminders.map(r => ({
        ...r,
        id: Math.random().toString()
      }))
    };

    setEntries(prev => [entry, ...prev]);
    setNewEntry({
      cropType: "",
      plantingDate: new Date(),
      harvestDate: undefined,
      stage: "",
      notes: "",
      reminders: []
    });
    setShowCreateEntry(false);
  };

  const getStageColor = (stage: string) => {
    const colors = {
      'planning': 'bg-gray-100 text-gray-800',
      'land-preparation': 'bg-orange-100 text-orange-800',
      'sowing': 'bg-blue-100 text-blue-800',
      'germination': 'bg-green-100 text-green-800',
      'vegetative': 'bg-emerald-100 text-emerald-800',
      'flowering': 'bg-pink-100 text-pink-800',
      'fruiting': 'bg-purple-100 text-purple-800',
      'maturation': 'bg-yellow-100 text-yellow-800',
      'harvesting': 'bg-amber-100 text-amber-800',
      'post-harvest': 'bg-slate-100 text-slate-800'
    };
    return colors[stage as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      'low': 'bg-green-100 text-green-800',
      'medium': 'bg-yellow-100 text-yellow-800',
      'high': 'bg-red-100 text-red-800'
    };
    return colors[priority as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getUpcomingReminders = () => {
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    const allReminders = [...mockEntries, ...entries].flatMap(entry =>
      entry.reminders.map(reminder => ({
        ...reminder,
        cropType: entry.cropType,
        entryId: entry.id
      }))
    );

    return allReminders
      .filter(reminder => 
        reminder.date >= today && 
        reminder.date <= nextWeek && 
        !reminder.completed
      )
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  };

  const allEntries = [...mockEntries, ...entries];
  const upcomingReminders = getUpcomingReminders();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Crop Calendar</h2>
          <p className="text-muted-foreground">
            Plan and track your crop cycles throughout the year
          </p>
        </div>
        <Button onClick={() => setShowCreateEntry(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Crop Entry
        </Button>
      </div>

      {/* Upcoming Reminders */}
      {upcomingReminders.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Upcoming Reminders
            </CardTitle>
            <CardDescription>
              Tasks scheduled for the next 7 days
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-3">
              {upcomingReminders.map(reminder => (
                <div key={reminder.id} className="flex items-center justify-between p-3 border rounded-md">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">
                        {format(reminder.date, "MMM dd")}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{reminder.task}</p>
                      <p className="text-sm text-muted-foreground">
                        {reminder.cropType}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge className={getPriorityColor(reminder.priority)}>
                      {reminder.priority}
                    </Badge>
                    <Button variant="ghost" size="sm">
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Create Entry Form */}
      {showCreateEntry && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Crop Entry</CardTitle>
            <CardDescription>
              Create a new entry to track your crop from planting to harvest
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Crop Type</Label>
                <Select 
                  value={newEntry.cropType} 
                  onValueChange={(value) => setNewEntry(prev => ({ ...prev, cropType: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select crop" />
                  </SelectTrigger>
                  <SelectContent>
                    {cropTypes.map(crop => (
                      <SelectItem key={crop} value={crop}>
                        {crop}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Current Stage</Label>
                <Select 
                  value={newEntry.stage} 
                  onValueChange={(value) => setNewEntry(prev => ({ ...prev, stage: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select stage" />
                  </SelectTrigger>
                  <SelectContent>
                    {cropStages.map(stage => (
                      <SelectItem key={stage.value} value={stage.value}>
                        {stage.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Planting Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(newEntry.plantingDate, "PPP")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={newEntry.plantingDate}
                      onSelect={(date) => date && setNewEntry(prev => ({ ...prev, plantingDate: date }))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-2">
                <Label>Expected Harvest Date (Optional)</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {newEntry.harvestDate ? format(newEntry.harvestDate, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={newEntry.harvestDate}
                      onSelect={(date) => setNewEntry(prev => ({ ...prev, harvestDate: date }))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea
                placeholder="Add any notes about this crop..."
                value={newEntry.notes}
                onChange={(e) => setNewEntry(prev => ({ ...prev, notes: e.target.value }))}
                rows={3}
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleCreateEntry}>Create Entry</Button>
              <Button variant="outline" onClick={() => setShowCreateEntry(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Crop Entries */}
      <div className="grid gap-4">
        {allEntries.map(entry => (
          <Card key={entry.id}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Sprout className="h-5 w-5 text-green-600" />
                    <h3 className="text-lg font-semibold">{entry.cropType}</h3>
                    <Badge className={getStageColor(entry.stage)}>
                      {cropStages.find(s => s.value === entry.stage)?.label || entry.stage}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                    <div>
                      <span className="font-medium">Planted:</span> {format(entry.plantingDate, "MMM dd, yyyy")}
                    </div>
                    {entry.harvestDate && (
                      <div>
                        <span className="font-medium">Expected Harvest:</span> {format(entry.harvestDate, "MMM dd, yyyy")}
                      </div>
                    )}
                  </div>
                  
                  {entry.notes && (
                    <p className="text-sm text-muted-foreground">{entry.notes}</p>
                  )}
                  
                  {entry.reminders.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Upcoming Tasks:</h4>
                      <div className="space-y-1">
                        {entry.reminders.slice(0, 3).map(reminder => (
                          <div key={reminder.id} className="flex items-center gap-2 text-sm">
                            <Clock className="h-3 w-3" />
                            <span>{format(reminder.date, "MMM dd")}: {reminder.task}</span>
                            <Badge className={getPriorityColor(reminder.priority)} variant="outline">
                              {reminder.priority}
                            </Badge>
                            {reminder.completed && <CheckCircle className="h-3 w-3 text-green-600" />}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {allEntries.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <CalendarDays className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No crop entries yet</h3>
              <p className="text-muted-foreground mb-4">
                Start tracking your crops by adding your first entry
              </p>
              <Button onClick={() => setShowCreateEntry(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Crop Entry
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};