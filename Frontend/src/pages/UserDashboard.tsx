
import { useState, useEffect } from "react";
import { Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProfileDetailsForm from "@/components/profile/ProfileDetailsForm";
import { 
  User, 
  ShoppingBag, 
  Heart, 
  MapPin, 
  CreditCard, 
  Settings, 
  LogOut,
  Package,
  Clock,
  CheckCircle2,
  Truck,
  BadgeCheck 
} from "lucide-react";
import RequireAuth from "@/components/auth/RequireAuth";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";

// Mock orders data - in a real app, this would come from an API
const mockOrders = [
  {
    id: "ORD-10568",
    date: "2024-03-15",
    status: "delivered",
    total: 85000,
    items: [
      {
        id: "1",
        name: "Emerald Silk Lehenga",
        image: "https://images.unsplash.com/photo-1621184455862-c163dfb30e0f?q=80&w=1964&auto=format&fit=crop",
        price: 49999,
        quantity: 1,
      }
    ]
  },
  {
    id: "ORD-10432",
    date: "2024-02-28",
    status: "processing",
    total: 42000,
    items: [
      {
        id: "2",
        name: "Ruby Red Celebration",
        image: "https://images.unsplash.com/photo-1610189019599-2d766fcb615d?q=80&w=1964&auto=format&fit=crop",
        price: 42000,
        quantity: 1,
      }
    ]
  },
  {
    id: "ORD-10345",
    date: "2024-01-12",
    status: "delivered",
    total: 92000,
    items: [
      {
        id: "3",
        name: "Sapphire Elegance",
        image: "https://images.unsplash.com/photo-1580522154200-c44a22efef64?q=80&w=1964&auto=format&fit=crop",
        price: 36000,
        quantity: 1,
      },
      {
        id: "4",
        name: "Pearl White Ethereal",
        image: "https://images.unsplash.com/photo-1620359579376-9d122c92fbcf?q=80&w=1964&auto=format&fit=crop",
        price: 56000,
        quantity: 1,
      }
    ]
  }
];

// Status mapping for visual representation
const statusMap: Record<string, { icon: React.ReactNode, label: string, color: string }> = {
  "pending": { 
    icon: <Clock className="h-4 w-4" />, 
    label: "Pending", 
    color: "text-yellow-600 bg-yellow-100" 
  },
  "processing": { 
    icon: <Package className="h-4 w-4" />, 
    label: "Processing", 
    color: "text-blue-600 bg-blue-100" 
  },
  "shipped": { 
    icon: <Truck className="h-4 w-4" />, 
    label: "Shipped", 
    color: "text-purple-600 bg-purple-100" 
  },
  "delivered": { 
    icon: <CheckCircle2 className="h-4 w-4" />, 
    label: "Delivered", 
    color: "text-green-600 bg-green-100" 
  },
  "cancelled": { 
    icon: <BadgeCheck className="h-4 w-4" />, 
    label: "Cancelled", 
    color: "text-red-600 bg-red-100" 
  }
};

const formattedPrice = (price: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
};

function Dashboard() {
  const [activeTab, setActiveTab] = useState("orders");
  const location = useLocation();
  const [user, setUser] = useState<any>(null);
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const { wishlistItems } = useCart();
  
  useEffect(() => {
    // Get user from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      setIsProfileComplete(userData.profileCompleted || false);
    }
    
    // Set active tab based on the current path
    const path = location.pathname.split('/').pop();
    if (path && path !== 'dashboard') {
      setActiveTab(path);
    }
  }, [location.pathname]);

  const handleProfileComplete = () => {
    setIsProfileComplete(true);
    
    // Update local storage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      userData.profileCompleted = true;
      localStorage.setItem("user", JSON.stringify(userData));
    }
  };

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">My Account</h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.fullName || 'Guest'}
        </p>
      </div>

      {!isProfileComplete && (
        <div className="bg-muted/30 border border-muted rounded-lg p-4 mb-6">
          <h3 className="font-medium mb-1">Complete Your Profile</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Finish setting up your profile to access all features.
          </p>
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="profile">Profile Details</TabsTrigger>
            </TabsList>
            <TabsContent value="profile">
              {user && (
                <ProfileDetailsForm 
                  userId={user.id || user.email} 
                  onSuccess={handleProfileComplete} 
                />
              )}
            </TabsContent>
          </Tabs>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="orders" asChild>
            <Link to="/dashboard/orders">Orders</Link>
          </TabsTrigger>
          <TabsTrigger value="wishlist" asChild>
            <Link to="/dashboard/wishlist">
              Wishlist
              {wishlistItems.length > 0 && (
                <span className="ml-2 inline-flex items-center justify-center w-5 h-5 text-xs font-medium rounded-full bg-primary text-primary-foreground">
                  {wishlistItems.length}
                </span>
              )}
            </Link>
          </TabsTrigger>
          <TabsTrigger value="addresses" asChild>
            <Link to="/dashboard/addresses">Addresses</Link>
          </TabsTrigger>
          <TabsTrigger value="payments" asChild>
            <Link to="/dashboard/payments">Payment Methods</Link>
          </TabsTrigger>
          <TabsTrigger value="settings" asChild>
            <Link to="/dashboard/settings">Account Settings</Link>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="orders" className="space-y-4">
          {mockOrders.length > 0 ? (
            mockOrders.map((order) => (
              <div key={order.id} className="border rounded-lg overflow-hidden">
                <div className="bg-muted/30 p-4 flex flex-wrap justify-between items-center gap-y-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Order #{order.id}</span>
                      <span className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${statusMap[order.status].color}`}>
                        {statusMap[order.status].icon}
                        {statusMap[order.status].label}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Placed on {formatDate(order.date)}
                    </div>
                  </div>
                  <div className="space-x-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/track-order/${order.id}`}>Track Order</Link>
                    </Button>
                    <Button size="sm">View Details</Button>
                  </div>
                </div>
                
                <div className="p-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex gap-4 py-3">
                      <Link to={`/products/${item.id}`} className="w-16 h-16 bg-muted/30 rounded overflow-hidden flex-shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </Link>
                      <div className="flex-1">
                        <Link to={`/products/${item.id}`} className="font-medium hover:underline">
                          {item.name}
                        </Link>
                        <div className="text-sm text-muted-foreground">
                          Quantity: {item.quantity}
                        </div>
                        <div className="font-medium">
                          {formattedPrice(item.price)}
                        </div>
                      </div>
                    </div>
                  ))}

                  <Separator className="my-3" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                    </span>
                    <div className="font-medium">
                      Total: {formattedPrice(order.total)}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10 border rounded-lg">
              <ShoppingBag className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No orders yet</h3>
              <p className="text-muted-foreground mb-4">
                Browse our collection and place your first order
              </p>
              <Button asChild>
                <Link to="/products">Shop Now</Link>
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="wishlist">
          <div className="text-center py-6">
            <Button asChild>
              <Link to="/wishlist">Go to Wishlist Page</Link>
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="addresses">
          <div className="text-center py-6">
            <Button asChild>
              <Link to="/address-management">Manage Addresses</Link>
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="payments">
          <div className="text-center py-6">
            <Button asChild>
              <Link to="/payment-methods">Manage Payment Methods</Link>
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="settings">
          <div className="text-center py-6">
            <Button asChild>
              <Link to="/account-settings">Account Settings</Link>
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
}

export default function UserDashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem("user");
    
    // Show toast
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    
    // Redirect to home page
    navigate("/");
  };
  
  return (
    <RequireAuth>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-10">
            {/* Sidebar */}
            <div className="space-y-6">
              <div className="bg-muted/30 rounded-lg p-4">
                <div className="space-y-1">
                  <Link to="/dashboard/orders" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted transition-colors">
                    <ShoppingBag className="h-5 w-5 text-muted-foreground" />
                    <span>Orders</span>
                  </Link>
                  <Link to="/wishlist" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted transition-colors">
                    <Heart className="h-5 w-5 text-muted-foreground" />
                    <span>Wishlist</span>
                  </Link>
                  <Link to="/address-management" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted transition-colors">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                    <span>Addresses</span>
                  </Link>
                  <Link to="/payment-methods" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted transition-colors">
                    <CreditCard className="h-5 w-5 text-muted-foreground" />
                    <span>Payment Methods</span>
                  </Link>
                  <Link to="/account-settings" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted transition-colors">
                    <Settings className="h-5 w-5 text-muted-foreground" />
                    <span>Account Settings</span>
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted transition-colors text-left"
                  >
                    <LogOut className="h-5 w-5 text-muted-foreground" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
              
              <div className="bg-muted/30 rounded-lg p-4">
                <h3 className="font-medium mb-2">Need Help?</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Have questions or concerns?
                </p>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link to="/contact">Contact Us</Link>
                </Button>
              </div>
            </div>
            
            {/* Main Content */}
            <div>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/orders" element={<Dashboard />} />
                <Route path="/wishlist" element={<Dashboard />} />
                <Route path="/addresses" element={<Dashboard />} />
                <Route path="/payments" element={<Dashboard />} />
                <Route path="/settings" element={<Dashboard />} />
              </Routes>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </RequireAuth>
  );
}
