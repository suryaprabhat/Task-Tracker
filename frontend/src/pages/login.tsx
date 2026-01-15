import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useAuth } from "../context/AuthContext";
import { loginUser } from "../api/authapi";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async () => {
    try {
      setLoading(true);
      const res = await loginUser({ email, password });
      login(res.token);
      navigate("/dashboard");
    } catch {
      alert("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            Task Tracker Login
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
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
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </Button>

          <p className="text-sm text-muted-foreground text-center">
            Authorized access only
          </p>
            <p className="text-sm text-muted-foreground text-center">
                Don’t have an account?{" "}
                <span
                    className="text-primary cursor-pointer underline"
                    onClick={() => navigate("/signup")}
                >
                    Sign up
                </span>
            </p>
        </CardContent>
      </Card>
    </div>
  );
}
