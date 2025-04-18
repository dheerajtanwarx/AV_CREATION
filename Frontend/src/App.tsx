
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { CartProvider } from "@/contexts/CartContext";
import { NotificationProvider } from "@/contexts/NotificationContext";

// Pages
import Index from "./pages/Index";
import About from "./pages/About";
import Auth from "./pages/Auth";
import Bridal from "./pages/Bridal";
import Cart from "./pages/Cart";
import Collections from "./pages/Collections";
import CompleteProfile from "./pages/CompleteProfile";
import Contact from "./pages/Contact";
import NewArrivals from "./pages/NewArrivals";
import NotFound from "./pages/NotFound";
import Privacy from "./pages/Privacy";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import UserDashboard from "./pages/UserDashboard";
import Shipping from "./pages/Shipping";
import Stores from "./pages/Stores";
import Terms from "./pages/Terms";
import Admin from "./pages/Admin";
import Sale from "./pages/Sale";
import Search from "./pages/Search";
import OrderSuccess from "./pages/OrderSuccess";
import OrderTracking from "./pages/OrderTracking";
import AccountSettings from "./pages/AccountSettings";
import AddressManagement from "./pages/AddressManagement";
import PaymentMethods from "./pages/PaymentMethods";
import Wishlist from "./pages/Wishlist";
import RequireAuth from "./components/auth/RequireAuth";

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <NotificationProvider>
          <Toaster />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/bridal" element={<Bridal />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/collections" element={<Collections />} />
            <Route path="/complete-profile" element={<CompleteProfile />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/new-arrivals" element={<NewArrivals />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/dashboard/*" element={<UserDashboard />} />
            <Route path="/profile" element={<Navigate to="/dashboard" replace />} />
            <Route path="/search" element={<Search />} />
            <Route path="/shipping" element={<Shipping />} />
            <Route path="/stores" element={<Stores />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/sale" element={<Sale />} />
            <Route
  path="/admin"
  element={
    <RequireAuth requireAdmin={true}>
      <Admin />
    </RequireAuth>
  }
/>
            <Route path="/order-success" element={<OrderSuccess />} />
            <Route path="/track-order/:orderId" element={<OrderTracking />} />
            <Route path="/account-settings" element={<AccountSettings />} />
            <Route path="/address-management" element={<AddressManagement />} />
            <Route path="/payment-methods" element={<PaymentMethods />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </NotificationProvider>
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;
