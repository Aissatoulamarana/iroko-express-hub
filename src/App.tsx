import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import TrackingPage from "./pages/TrackingPage";
import ServicesPage from "./pages/ServicesPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import BlogPage from "./pages/BlogPage";
import { QuotePage, LegalPage, PrivacyPage } from "./pages/PlaceholderPages";

// Admin
import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminShipments from "./pages/admin/AdminShipments";
import AdminQuotes from "./pages/admin/AdminQuotes";
import AdminClients from "./pages/admin/AdminClients";
import AdminBlog from "./pages/admin/AdminBlog";
import AdminSettings from "./pages/admin/AdminSettings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route
              path="/*"
              element={
                <>
                  <Header />
                  <main>
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/services" element={<ServicesPage />} />
                      <Route path="/suivi" element={<TrackingPage />} />
                      <Route path="/a-propos" element={<AboutPage />} />
                      <Route path="/contact" element={<ContactPage />} />
                      <Route path="/devis" element={<QuotePage />} />
                      <Route path="/blog" element={<BlogPage />} />
                      <Route path="/mentions-legales" element={<LegalPage />} />
                      <Route path="/politique-confidentialite" element={<PrivacyPage />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </main>
                  <Footer />
                  <WhatsAppButton />
                </>
              }
            />

            {/* Admin routes — no public header/footer */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="colis" element={<AdminShipments />} />
              <Route path="devis" element={<AdminQuotes />} />
              <Route path="clients" element={<AdminClients />} />
              <Route path="blog" element={<AdminBlog />} />
              <Route path="parametres" element={<AdminSettings />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
