import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Activity, Search, Filter, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { format } from "date-fns";

const AdminAuditLog = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useCurrentUser();
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const fetchLogs = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("activity_log")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);
    setLogs(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchLogs(); }, []);

  const actionTypes = [...new Set(logs.map(l => l.action_type))];
  const filtered = logs.filter(l => {
    const matchSearch = !search || l.action.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === "all" || l.action_type === typeFilter;
    return matchSearch && matchType;
  });

  const getTypeBadgeColor = (type: string) => {
    const colors: Record<string, string> = {
      login: "bg-primary/10 text-primary",
      system: "bg-muted text-muted-foreground",
      deal: "bg-accent/10 text-accent",
      consultation: "bg-navy/10 text-navy",
    };
    return colors[type] || "bg-secondary text-secondary-foreground";
  };

  return (
    <div className="min-h-screen bg-background">
      <Header user={{ name: user.name, role: "admin" }} onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} userRole="admin" />
      <main className="md:ml-64 pt-16 p-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Activity className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold text-gradient-tricolor">Audit Log</h1>
            </div>
            <Button variant="outline" onClick={fetchLogs}>
              <RefreshCw className="h-4 w-4 mr-2" /> Refresh
            </Button>
          </div>

          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search actions..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {actionTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <Card className="tricolor-card">
            <CardHeader>
              <CardTitle>Activity Log ({filtered.length} entries)</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex gap-4 py-3 border-b border-border">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-6 flex-1" />
                    <Skeleton className="h-6 w-32" />
                  </div>
                ))
              ) : filtered.length > 0 ? (
                <div className="divide-y divide-border">
                  {filtered.map(log => (
                    <div key={log.id} className="flex items-center gap-4 py-3">
                      <Badge className={getTypeBadgeColor(log.action_type)}>{log.action_type}</Badge>
                      <p className="flex-1 text-sm text-foreground">{log.action}</p>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {log.created_at ? format(new Date(log.created_at), "MMM dd, HH:mm") : "—"}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Activity className="h-12 w-12 mx-auto mb-3 opacity-40" />
                  <p>No audit log entries found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AdminAuditLog;
