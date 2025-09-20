import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Building2,
  Calendar,
  DollarSign,
  FileText,
  Filter,
  Heart,
  MapPin,
  Search,
  Sprout,
  Users,
  Wheat
} from "lucide-react";

interface Scheme {
  id: string;
  title: string;
  description: string;
  category: 'subsidy' | 'loan' | 'insurance' | 'training' | 'equipment';
  amount: string;
  eligibility: string[];
  deadline: string;
  status: 'active' | 'ending_soon' | 'upcoming';
  state: string;
  documents: string[];
}

const mockSchemes: Scheme[] = [
  {
    id: '1',
    title: 'PM-KISAN Samman Nidhi',
    description: 'Direct income support of ₹6,000 per year to farmer families',
    category: 'subsidy',
    amount: '₹6,000/year',
    eligibility: ['Small & marginal farmers', 'Land records required'],
    deadline: 'Ongoing enrollment',
    status: 'active',
    state: 'All India',
    documents: ['Aadhar Card', 'Land Records', 'Bank Details']
  },
  {
    id: '2',
    title: 'Pradhan Mantri Fasal Bima Yojana',
    description: 'Crop insurance scheme providing protection against crop loss',
    category: 'insurance',
    amount: 'Up to ₹2 lakh',
    eligibility: ['All farmers', 'Seasonal enrollment'],
    deadline: 'March 31, 2024',
    status: 'ending_soon',
    state: 'All India',
    documents: ['Aadhar Card', 'Land Records', 'Sowing Certificate']
  },
  {
    id: '3',
    title: 'Agriculture Infrastructure Fund',
    description: 'Financing facility for post-harvest infrastructure',
    category: 'loan',
    amount: '₹1 lakh - ₹2 crore',
    eligibility: ['Farmers', 'FPOs', 'Cooperatives'],
    deadline: 'April 15, 2024',
    status: 'active',
    state: 'All India',
    documents: ['Project Report', 'Land Documents', 'Registration Certificate']
  },
  {
    id: '4',
    title: 'Kisan Credit Card',
    description: 'Easy access to credit for agriculture and allied activities',
    category: 'loan',
    amount: 'Based on land holding',
    eligibility: ['All farmers', 'Fishers', 'Animal husbandry'],
    deadline: 'Ongoing',
    status: 'active',
    state: 'All India',
    documents: ['Aadhar Card', 'Land Records', 'Income Certificate']
  },
  {
    id: '5',
    title: 'Solar Pump Subsidy',
    description: 'State subsidy for solar irrigation pumps',
    category: 'equipment',
    amount: '60% subsidy',
    eligibility: ['Farmers with irrigation needs'],
    deadline: 'May 31, 2024',
    status: 'active',
    state: 'Maharashtra',
    documents: ['Electricity Bill', 'Land Records', 'Technical Feasibility']
  }
];

const Schemes = () => {
  const { t } = useLanguage();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedState, setSelectedState] = useState<string>("all");

  const user = {
    name: "John Farmer",
    role: "farmer",
  };

  const categoryIcons = {
    subsidy: DollarSign,
    loan: Building2,
    insurance: Heart,
    training: Users,
    equipment: Sprout,
  };

  const categoryColors = {
    subsidy: "bg-green-100 text-green-700",
    loan: "bg-blue-100 text-blue-700",
    insurance: "bg-purple-100 text-purple-700",
    training: "bg-orange-100 text-orange-700",
    equipment: "bg-cyan-100 text-cyan-700",
  };

  const statusColors = {
    active: "default",
    ending_soon: "destructive",
    upcoming: "secondary",
  };

  const filteredSchemes = mockSchemes.filter(scheme => {
    const matchesSearch = scheme.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         scheme.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || scheme.category === selectedCategory;
    const matchesState = selectedState === 'all' || scheme.state === selectedState || scheme.state === 'All India';
    
    return matchesSearch && matchesCategory && matchesState;
  });

  const states = ['All India', 'Maharashtra', 'Punjab', 'Haryana', 'Uttar Pradesh', 'Tamil Nadu'];

  return (
    <div className="min-h-screen bg-background">
      <Header 
        user={user}
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        notificationCount={3}
      />
      
      <Sidebar 
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        userRole={user.role}
      />

      <main className="md:ml-64 p-6">
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h2 className="text-3xl font-bold text-foreground">Government Schemes & Subsidies</h2>
            <p className="text-muted-foreground">
              Discover agricultural schemes and subsidies available for farmers
            </p>
          </div>

          {/* Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="grid gap-4 md:grid-cols-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search schemes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="subsidy">Subsidies</SelectItem>
                    <SelectItem value="loan">Loans</SelectItem>
                    <SelectItem value="insurance">Insurance</SelectItem>
                    <SelectItem value="training">Training</SelectItem>
                    <SelectItem value="equipment">Equipment</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedState} onValueChange={setSelectedState}>
                  <SelectTrigger>
                    <SelectValue placeholder="State" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All States</SelectItem>
                    {states.map(state => (
                      <SelectItem key={state} value={state}>{state}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button variant="outline" onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                  setSelectedState("all");
                }}>
                  <Filter className="h-4 w-4 mr-2" />
                  Clear Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Schemes Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredSchemes.map((scheme) => {
              const CategoryIcon = categoryIcons[scheme.category];
              
              return (
                <Card key={scheme.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${categoryColors[scheme.category]}`}>
                          <CategoryIcon className="h-5 w-5" />
                        </div>
                        <div>
                          <Badge variant={statusColors[scheme.status] as any}>
                            {scheme.status.replace('_', ' ')}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg text-primary">{scheme.amount}</div>
                      </div>
                    </div>
                    
                    <CardTitle className="text-lg">{scheme.title}</CardTitle>
                    <CardDescription>{scheme.description}</CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{scheme.state}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>Deadline: {scheme.deadline}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Eligibility:</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {scheme.eligibility.map((criteria, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                            {criteria}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Required Documents:</h4>
                      <div className="flex flex-wrap gap-1">
                        {scheme.documents.map((doc, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            <FileText className="h-3 w-3 mr-1" />
                            {doc}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2 pt-4">
                      <Button className="flex-1" size="sm">
                        Apply Now
                      </Button>
                      <Button variant="outline" size="sm">
                        Learn More
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {filteredSchemes.length === 0 && (
            <Card className="text-center py-12">
              <CardContent>
                <Wheat className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No schemes found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search criteria or filters
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default Schemes;