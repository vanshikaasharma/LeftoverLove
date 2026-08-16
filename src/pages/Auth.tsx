import { useNavigate } from "react-router-dom";
import AuthForm from "@/components/AuthForm";
import { useToast } from "@/components/ui/use-toast";

interface UserData {
  name: string;
  email: string;
  password: string;
}

interface StoredUser {
  name: string;
  email: string;
  passwordHash: string;
  userId: string;
  joinDate: string;
}

// Simple hash so we don't store plain passwords in localStorage
async function hashPassword(password: string): Promise<string> {
  const data = new TextEncoder().encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function getUsers(): StoredUser[] {
  return JSON.parse(localStorage.getItem("users") || "[]");
}

function saveSession(user: Pick<StoredUser, "name" | "email" | "userId" | "joinDate">) {
  localStorage.setItem(
    "user",
    JSON.stringify({
      name: user.name,
      email: user.email,
      isAuthenticated: true,
      userId: user.userId,
      joinDate: user.joinDate,
    })
  );
}

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAuth = async (userData: UserData, isSignUp: boolean) => {
    const users = getUsers();
    const existingUser = users.find((user) => user.email === userData.email);
    const passwordHash = await hashPassword(userData.password);

    if (isSignUp) {
      if (existingUser) {
        toast({
          title: "Account already exists",
          description: "Please sign in instead.",
          variant: "destructive",
        });
        return;
      }

      const newUser: StoredUser = {
        name: userData.name || "User",
        email: userData.email,
        passwordHash,
        userId: `user_${Date.now()}`,
        joinDate: new Date().toISOString().split("T")[0],
      };

      users.push(newUser);
      localStorage.setItem("users", JSON.stringify(users));
      saveSession(newUser);

      toast({
        title: "Account created",
        description: "Your account has been created successfully.",
      });
    } else {
      if (!existingUser) {
        toast({
          title: "Account not found",
          description: "Please sign up first.",
          variant: "destructive",
        });
        return;
      }

      // Support older demo accounts that still have a plain password field
      const storedHash =
        existingUser.passwordHash ||
        (existingUser as StoredUser & { password?: string }).password;

      if (storedHash !== passwordHash && storedHash !== userData.password) {
        toast({
          title: "Incorrect password",
          description: "Please try again.",
          variant: "destructive",
        });
        return;
      }

      // Upgrade old accounts to hashed passwords when they sign in
      if (!existingUser.passwordHash) {
        existingUser.passwordHash = passwordHash;
        delete (existingUser as StoredUser & { password?: string }).password;
        localStorage.setItem("users", JSON.stringify(users));
      }

      saveSession(existingUser);
      toast({
        title: "Welcome back",
        description: "You have been signed in successfully.",
      });
    }

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
