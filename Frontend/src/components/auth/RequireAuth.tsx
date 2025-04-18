import { ReactNode, useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client (if available)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = supabaseUrl && supabaseKey 
  ? createClient(supabaseUrl, supabaseKey)
  : null;

interface RequireAuthProps {
  children: ReactNode;
  requireAdmin?: boolean;
}

export default function RequireAuth({ children, requireAdmin = false }: RequireAuthProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // If Supabase is available, check session
        if (supabase) {
          const { data, error } = await supabase.auth.getSession();
          
          if (error) {
            console.error("Error getting session:", error);
            setIsLoading(false);
            return;
          }
          
          if (data.session) {
            const storedUser = localStorage.getItem("user");
            if (storedUser) {
              setUser(JSON.parse(storedUser));
            } else {
              setUser({
                id: data.session.user.id,
                email: data.session.user.email,
                role: "user",
              });
            }
          }
          
          setIsLoading(false);
          return;
        }
        
        // Otherwise, use localStorage
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Auth check error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    // Redirect to login page but save the current location they were trying to access
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (requireAdmin && user.role !== "admin") {
    // User is logged in but not an admin
    return <Navigate to="/" replace />;
  }

  // User is logged in and passes admin check if required
  return <>{children}</>;
}
