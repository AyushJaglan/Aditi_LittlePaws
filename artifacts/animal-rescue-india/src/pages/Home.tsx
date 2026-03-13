import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShieldAlert, Heart, Stethoscope, MapPin, CheckCircle } from "lucide-react";
import { useGetStats } from "@workspace/api-client-react";
import { PageWrapper } from "@/components/layout/PageWrapper";

export default function Home() {
  const { data: stats } = useGetStats();

  return (
    <PageWrapper>
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/20 z-10" />
          <img 
            src={`${import.meta.env.BASE_URL}images/hero-dogs.png`} 
            alt="Happy rescued animals" 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="container mx-auto px-4 relative z-20">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 text-secondary font-semibold mb-6">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-secondary"></span>
              </span>
              Nationwide Animal Emergency Response
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
              Don't Walk Past. <br/>
              <span className="text-primary">Save a Life</span> Today.
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl">
              Report injured stray animals instantly. Our system connects your report directly to government veterinary departments and rescue NGOs across India.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/report">
                <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-lg font-bold bg-destructive hover:bg-destructive/90 text-white rounded-full shadow-lg shadow-destructive/25 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <ShieldAlert className="mr-2 h-6 w-6" /> Report Injured Animal
                </Button>
              </Link>
              <Link href="/adopt">
                <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 text-lg font-bold rounded-full hover:bg-primary/5 hover:text-primary border-2 border-border hover:border-primary transition-all duration-300">
                  <Heart className="mr-2 h-5 w-5" /> Adopt a Pet
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white relative z-30 -mt-10 mx-4 md:mx-auto max-w-7xl rounded-3xl shadow-xl border border-border/50">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 px-8">
          <div className="text-center">
            <h3 className="text-4xl font-display font-bold text-primary mb-2">
              {stats?.totalReports ? `${stats.totalReports}+` : "12K+"}
            </h3>
            <p className="text-muted-foreground font-medium">Animals Reported</p>
          </div>
          <div className="text-center">
            <h3 className="text-4xl font-display font-bold text-secondary mb-2">
              {stats?.animalsRescued ? `${stats.animalsRescued}+` : "8.5K+"}
            </h3>
            <p className="text-muted-foreground font-medium">Successfully Rescued</p>
          </div>
          <div className="text-center">
            <h3 className="text-4xl font-display font-bold text-accent mb-2">
              {stats?.registeredVets ? `${stats.registeredVets}+` : "450+"}
            </h3>
            <p className="text-muted-foreground font-medium">Govt Vets Active</p>
          </div>
          <div className="text-center">
            <h3 className="text-4xl font-display font-bold text-foreground mb-2">
              {stats?.districtsCovered ? stats.districtsCovered : "120"}
            </h3>
            <p className="text-muted-foreground font-medium">Districts Covered</p>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How The Platform Works</h2>
            <p className="text-muted-foreground">A transparent, real-time workflow ensuring every reported animal gets medical attention.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-12 left-1/6 right-1/6 h-0.5 bg-border -z-10" />

            <div className="bg-card p-8 rounded-3xl shadow-sm border border-border relative text-center group hover:shadow-md transition-shadow">
              <div className="w-20 h-20 mx-auto bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <MapPin className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-bold mb-3">1. You Report</h3>
              <p className="text-muted-foreground">Upload a photo, description, and GPS pin of the injured animal in less than 30 seconds.</p>
            </div>

            <div className="bg-card p-8 rounded-3xl shadow-sm border border-border relative text-center group hover:shadow-md transition-shadow">
              <div className="w-20 h-20 mx-auto bg-secondary/10 text-secondary rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Stethoscope className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-bold mb-3">2. Vets Assigned</h3>
              <p className="text-muted-foreground">Our system instantly alerts the nearest Govt Vet Hospital and registered volunteers.</p>
            </div>

            <div className="bg-card p-8 rounded-3xl shadow-sm border border-border relative text-center group hover:shadow-md transition-shadow">
              <div className="w-20 h-20 mx-auto bg-success/10 text-success rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <CheckCircle className="h-10 w-10" />
              </div>
              <h3 className="text-xl font-bold mb-3">3. Transparent Care</h3>
              <p className="text-muted-foreground">Track the rescue status, medical reports, and recovery photos uploaded by the doctor.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&q=80')] opacity-10 mix-blend-overlay object-cover" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Make a Difference?</h2>
          <p className="text-xl text-primary-foreground/80 mb-10 max-w-2xl mx-auto">
            Whether you want to join rescue missions, foster an animal, or help with transport, your local community needs you.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/volunteer">
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100 rounded-full h-14 px-8 font-bold text-lg">
                Join as Volunteer
              </Button>
            </Link>
            <Link href="/store">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 rounded-full h-14 px-8 font-bold text-lg">
                Support via Store
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}
