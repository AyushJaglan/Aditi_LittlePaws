import { Link, useLocation } from "wouter";
import { PawPrint, Map, ShoppingBag, Users, ShieldAlert, Menu, X, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "/", icon: PawPrint },
    { name: "Rescue Map", href: "/map", icon: Map },
    { name: "Adopt", href: "/adopt", icon: PawPrint },
    { name: "Store", href: "/store", icon: ShoppingBag },
    { name: "Volunteer", href: "/volunteer", icon: Users },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-primary/10 p-2 rounded-xl group-hover:bg-primary/20 transition-colors">
            <PawPrint className="h-6 w-6 text-primary" />
          </div>

          <span className="font-display font-bold text-xl tracking-tight text-foreground">
            🐾 Aditi’s <span className="text-primary">Little Paws</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                location === link.href
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Right Side Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <Link href="/gov/dashboard">
            <Button variant="ghost" size="sm" className="text-muted-foreground">
              <LayoutDashboard className="h-4 w-4 mr-2" /> Govt Login
            </Button>
          </Link>

          <Link href="/report">
            <Button className="bg-destructive hover:bg-destructive/90 text-white shadow-lg shadow-destructive/20 rounded-full font-bold px-6">
              <ShieldAlert className="h-4 w-4 mr-2" /> Report Emergency
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 text-foreground"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border bg-background"
          >
            <div className="p-4 flex flex-col gap-2">

              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium ${
                    location === link.href
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  <link.icon className="h-5 w-5" />
                  {link.name}
                </Link>
              ))}

              <div className="h-px bg-border my-2" />

              <Link href="/report" onClick={() => setIsMobileMenuOpen(false)}>
                <Button className="w-full bg-destructive text-white justify-start" size="lg">
                  <ShieldAlert className="h-5 w-5 mr-3" /> Report Emergency
                </Button>
              </Link>

              <Link href="/gov/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full justify-start mt-2" size="lg">
                  <LayoutDashboard className="h-5 w-5 mr-3" /> Govt Dashboard
                </Button>
              </Link>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
