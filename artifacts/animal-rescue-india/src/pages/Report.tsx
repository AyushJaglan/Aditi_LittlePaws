import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCreateReportMutation } from "@/hooks/use-api-wrappers";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Camera, MapPin, AlertTriangle, Loader2 } from "lucide-react";
import { useLocation } from "wouter";

const formSchema = z.object({
  reporterName: z.string().min(2, "Name is required"),
  reporterPhone: z.string().min(10, "Valid phone number required"),
  reporterEmail: z.string().email("Valid email required").optional().or(z.literal('')),
  animalType: z.string().min(1, "Animal type is required"),
  description: z.string().min(10, "Please provide some details about the injury"),
  severity: z.string().min(1, "Severity is required"),
  locationAddress: z.string().min(5, "Address is required"),
  district: z.string().min(2, "District is required"),
  state: z.string().min(2, "State is required"),
  latitude: z.number().default(20.5937),
  longitude: z.number().default(78.9629),
});

const STATES = [
  "Maharashtra", "Karnataka", "Tamil Nadu", "Delhi", "Gujarat", "Rajasthan", "Uttar Pradesh", "West Bengal"
];

export default function Report() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const createReport = useCreateReportMutation();
  const [isLocating, setIsLocating] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      reporterName: "",
      reporterPhone: "",
      reporterEmail: "",
      animalType: "",
      description: "",
      severity: "",
      locationAddress: "",
      district: "",
      state: "",
      latitude: 0,
      longitude: 0,
    },
  });

  const handleGetLocation = () => {
    setIsLocating(true);
    // Simulate GPS fetch
    setTimeout(() => {
      form.setValue("latitude", 19.0760);
      form.setValue("longitude", 72.8777);
      form.setValue("locationAddress", "Linking Road, Mumbai (Auto-detected)");
      form.setValue("district", "Mumbai");
      form.setValue("state", "Maharashtra");
      setIsLocating(false);
      toast({ title: "Location Acquired", description: "GPS coordinates saved." });
    }, 1500);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const res = await createReport.mutateAsync({ 
        data: {
          ...values,
          photoUrl: photoPreview || "https://images.unsplash.com/photo-1541364983171-a8ba01e95cfc?w=500&q=80", // placeholder if none
        }
      });
      toast({
        title: "Emergency Report Submitted!",
        description: `Case ID: ${res.caseId}. Authorities have been notified.`,
        variant: "default",
      });
      setLocation(`/cases/${res.id}`);
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <PageWrapper className="bg-muted/30 py-12">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="bg-destructive/10 border-l-4 border-destructive p-4 rounded-r-lg mb-8 flex items-start gap-4">
          <AlertTriangle className="h-6 w-6 text-destructive shrink-0 mt-1" />
          <div>
            <h3 className="font-bold text-destructive text-lg">URGENT: Emergency Reporting</h3>
            <p className="text-destructive/80 text-sm">Please only use this form for animals requiring immediate medical attention. Your report directly alerts government veterinary services.</p>
          </div>
        </div>

        <div className="bg-card rounded-3xl shadow-xl border border-border/50 overflow-hidden">
          <div className="bg-foreground text-background p-6 text-center">
            <h1 className="text-2xl font-bold font-display">Report Injured Animal</h1>
            <p className="text-muted">Fill out details below to dispatch help instantly.</p>
          </div>

          <div className="p-6 md:p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                
                {/* Section 1: Animal Details */}
                <div className="space-y-4">
                  <h3 className="font-bold text-lg border-b pb-2">1. Animal & Injury Details</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="animalType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Type of Animal *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-12 rounded-xl"><SelectValue placeholder="Select animal" /></SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Dog">Dog</SelectItem>
                              <SelectItem value="Cat">Cat</SelectItem>
                              <SelectItem value="Cow/Cattle">Cow / Cattle</SelectItem>
                              <SelectItem value="Bird">Bird</SelectItem>
                              <SelectItem value="Wildlife">Wildlife</SelectItem>
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="severity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Severity of Injury *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-12 rounded-xl"><SelectValue placeholder="Select severity" /></SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Minor">Minor (Needs First Aid)</SelectItem>
                              <SelectItem value="Severe">Severe (Needs Transport/Vet)</SelectItem>
                              <SelectItem value="Critical">Critical (Life Threatening)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description of Injury *</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Visible wounds? Is it bleeding? Can it stand?" 
                            className="rounded-xl min-h-[100px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Mock Photo Upload */}
                  <div className="pt-2">
                    <FormLabel className="block mb-2">Upload Photo/Video (Crucial for Vets)</FormLabel>
                    <div 
                      className="border-2 border-dashed border-border rounded-2xl p-8 flex flex-col items-center justify-center text-muted-foreground hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => setPhotoPreview("https://images.unsplash.com/photo-1541364983171-a8ba01e95cfc?w=500&q=80")}
                    >
                      {photoPreview ? (
                        <div className="relative w-full aspect-video rounded-xl overflow-hidden">
                          <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <>
                          <Camera className="h-10 w-10 mb-2 opacity-50" />
                          <p className="font-medium">Tap to take a photo</p>
                          <p className="text-xs mt-1">or browse gallery</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Section 2: Location */}
                <div className="space-y-4 pt-4">
                  <h3 className="font-bold text-lg border-b pb-2 flex justify-between items-center">
                    <span>2. Exact Location</span>
                    <Button type="button" variant="outline" size="sm" onClick={handleGetLocation} disabled={isLocating} className="rounded-full">
                      {isLocating ? <Loader2 className="h-4 w-4 animate-spin mr-2"/> : <MapPin className="h-4 w-4 mr-2"/>}
                      Auto-detect GPS
                    </Button>
                  </h3>
                  
                  <FormField
                    control={form.control}
                    name="locationAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Street Address / Landmark *</FormLabel>
                        <FormControl>
                          <Input className="h-12 rounded-xl" placeholder="E.g., Near Apollo Hospital, Main Road..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State *</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-12 rounded-xl"><SelectValue placeholder="Select state" /></SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {STATES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="district"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>District *</FormLabel>
                          <Input className="h-12 rounded-xl" placeholder="Enter district" {...field} />
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Section 3: Reporter */}
                <div className="space-y-4 pt-4">
                  <h3 className="font-bold text-lg border-b pb-2">3. Your Contact Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="reporterName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name *</FormLabel>
                          <FormControl><Input className="h-12 rounded-xl" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="reporterPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number *</FormLabel>
                          <FormControl><Input className="h-12 rounded-xl" type="tel" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-14 text-lg font-bold rounded-xl bg-destructive hover:bg-destructive/90 shadow-lg"
                  disabled={createReport.isPending}
                >
                  {createReport.isPending ? "Submitting Emergency Report..." : "Submit Emergency Report"}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
