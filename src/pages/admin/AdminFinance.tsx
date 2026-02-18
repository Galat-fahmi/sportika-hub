import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { 
  DollarSign, 
  Settings, 
  CreditCard, 
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle,
  XCircle,
  RefreshCw,
  Wallet,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  FileText,
  Download,
  Search,
  Filter,
  Calendar,
  User,
  Clock
} from "lucide-react";
import { format } from "date-fns";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, Legend } from "recharts";

interface CommissionSettings {
  platformFee: number;
  transactionFee: number;
  payoutThreshold: number;
  payoutSchedule: 'weekly' | 'biweekly' | 'monthly';
  enableTaxCollection: boolean;
  taxRate: number;
}

interface Transaction {
  id: string;
  date: string;
  user: string;
  userType: 'athlete' | 'organizer';
  event: string;
  amount: number;
  platformFee: number;
  netAmount: number;
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  paymentMethod: string;
  transactionId: string;
}

interface PayoutRequest {
  id: string;
  organizerId: string;
  organizerName: string;
  amount: number;
  requestedAt: string;
  status: 'pending' | 'approved' | 'rejected' | 'processed';
  method: string;
  accountDetails: string;
}

interface RefundRequest {
  id: string;
  transactionId: string;
  user: string;
  amount: number;
  reason: string;
  requestedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  event: string;
}

