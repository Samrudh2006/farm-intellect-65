import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Calendar,
  MapPin,
  Wheat,
  Droplets,
  Sun,
  AlertTriangle,
  TrendingUp,
  Users,
  Building2
} from "lucide-react";

const punjabCrops = [
  {
    name: 'Wheat',
    varieties: ['PBW 725', 'HD 3226', 'WH 1105', 'PBW 502'],
    season: 'Rabi (Nov-Apr)',
    avgYield: '48 q/ha',
    marketPrice: '₹2,150/quintal',
    waterReq: '400-450mm',
    suitability: 95
  },
  {
    name: 'Rice',
    varieties: ['PR 126', 'Pusa 44', 'PR 121', 'PB 1509'],
    season: 'Kharif (Jun-Oct)',
    avgYield: '72 q/ha',
    marketPrice: '₹3,200/quintal',
    waterReq: '1200-1500mm',
    suitability: 98
  },
  {
    name: 'Cotton',
    varieties: ['RCH 134', 'MRC 7031', 'PCH 570', 'RCH 314'],
    season: 'Kharif (Apr-Nov)',
    avgYield: '22 q/ha',
    marketPrice: '₹6,200/quintal',
    waterReq: '600-800mm',
    suitability: 85
  },
  {
    name: 'Sugarcane',
    varieties: ['Co 0238', 'CoPb 94', 'Co 118', 'CoPb 15'],
    season: 'Annual',
    avgYield: '650 q/ha',
    marketPrice: '₹370/quintal',
    waterReq: '1500-2000mm',
    suitability: 88
  }
];

const punjabSchemes = [
  {
    title: 'Punjab Crop Diversification Scheme',
    amount: '₹17,500/hectare',
    eligibility: 'Farmers shifting from Rice to alternative crops',
    status: 'Active',
    deadline: 'March 2024'
  },
  {
    title: 'Direct Seeding of Rice (DSR) Incentive',
    amount: '₹4,000/hectare',
    eligibility: 'Farmers adopting DSR technology',
    status: 'Active',
    deadline: 'June 2024'
  },
  {
    title: 'Happy Seeder Subsidy',
    amount: '50% subsidy up to ₹1.39 lakh',
    eligibility: 'Individual farmers and cooperative societies',
    status: 'Active',
    deadline: 'Ongoing'
  },
  {
    title: 'Solar Irrigation Pump Subsidy',
    amount: '85% subsidy for SC/ST, 75% for others',
    eligibility: 'All farmers with irrigation needs',
    status: 'Active',
    deadline: 'December 2024'
  }
];

const punjabCalendar = [
  { month: 'November', activity: 'Wheat sowing begins', crop: 'Wheat', type: 'sowing' },
  { month: 'December', activity: 'Wheat first irrigation', crop: 'Wheat', type: 'irrigation' },
  { month: 'January', activity: 'Wheat fertilizer application', crop: 'Wheat', type: 'fertilizer' },
  { month: 'February', activity: 'Mustard harvesting', crop: 'Mustard', type: 'harvest' },
  { month: 'March', activity: 'Wheat disease monitoring', crop: 'Wheat', type: 'monitoring' },
  { month: 'April', activity: 'Wheat harvesting begins', crop: 'Wheat', type: 'harvest' },
  { month: 'May', activity: 'Cotton sowing preparation', crop: 'Cotton', type: 'preparation' },
  { month: 'June', activity: 'Rice nursery preparation', crop: 'Rice', type: 'preparation' }
];

const activityColors = {
  sowing: 'bg-green-100 text-green-700',
  irrigation: 'bg-blue-100 text-blue-700',
  fertilizer: 'bg-orange-100 text-orange-700',
  harvest: 'bg-yellow-100 text-yellow-700',
  monitoring: 'bg-purple-100 text-purple-700',
  preparation: 'bg-gray-100 text-gray-700'
};

const PunjabSpecific = () => {
  return (
    <div className="space-y-6">
      {/* Punjab Crop Varieties */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wheat className="h-5 w-5" />
            Punjab Recommended Crop Varieties
          </CardTitle>
          <CardDescription>
            High-yielding varieties suited for Punjab soil and climate conditions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {punjabCrops.map((crop, index) => (
              <Card key={index} className="border-l-4 border-l-primary">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{crop.name}</CardTitle>
                    <Badge className="bg-green-100 text-green-700">
                      {crop.suitability}% suitable
                    </Badge>
                  </div>
                  <Progress value={crop.suitability} className="h-2" />
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid gap-2 text-sm">
                    <div className="flex justify-between">
                      <span className="font-medium">Season:</span>
                      <span>{crop.season}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Avg Yield:</span>
                      <span>{crop.avgYield}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Market Price:</span>
                      <span className="text-green-600 font-medium">{crop.marketPrice}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Water Need:</span>
                      <span>{crop.waterReq}</span>
                    </div>
                  </div>
                  
                  <div>
                    <span className="text-sm font-medium">Recommended Varieties:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {crop.varieties.map((variety, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {variety}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Punjab Agricultural Calendar */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Punjab Agricultural Calendar
          </CardTitle>
          <CardDescription>
            Month-wise farming activities for optimal crop management
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            {punjabCalendar.map((item, index) => (
              <Card key={index} className="border-l-4 border-l-blue-500">
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-2">
                    <Badge className={activityColors[item.type as keyof typeof activityColors]}>
                      {item.month}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{item.crop}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{item.activity}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Punjab Specific Schemes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Punjab Government Schemes
          </CardTitle>
          <CardDescription>
            State-specific agricultural schemes and subsidies
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {punjabSchemes.map((scheme, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg leading-tight">{scheme.title}</CardTitle>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="default">{scheme.status}</Badge>
                        <span className="text-sm text-muted-foreground">
                          Deadline: {scheme.deadline}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-600">{scheme.amount}</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    <strong>Eligibility:</strong> {scheme.eligibility}
                  </p>
                  <Button className="w-full" size="sm">
                    Apply Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Punjab Districts Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            District-wise Crop Suitability
          </CardTitle>
          <CardDescription>
            Crop recommendations based on Punjab districts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="border-l-4 border-l-green-500">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Central Punjab</CardTitle>
                <CardDescription>Ludhiana, Patiala, Sangrur</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Wheat:</span>
                    <Badge className="bg-green-100 text-green-700">Excellent</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Rice:</span>
                    <Badge className="bg-green-100 text-green-700">Excellent</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Cotton:</span>
                    <Badge className="bg-yellow-100 text-yellow-700">Good</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-blue-500">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Malwa Region</CardTitle>
                <CardDescription>Bathinda, Mansa, Faridkot</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Cotton:</span>
                    <Badge className="bg-green-100 text-green-700">Excellent</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Wheat:</span>
                    <Badge className="bg-green-100 text-green-700">Excellent</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Oilseeds:</span>
                    <Badge className="bg-yellow-100 text-yellow-700">Good</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-purple-500">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Majha Region</CardTitle>
                <CardDescription>Amritsar, Tarn Taran, Gurdaspur</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Rice:</span>
                    <Badge className="bg-green-100 text-green-700">Excellent</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Wheat:</span>
                    <Badge className="bg-green-100 text-green-700">Excellent</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Sugarcane:</span>
                    <Badge className="bg-yellow-100 text-yellow-700">Good</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PunjabSpecific;