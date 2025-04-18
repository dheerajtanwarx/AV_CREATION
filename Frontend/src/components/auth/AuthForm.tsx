import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";

const formSchema = z.object({
  fullName: z.string().optional(),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
  adminKey: z.string().optional(),
});

interface AuthFormProps {
  userType?: "user" | "admin";
}

export default function AuthForm({ userType = "user" }: AuthFormProps) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminKey, setAdminKey] = useState("");

  // Get redirect path from location state
  const from = location.state?.from?.pathname || "/";

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      adminKey: "",
    },
  });

  const handleLogin = async () => {
    console.log("login clicked");
    const res = await axios.post("http://localhost:3000/api/auth/login", {
      email: email,
      password: password,
     
    }, {
      withCredentials: true
    });

    const user = await res.data;
    const token = res.headers['authorization'];
    if (token) {
      localStorage.setItem("token", token);
      axios.defaults.headers.common["Authorization"] = token;
    }
    localStorage.setItem("user", JSON.stringify(user));
    toast({
      title: "Login successful",
    });
    navigate(from === "/auth" ? "/" : from);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log("login is clicked");
    setIsLoading(true);

    try {
      const endpoint = mode === "signup" ? "/api/auth/signup" : "/api/auth/login";
      const res = await axios.post(
        `http://localhost:3000${endpoint}`,
        {
          email: values.email,
          password: values.password,
          confirmPassword: mode === "signup" ? values.confirmPassword : undefined,
          fullName: mode === "signup" ? values.email.split("@")[0] : undefined,
          adminKey: mode === "signup" ? values.adminKey : undefined,
        },
        { withCredentials: true }
      );

      const user = res.data;
      const token = res.headers['authorization'];
      if (token) {
        localStorage.setItem("token", token);
        axios.defaults.headers.common["Authorization"] = token;
      }
      localStorage.setItem("user", JSON.stringify(user));

      toast({
        title: mode === "signup" ? "Account created" : "Login successful",
        description: `Welcome${userType === "admin" ? " to the admin panel" : ""}!`,
      });

      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate(from === "/auth" ? "/" : from);
      }

    } catch (error: any) {
      console.error("Authentication error:", error);
      toast({
        title: mode === "login" ? "Login failed" : "Signup failed",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <Tabs defaultValue={mode} onValueChange={(v) => setMode(v as "login" | "signup")}>
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
        </TabsList>

        <TabsContent value="login" className="space-y-4">
          <div>
            <div>
              <h2 className="font-medium">Email</h2>
              <input onChange={(e) => {
                setEmail(e.target.value);
              }} type="text" placeholder="your.email@example.com" className="border mt-2 mb-5 w-full p-2 bg-[#FCFAF8] rounded-sm" />
            </div>
            <div>
              <h2 className="font-medium">Password</h2>
              <input onChange={(e) => {
                setPassword(e.target.value);
              }} type="password" placeholder="••••••" className="border mt-2 w-full bg-[#FCFAF8] p-2 rounded-sm" />
            </div>
            {/* <div>
              <h2 className="font-medium">Admin Key (optional)</h2>
              <input
                onChange={(e) => setAdminKey(e.target.value)}
                type="text"
                placeholder="Enter Admin Key if applicable"
                className="border mt-2 mb-5 w-full p-2 bg-[#FCFAF8] rounded-sm"
              />
            </div> */}
            <div>
              <button className="w-full mt-4 bg-[#A16E34] p-2 rounded-sm text-white" onClick={handleLogin}>Login</button>
            </div>
          </div>

        </TabsContent>

        <TabsContent value="signup" className="space-y-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="Full Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="your.email@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="adminKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Admin Key (optional)</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="Enter Admin Key if applicable" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating account...</>
                ) : (
                  'Sign Up'
                )}
              </Button>
            </form>
          </Form>
        </TabsContent>
      </Tabs>
    </div>
  );
}