const AdminFinance = () => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [transactionDialogOpen, setTransactionDialogOpen] = useState(false);
  const [refundDialogOpen, setRefundDialogOpen] = useState(false);
  const [selectedRefund, setSelectedRefund] = useState<RefundRequest | null>(null);
  const [refundReason, setRefundReason] = useState("");

  // Commission settings state
  const [commissionSettings, setCommissionSettings] = useState<CommissionSettings>({
    platformFee: 10,
    transactionFee: 2.9,
    payoutThreshold: 100,
    payoutSchedule: 'monthly',
    enableTaxCollection: true,
    taxRate: 8.5,
  });

  // Fetch transactions
  const { data: transactions } = useQuery({
    queryKey: ["admin-transactions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("event_registrations")
        .select("*, events(title, registration_fee), profiles:athlete_id(full_name)")
        .order("registered_at", { ascending: false });
      if (error) throw error;
      return data.map((r: any) => ({
        id: r.id,
        date: r.registered_at,
        user: r.profiles?.full_name || 'Unknown',
        userType: 'athlete',
        event: r.events?.title,
        amount: Number(r.events?.registration_fee || 0),
        platformFee: Number(r.events?.registration_fee || 0) * 0.1,
        netAmount: Number(r.events?.registration_fee || 0) * 0.9,
        status: r.payment_status === 'paid' ? 'completed' : r.payment_status,
        paymentMethod: 'Credit Card',
        transactionId: `TXN-${r.id.slice(0, 8).toUpperCase()}`,
      })) as Transaction[];
    },
  });

  // Mock payout requests
  const payoutRequests: PayoutRequest[] = [
    { id: '1', organizerId: 'org1', organizerName: 'Sports Events Co.', amount: 2500, requestedAt: new Date(Date.now() - 86400000).toISOString(), status: 'pending', method: 'Bank Transfer', accountDetails: '****4567' },
    { id: '2', organizerId: 'org2', organizerName: 'City Marathon Org', amount: 4800, requestedAt: new Date(Date.now() - 172800000).toISOString(), status: 'pending', method: 'PayPal', accountDetails: 'payments@citymarathon.com' },
    { id: '3', organizerId: 'org3', organizerName: 'Tennis Club Pro', amount: 1200, requestedAt: new Date(Date.now() - 259200000).toISOString(), status: 'approved', method: 'Bank Transfer', accountDetails: '****8901' },
  ];

  // Mock refund requests
  const refundRequests: RefundRequest[] = [
    { id: '1', transactionId: 'TXN-ABC123', user: 'John Smith', amount: 50, reason: 'Event cancelled by organizer', requestedAt: new Date(Date.now() - 86400000).toISOString(), status: 'pending', event: 'City Marathon' },
    { id: '2', transactionId: 'TXN-DEF456', user: 'Jane Doe', amount: 75, reason: 'Unable to attend due to injury', requestedAt: new Date(Date.now() - 172800000).toISOString(), status: 'pending', event: 'Spring Tournament' },
    { id: '3', transactionId: 'TXN-GHI789', user: 'Mike Johnson', amount: 100, reason: 'Duplicate payment', requestedAt: new Date(Date.now() - 259200000).toISOString(), status: 'approved', event: 'Summer Championship' },
  ];

  // Calculate financial metrics
  const totalRevenue = transactions?.reduce((sum: number, t: Transaction) => sum + (t.status === 'completed' ? t.amount : 0), 0) ?? 0;
  const totalPlatformFees = transactions?.reduce((sum: number, t: Transaction) => sum + (t.status === 'completed' ? t.platformFee : 0), 0) ?? 0;
  const totalNetRevenue = totalRevenue - totalPlatformFees;
  const pendingPayouts = payoutRequests.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0);
  const pendingRefunds = refundRequests.filter(r => r.status === 'pending').reduce((sum, r) => sum + r.amount, 0);

  // Revenue trend data (mock)
  const revenueTrendData = [
    { month: 'Jan', revenue: 45000, fees: 4500, net: 40500 },
    { month: 'Feb', revenue: 52000, fees: 5200, net: 46800 },
    { month: 'Mar', revenue: 48000, fees: 4800, net: 43200 },
    { month: 'Apr', revenue: 61000, fees: 6100, net: 54900 },
    { month: 'May', revenue: 58000, fees: 5800, net: 52200 },
    { month: 'Jun', revenue: 72000, fees: 7200, net: 64800 },
  ];

  const updateCommissionSettings = useMutation({
    mutationFn: async () => {
      toast({ title: "Commission settings updated!" });
    },
  });

  const approvePayout = useMutation({
    mutationFn: async (payoutId: string) => {
      toast({ title: "Payout approved!" });
    },
  });

  const processRefund = useMutation({
    mutationFn: async ({ refundId, approved }: { refundId: string; approved: boolean }) => {
      toast({ 
        title: approved ? "Refund approved!" : "Refund rejected",
        description: approved ? "Payment will be processed within 5-7 business days" : "Reason recorded"
      });
    },
    onSuccess: () => {
      setRefundDialogOpen(false);
      setSelectedRefund(null);
      setRefundReason("");
    },
  });

  const filteredTransactions = transactions?.filter((t: Transaction) => {
    const matchesSearch = 
      t.user?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.event?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.transactionId?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500/20 text-green-600"><CheckCircle className="h-3 w-3 mr-1" /> Completed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500/20 text-yellow-600"><Clock className="h-3 w-3 mr-1" /> Pending</Badge>;
      case 'failed':
        return <Badge className="bg-red-500/20 text-red-600"><XCircle className="h-3 w-3 mr-1" /> Failed</Badge>;
      case 'refunded':
        return <Badge className="bg-blue-500/20 text-blue-600"><RefreshCw className="h-3 w-3 mr-1" /> Refunded</Badge>;
      case 'approved':
        return <Badge className="bg-green-500/20 text-green-600"><CheckCircle className="h-3 w-3 mr-1" /> Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500/20 text-red-600"><XCircle className="h-3 w-3 mr-1" /> Rejected</Badge>;
      case 'processed':
        return <Badge className="bg-blue-500/20 text-blue-600"><CheckCircle className="h-3 w-3 mr-1" /> Processed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">Financial & Commission Management</h1>
        <p className="text-muted-foreground mt-1">Manage platform commissions, transactions, payouts, and refunds.</p>
      </div>

      {/* Financial Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="glass">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <DollarSign className="h-5 w-5 text-green-500" />
              <TrendingUp className="h-4 w-4 text-green-500" />
            </div>
            <p className="text-2xl font-display font-bold mt-2">${totalRevenue.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Total Revenue</p>
          </CardContent>
        </Card>
        <Card className="glass">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <Wallet className="h-5 w-5 text-primary" />
              <TrendingUp className="h-4 w-4 text-green-500" />
            </div>
            <p className="text-2xl font-display font-bold mt-2">${totalPlatformFees.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Platform Fees</p>
          </CardContent>
        </Card>
        <Card className="glass">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <ArrowUpRight className="h-5 w-5 text-yellow-500" />
              <AlertCircle className="h-4 w-4 text-yellow-500" />
            </div>
            <p className="text-2xl font-display font-bold mt-2">${pendingPayouts.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Pending Payouts</p>
          </CardContent>
        </Card>
        <Card className="glass">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <RefreshCw className="h-5 w-5 text-blue-500" />
              <AlertCircle className="h-4 w-4 text-blue-500" />
            </div>
            <p className="text-2xl font-display font-bold mt-2">${pendingRefunds.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Pending Refunds</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full max-w-2xl grid-cols-4">
          <TabsTrigger value="overview" className="gap-2">
            <TrendingUp className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="transactions" className="gap-2">
            <CreditCard className="h-4 w-4" />
            Transactions
          </TabsTrigger>
          <TabsTrigger value="payouts" className="gap-2">
            <ArrowUpRight className="h-4 w-4" />
            Payouts
          </TabsTrigger>
          <TabsTrigger value="settings" className="gap-2">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Revenue Chart */}
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Revenue Trends
              </CardTitle>
              <CardDescription>Monthly revenue, platform fees, and net income</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <AreaChart data={revenueTrendData}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(145,100%,45%)" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="hsl(145,100%,45%)" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorFees" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(190,100%,50%)" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="hsl(190,100%,50%)" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorNet" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(40,100%,50%)" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="hsl(40,100%,50%)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(225,20%,18%)" />
                  <XAxis dataKey="month" tick={{ fill: "hsl(220,15%,55%)", fontSize: 12 }} />
                  <YAxis tick={{ fill: "hsl(220,15%,55%)", fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ 
                      background: "hsl(225,30%,10%)", 
                      border: "1px solid hsl(225,20%,18%)", 
                      borderRadius: 8, 
                      color: "hsl(210,40%,96%)" 
                    }}
                    formatter={(value: number) => `$${value.toLocaleString()}`}
                  />
                  <Legend />
                  <Area type="monotone" dataKey="revenue" name="Gross Revenue" stroke="hsl(145,100%,45%)" fillOpacity={1} fill="url(#colorRevenue)" />
                  <Area type="monotone" dataKey="fees" name="Platform Fees" stroke="hsl(190,100%,50%)" fillOpacity={1} fill="url(#colorFees)" />
                  <Area type="monotone" dataKey="net" name="Net Revenue" stroke="hsl(40,100%,50%)" fillOpacity={1} fill="url(#colorNet)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Commission Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="glass">
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground mb-1">Current Platform Fee</p>
                <p className="text-3xl font-bold">{commissionSettings.platformFee}%</p>
                <p className="text-xs text-muted-foreground">Per transaction</p>
              </CardContent>
            </Card>
            <Card className="glass">
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground mb-1">Transaction Fee</p>
                <p className="text-3xl font-bold">{commissionSettings.transactionFee}%</p>
                <p className="text-xs text-muted-foreground">+ $0.30 per transaction</p>
              </CardContent>
            </Card>
            <Card className="glass">
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground mb-1">Payout Schedule</p>
                <p className="text-3xl font-bold capitalize">{commissionSettings.payoutSchedule}</p>
                <p className="text-xs text-muted-foreground">${commissionSettings.payoutThreshold} minimum</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Transactions Tab */}
        <TabsContent value="transactions" className="space-y-4">
          <Card className="glass">
            <CardHeader>
              <CardTitle>Transaction Oversight</CardTitle>
              <CardDescription>View and manage all platform transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search transactions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                    <SelectItem value="refunded">Refunded</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Event</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Platform Fee</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions?.map((transaction: Transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-mono text-xs">{transaction.transactionId}</TableCell>
                      <TableCell className="text-sm">{format(new Date(transaction.date), "MMM d, yyyy")}</TableCell>
                      <TableCell>{transaction.user}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{transaction.event}</TableCell>
                      <TableCell className="font-medium">${transaction.amount}</TableCell>
                      <TableCell className="text-muted-foreground">${transaction.platformFee.toFixed(2)}</TableCell>
                      <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payouts Tab */}
        <TabsContent value="payouts" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Payout Requests */}
            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ArrowUpRight className="h-5 w-5 text-primary" />
                  Payout Approvals
                </CardTitle>
                <CardDescription>Review and approve organizer payout requests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {payoutRequests.map((payout) => (
                    <div key={payout.id} className="p-4 rounded-lg bg-secondary/50">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{payout.organizerName}</span>
                        </div>
                        {getStatusBadge(payout.status)}
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                        <div>
                          <span className="text-muted-foreground">Amount:</span>
                          <span className="font-medium ml-1">${payout.amount.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Method:</span>
                          <span className="ml-1">{payout.method}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Account:</span>
                          <span className="ml-1">{payout.accountDetails}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Requested:</span>
                          <span className="ml-1">{format(new Date(payout.requestedAt), "MMM d")}</span>
                        </div>
                      </div>
                      {payout.status === 'pending' && (
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            className="flex-1"
                            onClick={() => approvePayout.mutate(payout.id)}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Approve
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1">
                            <XCircle className="h-4 w-4 mr-2" />
                            Reject
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Refund Requests */}
            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RefreshCw className="h-5 w-5 text-primary" />
                  Refund Management
                </CardTitle>
                <CardDescription>Process refund requests from users</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {refundRequests.map((refund) => (
                    <div key={refund.id} className="p-4 rounded-lg bg-secondary/50">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{refund.user}</span>
                        </div>
                        {getStatusBadge(refund.status)}
                      </div>
                      <div className="space-y-1 text-sm mb-3">
                        <p><span className="text-muted-foreground">Event:</span> {refund.event}</p>
                        <p><span className="text-muted-foreground">Amount:</span> <span className="font-medium">${refund.amount}</span></p>
                        <p><span className="text-muted-foreground">Reason:</span> {refund.reason}</p>
                      </div>
                      {refund.status === 'pending' && (
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            className="flex-1"
                            onClick={() => { setSelectedRefund(refund); setRefundDialogOpen(true); }}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Process
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="flex-1"
                            onClick={() => processRefund.mutate({ refundId: refund.id, approved: false })}
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Reject
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-primary" />
                Commission Settings
              </CardTitle>
              <CardDescription>Configure platform fees and payout settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label>Platform Fee (%)</Label>
                  <Input
                    type="number"
                    value={commissionSettings.platformFee}
                    onChange={(e) => setCommissionSettings({ ...commissionSettings, platformFee: Number(e.target.value) })}
                    className="mt-1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Percentage taken from each transaction</p>
                </div>
                <div>
                  <Label>Transaction Fee (%)</Label>
                  <Input
                    type="number"
                    value={commissionSettings.transactionFee}
                    onChange={(e) => setCommissionSettings({ ...commissionSettings, transactionFee: Number(e.target.value) })}
                    className="mt-1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Payment processor fee</p>
                </div>
                <div>
                  <Label>Payout Threshold ($)</Label>
                  <Input
                    type="number"
                    value={commissionSettings.payoutThreshold}
                    onChange={(e) => setCommissionSettings({ ...commissionSettings, payoutThreshold: Number(e.target.value) })}
                    className="mt-1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Minimum amount for payout</p>
                </div>
                <div>
                  <Label>Payout Schedule</Label>
                  <Select 
                    value={commissionSettings.payoutSchedule} 
                    onValueChange={(v: any) => setCommissionSettings({ ...commissionSettings, payoutSchedule: v })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="biweekly">Bi-weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
                <div>
                  <Label className="text-base">Enable Tax Collection</Label>
                  <p className="text-sm text-muted-foreground">Automatically collect sales tax on transactions</p>
                </div>
                <Switch
                  checked={commissionSettings.enableTaxCollection}
                  onCheckedChange={(checked) => setCommissionSettings({ ...commissionSettings, enableTaxCollection: checked })}
                />
              </div>

              {commissionSettings.enableTaxCollection && (
                <div>
                  <Label>Tax Rate (%)</Label>
                  <Input
                    type="number"
                    value={commissionSettings.taxRate}
                    onChange={(e) => setCommissionSettings({ ...commissionSettings, taxRate: Number(e.target.value) })}
                    className="mt-1"
                  />
                </div>
              )}

              <Button onClick={() => updateCommissionSettings.mutate()}>
                <CheckCircle className="h-4 w-4 mr-2" />
                Save Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Refund Processing Dialog */}
      <Dialog open={refundDialogOpen} onOpenChange={setRefundDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Process Refund</DialogTitle>
            <DialogDescription>
              Review and approve refund for {selectedRefund?.user}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-secondary/50">
              <p className="text-sm text-muted-foreground">Refund Amount</p>
              <p className="text-2xl font-bold">${selectedRefund?.amount}</p>
            </div>
            <div>
              <Label>Admin Notes (Optional)</Label>
              <Textarea
                placeholder="Add notes about this refund..."
                value={refundReason}
                onChange={(e) => setRefundReason(e.target.value)}
                className="mt-1"
              />
            </div>
            <div className="flex gap-2">
              <Button 
                className="flex-1" 
                variant="destructive"
                onClick={() => selectedRefund && processRefund.mutate({ refundId: selectedRefund.id, approved: true })}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve Refund
              </Button>
              <Button variant="outline" onClick={() => setRefundDialogOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminFinance;