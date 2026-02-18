import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";
import { 
  Activity, 
  Server, 
  Database, 
  Shield, 
  CreditCard,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  Zap,
  AlertOctagon,
  FileText,
  TrendingUp,
  TrendingDown,
  Wifi,
  HardDrive,
  Cpu,
  MemoryStick
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, Legend } from "recharts";

interface ServiceStatus {
  name: string;
  status: 'operational' | 'degraded' | 'down';
  uptime: number;
  latency: number;
  lastChecked: string;
  incidents: number;
}

interface ErrorLog {
  id: string;
  timestamp: string;
  level: 'error' | 'warning' | 'info';
  message: string;
  service: string;
  count: number;
}

interface SecurityAlert {
  id: string;
  timestamp: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  type: string;
  description: string;
  source: string;
  status: 'open' | 'resolved';
}

const AdminMonitoring = () => {
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [activeTab, setActiveTab] = useState("overview");

  // Mock service statuses
  const [services, setServices] = useState<ServiceStatus[]>([
    { name: 'API Gateway', status: 'operational', uptime: 99.98, latency: 45, lastChecked: new Date().toISOString(), incidents: 0 },
    { name: 'Web Server', status: 'operational', uptime: 99.95, latency: 32, lastChecked: new Date().toISOString(), incidents: 0 },
    { name: 'Database', status: 'operational', uptime: 99.99, latency: 12, lastChecked: new Date().toISOString(), incidents: 0 },
    { name: 'File Storage', status: 'operational', uptime: 99.92, latency: 78, lastChecked: new Date().toISOString(), incidents: 1 },
    { name: 'Authentication', status: 'operational', uptime: 99.97, latency: 28, lastChecked: new Date().toISOString(), incidents: 0 },
    { name: 'Notifications', status: 'degraded', uptime: 98.5, latency: 245, lastChecked: new Date().toISOString(), incidents: 2 },
  ]);

  // Mock API performance data
  const apiPerformanceData = [
    { time: '00:00', requests: 1200, errors: 2, latency: 45 },
    { time: '04:00', requests: 800, errors: 1, latency: 42 },
    { time: '08:00', requests: 2400, errors: 5, latency: 52 },
    { time: '12:00', requests: 3800, errors: 8, latency: 58 },
    { time: '16:00', requests: 3200, errors: 4, latency: 48 },
    { time: '20:00', requests: 2100, errors: 3, latency: 46 },
    { time: '23:59', requests: 1500, errors: 2, latency: 44 },
  ];

  // Mock error logs
  const errorLogs: ErrorLog[] = [
    { id: '1', timestamp: new Date(Date.now() - 300000).toISOString(), level: 'error', message: 'Database connection timeout', service: 'Database', count: 3 },
    { id: '2', timestamp: new Date(Date.now() - 600000).toISOString(), level: 'warning', message: 'High memory usage detected', service: 'Web Server', count: 1 },
    { id: '3', timestamp: new Date(Date.now() - 900000).toISOString(), level: 'error', message: 'Payment processing failed', service: 'Payment Gateway', count: 5 },
    { id: '4', timestamp: new Date(Date.now() - 1200000).toISOString(), level: 'info', message: 'Cache cleared successfully', service: 'Cache', count: 1 },
    { id: '5', timestamp: new Date(Date.now() - 1800000).toISOString(), level: 'warning', message: 'Slow query detected', service: 'Database', count: 2 },
  ];

  // Mock database activity
  const dbActivityData = [
    { time: '00:00', queries: 4500, connections: 45, slowQueries: 2 },
    { time: '04:00', queries: 2800, connections: 32, slowQueries: 1 },
    { time: '08:00', queries: 8200, connections: 78, slowQueries: 5 },
    { time: '12:00', queries: 12500, connections: 95, slowQueries: 8 },
    { time: '16:00', queries: 11200, connections: 88, slowQueries: 4 },
    { time: '20:00', queries: 7800, connections: 65, slowQueries: 3 },
    { time: '23:59', queries: 5200, connections: 48, slowQueries: 2 },
  ];

  // Mock security alerts
  const securityAlerts: SecurityAlert[] = [
    { id: '1', timestamp: new Date(Date.now() - 3600000).toISOString(), severity: 'critical', type: 'Brute Force Attack', description: 'Multiple failed login attempts from IP 192.168.1.100', source: 'Authentication', status: 'open' },
    { id: '2', timestamp: new Date(Date.now() - 7200000).toISOString(), severity: 'high', type: 'Suspicious Activity', description: 'Unusual API request pattern detected', source: 'API Gateway', status: 'open' },
    { id: '3', timestamp: new Date(Date.now() - 14400000).toISOString(), severity: 'medium', type: 'Rate Limit Exceeded', description: 'User exceeded rate limit for event creation', source: 'API Gateway', status: 'resolved' },
    { id: '4', timestamp: new Date(Date.now() - 28800000).toISOString(), severity: 'low', type: 'Failed Payment', description: 'Multiple failed payment attempts', source: 'Payment Gateway', status: 'resolved' },
  ];

  // Mock payment gateway status
  const paymentGateways = [
    { name: 'Stripe', status: 'operational', uptime: 99.95, lastTransaction: '2 mins ago', successRate: 98.5 },
    { name: 'PayPal', status: 'operational', uptime: 99.92, lastTransaction: '5 mins ago', successRate: 97.8 },
    { name: 'Square', status: 'operational', uptime: 99.88, lastTransaction: '12 mins ago', successRate: 96.2 },
  ];

  // Server resources
  const serverResources = {
    cpu: { usage: 45, cores: 8, temperature: 62 },
    memory: { usage: 68, total: 32, used: 21.8 },
    disk: { usage: 72, total: 500, used: 360 },
    network: { in: 125, out: 89 },
  };

  const refreshData = () => {
    setLastRefresh(new Date());
    toast({ title: "System status refreshed" });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'operational':
        return <Badge className="bg-green-500/20 text-green-600"><CheckCircle className="h-3 w-3 mr-1" /> Operational</Badge>;
      case 'degraded':
        return <Badge className="bg-yellow-500/20 text-yellow-600"><AlertTriangle className="h-3 w-3 mr-1" /> Degraded</Badge>;
      case 'down':
        return <Badge className="bg-red-500/20 text-red-600"><XCircle className="h-3 w-3 mr-1" /> Down</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <Badge className="bg-red-500/20 text-red-600">Critical</Badge>;
      case 'high':
        return <Badge className="bg-orange-500/20 text-orange-600">High</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-500/20 text-yellow-600">Medium</Badge>;
      case 'low':
        return <Badge className="bg-blue-500/20 text-blue-600">Low</Badge>;
      default:
        return <Badge variant="secondary">{severity}</Badge>;
    }
  };

  const getLogLevelBadge = (level: string) => {
    switch (level) {
      case 'error':
        return <Badge className="bg-red-500/20 text-red-600">Error</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-500/20 text-yellow-600">Warning</Badge>;
      case 'info':
        return <Badge className="bg-blue-500/20 text-blue-600">Info</Badge>;
      default:
        return <Badge variant="secondary">{level}</Badge>;
    }
  };

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setLastRefresh(new Date());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">System Monitoring</h1>
          <p className="text-muted-foreground mt-1">Real-time system health and performance monitoring.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Last updated: {lastRefresh.toLocaleTimeString()}
          </span>
          <Button variant="outline" size="sm" onClick={refreshData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* System Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="glass">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <Server className="h-5 w-5 text-green-500" />
              <Badge className="bg-green-500/20 text-green-600">99.9%</Badge>
            </div>
            <p className="text-2xl font-display font-bold mt-2">{services.filter(s => s.status === 'operational').length}/{services.length}</p>
            <p className="text-xs text-muted-foreground">Services Online</p>
          </CardContent>
        </Card>
        <Card className="glass">
          <CardContent className="p-4">
            <Zap className="h-5 w-5 text-yellow-500 mb-2" />
            <p className="text-2xl font-display font-bold">45ms</p>
            <p className="text-xs text-muted-foreground">Avg Latency</p>
          </CardContent>
        </Card>
        <Card className="glass">
          <CardContent className="p-4">
            <AlertOctagon className="h-5 w-5 text-red-500 mb-2" />
            <p className="text-2xl font-display font-bold">{securityAlerts.filter(a => a.status === 'open').length}</p>
            <p className="text-xs text-muted-foreground">Open Alerts</p>
          </CardContent>
        </Card>
        <Card className="glass">
          <CardContent className="p-4">
            <FileText className="h-5 w-5 text-primary mb-2" />
            <p className="text-2xl font-display font-bold">{errorLogs.filter(l => l.level === 'error').length}</p>
            <p className="text-xs text-muted-foreground">Errors (24h)</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full max-w-2xl grid-cols-4">
          <TabsTrigger value="overview" className="gap-2">
            <Activity className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="performance" className="gap-2">
            <Zap className="h-4 w-4" />
            Performance
          </TabsTrigger>
          <TabsTrigger value="database" className="gap-2">
            <Database className="h-4 w-4" />
            Database
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Server Health Status */}
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="h-5 w-5 text-primary" />
                Server Health Status
              </CardTitle>
              <CardDescription>Current status of all system services</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {services.map((service) => (
                  <div key={service.name} className="p-4 rounded-lg bg-secondary/50">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {service.name.includes('Database') ? <Database className="h-4 w-4" /> :
                         service.name.includes('Storage') ? <HardDrive className="h-4 w-4" /> :
                         service.name.includes('Auth') ? <Shield className="h-4 w-4" /> :
                         <Server className="h-4 w-4" />}
                        <span className="font-medium">{service.name}</span>
                      </div>
                      {getStatusBadge(service.status)}
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Uptime</span>
                        <span className="font-medium">{service.uptime}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Latency</span>
                        <span className="font-medium">{service.latency}ms</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Incidents</span>
                        <span className={service.incidents > 0 ? "text-yellow-600" : "text-green-600"}>
                          {service.incidents}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Server Resources */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cpu className="h-5 w-5 text-primary" />
                  CPU & Memory
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="flex items-center gap-2">
                      <Cpu className="h-4 w-4" />
                      CPU Usage ({serverResources.cpu.cores} cores)
                    </span>
                    <span className="font-medium">{serverResources.cpu.usage}%</span>
                  </div>
                  <Progress value={serverResources.cpu.usage} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">
                    Temperature: {serverResources.cpu.temperature}°C
                  </p>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="flex items-center gap-2">
                      <MemoryStick className="h-4 w-4" />
                      Memory Usage
                    </span>
                    <span className="font-medium">{serverResources.memory.usage}%</span>
                  </div>
                  <Progress value={serverResources.memory.usage} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">
                    {serverResources.memory.used} GB / {serverResources.memory.total} GB used
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HardDrive className="h-5 w-5 text-primary" />
                  Disk & Network
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="flex items-center gap-2">
                      <HardDrive className="h-4 w-4" />
                      Disk Usage
                    </span>
                    <span className="font-medium">{serverResources.disk.usage}%</span>
                  </div>
                  <Progress value={serverResources.disk.usage} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">
                    {serverResources.disk.used} GB / {serverResources.disk.total} GB used
                  </p>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="flex items-center gap-2">
                      <Wifi className="h-4 w-4" />
                      Network I/O
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 rounded-lg bg-secondary/50 text-center">
                      <TrendingDown className="h-4 w-4 text-blue-500 mx-auto mb-1" />
                      <p className="text-lg font-bold">{serverResources.network.in}</p>
                      <p className="text-xs text-muted-foreground">MB/s In</p>
                    </div>
                    <div className="p-3 rounded-lg bg-secondary/50 text-center">
                      <TrendingUp className="h-4 w-4 text-green-500 mx-auto mb-1" />
                      <p className="text-lg font-bold">{serverResources.network.out}</p>
                      <p className="text-xs text-muted-foreground">MB/s Out</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Gateway Status */}
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                Payment Gateway Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {paymentGateways.map((gateway) => (
                  <div key={gateway.name} className="p-4 rounded-lg bg-secondary/50">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-medium">{gateway.name}</span>
                      {getStatusBadge(gateway.status)}
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Uptime</span>
                        <span className="font-medium">{gateway.uptime}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Success Rate</span>
                        <span className="font-medium text-green-600">{gateway.successRate}%</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Last Transaction</span>
                        <span className="text-muted-foreground">{gateway.lastTransaction}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          {/* API Performance */}
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                API Performance (24h)
              </CardTitle>
              <CardDescription>Request volume, errors, and latency trends</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={apiPerformanceData}>
                  <defs>
                    <linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(145,100%,45%)" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="hsl(145,100%,45%)" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorErrors" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(0,72%,51%)" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="hsl(0,72%,51%)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(225,20%,18%)" />
                  <XAxis dataKey="time" tick={{ fill: "hsl(220,15%,55%)", fontSize: 12 }} />
                  <YAxis yAxisId="left" tick={{ fill: "hsl(220,15%,55%)", fontSize: 12 }} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fill: "hsl(220,15%,55%)", fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ 
                      background: "hsl(225,30%,10%)", 
                      border: "1px solid hsl(225,20%,18%)", 
                      borderRadius: 8, 
                      color: "hsl(210,40%,96%)" 
                    }} 
                  />
                  <Legend />
                  <Area yAxisId="left" type="monotone" dataKey="requests" name="Requests" stroke="hsl(145,100%,45%)" fillOpacity={1} fill="url(#colorRequests)" />
                  <Area yAxisId="left" type="monotone" dataKey="errors" name="Errors" stroke="hsl(0,72%,51%)" fillOpacity={1} fill="url(#colorErrors)" />
                  <Line yAxisId="right" type="monotone" dataKey="latency" name="Latency (ms)" stroke="hsl(190,100%,50%)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Error Logs */}
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Recent Error Logs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {errorLogs.map((log) => (
                  <div key={log.id} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50">
                    {getLogLevelBadge(log.level)}
                    <div className="flex-1">
                      <p className="font-medium text-sm">{log.message}</p>
                      <p className="text-xs text-muted-foreground">
                        {log.service} · {new Date(log.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                    {log.count > 1 && (
                      <Badge variant="outline" className="text-xs">
                        {log.count} occurrences
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Database Tab */}
        <TabsContent value="database" className="space-y-6">
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-primary" />
                Database Activity (24h)
              </CardTitle>
              <CardDescription>Query volume, connections, and slow queries</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={dbActivityData}>
                  <defs>
                    <linearGradient id="colorQueries" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(145,100%,45%)" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="hsl(145,100%,45%)" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorConnections" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(190,100%,50%)" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="hsl(190,100%,50%)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(225,20%,18%)" />
                  <XAxis dataKey="time" tick={{ fill: "hsl(220,15%,55%)", fontSize: 12 }} />
                  <YAxis yAxisId="left" tick={{ fill: "hsl(220,15%,55%)", fontSize: 12 }} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fill: "hsl(220,15%,55%)", fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ 
                      background: "hsl(225,30%,10%)", 
                      border: "1px solid hsl(225,20%,18%)", 
                      borderRadius: 8, 
                      color: "hsl(210,40%,96%)" 
                    }} 
                  />
                  <Legend />
                  <Area yAxisId="left" type="monotone" dataKey="queries" name="Queries" stroke="hsl(145,100%,45%)" fillOpacity={1} fill="url(#colorQueries)" />
                  <Area yAxisId="right" type="monotone" dataKey="connections" name="Connections" stroke="hsl(190,100%,50%)" fillOpacity={1} fill="url(#colorConnections)" />
                  <Line yAxisId="left" type="monotone" dataKey="slowQueries" name="Slow Queries" stroke="hsl(0,72%,51%)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Security Alerts
              </CardTitle>
              <CardDescription>Active and resolved security incidents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {securityAlerts.map((alert) => (
                  <div key={alert.id} className={`flex items-start gap-3 p-4 rounded-lg ${alert.status === 'open' ? 'bg-red-500/5 border border-red-500/20' : 'bg-secondary/50'}`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      alert.severity === 'critical' ? 'bg-red-500/20' :
                      alert.severity === 'high' ? 'bg-orange-500/20' :
                      alert.severity === 'medium' ? 'bg-yellow-500/20' :
                      'bg-blue-500/20'
                    }`}>
                      <AlertOctagon className={`h-5 w-5 ${
                        alert.severity === 'critical' ? 'text-red-500' :
                        alert.severity === 'high' ? 'text-orange-500' :
                        alert.severity === 'medium' ? 'text-yellow-500' :
                        'text-blue-500'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{alert.type}</span>
                        {getSeverityBadge(alert.severity)}
                        <Badge variant={alert.status === 'open' ? 'destructive' : 'secondary'}>
                          {alert.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{alert.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span>Source: {alert.source}</span>
                        <span>{new Date(alert.timestamp).toLocaleString()}</span>
                      </div>
                    </div>
                    {alert.status === 'open' && (
                      <Button variant="outline" size="sm">
                        Resolve
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminMonitoring;