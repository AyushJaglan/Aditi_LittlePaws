import { useParams } from "wouter";
import { useGetReport } from "@workspace/api-client-react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { MapPin, Activity, Stethoscope, User, Calendar, FileText } from "lucide-react";

export default function CaseDetail() {
  const { id } = useParams();
  const { data: report, isLoading } = useGetReport(Number(id));

  if (isLoading) return <div className="h-screen flex items-center justify-center">Loading case...</div>;
  if (!report) return <div className="h-screen flex items-center justify-center">Case not found.</div>;

  return (
    <PageWrapper className="bg-muted/10 py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex flex-col md:flex-row gap-8 mb-8">
          
          {/* Main Info */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <Badge className="bg-foreground text-background hover:bg-foreground rounded-md px-3 py-1">
                Case {report.caseId}
              </Badge>
              <Badge variant={report.severity === 'Critical' ? 'destructive' : 'default'} className="rounded-md px-3 py-1">
                {report.severity} Severity
              </Badge>
              <Badge variant="outline" className="rounded-md px-3 py-1 border-primary text-primary bg-primary/5">
                {report.status}
              </Badge>
            </div>
            
            <h1 className="text-4xl font-display font-bold mb-4">{report.animalType} Rescue</h1>
            
            <p className="text-lg text-muted-foreground mb-6">
              {report.description}
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="flex items-start gap-3 p-4 bg-card rounded-2xl border border-border shadow-sm">
                <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold">Location</p>
                  <p className="text-sm text-muted-foreground">{report.locationAddress}, {report.district}, {report.state}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-card rounded-2xl border border-border shadow-sm">
                <Calendar className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold">Reported On</p>
                  <p className="text-sm text-muted-foreground">{format(new Date(report.createdAt), 'PPpp')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Photo */}
          <div className="w-full md:w-1/3">
            <div className="aspect-square rounded-3xl overflow-hidden shadow-lg border-4 border-white bg-white">
              <img 
                src={report.photoUrl || "https://images.unsplash.com/photo-1541364983171-a8ba01e95cfc"} 
                alt="Animal"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Timeline / Treatment Record */}
        <div className="bg-card rounded-3xl p-8 border border-border shadow-sm">
          <h2 className="text-2xl font-bold font-display mb-8 flex items-center gap-2">
            <Activity className="h-6 w-6 text-primary" /> Official Treatment Record
          </h2>

          <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
            
            {/* Step 1: Reported */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-background bg-primary text-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-md relative z-10">
                <User className="h-4 w-4" />
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-2xl border border-border bg-background shadow-sm">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-bold">Citizen Report</h4>
                  <time className="text-xs text-muted-foreground">{format(new Date(report.createdAt), 'MMM d, h:mm a')}</time>
                </div>
                <p className="text-sm text-muted-foreground">Reported by {report.reporterName}. Local authorities notified automatically.</p>
              </div>
            </div>

            {/* Step 2: Vet Assigned (Mock Data based on status) */}
            {(report.status !== 'Reported') && (
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-background bg-secondary text-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-md relative z-10">
                  <Stethoscope className="h-4 w-4" />
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-2xl border border-border bg-background shadow-sm">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-bold">Govt Vet Assigned</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Dr. Sharma from District Veterinary Hospital assigned to case. Ambulance dispatched.
                  </p>
                </div>
              </div>
            )}

            {/* Step 3: Treatment (Mock Data) */}
            {['In Treatment', 'Recovered'].includes(report.status) && (
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-background bg-accent text-accent-foreground shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-md relative z-10">
                  <FileText className="h-4 w-4" />
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-2xl border border-border bg-background shadow-sm">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-bold">Medical Treatment</h4>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {report.treatmentNotes || "First aid provided, wound cleaned and dressed. Antibiotics administered."}
                  </p>
                  {report.medicalReport && (
                    <a href="#" className="inline-flex items-center text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded hover:bg-primary/20">
                      View Medical Report.pdf
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
