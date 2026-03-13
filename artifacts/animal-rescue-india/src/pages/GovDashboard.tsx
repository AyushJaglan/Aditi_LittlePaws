import { useState } from "react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { useGetCases, useGetReports } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Shield, Search, CheckCircle } from "lucide-react";
import { useUpdateReportMutation, useUpdateCaseMutation } from "@/hooks/use-api-wrappers";
import { useToast } from "@/hooks/use-toast";

export default function GovDashboard() {
  const [auth, setAuth] = useState(false);
  const [password, setPassword] = useState("");
  
  const { data: cases } = useGetCases();
  const { data: reports } = useGetReports({ status: "Reported" }); // New incoming reports
  
  const updateReport = useUpdateReportMutation();
  const updateCase = useUpdateCaseMutation();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "govt123") setAuth(true);
    else toast({ title: "Invalid Credentials", variant: "destructive" });
  };

  const handleAssignVet = async (reportId: number) => {
    await updateReport.mutateAsync({ id: reportId, data: { status: "Assigned", assignedVetId: 1 } });
    toast({ title: "Case Assigned to District Vet" });
  };

  const handleUpdateCaseStatus = async (caseId: number, status: string) => {
    await updateCase.mutateAsync({ id: caseId, data: { status } });
    toast({ title: "Treatment Status Updated" });
  };

  if (!auth) {
    return (
      <PageWrapper className="flex items-center justify-center bg-muted/30">
        <Card className="w-full max-w-md p-8 rounded-3xl shadow-xl">
          <div className="text-center mb-8">
            <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
            <h1 className="text-2xl font-bold font-display">Government Portal</h1>
            <p className="text-muted-foreground text-sm">Authorized Veterinary Departments Only</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <Input type="password" placeholder="Enter Access Code (govt123)" value={password} onChange={(e) => setPassword(e.target.value)} className="h-12" />
            <Button type="submit" className="w-full h-12 text-lg">Secure Login</Button>
          </form>
        </Card>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper className="bg-background">
      <div className="border-b border-border bg-card pb-4 pt-8 px-8">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">District Veterinary Dashboard</h1>
            <p className="text-muted-foreground">Manage incoming SOS alerts and active treatment records.</p>
          </div>
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 px-4 py-2 text-sm">
            Session Active: Dept. of Animal Husbandry
          </Badge>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
        {/* Section: Incoming SOS Alerts */}
        <div>
          <h2 className="text-xl font-bold mb-4 flex items-center text-destructive">
            <span className="relative flex h-3 w-3 mr-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-destructive"></span></span>
            Incoming Emergency SOS Reports
          </h2>
          <Card className="rounded-2xl shadow-sm border-destructive/20 overflow-hidden">
            <Table>
              <TableHeader className="bg-muted">
                <TableRow>
                  <TableHead>Case ID</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Animal</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports?.reports?.length === 0 ? (
                  <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No pending SOS alerts.</TableCell></TableRow>
                ) : (
                  reports?.reports?.map(report => (
                    <TableRow key={report.id}>
                      <TableCell className="font-medium">{report.caseId}</TableCell>
                      <TableCell>{report.locationAddress}</TableCell>
                      <TableCell>{report.animalType}</TableCell>
                      <TableCell><Badge variant="destructive">{report.severity}</Badge></TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" onClick={() => handleAssignVet(report.id)}>Dispatch Ambulance & Assign Vet</Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Card>
        </div>

        {/* Section: Active Treatment Cases */}
        <div>
          <h2 className="text-xl font-bold mb-4">Active Treatment Records</h2>
          <Card className="rounded-2xl shadow-sm overflow-hidden border-border">
            <Table>
              <TableHeader className="bg-muted">
                <TableRow>
                  <TableHead>Case ID</TableHead>
                  <TableHead>Animal</TableHead>
                  <TableHead>Assigned Hospital</TableHead>
                  <TableHead>Current Status</TableHead>
                  <TableHead className="text-right">Update Record</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cases?.cases?.map(c => (
                  <TableRow key={c.id}>
                    <TableCell className="font-medium">{c.caseId}</TableCell>
                    <TableCell>{c.animalType}</TableCell>
                    <TableCell>{c.hospitalName || "Govt Vet Hospital"}</TableCell>
                    <TableCell><Badge variant="outline">{c.status}</Badge></TableCell>
                    <TableCell className="text-right">
                      {c.status !== 'Recovered' && (
                        <Button size="sm" variant="outline" className="text-success hover:text-success hover:bg-success/10 border-success/30" onClick={() => handleUpdateCaseStatus(c.id, 'Recovered')}>
                          <CheckCircle className="h-4 w-4 mr-1" /> Mark Recovered
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>
      </div>
    </PageWrapper>
  );
}
