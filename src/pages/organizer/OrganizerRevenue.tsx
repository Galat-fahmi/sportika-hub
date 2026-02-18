import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Wallet,
  CreditCard,
  Clock,
  CheckCircle,
  AlertCircle,
  Download,
  Calendar,
  Trophy,
  ArrowUpRight,
  ArrowDownRight,
  Banknote,
  Receipt,
  FileSpreadsheet
} from "lucide-react";
import { format } from "date-fns";

interface RevenueEvent {
  id: string;
  title: string;
  sport: string;
  start_date: string;
  registration_fee: number;
  total_registrations: number;
  paid_registrations: number;
  pending_registrations: number;
  total_revenue: number;
  paid_revenue: number;
  pending_revenue: number;
  commission: number;
  net_revenue: number;
}

interface Transaction {
  id: string;
  date: string;
  athlete_name: string;
  event_name: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
  payment_method: string;
  transaction_id: string;
}

const OrganizerRevenue = () => {
  const { user } = useAuth();
  const [selectedEvent, setSelectedEvent] = useState<string>("all");
  const [timeRange, setTimeRange] = useState<string>("all");

  const { data: events } = useQuery({
    queryKey: ["organizer-revenue-events", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("organizer_id", user!.id)
        .order("start_date", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: registrations } = useQuery({
    queryKey: ["organizer-revenue-registrations", user?.id],
    queryFn: async () => {
      if (!events || events.length === 0) return [];
      const eventIds = events.map((e) => e.id);
      const { data, error } = await supabase
        .from("event_registrations")
        .select("*, events(title, sport, start_date, registration_fee), profiles:athlete_id(full_name)")
        .in("event_id", eventIds)
        .order("registered_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!events && events.length > 0,
  });

  // Calculate revenue data per event
  const revenueData: RevenueEvent[] = useMemo(() => {
    if (!events || !registrations) return [];
    
    return events.map(event => {
      const eventRegs = registrations.filter((r: any) => r.event_id === event.id);
      const paidRegs = eventRegs.filter((r: any) => r.payment_status === 'paid');
      const pendingRegs = eventRegs.filter((r: any) => r.payment_status === 'pending');
      
      const fee = Number(event.registration_fee || 0);
      const totalRevenue = eventRegs.length * fee;
      const paidRevenue = paidRegs.length * fee;
      const pendingRevenue = pendingRegs.length * fee;
      const commission = paidRevenue * 0.1; // 10% commission
      const netRevenue = paidRevenue - commission;

      return {
        id: event.id,
        title: event.title,
        sport: event.sport,
        start_date: event.start_date,
        registration_fee: fee,
        total_registrations: eventRegs.length,
        paid_registrations: paidRegs.length,
        pending_registrations: pendingRegs.length,
        total_revenue: totalRevenue,
        paid_revenue: paidRevenue,
        pending_revenue: pendingRevenue,
        commission: commission,
        net_revenue: netRevenue,
      };
    });
  }, [events, registrations]);

  // Generate transaction history
  const transactions: Transaction[] = useMemo(() => {
    if (!registrations) return [];
    return registrations
      .filter((r: any) => r.payment_status === 'paid')
      .map((r: any, index: number) => ({
        id: r.id,
        date: r.registered_at,
        athlete_name: r.profiles?.full_name || 'Unknown',
        event_name: r.events?.title,
        amount: Number(r.events?.registration_fee || 0),
        status: r.payment_status,
        payment_method: 'Credit Card',
        transaction_id: `TXN-${Date.now()}-${index}`,
      }));
  }, [registrations]);

  // Filter data based on selections
  const filteredRevenueData = useMemo(() => {
    if (selectedEvent === "all") return revenueData;
    return revenueData.filter(e => e.id === selectedEvent);
  }, [revenueData, selectedEvent]);

  // Calculate totals
  const totals = useMemo(() => {
    return filteredRevenueData.reduce((acc, event) => ({
      total_revenue: acc.total_revenue + event.total_revenue,
      paid_revenue: acc.paid_revenue + event.paid_revenue,
      pending_revenue: acc.pending_revenue + event.pending_revenue,
      commission: acc.commission + event.commission,
      net_revenue: acc.net_revenue + event.net_revenue,
      total_registrations: acc.total_registrations + event.total_registrations,
      paid_registrations: acc.paid_registrations + event.paid_registrations,
      pending_registrations: acc.pending_registrations + event.pending_registrations,
    }), {
      total_revenue: 0,
      paid_revenue: 0,
      pending_revenue: 0,
      commission: 0,
      net_revenue: 0,
      total_registrations: 0,
      paid_registrations: 0,
      pending_registrations: 0,
    });
  }, [filteredRevenueData]);

  const exportToCSV = () => {
    const headers = ["Event", "Date", "Registrations", "Paid", "Pending", "Total Revenue", "Paid Revenue", "Commission", "Net Revenue"];
    const rows = filteredRevenueData.map(e => [
      e.title,
      format(new Date(e.start_date), "yyyy-MM-dd"),
      e.total_registrations,
      e.paid_registrations,
      e.pending_registrations,
      e.total_revenue,
      e.paid_revenue,
      e.commission,
      e.net_revenue,
    ]);
    
    const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `revenue-report-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast({ title: "Revenue report exported" });
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-500/20 text-green-600"><CheckCircle className="h-3 w-3 mr-1" /> Paid</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500/20 text-yellow-600"><Clock className="h-3 w-3 mr-1" /> Pending</Badge>;
      case 'failed':
        return <Badge className="bg-red-500/20 text-red-600"><AlertCircle className="h-3 w-3 mr-1" /> Failed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground">Revenue Tracking</h1>
          <p className="text-muted-foreground mt-1">Monitor your event revenue and transactions.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={exportToCSV} className="gap-2">
            <FileSpreadsheet className="h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="glass">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-display font-bold">${totals.total_revenue.toLocaleString()}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Paid Revenue</p>
                <p className="text-2xl font-display font-bold text-green-600">${totals.paid_revenue.toLocaleString()}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-display font-bold text-yellow-600">${totals.pending_revenue.toLocaleString()}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center">
                <Clock className="h-5 w-5 text-yellow-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="glass">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Net Revenue</p>
                <p className="text-2xl font-display font-bold text-primary">${totals.net_revenue.toLocaleString()}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Wallet className="h-5 w-5 text-primary" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">After 10% commission</p>
          </CardContent>
        </Card>
      </div>

      {/* Commission Breakdown */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Receipt className="h-5 w-5 text-primary" />
            Commission Breakdown
          </CardTitle>
          <CardDescription>Platform fee structure and payouts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 rounded-lg bg-secondary/50">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="font-medium">Gross Revenue</p>
                  <p className="text-2xl font-bold">${totals.paid_revenue.toLocaleString()}</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">Total paid registrations</p>
            </div>
            <div className="p-4 rounded-lg bg-secondary/50">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center">
                  <Receipt className="h-5 w-5 text-orange-500" />
                </div>
                <div>
                  <p className="font-medium">Platform Commission</p>
                  <p className="text-2xl font-bold text-orange-600">-${totals.commission.toLocaleString()}</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">10% of gross revenue</p>
            </div>
            <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Banknote className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Your Payout</p>
                  <p className="text-2xl font-bold text-primary">${totals.net_revenue.toLocaleString()}</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">Available for withdrawal</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <Select value={selectedEvent} onValueChange={setSelectedEvent}>
          <SelectTrigger className="w-[250px]">
            <Trophy className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by event" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Events</SelectItem>
            {events?.map((e) => (
              <SelectItem key={e.id} value={e.id}>{e.title}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[200px]">
            <Calendar className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="quarter">This Quarter</SelectItem>
            <SelectItem value="year">This Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="events" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="events">Revenue by Event</TabsTrigger>
          <TabsTrigger value="transactions">Transaction History</TabsTrigger>
        </TabsList>

        {/* Revenue by Event */}
        <TabsContent value="events" className="space-y-4">
          <Card className="glass">
            <CardHeader>
              <CardTitle>Revenue Per Event</CardTitle>
              <CardDescription>Detailed breakdown for each event</CardDescription>
            </CardHeader>
            <CardContent>
              {filteredRevenueData.length === 0 ? (
                <div className="text-center py-12">
                  <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                  <p className="text-muted-foreground">No revenue data available.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredRevenueData.map((event) => (
                    <div key={event.id} className="p-4 rounded-lg bg-secondary/50">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium">{event.title}</p>
                            <Badge variant="secondary">{event.sport}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(event.start_date), "MMM d, yyyy")} · ${event.registration_fee} per participant
                          </p>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-right">
                          <div>
                            <p className="text-lg font-bold">{event.total_registrations}</p>
                            <p className="text-xs text-muted-foreground">Registrations</p>
                          </div>
                          <div>
                            <p className="text-lg font-bold text-green-600">${event.paid_revenue.toLocaleString()}</p>
                            <p className="text-xs text-muted-foreground">Paid</p>
                          </div>
                          <div>
                            <p className="text-lg font-bold text-yellow-600">${event.pending_revenue.toLocaleString()}</p>
                            <p className="text-xs text-muted-foreground">Pending</p>
                          </div>
                          <div>
                            <p className="text-lg font-bold text-primary">${event.net_revenue.toLocaleString()}</p>
                            <p className="text-xs text-muted-foreground">Net</p>
                          </div>
                        </div>
                      </div>
                      {event.total_registrations > 0 && (
                        <div className="mt-3">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-muted-foreground">Payment Progress</span>
                            <span>{Math.round((event.paid_registrations / event.total_registrations) * 100)}%</span>
                          </div>
                          <Progress value={(event.paid_registrations / event.total_registrations) * 100} className="h-2" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Transaction History */}
        <TabsContent value="transactions" className="space-y-4">
          <Card className="glass">
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>All payment transactions</CardDescription>
            </CardHeader>
            <CardContent>
              {transactions.length === 0 ? (
                <div className="text-center py-12">
                  <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                  <p className="text-muted-foreground">No transactions yet.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Athlete</TableHead>
                        <TableHead>Event</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Transaction ID</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transactions.map((txn) => (
                        <TableRow key={txn.id}>
                          <TableCell>{format(new Date(txn.date), "MMM d, yyyy")}</TableCell>
                          <TableCell className="font-medium">{txn.athlete_name}</TableCell>
                          <TableCell>{txn.event_name}</TableCell>
                          <TableCell className="font-medium">${txn.amount}</TableCell>
                          <TableCell>{getPaymentStatusBadge(txn.status)}</TableCell>
                          <TableCell className="font-mono text-xs">{txn.transaction_id}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Payout Status */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Banknote className="h-5 w-5 text-primary" />
            Payout Status
          </CardTitle>
          <CardDescription>Your earnings and withdrawal status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 rounded-lg bg-secondary/50">
              <p className="text-sm text-muted-foreground mb-1">Available Balance</p>
              <p className="text-3xl font-display font-bold text-primary">${totals.net_revenue.toLocaleString()}</p>
              <Button className="w-full mt-3" variant="outline">
                Request Withdrawal
              </Button>
            </div>
            <div className="p-4 rounded-lg bg-secondary/50">
              <p className="text-sm text-muted-foreground mb-1">Pending Clearance</p>
              <p className="text-3xl font-display font-bold text-yellow-600">${totals.pending_revenue.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground mt-2">Will be available in 7 days</p>
            </div>
            <div className="p-4 rounded-lg bg-secondary/50">
              <p className="text-sm text-muted-foreground mb-1">Total Payouts</p>
              <p className="text-3xl font-display font-bold text-green-600">$0</p>
              <p className="text-xs text-muted-foreground mt-2">No withdrawals yet</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrganizerRevenue;