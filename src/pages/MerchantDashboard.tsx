import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { RoleDashboard } from "@/components/dashboard/RoleDashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatCard } from "@/components/ui/stat-card";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  ShoppingCart, 
  TrendingUp, 
  Wallet,
  Truck,
  Package,
  AlertTriangle,
  CheckCircle,
  Clock,
  Phone,
  MapPin,
  Star
} from "lucide-react";

const MerchantDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const mockUser = {
    name: "Rajesh Agro Trading",
    email: "merchant@smartcrop.com",
    role: "Merchant",
    location: "Ludhiana, Punjab",
    businessType: "Grain Trader",
    rating: 4.6,
    yearsInBusiness: 8
  };

  const stats = [
    {
      title: "Active Orders",
      value: "42",
      icon: ShoppingCart,
      trend: "+8%",
      description: "This week"
    },
    {
      title: "Connected Farmers",
      value: "156",
      icon: Users,
      trend: "+23%",
      description: "Active partnerships"
    },
    {
      title: "Monthly Revenue",
      value: "₹8.5L",
      icon: Wallet,
      trend: "+15%",
      description: "This month"
    },
    {
      title: "Crops Purchased",
      value: "2,450 Qt",
      icon: Package,
      trend: "+12%",
      description: "Total this season"
    }
  ];

  const pendingOrders = [
    {
      id: "ORD001",
      farmer: "Kulwinder Singh",
      location: "Amritsar",
      crop: "Wheat",
      quantity: "50 Qt",
      quality: "Grade A",
      price: "₹2,100/Qt",
      status: "pending",
      requestedDate: "2 hours ago"
    },
    {
      id: "ORD002", 
      farmer: "Manpreet Kaur",
      location: "Bathinda",
      crop: "Rice",
      quantity: "80 Qt",
      quality: "Grade A+",
      price: "₹1,850/Qt",
      status: "negotiation",
      requestedDate: "5 hours ago"
    },
    {
      id: "ORD003",
      farmer: "Jasbir Singh",
      location: "Patiala", 
      crop: "Cotton",
      quantity: "25 Qt",
      quality: "Premium",
      price: "₹5,200/Qt",
      status: "approved",
      requestedDate: "1 day ago"
    }
  ];

  const marketPrices = [
    { crop: "Wheat", currentPrice: "₹2,150/Qt", change: "+2.3%", trend: "up", demand: "High" },
    { crop: "Rice", currentPrice: "₹1,890/Qt", change: "-1.1%", trend: "down", demand: "Medium" },
    { crop: "Cotton", currentPrice: "₹5,400/Qt", change: "+5.8%", trend: "up", demand: "Very High" },
    { crop: "Sugarcane", currentPrice: "₹350/Qt", change: "+0.5%", trend: "up", demand: "Medium" },
    { crop: "Maize", currentPrice: "₹1,750/Qt", change: "-0.8%", trend: "down", demand: "Low" }
  ];

  const recentTransactions = [
    {
      id: "TXN001",
      farmer: "Gurpreet Singh",
      crop: "Wheat",
      quantity: "100 Qt",
      amount: "₹2,10,000",
      date: "Jan 20, 2024",
      status: "completed"
    },
    {
      id: "TXN002",
      farmer: "Simran Kaur", 
      crop: "Rice",
      quantity: "75 Qt",
      amount: "₹1,41,750",
      date: "Jan 19, 2024",
      status: "completed"
    },
    {
      id: "TXN003",
      farmer: "Harjit Singh",
      crop: "Cotton",
      quantity: "30 Qt", 
      amount: "₹1,56,000",
      date: "Jan 18, 2024",
      status: "processing"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'negotiation': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDemandColor = (demand: string) => {
    switch (demand) {
      case 'Very High': return 'text-red-600';
      case 'High': return 'text-orange-600';
      case 'Medium': return 'text-yellow-600';
      case 'Low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        user={mockUser}
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
      />
      
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        userRole="merchant"
      />

      <main className="ml-0 md:ml-64 pt-16 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Merchant Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {mockUser.name}. You have {pendingOrders.length} pending orders to review.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <StatCard
                key={index}
                title={stat.title}
                value={stat.value}
                icon={stat.icon}
                change={{
                  value: stat.trend + " " + stat.description,
                  trend: stat.trend.includes('+') ? 'up' : stat.trend.includes('-') ? 'down' : 'neutral'
                }}
              />
            ))}
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="orders" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="market">Market Prices</TabsTrigger>
              <TabsTrigger value="inventory">Inventory</TabsTrigger>
              <TabsTrigger value="farmers">Farmers</TabsTrigger>
            </TabsList>

            <TabsContent value="orders" className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Pending Orders */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      Pending Orders
                    </CardTitle>
                    <CardDescription>
                      Orders awaiting your response
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {pendingOrders.map((order) => (
                      <div key={order.id} className="p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-semibold">{order.farmer}</h4>
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {order.location}
                            </p>
                          </div>
                          <Badge className={getStatusColor(order.status)}>
                            {order.status}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                          <div>
                            <span className="text-muted-foreground">Crop:</span>
                            <span className="ml-1 font-medium">{order.crop}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Quantity:</span>
                            <span className="ml-1 font-medium">{order.quantity}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Quality:</span>
                            <span className="ml-1 font-medium">{order.quality}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Price:</span>
                            <span className="ml-1 font-medium text-green-600">{order.price}</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">{order.requestedDate}</span>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Phone className="h-4 w-4 mr-1" />
                              Call
                            </Button>
                            <Button size="sm">Accept</Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Recent Transactions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5" />
                      Recent Transactions
                    </CardTitle>
                    <CardDescription>
                      Your recent purchase history
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {recentTransactions.map((transaction) => (
                      <div key={transaction.id} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-semibold">{transaction.farmer}</h4>
                            <p className="text-sm text-muted-foreground">{transaction.date}</p>
                          </div>
                          <Badge className={getStatusColor(transaction.status)}>
                            {transaction.status}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Crop:</span>
                            <p className="font-medium">{transaction.crop}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Quantity:</span>
                            <p className="font-medium">{transaction.quantity}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Amount:</span>
                            <p className="font-medium text-green-600">{transaction.amount}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="market" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Market Prices
                  </CardTitle>
                  <CardDescription>
                    Current market rates and demand trends
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {marketPrices.map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-4 border rounded-lg">
                        <div>
                          <h4 className="font-semibold">{item.crop}</h4>
                          <p className="text-2xl font-bold text-green-600">{item.currentPrice}</p>
                        </div>
                        <div className="text-right">
                          <p className={item.trend === 'up' ? 'text-green-600' : 'text-red-600'}>
                            {item.change}
                          </p>
                          <p className={`text-sm font-medium ${getDemandColor(item.demand)}`}>
                            {item.demand} Demand
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="inventory" className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      Current Inventory
                    </CardTitle>
                    <CardDescription>Stock levels and storage capacity</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Wheat</span>
                        <span className="font-semibold">450 Qt</span>
                      </div>
                      <Progress value={75} className="h-2" />
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Rice</span>
                        <span className="font-semibold">220 Qt</span>
                      </div>
                      <Progress value={45} className="h-2" />
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Cotton</span>
                        <span className="font-semibold">80 Qt</span>
                      </div>
                      <Progress value={20} className="h-2" />
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Storage Capacity Used</span>
                        <span className="font-semibold">750/1200 Qt</span>
                      </div>
                      <Progress value={62.5} className="h-2" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Truck className="h-5 w-5" />
                      Logistics
                    </CardTitle>
                    <CardDescription>Transportation and delivery status</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Trucks Available</span>
                        <span className="font-semibold">3/5</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Active Deliveries</span>
                        <span className="font-semibold">8</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Pending Pickups</span>
                        <span className="font-semibold">12</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Average Delivery Time</span>
                        <span className="font-semibold">2.3 days</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="farmers" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Connected Farmers
                  </CardTitle>
                  <CardDescription>
                    Your network of farmer partners
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3, 4, 5, 6].map((farmer, index) => (
                      <div key={index} className="p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <Users className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-semibold">Farmer {farmer}</h4>
                            <p className="text-sm text-muted-foreground">Punjab Region</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="text-sm">4.{8 - index} rating</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">
                            {10 + index * 5} transactions
                          </span>
                          <Button size="sm" variant="outline">
                            <Phone className="h-4 w-4 mr-1" />
                            Contact
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default MerchantDashboard;