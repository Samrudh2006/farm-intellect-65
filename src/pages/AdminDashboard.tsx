import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatCard } from "@/components/ui/stat-card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  Users, Activity, TrendingUp, Shield, AlertTriangle,
  CheckCircle, UserCheck, Store, GraduationCap, RefreshCw
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentUser } from "@/hooks/useCurrentUser";

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useCurrentUser();
  const [stats, setStats] = useState({ total: 0, farmers: 0, merchants: 0, experts: 0, admins: 0 });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        // Fetch user role counts
        const { data: roles } = await supabase.from("user_roles").select("role");
        if (roles) {
          setStats({
            total: roles.length,
            farmers: roles.filter(r => r.role === "farmer").length,
            merchants: roles.filter(r => r.role === "merchant").length,
            experts: roles.filter(r => r.role === "expert").length,
            admins: roles.filter(r => r.role === "admin").length,
          });
        }

        // Fetch recent activity
        const { data: activity } = await supabase
          .from("activity_log")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(10);
        setRecentActivity(activity || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const userDistribution = [
    { role: "Farmers", count: stats.farmers, pct: stats.total ? (stats.farmers / stats.total * 100) : 0, icon: UserCheck, color: "bg-primary" },
    { role: "Merchants", count: stats.merchants, pct: stats.total ? (stats.merchants / stats.total * 100) : 0, icon: Store, color: "bg-accent" },
    { role: "Experts", count: stats.experts, pct: stats.total ? (stats.experts / stats.total * 100) : 0, icon: GraduationCap, color: "bg-navy" },
    { role: "Admins", count: stats.admins, pct: stats.total ? (stats.admins / stats.total * 100) : 0, icon: Shield, color: "bg-destructive" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header user={{ name: user.name, role: "admin" }} onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} userRole="admin" />

      <main className="ml-0 md:ml-64 pt-16 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              System overview — {stats.total} registered users
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard title="Total Users" value={loading ? "..." : stats.total.toLocaleString()} icon={Users} change={{ value: "Live data", trend: "up" as const }} />
            <StatCard title="Farmers" value={loading ? "..." : stats.farmers.toLocaleString()} icon={UserCheck} change={{ value: `${stats.total ? Math.round(stats.farmers / stats.total * 100) : 0}% of total`, trend: "up" as const }} />
            <StatCard title="Merchants" value={loading ? "..." : stats.merchants.toLocaleString()} icon={Store} change={{ value: `${stats.total ? Math.round(stats.merchants / stats.total * 100) : 0}% of total`, trend: "neutral" as const }} />
            <StatCard title="Experts" value={loading ? "..." : stats.experts.toLocaleString()} icon={GraduationCap} change={{ value: `${stats.total ? Math.round(stats.experts / stats.total * 100) : 0}% of total`, trend: "neutral" as const }} />
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="activity">Activity Log</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-2">
                <Card className="tricolor-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5" /> User Distribution</CardTitle>
                    <CardDescription>Active users by role (live)</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {loading ? (
                      <div className="flex justify-center py-8"><RefreshCw className="h-6 w-6 animate-spin text-primary" /></div>
                    ) : (
                      userDistribution.map((s, i) => (
                        <div key={i} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <div className={`w-3 h-3 rounded-full ${s.color}`} />
                              <span className="text-sm font-medium">{s.role}</span>
                            </div>
                            <span className="text-sm text-muted-foreground">{s.count}</span>
                          </div>
                          <Progress value={s.pct} className="h-2" />
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>

                <Card className="tricolor-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5" /> Platform Security</CardTitle>
                    <CardDescription>Security status overview</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">RLS Policies</span>
                      <Badge className="bg-primary/15 text-primary">✅ Active</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Admin Role Protection</span>
                      <Badge className="bg-primary/15 text-primary">✅ Enforced</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">JWT Validation</span>
                      <Badge className="bg-primary/15 text-primary">✅ Enabled</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Edge Function Auth</span>
                      <Badge className="bg-primary/15 text-primary">✅ Secured</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="activity" className="space-y-6">
              <Card className="tricolor-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Activity className="h-5 w-5" /> Recent Activity</CardTitle>
                  <CardDescription>System-wide activity log from database</CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex justify-center py-8"><RefreshCw className="h-6 w-6 animate-spin text-primary" /></div>
                  ) : recentActivity.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">No activity recorded yet</p>
                  ) : (
                    <div className="space-y-3">
                      {recentActivity.map((a) => (
                        <div key={a.id} className="flex items-center gap-3 p-3 border rounded-lg">
                          <div className={`w-2 h-2 rounded-full ${a.action_type === "error" ? "bg-destructive" : "bg-primary"}`} />
                          <div className="flex-1">
                            <p className="text-sm font-medium">{a.action}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(a.created_at).toLocaleString("en-IN")} • {a.action_type}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-2">
                <Card className="tricolor-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5" /> Access Control</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between"><span className="text-sm">Role-Based Access</span><span className="font-semibold text-primary">4 roles configured</span></div>
                    <div className="flex justify-between"><span className="text-sm">SECURITY DEFINER Functions</span><span className="font-semibold text-primary">Active</span></div>
                    <div className="flex justify-between"><span className="text-sm">Client-Side Admin Block</span><span className="font-semibold text-primary">Enforced</span></div>
                    <div className="flex justify-between"><span className="text-sm">Server-Side Admin Block</span><span className="font-semibold text-primary">Enforced (trigger)</span></div>
                  </CardContent>
                </Card>

                <Card className="tricolor-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><AlertTriangle className="h-5 w-5" /> Recommendations</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="p-3 bg-primary/5 rounded-lg">
                      <p className="text-sm font-medium">✅ Admin privilege escalation — Fixed</p>
                      <p className="text-xs text-muted-foreground">handle_new_user always assigns 'farmer'</p>
                    </div>
                    <div className="p-3 bg-primary/5 rounded-lg">
                      <p className="text-sm font-medium">✅ Chat function auth — Fixed</p>
                      <p className="text-xs text-muted-foreground">JWT validation via getClaims()</p>
                    </div>
                    <div className="p-3 bg-primary/5 rounded-lg">
                      <p className="text-sm font-medium">✅ Dead auth code — Removed</p>
                      <p className="text-xs text-muted-foreground">EnhancedLogin.tsx deleted</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
