
import AuthForm from "@/components/auth/AuthForm";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Auth() {
  const navigate = useNavigate();
  const [userType, setUserType] = useState<"user" | "admin">("user");

  useEffect(() => {
    // If user is already logged in, redirect to home
    const user = localStorage.getItem("user");
    if (user) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 container mx-auto px-4 py-24 md:py-32">
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl">Sign in</CardTitle>
              <CardDescription>
                Choose your account type and enter your credentials
              </CardDescription>
              <Tabs defaultValue="user" className="w-full" onValueChange={(value) => setUserType(value as "user" | "admin")}>
               
              </Tabs>
            </CardHeader>
            <CardContent>
              <AuthForm userType={userType} />
              
              {userType === "admin" && (
                <div className="mt-4 p-3 bg-muted rounded-md text-sm">
                  <p className="font-medium">Demo Admin Access:</p>
                  <p className="text-muted-foreground mt-1">
                    Use any email containing "admin" and any password.
                  </p>
                </div>
              )}
              
              {userType === "user" && (
                <div className="mt-4 p-3 bg-muted rounded-md text-sm">
                  <p className="font-medium">Demo User Access:</p>
                  <p className="text-muted-foreground mt-1">
                    Use any email (without "admin") and any password.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
}
