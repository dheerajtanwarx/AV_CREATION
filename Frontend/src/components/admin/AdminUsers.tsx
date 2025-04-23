import { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Loader2, UserPlus, Shield, UserX } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { Form } from "../ui/form";

// User type
type User = {
  id: string;
  email: string;
  role: 'user' | 'admin';
  createdAt: string;
  last_sign_in: string;
};


export default function AdminUsers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const storedUser = localStorage.getItem('user');
  const authUser = storedUser ? JSON.parse(storedUser) : null;
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const handleAddUser = async () => {
    console.log("add user clicked");
    const res = await axios.post("http://localhost:3000/api/auth/signup", {
      fullName: fullName,
      email: email,
      password: password,
      confirmPassword: confirmPassword
    }, {
      withCredentials: true
    });

    setIsDialogOpen(false);
    window.location.reload();
  };

  // Fetch users from backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get("http://localhost:3000/users", {
          headers: {
            Authorization: `${authUser.jwt}`
          },
          withCredentials: true
        });
        const data = res.data;
        setUsers(data);
        console.log(data)
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [toast]);

  const filteredUsers = users.filter(
    user => user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleAdminRole = async (userId: string, currentRole: string) => {
    try {
      setIsLoading(true);
      const newRole = currentRole === 'admin' ? 'user' : 'admin';

      await axios.post(`http://localhost:3000/api/users/${userId}/toggle-role`);
      setUsers(users.map(user => user.id === userId ? { ...user, role: newRole as 'user' | 'admin' } : user));

      toast({
        title: "Role updated",
        description: `User is now ${newRole === 'admin' ? 'an admin' : 'a regular user'}`,
      });
    } catch (error) {
      console.error('Error updating role:', error);
      toast({
        title: "Error updating role",
        description: "There was a problem updating the user role.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addNewUser = async () => {
    try {
      setIsSubmitting(true);

      await axios.post("http://localhost:3000/api/users", {
        email: newUserEmail,
        role: isAdmin ? "admin" : "user"
      });

      toast({
        title: "User added",
        description: `Successfully added ${newUserEmail} as ${isAdmin ? 'an admin' : 'a user'}`,
      });

      // Reset form and close dialog
      setNewUserEmail("");
      setIsAdmin(false);
      setIsDialogOpen(false);

    } catch (error) {
      console.error('Error adding user:', error);
      toast({
        title: "Error adding user",
        description: "There was a problem adding the user.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search users..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 ml-auto">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="h-4 w-4 mr-2" /> Add User
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div>
                  <div>
                    <h2 className="font-medium">Full Name</h2>
                    <input onChange={(e) => setFullName(e.target.value)} type="text" placeholder="Your Name" className="border mt-2 mb-5 w-full p-2 bg-[#FCFAF8] rounded-sm" />
                  </div>
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
                  <div>
                    <h2 className="font-medium">Confirm Password</h2>
                    <input onChange={(e) => {
                      setConfirmPassword(e.target.value);
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
                    <button className="w-full mt-4 bg-[#A16E34] p-2 rounded-sm text-white" onClick={handleAddUser}>Add User</button>
                  </div>
                </div>


                <div className="grid grid-cols-4 items-center gap-4">


                </div>
              </div>

            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Last Sign In</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-32">
                  <div className="flex justify-center items-center">
                    <Loader2 className="h-6 w-6 animate-spin mr-2" />
                    <span>Loading users...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-32 text-muted-foreground">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={user.role === 'admin' ? "default" : "secondary"}>
                      {user.role === 'admin' ? (
                        <><Shield className="h-3 w-3 mr-1" /> Admin</>
                      ) : (
                        'User'
                      )}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>{user.last_sign_in === 'Never' ? 'Never' : new Date(user.last_sign_in).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleAdminRole(user.id, user.role)}
                    >
                      {user.role === 'admin' ? (
                        <><UserX className="h-4 w-4 mr-2" /> Remove Admin</>
                      ) : (
                        <><Shield className="h-4 w-4 mr-2" /> Make Admin</>
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
