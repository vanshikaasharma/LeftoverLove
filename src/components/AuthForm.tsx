
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";

interface UserData {
  name: string;
  email: string;
  password: string;
}

interface AuthFormProps {
  onAuth: (userData: UserData, isSignUp: boolean) => void;
}

const AuthForm = ({ onAuth }: AuthFormProps) => {
  const [activeTab, setActiveTab] = useState("signin");
  const [userData, setUserData] = useState<UserData>({
    name: "",
    email: "",
    password: "",
  });
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent, isSignUp: boolean) => {
    e.preventDefault();
    
    if (isSignUp && !userData.name) {
      toast({
        title: "Name is required",
        description: "Please enter your name to sign up.",
        variant: "destructive",
      });
      return;
    }

    if (!userData.email) {
      toast({
        title: "Email is required",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }

    if (!userData.password) {
      toast({
        title: "Password is required",
        description: "Please enter your password.",
        variant: "destructive",
      });
      return;
    }

    onAuth(userData, isSignUp);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <Tabs defaultValue="signin" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="signin">Sign In</TabsTrigger>
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
        </TabsList>
        
        <TabsContent value="signin">
          <form onSubmit={(e) => handleSubmit(e, false)}>
            <CardHeader>
              <CardTitle>Sign In</CardTitle>
              <CardDescription>Enter your credentials to access your account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your@email.com"
                  value={userData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={userData.password}
                  onChange={handleChange}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full">Sign In</Button>
            </CardFooter>
          </form>
        </TabsContent>
        
        <TabsContent value="signup">
          <form onSubmit={(e) => handleSubmit(e, true)}>
            <CardHeader>
              <CardTitle>Sign Up</CardTitle>
              <CardDescription>Create a new account to get started</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Your Name"
                  value={userData.name}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <Input
                  id="signup-email"
                  name="email"
                  type="email"
                  placeholder="your@email.com"
                  value={userData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <Input
                  id="signup-password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={userData.password}
                  onChange={handleChange}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full">Sign Up</Button>
            </CardFooter>
          </form>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default AuthForm;
