import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trophy } from "lucide-react";
import { format } from "date-fns";

const AthleteResults = () => {
  const { user } = useAuth();

  const { data: results, isLoading } = useQuery({
    queryKey: ["athlete-results-all", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("event_results")
        .select("*, events(*)")
        .eq("athlete_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  if (isLoading) return <p className="text-muted-foreground">Loading…</p>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground">My Results</h1>
        <p className="text-muted-foreground mt-1">Your performance history across all events.</p>
      </div>

      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Trophy className="h-5 w-5 text-primary" /> Performance History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!results || results.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4">No results recorded yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event</TableHead>
                  <TableHead>Sport</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.map((r: any) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">{r.events?.title}</TableCell>
                    <TableCell>{r.events?.sport}</TableCell>
                    <TableCell>{r.events?.start_date && format(new Date(r.events.start_date), "MMM d, yyyy")}</TableCell>
                    <TableCell>
                      {r.position ? (
                        <span className={r.position <= 3 ? "text-primary font-bold" : ""}>#{r.position}</span>
                      ) : "—"}
                    </TableCell>
                    <TableCell>{r.score ?? "—"}</TableCell>
                    <TableCell className="text-muted-foreground text-xs">{r.notes ?? "—"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AthleteResults;
