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
    
    // Store user data in localStorage
    localStorage.setItem("user", JSON.stringify({
      name: userData.name || "User",
      email: userData.email,
      isAuthenticated: true
    }));
    
    toast({
      title: isSignUp ? "Account created" : "Welcome back",
      description: isSignUp 
        ? "Your account has been created successfully." 
        : "You have been signed in successfully.",
    });
    
    // Redirect to role selection page
    navigate("/role-selection");
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
