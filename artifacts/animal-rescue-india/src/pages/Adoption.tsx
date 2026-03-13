import { useState } from "react";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { useGetAnimals } from "@workspace/api-client-react";
import { useCreateAdoptionMutation } from "@/hooks/use-api-wrappers";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Heart, Info, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const applySchema = z.object({
  applicantName: z.string().min(2),
  applicantEmail: z.string().email(),
  applicantPhone: z.string().min(10),
  applicantAddress: z.string().min(5),
  applicantDistrict: z.string().min(2),
  applicantState: z.string().min(2),
  housingType: z.string().min(1),
  hasOtherPets: z.boolean(),
  hasChildren: z.boolean(),
  reasonForAdoption: z.string().min(10),
});

export default function Adoption() {
  const { data, isLoading } = useGetAnimals({ limit: 20 });
  const [selectedAnimal, setSelectedAnimal] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const applyMutation = useCreateAdoptionMutation();

  const form = useForm<z.infer<typeof applySchema>>({
    resolver: zodResolver(applySchema),
    defaultValues: {
      hasOtherPets: false,
      hasChildren: false,
    }
  });

  const onSubmit = async (values: z.infer<typeof applySchema>) => {
    if (!selectedAnimal) return;
    try {
      await applyMutation.mutateAsync({
        data: {
          ...values,
          animalId: selectedAnimal
        }
      });
      setIsDialogOpen(false);
      form.reset();
      toast({
        title: "Application Submitted Successfully",
        description: "The shelter will contact you soon for verification.",
      });
    } catch {
      toast({ title: "Error", description: "Could not submit application.", variant: "destructive" });
    }
  };

  return (
    <PageWrapper className="bg-background">
      {/* Header */}
      <div className="bg-primary/5 border-b border-primary/10 py-16">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <Heart className="h-12 w-12 text-primary mx-auto mb-4" fill="currentColor" />
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">Give Them a Second Chance</h1>
          <p className="text-lg text-muted-foreground">
            All animals listed here have been rescued, treated by government vets, fully vaccinated, and are ready for a loving forever home.
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="container mx-auto px-4 py-16">
        {isLoading ? (
          <div className="flex justify-center py-20"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {data?.animals?.map((animal) => (
              <Card key={animal.id} className="rounded-3xl overflow-hidden border-border/50 shadow-md hover:shadow-xl transition-all duration-300 group bg-card">
                <div className="relative aspect-[4/3] bg-muted overflow-hidden">
                  <img 
                    src={animal.photoUrl || "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=500&q=80"} 
                    alt={animal.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-foreground">
                    {animal.age} • {animal.gender}
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-2xl font-bold font-display">{animal.name}</h3>
                    <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                      {animal.species}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 mb-6 text-sm text-muted-foreground">
                    <p className="flex items-center"><Info className="h-3 w-3 mr-2 text-primary" /> {animal.breed || "Mixed Breed"}</p>
                    <p className="flex items-center"><Heart className="h-3 w-3 mr-2 text-primary" /> Vaccinated: {animal.vaccinationStatus}</p>
                    <p className="flex items-center"><Info className="h-3 w-3 mr-2 text-primary" /> Shelter: {animal.shelterDistrict}</p>
                  </div>

                  <Dialog open={isDialogOpen && selectedAnimal === animal.id} onOpenChange={(open) => {
                    setIsDialogOpen(open);
                    if(open) setSelectedAnimal(animal.id);
                  }}>
                    <DialogTrigger asChild>
                      <Button className="w-full h-12 rounded-xl font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
                        Apply to Adopt
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl">
                      <DialogHeader>
                        <DialogTitle className="text-2xl font-display">Adoption Application for {animal.name}</DialogTitle>
                      </DialogHeader>
                      <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-4">
                          <div className="grid grid-cols-2 gap-4">
                            <FormField control={form.control} name="applicantName" render={({ field }) => (
                              <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input {...field}/></FormControl></FormItem>
                            )}/>
                            <FormField control={form.control} name="applicantPhone" render={({ field }) => (
                              <FormItem><FormLabel>Phone</FormLabel><FormControl><Input {...field}/></FormControl></FormItem>
                            )}/>
                            <FormField control={form.control} name="applicantEmail" render={({ field }) => (
                              <FormItem><FormLabel>Email</FormLabel><FormControl><Input {...field}/></FormControl></FormItem>
                            )}/>
                            <FormField control={form.control} name="housingType" render={({ field }) => (
                              <FormItem><FormLabel>Housing</FormLabel>
                                <Select onValueChange={field.onChange}>
                                  <FormControl><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger></FormControl>
                                  <SelectContent>
                                    <SelectItem value="Apartment">Apartment</SelectItem>
                                    <SelectItem value="Independent House">Independent House</SelectItem>
                                  </SelectContent>
                                </Select>
                              </FormItem>
                            )}/>
                          </div>
                          
                          <FormField control={form.control} name="applicantAddress" render={({ field }) => (
                            <FormItem><FormLabel>Full Address</FormLabel><FormControl><Input {...field}/></FormControl></FormItem>
                          )}/>

                          <div className="grid grid-cols-2 gap-4">
                             <FormField control={form.control} name="applicantState" render={({ field }) => (
                              <FormItem><FormLabel>State</FormLabel><FormControl><Input {...field}/></FormControl></FormItem>
                            )}/>
                            <FormField control={form.control} name="applicantDistrict" render={({ field }) => (
                              <FormItem><FormLabel>District</FormLabel><FormControl><Input {...field}/></FormControl></FormItem>
                            )}/>
                          </div>

                          <FormField control={form.control} name="reasonForAdoption" render={({ field }) => (
                            <FormItem><FormLabel>Why do you want to adopt?</FormLabel><FormControl><Input {...field}/></FormControl></FormItem>
                          )}/>

                          <Button type="submit" className="w-full h-12" disabled={applyMutation.isPending}>
                            {applyMutation.isPending ? "Submitting..." : "Submit Application"}
                          </Button>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
