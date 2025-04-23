import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Edit, Trash2, Search, Loader2, AlertTriangle, Tag } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
 
import EditProductForm from "./EditProductForm";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import axios from "axios";

 

 

type Product = {
  id: number;
  name: string;
  sku: string;
  price: number;
  stock: number;
  category: string;
  status: string;
  tags?: string[];
};

export default function AdminProducts() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editProductId, setEditProductId] = useState<number | null>(null);
  const [deleteProductId, setDeleteProductId] = useState<number | null>(null);
  const [isDeletingMultiple, setIsDeletingMultiple] = useState(false);
  const { toast } = useToast();
const storedUser = localStorage.getItem('user')
const authUser = storedUser ? JSON.parse(storedUser) : null;
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        
        const res = await axios.get("http://localhost:3000/api/product", {
          headers: {
            Authorization: `${authUser.jwt}`
          },
          withCredentials: true
        });
          
          const data = res.data;
          console.log(data)
          const formattedProducts: Product[] = data.map((item: any) => ({
            id: item._id,
            name: item.title,
            sku: item.sku || '',
            price: item.price,
            stock: item.stock || 0,
            category: item.category || '',
            status: item.stock > 0 ? 'In Stock' : 'Out of Stock',
            tags: item.tags || []
          }));
          
          setProducts(formattedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
        toast({
          title: "Error fetching products",
          description: "There was a problem fetching the products.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [toast]);

  const filteredProducts = products.filter(
    product => 
      (product.name ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.tags && product.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  const toggleProductSelection = (productId: number) => {
    if (selectedProducts.includes(productId)) {
      setSelectedProducts(selectedProducts.filter(id => id !== productId));
    } else {
      setSelectedProducts([...selectedProducts, productId]);
    }
  };

  const toggleAllSelection = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map(product => product.id));
    }
  };

  const handleEditClick = (productId: number) => {
    setEditProductId(productId);
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (productId: number) => {
    setDeleteProductId(productId);
    setIsDeletingMultiple(false);
    setIsDeleteDialogOpen(true);
  };

  const handleMultipleDeleteClick = () => {
    setIsDeletingMultiple(true);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      setIsLoading(true);
      
      const idsToDelete = isDeletingMultiple ? selectedProducts : (deleteProductId ? [deleteProductId] : []);
      
      if (idsToDelete.length === 0) return;
      
      if (!isDeletingMultiple && deleteProductId) {
        await axios.delete(`http://localhost:3000/api/products/${deleteProductId}`);
      } else if (isDeletingMultiple) {
        await axios.post("http://localhost:3000/api/products/bulk-delete", {
          ids: selectedProducts
        });
      }
      
      setProducts(products.filter(product => !idsToDelete.includes(product.id)));
      setSelectedProducts([]);
      
      toast({
        title: "Products deleted",
        description: `Successfully deleted ${idsToDelete.length} product(s)`,
      });
      
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error('Error deleting products:', error);
      toast({
        title: "Error deleting products",
        description: "There was a problem deleting the selected products.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateSuccess = () => {
    setIsEditDialogOpen(false);
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get("http://localhost:3000/api/products");
        const data = res.data;
        
        const formattedProducts: Product[] = data.map((item: any) => ({
          id: item._id,
          name: item.title,
          sku: item.sku || '',
          price: item.price,
          stock: item.stock || 0,
          category: item.category || '',
          status: item.stock > 0 ? 'In Stock' : 'Out of Stock',
          tags: item.tags || []
        }));
        setProducts(formattedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
        toast({
          title: "Error fetching products",
          description: "There was a problem fetching the products.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search products, tags..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 ml-auto">
          {selectedProducts.length > 0 && (
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={handleMultipleDeleteClick} 
              disabled={isLoading}
            >
              {isLoading ? (
                <><Loader2 className="h-4 w-4 mr-1 animate-spin" /> Processing...</>
              ) : (
                <><Trash2 className="h-4 w-4 mr-1" /> Delete Selected</>
              )}
            </Button>
          )}
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox 
                  checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                  onCheckedChange={toggleAllSelection}
                  aria-label="Select all products"
                  disabled={isLoading}
                />
              </TableHead>
              <TableHead>Product</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Tags</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center h-32">
                  <div className="flex justify-center items-center">
                    <Loader2 className="h-6 w-6 animate-spin mr-2" />
                    <span>Loading products...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center h-32 text-muted-foreground">
                  No products found
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <Checkbox 
                      checked={selectedProducts.includes(product.id)}
                      onCheckedChange={() => toggleProductSelection(product.id)}
                      aria-label={`Select ${product.name}`}
                    />
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.sku}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>₹{product.price}</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>
                    <Badge variant={product.stock > 0 ? "default" : "destructive"}>
                      {product.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {product.tags && product.tags.length > 0 ? (
                        product.tags.slice(0, 2).map(tag => (
                          <Badge key={tag} variant="outline" className="flex items-center">
                            <Tag className="h-3 w-3 mr-1" />
                            {tag}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-muted-foreground text-xs">No tags</span>
                      )}
                      {product.tags && product.tags.length > 2 && (
                        <Badge variant="outline">+{product.tags.length - 2}</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleEditClick(product.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDeleteClick(product.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          {editProductId && (
            <EditProductForm 
              productId={editProductId} 
              onSuccess={handleUpdateSuccess}
              onCancel={() => setIsEditDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              {isDeletingMultiple ? (
                `Are you sure you want to delete ${selectedProducts.length} selected products? This action cannot be undone.`
              ) : (
                `Are you sure you want to delete this product? This action cannot be undone.`
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isLoading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Deleting...</>
              ) : (
                <><AlertTriangle className="mr-2 h-4 w-4" /> Delete</>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
