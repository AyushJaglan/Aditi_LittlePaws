import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

// Layout
import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";

// Pages
import Home from "./pages/Home";
import Report from "./pages/Report";
import RescueMap from "./pages/RescueMap";
import CaseDetail from "./pages/CaseDetail";
import Adoption from "./pages/Adoption";
import Store from "./pages/Store";
import Volunteer from "./pages/Volunteer";
import GovDashboard from "./pages/GovDashboard";
import NotFound from "./pages/not-found";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

function Router() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/report" component={Report} />
          <Route path="/map" component={RescueMap} />
          <Route path="/cases/:id" component={CaseDetail} />
          <Route path="/adopt" component={Adoption} />
          <Route path="/store" component={Store} />
          <Route path="/volunteer" component={Volunteer} />
          <Route path="/gov/dashboard" component={GovDashboard} />
          
          {/* Admin just maps to GovDashboard for mockup purposes, realistically would be separate */}
          <Route path="/admin" component={GovDashboard} />
          
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
