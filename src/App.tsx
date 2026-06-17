import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
// import Blog from "./pages/Blog"; // HIDDEN - waiting for content
// import BlogPost from "./pages/BlogPost"; // HIDDEN - waiting for content
// HIDDEN - Pricing page taken down until per-kW/month pricing is corrected (re-enable the import + route below to restore).
// import PricingPage from "./pages/PricingPage";
import ModelLibraryPage from "./pages/ModelLibraryPage";
import ModelDetailsPage from "./pages/ModelDetailsPage";
import Tnc from "./pages/Tnc";
import NotFound from "./pages/NotFound";
import Design from "./pages/Design";
import CareersPage from "./pages/CareersPage";
import ContactPage from "./pages/ContactPage";
import PressPage from "./pages/PressPage";
import EventsPage from "./pages/EventsPage";
import PartnerPage from "./pages/PartnerPage";
import EnergyPage from "./pages/EnergyPage";
import ColocationPage from "./pages/ColocationPage";
import SustainabilityPage from "./pages/SustainabilityPage";
import InferencePage from "./pages/InferencePage";
import ClustersPage from "./pages/ClustersPage";
import ServerlessPage from "./pages/ServerlessPage";
import ModelApisPage from "./pages/ModelApisPage";
import TrainingPage from "./pages/TrainingPage";
import StartupsPage from "./pages/StartupsPage";
import ComingSoonPage from "./pages/ComingSoonPage";
import BrandTransition from "./pages/BrandTransition";
import { LEGACY_HOSTNAMES } from "@/lib/site";
import { ScrollToTop } from "@/components/ScrollToTop";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        {/*
          Legacy domain behavior:
          - `/` serves the brand transition page.
          - Everything else redirects to the primary domain via src/lib/domainRedirect.ts.
        */}
        <Routes>
          <Route
            path="/"
            element={
              typeof window !== "undefined" &&
              LEGACY_HOSTNAMES.some((legacyHostname) =>
                window.location.hostname === legacyHostname ||
                window.location.hostname === `www.${legacyHostname}`,
              )
                ? <BrandTransition />
                : <Index />
            }
          />
          <Route path="/helios" element={<BrandTransition />} />
          {/* HIDDEN - Blog routes waiting for content */}
          {/* <Route path="/blog" element={<Blog />} /> */}
          {/* <Route path="/blog/:slug" element={<BlogPost />} /> */}
          {/* HIDDEN - Pricing taken down until pricing is corrected; redirect to home for now. */}
          <Route path="/pricing" element={<Navigate to="/" replace />} />
          <Route path="/model-library" element={<ModelLibraryPage />} />
          <Route path="/model-library/:slug" element={<ModelDetailsPage />} />
          <Route path="/tnc" element={<Tnc />} />
          <Route path="/design" element={<Design />} />
          <Route path="/careers" element={<CareersPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/press" element={<PressPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/partner" element={<PartnerPage />} />
          <Route path="/energy" element={<EnergyPage />} />
          <Route path="/colocation" element={<ColocationPage />} />
          <Route path="/sustainability" element={<SustainabilityPage />} />
          <Route path="/inference" element={<InferencePage />} />
          <Route path="/clusters" element={<ClustersPage />} />
          <Route path="/serverless" element={<ServerlessPage />} />
          <Route path="/models" element={<ModelApisPage />} />
          <Route path="/training" element={<TrainingPage />} />
          <Route path="/startups" element={<StartupsPage />} />
          <Route path="/coming-soon" element={<ComingSoonPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
