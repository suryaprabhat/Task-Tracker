import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { signupUser } from "../api/authapi";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSignup = async () => {
    if (!name || !email || !password) {
      alert("All fields are required");
      return;
    }

    try {
      setLoading(true);
      await signupUser({ name, email, password });
      alert("Account created. Please login.");
      navigate("/login");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            Create Account
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              placeholder="Your name"
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              type="email"
              placeholder="you@example.com"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Password</Label>
            <Input
              type="password"
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button
            className="w-full"
            onClick={handleSignup}
            disabled={loading}
          >
            {loading ? "Creating account..." : "Sign Up"}
          </Button>

          <p className="text-sm text-muted-foreground text-center">
            Already have an account?{" "}
            <span
              className="text-primary cursor-pointer underline"
              onClick={() => navigate("/login")}
            >
              Login
            </span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
