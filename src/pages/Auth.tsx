import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "@/components/AuthForm";
import { useToast } from "@/components/ui/use-toast";

interface UserData {
  name: string;
  email: string;
  password: string;
}

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAuth = (userData: UserData, isSignUp: boolean) => {
    // In a real app, this would call an authentication API
    // For demonstration, we're simulating successful auth
    
    if (isSignUp) {
      // Check if user already exists
      const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");
      const existingUser = existingUsers.find((user: any) => user.email === userData.email);
      
      if (existingUser) {
        // User already exists, show error
        toast({
          title: "Account already exists",
          description: "An account with this email already exists. Please sign in instead.",
          variant: "destructive",
        });
        return;
      }
      
      // Generate a unique user ID for new accounts
      const userId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      const joinDate = new Date().toISOString().split('T')[0]; // Format as YYYY-MM-DD
      
      // Store user data in localStorage with the new ID
      localStorage.setItem("user", JSON.stringify({
        name: userData.name || "User",
        email: userData.email,
        isAuthenticated: true,
        userId: userId,
        joinDate: joinDate
      }));
      
      // Add to users list with password (in a real app, this would be hashed)
      existingUsers.push({
        name: userData.name || "User",
        email: userData.email,
        password: userData.password, // In a real app, this would be hashed
        userId: userId,
        joinDate: joinDate
      });
      localStorage.setItem("users", JSON.stringify(existingUsers));
      
      toast({
        title: "Account created",
        description: "Your account has been created successfully.",
      });
    } else {
      // For sign in, check if user exists and verify password
      const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");
      const existingUser = existingUsers.find((user: any) => user.email === userData.email);
      
      if (existingUser) {
        // User exists, check password
        if (existingUser.password !== userData.password) {
          // Incorrect password
          toast({
            title: "Incorrect password",
            description: "The password you entered is incorrect. Please try again.",
            variant: "destructive",
          });
          return;
        }
        
        // Password correct, sign in
        localStorage.setItem("user", JSON.stringify({
          name: existingUser.name || "User",
          email: existingUser.email,
          isAuthenticated: true,
          userId: existingUser.userId,
          joinDate: existingUser.joinDate
        }));
        
        toast({
          title: "Welcome back",
          description: "You have been signed in successfully.",
        });
      } else {
        // User doesn't exist in our records, create a new ID
        const userId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        const joinDate = new Date().toISOString().split('T')[0];
        
        localStorage.setItem("user", JSON.stringify({
          name: userData.name || "User",
          email: userData.email,
          isAuthenticated: true,
          userId: userId,
          joinDate: joinDate
        }));
        
        // Add to users list
        existingUsers.push({
          name: userData.name || "User",
          email: userData.email,
          password: userData.password, // In a real app, this would be hashed
          userId: userId,
          joinDate: joinDate
        });
        localStorage.setItem("users", JSON.stringify(existingUsers));
        
        toast({
          title: "Account created",
          description: "Your account has been created successfully.",
        });
      }
    }
    
    // Redirect to dashboard instead of role selection
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-green-50 to-white">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-green-700 mb-2">Leftover Love</h1>
        <p className="text-lg text-gray-600 max-w-md">
          Connecting those with food to share with those who need it most
        </p>
      </div>
      
      <AuthForm onAuth={handleAuth} />
    </div>
  );
};

export default Auth;
