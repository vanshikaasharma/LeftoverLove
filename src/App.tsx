import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import RoleSelectionPage from "./pages/RoleSelectionPage";
import CreateListingPage from "./pages/CreateListingPage";
import BrowseFoodPage from "./pages/BrowseFoodPage";
import ProfilePage from "./pages/ProfilePage";
import HelpPage from "./pages/HelpPage";
import DashboardPage from "./pages/DashboardPage";
import FoodListingDetailPage from "./pages/FoodListingDetailPage";
import EmergencyPage from "./pages/EmergencyPage";
import NotFound from "./pages/NotFound";
import LearnPage from "./pages/LearnPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/role-selection" element={<RoleSelectionPage />} />
          <Route path="/create-listing" element={<CreateListingPage />} />
          <Route path="/browse-food" element={<BrowseFoodPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/help" element={<HelpPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/food-listing/:id" element={<FoodListingDetailPage />} />
          <Route path="/emergency" element={<EmergencyPage />} />
          <Route path="/learn" element={<LearnPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
