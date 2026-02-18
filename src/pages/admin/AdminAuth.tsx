import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { 
  Shield, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Zap,
  AlertCircle,
  CheckCircle,
  ArrowLeft
} from "lucide-react";

const AdminAuth = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
        setLoading(false);
        return;
      }

      if (data.user) {
        // Check if user has admin role
        const { data: roleData, error: roleError } = await supabase
          .rpc("get_user_role", { _user_id: data.user.id });

        if (roleError || roleData !== 'admin') {
          setError("Access denied. Admin privileges required.");
          await supabase.auth.signOut();
          setLoading(false);
          return;
        }

        toast({ 
          title: "Welcome back, Admin!",
          description: "You have successfully logged in."
        });
        navigate("/admin");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    }

    setLoading(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      setLoading(false);
      return;
    }

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: "Administrator" },
          emailRedirectTo: `${window.location.origin}/admin/auth`,
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        setLoading(false);
        return;
      }

      if (data.user) {
        // Assign admin role
        const { error: roleError } = await supabase
          .from("user_roles")
          .insert({ user_id: data.user.id, role: "admin" });

        if (roleError) {
          setError("Account created but role assignment failed.");
          setLoading(false);
          return;
        }

        toast({ 
          title: "Admin account created!",
          description: "Please check your email to confirm your account."
        });
        setIsLogin(true);
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Back to main site */}
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Sportika
        </Link>

        <Card className="glass">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-2xl font-display">
              {isLogin ? "Admin Login" : "Create Admin Account"}
            </CardTitle>
            <CardDescription>
              {isLogin 
                ? "Secure access for platform administrators" 
                : "Register as a platform administrator"
              }
            </CardDescription>
            <Badge variant="secondary" className="mt-2 mx-auto">
              Restricted Access
            </Badge>
          </CardHeader>

          <CardContent>
            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <form onSubmit={isLogin ? handleLogin : handleSignup} className="space-y-4">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10"
                    placeholder="admin@sportika.app"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={isLogin ? 6 : 8}
                    className="pl-10 pr-10"
                    placeholder={isLogin ? "Enter your password" : "Min 8 characters"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {!isLogin && (
                <div>
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="pl-10"
                      placeholder="Confirm your password"
                    />
                  </div>
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    {isLogin ? "Signing in..." : "Creating account..."}
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    {isLogin ? "Sign In as Admin" : "Create Admin Account"}
                  </span>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError("");
                  setPassword("");
                  setConfirmPassword("");
                }}
                className="text-sm text-primary hover:underline"
              >
                {isLogin 
                  ? "Need to create an admin account?" 
                  : "Already have an admin account? Sign in"
                }
              </button>
            </div>

            {isLogin && (
              <div className="mt-4 text-center">
                <Link 
                  to="/forgot-password" 
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Forgot password?
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Security notice */}
        <div className="mt-6 flex items-start gap-3 p-4 rounded-lg bg-secondary/50">
          <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
          <div className="text-sm text-muted-foreground">
            <p className="font-medium text-foreground">Secure Admin Portal</p>
            <p>This page is restricted to authorized administrators only. All login attempts are logged and monitored.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAuth;