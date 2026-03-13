import { Link } from "wouter";
import { Heart, Mail, MapPin, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-foreground text-background py-16 mt-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <Heart className="h-8 w-8 text-primary" fill="currentColor" />
              <span className="font-display font-bold text-2xl tracking-tight">
                Aditi's <span className="text-primary">Little Paws</span>
              </span>
            </div>
            <p className="text-muted-foreground mb-6">
              A nationwide digital infrastructure connecting citizens, government veterinary departments, and animal lovers to save lives.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6">Quick Links</h4>
            <ul className="space-y-4 text-muted-foreground">
              <li><Link href="/report" className="hover:text-primary transition-colors">Report Emergency</Link></li>
              <li><Link href="/map" className="hover:text-primary transition-colors">Rescue Map</Link></li>
              <li><Link href="/adopt" className="hover:text-primary transition-colors">Adoption Center</Link></li>
              <li><Link href="/volunteer" className="hover:text-primary transition-colors">Join as Volunteer</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6">Government Portals</h4>
            <ul className="space-y-4 text-muted-foreground">
              <li><Link href="/gov/dashboard" className="hover:text-primary transition-colors">Veterinary Login</Link></li>
              <li><Link href="/admin" className="hover:text-primary transition-colors">Admin Portal</Link></li>
              <li><Link href="/hospitals" className="hover:text-primary transition-colors">Hospital Directory</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6">Contact Us</h4>
            <ul className="space-y-4 text-muted-foreground">
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary" />
                <span>1800-120-RESCUE (Toll Free)</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary" />
                <span>help@animalrescueindia.gov.in</span>
              </li>
              <li className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-primary" />
                <span>New Delhi, India</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Animal Rescue India Initiative. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
