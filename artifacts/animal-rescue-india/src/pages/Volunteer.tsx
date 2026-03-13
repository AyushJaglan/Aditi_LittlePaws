import { PageWrapper } from "@/components/layout/PageWrapper";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRegisterVolunteerMutation } from "@/hooks/use-api-wrappers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Users, HeartHandshake } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  type: z.string().min(1),
  organizationName: z.string().optional(),
  district: z.string().min(2),
  state: z.string().min(2),
  skills: z.string().optional(),
  vehicleAvailable: z.boolean().default(false),
});

export default function Volunteer() {
  const { toast } = useToast();
  const registerMutation = useRegisterVolunteerMutation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { vehicleAvailable: false }
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await registerMutation.mutateAsync({ data: values });
      toast({ title: "Registration Successful", description: "Welcome to the Animal Rescue India network!" });
      form.reset();
    } catch {
      toast({ title: "Error", description: "Failed to register.", variant: "destructive" });
    }
  };

  return (
    <PageWrapper className="bg-muted/20 py-16">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-bold mb-6">
              <HeartHandshake className="h-4 w-4" /> Become a Hero
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 leading-tight">
              Join the Largest Rescue Network in India
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Whether you are an individual wanting to help transport injured animals, or an NGO providing shelter, register here to receive official SOS alerts from the government reporting system.
            </p>
            <div className="space-y-6">
              <div className="flex gap-4 items-start">
                <div className="bg-background p-3 rounded-xl shadow-sm"><Users className="h-6 w-6 text-primary" /></div>
                <div>
                  <h3 className="font-bold text-lg">Receive Local Alerts</h3>
                  <p className="text-muted-foreground text-sm">Get notified when an animal is reported injured in your district.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-3xl shadow-xl border border-border/50 p-8">
            <h2 className="text-2xl font-bold mb-6 font-display">Registration Form</h2>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="name" render={({ field }) => (
                    <FormItem><FormLabel>Full Name / Rep Name</FormLabel><FormControl><Input {...field}/></FormControl></FormItem>
                  )}/>
                  <FormField control={form.control} name="phone" render={({ field }) => (
                    <FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input {...field}/></FormControl></FormItem>
                  )}/>
                </div>

                <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem><FormLabel>Email Address</FormLabel><FormControl><Input {...field}/></FormControl></FormItem>
                )}/>

                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="type" render={({ field }) => (
                    <FormItem><FormLabel>I am registering as</FormLabel>
                      <Select onValueChange={field.onChange}>
                        <FormControl><SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger></FormControl>
                        <SelectContent>
                          <SelectItem value="Individual">Individual Volunteer</SelectItem>
                          <SelectItem value="NGO">NGO / Shelter</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}/>
                  <FormField control={form.control} name="organizationName" render={({ field }) => (
                    <FormItem><FormLabel>NGO Name (If applicable)</FormLabel><FormControl><Input {...field}/></FormControl></FormItem>
                  )}/>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="state" render={({ field }) => (
                    <FormItem><FormLabel>State</FormLabel><FormControl><Input {...field}/></FormControl></FormItem>
                  )}/>
                  <FormField control={form.control} name="district" render={({ field }) => (
                    <FormItem><FormLabel>District</FormLabel><FormControl><Input {...field}/></FormControl></FormItem>
                  )}/>
                </div>

                <FormField control={form.control} name="vehicleAvailable" render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-xl border p-4 shadow-sm bg-muted/20">
                    <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>I have a vehicle for transport</FormLabel>
                      <p className="text-xs text-muted-foreground">Crucial for emergency animal ambulance assistance.</p>
                    </div>
                  </FormItem>
                )}/>

                <Button type="submit" className="w-full h-12 text-lg font-bold rounded-xl" disabled={registerMutation.isPending}>
                  {registerMutation.isPending ? "Registering..." : "Complete Registration"}
                </Button>
              </form>
            </Form>
          </div>

        </div>
      </div>
    </PageWrapper>
  );
}
