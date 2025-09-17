"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/app/contexts/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Loader2, Users, TrendingUp, UserCheck, PieChart } from "lucide-react";
import { redirect } from "next/navigation";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, user } = useAuth();

  useEffect(() => {
    if (user) {
      redirect("/");
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (!error) {
          redirect("/");
        }
      } else {
        const { error } = await signUp(email, password, fullName);
        if (!error) {
          setIsLogin(true);
          setEmail("");
          setPassword("");
          setFullName("");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-variant flex">
      {/* Left side - Hero section */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary to-primary-hover p-12 text-primary-foreground">
        <div className="flex flex-col justify-center max-w-md mx-auto">
          <h1 className="text-4xl font-bold mb-6">Lead Management System</h1>
          <p className="text-xl mb-8 text-primary-foreground/90">
            Streamline your buyer leads, track conversions, and grow your real
            estate business efficiently.
          </p>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-primary-foreground/10 p-4 rounded-lg">
              <Users className="w-6 h-6 mb-2" />
              <div className="text-sm font-medium">Lead Management</div>
            </div>
            <div className="bg-primary-foreground/10 p-4 rounded-lg">
              <TrendingUp className="w-6 h-6 mb-2" />
              <div className="text-sm font-medium">Sales Tracking</div>
            </div>
            <div className="bg-primary-foreground/10 p-4 rounded-lg">
              <UserCheck className="w-6 h-6 mb-2" />
              <div className="text-sm font-medium">Lead Qualification</div>
            </div>
            <div className="bg-primary-foreground/10 p-4 rounded-lg">
              <PieChart className="w-6 h-6 mb-2" />
              <div className="text-sm font-medium">Analytics</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Auth form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-2 text-center">
            <CardTitle className="text-2xl">
              {isLogin ? "Welcome Back" : "Create Account"}
            </CardTitle>
            <CardDescription>
              {isLogin
                ? "Sign in to access your lead management dashboard"
                : "Get started with your lead management system"}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required={!isLogin}
                    placeholder="Enter your full name"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter your email"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                  minLength={6}
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {isLogin ? "Sign In" : "Create Account"}
              </Button>
            </form>

            <Separator className="my-6" />

            <div className="text-center">
              <Button
                variant="ghost"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setEmail("");
                  setPassword("");
                  setFullName("");
                }}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                {isLogin
                  ? "Don't have an account? Sign up"
                  : "Already have an account? Sign in"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
