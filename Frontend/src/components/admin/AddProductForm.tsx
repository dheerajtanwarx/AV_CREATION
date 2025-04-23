
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Image as ImageIcon, Upload } from "lucide-react";
import axios from "axios";
import { log } from "console";
import { useRouter } from 'next/router';


const productSchema = z.object({
  title: z.string().min(3, { message: "Product name must be at least 3 characters" }),
  description: z.string().optional(),
  price: z.coerce.number().positive({ message: "Price must be a positive number" }),
  sizes: z.string().min(1, { message: "Enter size" }),
  category: z.string().min(1, { message: "Please select a category" }),
  images: z.string().optional(),
  stock: z.coerce.number().int({ message: "Stock must be a whole number" }).nonnegative({ message: "Stock cannot be negative" }),
  sku: z.string().min(2, { message: "SKU must be at least 2 characters" }),
  tags: z.string().optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

interface AddProductFormProps {
  onSuccess?: () => void;
}

export default function AddProductForm({ onSuccess }: AddProductFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [sizes, setSizes] = useState("")
  const [category, setCategory] = useState("")
  const [images, setImages] = useState("")
  const [stock, setStock] = useState("")
  const [sku, setSku] = useState("")
  const [tags, setTags] = useState("")
  const storedUser = localStorage.getItem('user')
  const authUser = storedUser ? JSON.parse(storedUser) : null;
  const { toast } = useToast();

  // const form = useForm<ProductFormValues>({
  //   resolver: zodResolver(productSchema),
  //   defaultValues: {
  //     title: "",
  //     description: "",
  //     price: 0,
  //     sizes: "",
  //     category: "",
  //     images: "",
  //     stock: 0,
  //     sku: "",
  //     tags: "",
  //   },
 // });
  async function handleAddProduct() {
    setIsSubmitting(true);
    try {
      const res = await axios.post(
        "http://localhost:3000/api/product",
        {
          title,
          description,
          price,
          sizes,
          category,
          images,
          stock,
          sku,
          tags
        },
        {
          headers: {
            Authorization: `${authUser.jwt}`
          }
        }
      );

      toast({
        title: "Product Added",
        description: `Successfully added "${title}"`,
      });


      setTitle("");
      setDescription("");
      setPrice("");
      setSizes("");
      setCategory("");
      setImages("");
      setStock("");
      setSku("");
      setTags("");
      setImagePreview(null);
      setImageFile(null);

      if (onSuccess) onSuccess();

    } catch (error) {
      console.error("Error adding product:", error);
      toast({
        title: "Error",
        description: "Failed to add product.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
       // Set the filename as a placeholder
    }
  };

  const onSubmit = async (data: ProductFormValues) => {
    try {
      setIsSubmitting(true);
      // Prepare product data
      const productData = {
        ...data,
        image: imagePreview || "",
      };
      // Optionally log the product data
      console.log("Product to save:", productData);

      toast({
        title: "Product added",
        description: `Successfully added ${data.title}`,
      });

     
      setImagePreview(null);
      setImageFile(null);

      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error adding product:', error);
      toast({
        title: "Error adding product",
        description: "There was a problem adding the product.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-h-[80vh] overflow-y-auto px-4">
    
        
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6" />

          <div>
            <h2 className="font-medium">Title</h2>
            <input onChange={(e) => {
              setTitle(e.target.value);
            }} type="text" placeholder="Product Name" className="border mt-2 mb-5 w-full p-2 bg-[#FCFAF8] rounded-sm" />
          </div>
          <div>
            <h2 className="font-medium">Description</h2>
            <input onChange={(e) => {
              setDescription(e.target.value);
            }} type="text" placeholder="Product Description" className="border mt-2 mb-5 w-full p-2 bg-[#FCFAF8] rounded-sm" />
          </div>
          <div>
            <h2 className="font-medium">Price</h2>
            <input onChange={(e) => {
              setPrice(e.target.value);
            }} type="number" placeholder="Product Price" className="border mt-2 mb-5 w-full p-2 bg-[#FCFAF8] rounded-sm" />
          </div>
          <div>
            <h2 className="font-medium">Size</h2>
            <input onChange={(e) => {
              setSizes(e.target.value);
            }} type="text" placeholder="Product Size" className="border mt-2 mb-5 w-full p-2 bg-[#FCFAF8] rounded-sm" />
          </div>
          <div>
            <h2 className="font-medium">Category</h2>
            <Select onValueChange={(value) => setCategory(value)}>
              <SelectTrigger className="border mt-2 mb-5 w-full p-2 bg-[#FCFAF8] rounded-sm">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Bridal">Bridal</SelectItem>
                <SelectItem value="Party Wear">Party Wear</SelectItem>
                <SelectItem value="Traditional">Traditional</SelectItem>
                <SelectItem value="Casual">Casual</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <h2 className="font-medium">Images</h2>
            <input onChange={(e) => {
              setImages(e.target.value);
            }} type="text" placeholder="Image URL" className="border mt-2 mb-5 w-full p-2 bg-[#FCFAF8] rounded-sm" />
          </div>
          <div>
            <h2 className="font-medium">SKU</h2>
            <input onChange={(e) => {
              setSku(e.target.value);
            }} type="text" placeholder="SKU" className="border mt-2 mb-5 w-full p-2 bg-[#FCFAF8] rounded-sm" />
          </div>
          <div>
            <h2 className="font-medium">Stock</h2>
            <input onChange={(e) => {
              setStock(e.target.value);
            }} type="number" placeholder="Set Stock" className="border mt-2 mb-5 w-full p-2 bg-[#FCFAF8] rounded-sm" />
          </div>






          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => onSuccess && onSuccess()}>
              Cancel
            </Button>
            <Button onClick={handleAddProduct} disabled={isSubmitting}>
              {isSubmitting ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
              ) : (
                'Add Product'
              )}
            </Button>
          </div>
        

    </div>
  );
}
