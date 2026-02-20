import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, UserCheck, UserX, Shield, Settings } from "lucide-react";

const AdminUsers = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const user = {
    name: "Admin User",
    role: "admin",
  };

  const userStats = [
    { icon: Users, label: "Total Users", value: "1,247", trend: "+15%" },
    { icon: UserCheck, label: "Active Users", value: "1,156", trend: "+12%" },
    { icon: UserX, label: "Pending Verification", value: "91", trend: "+8%" },
    { icon: Shield, label: "Verified Experts", value: "23", trend: "+3%" }
  ];

  const recentUsers = [
    {
      id: 1,
      name: "Rajesh Kumar",
      email: "rajesh@email.com",
      role: "farmer",
      status: "active",
      joinDate: "2024-01-15",
      location: "Punjab"
    },
    {
      id: 2,
      name: "Merchant Corp",
      email: "merchant@corp.com",
      role: "merchant",
      status: "pending",
      joinDate: "2024-01-14",
      location: "Delhi"
    },
    {
      id: 3,
      name: "Dr. Priya Sharma",
      email: "priya@expert.com",
      role: "expert",
      status: "active",
      joinDate: "2024-01-13",
      location: "Haryana"
    }
  ];

  const getRoleColor = (role: string) => {
    switch (role) {
      case "farmer": return "bg-green-100 text-green-800";
      case "merchant": return "bg-blue-100 text-blue-800";
      case "expert": return "bg-purple-100 text-purple-800";
      case "admin": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "suspended": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

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
              👥 User Management Center
            </h1>
            <p className="text-muted-foreground text-lg mt-2">
              Oversee platform community and user verification
            </p>
          </div>

          {/* User Statistics */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {userStats.map((stat, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-200 hover:scale-105 border-l-4 border-l-primary/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                  <div className="p-2 rounded-full bg-primary/10">
                    <stat.icon className="h-4 w-4 text-primary" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-600 font-medium">{stat.trend}</span>
                    {" from last month"}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* User Management Table */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent User Registrations</CardTitle>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Manage All Users
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentUsers.map((userData) => (
                  <div key={userData.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src="" />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {userData.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{userData.name}</div>
                        <div className="text-sm text-muted-foreground">{userData.email}</div>
                        <div className="text-xs text-muted-foreground">{userData.location} • Joined {userData.joinDate}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getRoleColor(userData.role)}>
                        {userData.role}
                      </Badge>
                      <Badge className={getStatusColor(userData.status)}>
                        {userData.status}
                      </Badge>
                      <div className="flex gap-1">
                        <Button size="sm" variant="outline">
                          View
                        </Button>
                        {userData.status === "pending" && (
                          <Button size="sm" variant="default">
                            Approve
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AdminUsers;