
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AdminProducts from "@/components/admin/AdminProducts";
import AdminOrders from "@/components/admin/AdminOrders";
import AdminDashboard from "@/components/admin/AdminDashboard";
import AdminUsers from "@/components/admin/AdminUsers";
import AddProductForm from "@/components/admin/AddProductForm";
import EditHomepageContent from "@/components/admin/EditHomepageContent";
import { Button } from "@/components/ui/button";
import { Shield, Plus, Menu } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import RequireAuth from "@/components/auth/RequireAuth";
import axios from "axios";

export default function Admin() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState(0)
  const [sizes, setSizes] = useState("")
  const [category, setCategory] = useState("")
  const [images, setImages] = useState("")
  const [stock, setStock] = useState(0)
  const [sku, setSku] = useState("")
  const [tags, setTags] = useState("")
  const storedUser = localStorage.getItem('user')
const authUser = storedUser ? JSON.parse(storedUser) : null;

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setIsMobileMenuOpen(false);
  };




  return (
    <RequireAuth requireAdmin={true}>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="flex items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 md:h-8 md:w-8 text-primary" />
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Admin Panel</h1>
            </div>
            
            {/* Mobile menu trigger */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[240px] sm:w-[280px]">
                <div className="flex flex-col gap-6 py-4">
                  <div className="flex items-center gap-2">
                    <Shield className="h-6 w-6 text-primary" />
                    <h2 className="font-semibold text-lg">Admin Menu</h2>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <Button 
                      variant={activeTab === "dashboard" ? "default" : "ghost"} 
                      className="justify-start"
                      onClick={() => handleTabChange("dashboard")}
                    >
                      Dashboard
                    </Button>
                    <Button 
                      variant={activeTab === "products" ? "default" : "ghost"} 
                      className="justify-start"
                      onClick={() => handleTabChange("products")}
                    >
                      Products
                    </Button>
                    <Button 
                      variant={activeTab === "homepage" ? "default" : "ghost"} 
                      className="justify-start"
                      onClick={() => handleTabChange("homepage")}
                    >
                      Homepage
                    </Button>
                    <Button 
                      variant={activeTab === "orders" ? "default" : "ghost"} 
                      className="justify-start"
                      onClick={() => handleTabChange("orders")}
                    >
                      Orders
                    </Button>
                    <Button 
                      variant={activeTab === "users" ? "default" : "ghost"} 
                      className="justify-start"
                      onClick={() => handleTabChange("users")}
                    >
                      Users
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList className="hidden md:grid w-full grid-cols-5 md:w-auto">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="homepage">Homepage</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="space-y-6">
              <AdminDashboard />
            </TabsContent>

            <TabsContent value="products" className="space-y-6">
              <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
                <h2 className="text-xl md:text-2xl font-semibold">Products Management</h2>
                <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" /> Add New Product
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-full sm:max-w-[600px] h-[90vh] sm:h-auto overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Add New Product</DialogTitle>
                    </DialogHeader>
                    <AddProductForm onSuccess={() => setIsAddProductOpen(false)} />
                  </DialogContent>
                </Dialog>
              </div>
              <AdminProducts />
            </TabsContent>

            <TabsContent value="homepage" className="space-y-6">
              <EditHomepageContent />
            </TabsContent>

            <TabsContent value="orders" className="space-y-6">
              <h2 className="text-xl md:text-2xl font-semibold mb-6">Orders Management</h2>
              <AdminOrders />
            </TabsContent>

            <TabsContent value="users" className="space-y-6">
              <h2 className="text-xl md:text-2xl font-semibold mb-6">User Management</h2>
              <AdminUsers />
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Footer />
      </div>
    </RequireAuth>
  );
}
