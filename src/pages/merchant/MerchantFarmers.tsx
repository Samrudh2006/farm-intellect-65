import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Star, Users, Phone, Mail, Calendar } from "lucide-react";

const MerchantFarmers = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const user = {
    name: "Merchant User",
    role: "merchant",
  };

  const partnerFarmers = [
    {
      id: 1,
      name: "Rajesh Kumar",
      location: "Punjab, India",
      crops: ["Wheat", "Rice", "Cotton"],
      rating: 4.8,
      experience: "15 years",
      phone: "+91 98765 43210",
      email: "rajesh.farmer@email.com",
      joinDate: "Jan 2023",
      avatar: "RK"
    },
    {
      id: 2,
      name: "Priya Sharma",
      location: "Haryana, India",
      crops: ["Sugarcane", "Potato", "Onion"],
      rating: 4.9,
      experience: "12 years",
      phone: "+91 98765 43211",
      email: "priya.farmer@email.com",
      joinDate: "Mar 2023",
      avatar: "PS"
    },
    {
      id: 3,
      name: "Amit Singh",
      location: "Uttar Pradesh, India",
      crops: ["Maize", "Soybean", "Mustard"],
      rating: 4.7,
      experience: "18 years",
      phone: "+91 98765 43212",
      email: "amit.farmer@email.com",
      joinDate: "Feb 2023",
      avatar: "AS"
    }
  ];

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
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gradient-saffron-navy">
              🤝 Partner Farmers Network
            </h1>
            <p className="text-muted-foreground text-lg mt-2">
              Connect with verified farmers and build lasting partnerships
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {partnerFarmers.map((farmer) => (
              <Card key={farmer.id} className="hover:shadow-lg transition-all duration-200 hover:scale-105">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src="" />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {farmer.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{farmer.name}</CardTitle>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {farmer.location}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{farmer.rating}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium text-sm mb-2">Specializes in:</h4>
                    <div className="flex flex-wrap gap-1">
                      {farmer.crops.map((crop) => (
                        <Badge key={crop} variant="secondary" className="text-xs">
                          {crop}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {farmer.experience}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Since {farmer.joinDate}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1">
                      <Phone className="h-3 w-3 mr-1" />
                      Call
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <Mail className="h-3 w-3 mr-1" />
                      Email
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default MerchantFarmers;