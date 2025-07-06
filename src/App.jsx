import { Toaster } from "@/components/ui/sonner";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { navItems } from "./nav-items";
import TemplatePage from "./pages/TemplatePage";
import ReceiptPage from "./pages/ReceiptPage";
import Index from "./pages/Index";

const App = () => (
  <>
    <Toaster />
    <BrowserRouter>
      <Routes>
        {navItems.map(({ to, page }) => (
          <Route key={to} path={to} element={page} />
        ))}
        <Route path="/" element={<Index />} />
        <Route path="/template" element={<TemplatePage />} />
        <Route path="/receipt" element={<ReceiptPage />} />
      </Routes>
    </BrowserRouter>
  </>
);

export default App;
