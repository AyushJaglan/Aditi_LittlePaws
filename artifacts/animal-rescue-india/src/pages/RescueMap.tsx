import { useState } from "react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { useGetReports } from "@workspace/api-client-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";

export default function RescueMap() {
  const [filterStatus, setFilterStatus] = useState<string>("");
  const { data, isLoading } = useGetReports(filterStatus ? { status: filterStatus } : {});

  return (
    <PageWrapper className="bg-muted/20">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">Live Rescue Cases</h1>
            <p className="text-muted-foreground">Tracking injured animals reported across the nation.</p>
          </div>
          <div className="w-full md:w-64">
            <Select onValueChange={setFilterStatus} value={filterStatus}>
              <SelectTrigger className="bg-background rounded-xl h-12">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cases</SelectItem>
                <SelectItem value="Reported">Reported</SelectItem>
                <SelectItem value="Assigned">Assigned to Vet</SelectItem>
                <SelectItem value="In Treatment">In Treatment</SelectItem>
                <SelectItem value="Recovered">Recovered</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Map Placeholder - using visual grid instead of actual map to guarantee render without API keys */}
        <div className="bg-card rounded-3xl p-4 mb-12 border border-border shadow-sm h-[300px] flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80')] bg-cover bg-center relative overflow-hidden">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
          <div className="relative z-10 text-center">
            <MapPin className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-bold">Interactive Map View</h3>
            <p className="text-muted-foreground mt-2">Showing {data?.total || 0} active cases nationwide.</p>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3,4,5,6].map(i => (
              <Card key={i} className="h-64 animate-pulse bg-muted rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data?.reports?.map((report) => (
              <Card key={report.id} className="rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-border group">
                <div className="relative h-48 bg-muted">
                  <img 
                    src={report.photoUrl || "https://images.unsplash.com/photo-1541364983171-a8ba01e95cfc?w=500&q=80"} 
                    alt="Reported animal"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <Badge variant={report.severity === 'Critical' ? 'destructive' : report.severity === 'Severe' ? 'default' : 'secondary'} className="shadow-md font-bold">
                      {report.severity}
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4">
                    <Badge variant="outline" className="bg-background/90 backdrop-blur-sm shadow-md border-0">
                      {report.status}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-lg font-display">{report.animalType} Injury</h3>
                      <p className="text-sm text-muted-foreground flex items-center mt-1">
                        <MapPin className="h-3 w-3 mr-1" /> {report.district}, {report.state}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-6 h-10">
                    {report.description}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div className="text-xs text-muted-foreground flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {format(new Date(report.createdAt), 'MMM d, h:mm a')}
                    </div>
                    <Link href={`/cases/${report.id}`} className="text-primary text-sm font-bold flex items-center hover:underline">
                      View Case <ArrowRight className="h-4 w-4 ml-1" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
            {data?.reports?.length === 0 && (
              <div className="col-span-full py-20 text-center text-muted-foreground">
                <ShieldAlert className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No cases found for the selected filters.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
