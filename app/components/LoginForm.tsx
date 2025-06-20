"use client";
// imports
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";

import useUserRole from "../hooks/useUserRole";
import { login } from "../(landing)/login/action";

// shadcn components
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const LoginForm = () => {
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isRedirecting, setIsRedirecting] = useState(false); // Prevent multiple redirects
  const { fetchUserRole } = useUserRole(); // fetch user role custom hook
  const router = useRouter();

  // function for handling form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // create a FormData object
    const form = new FormData();
    form.append("email", formData.email);
    form.append("password", formData.password);
    // call the login function
    const result = await login(form);
    // if login fails
    if (!result.success) {
      // set errors
      setErrors(result.errors!);
    } else {
      // Fetch the user role asynchronously
      const userRole = await fetchUserRole();

      // Wait for the userRole to be available before redirecting
      if (!userRole) {
        console.error("User role is not available yet.");
        return;
      }

      // Redirect user based on their role
      setIsRedirecting(true); // Prevent multiple redirects
      if (userRole === "superAdmin") {
        router.push("/dashboard/superAdmin");
      } else if (userRole === "admin") {
        router.push("/dashboard/admin");
      } else if (userRole === "teacher") {
        router.push("/dashboard/teacher");
      } else if (userRole === "parent") {
        router.push("/dashboard/parent");
      } else {
        router.push("/dashboard/student");
      }
    }
  };

  // react hook form
  const form = useForm();

  return (
    <div className="place-items-center place-content-center my-30">
      {/* Form - shadcn */}
      <Form {...form}>
        {/* Form - React Hook Form */}
        <form onSubmit={handleSubmit} className="flex-row max-w-sm space-y-8">
          {/* Form Title */}
          <h1 className="text-2xl/8 sm:text-xl/8 font-bold">
            Sign in to your account
          </h1>
          {errors.general && (
            <p className="text-red-500">{errors.general[0]}</p>
          )}
          {/* Email input field */}
          <FormField
            control={form.control}
            name="email"
            render={() => (
              <FormItem>
                <FormLabel htmlFor="email" className="text-base sm:text-sm">
                  Email or Phone
                </FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    id="email"
                    value={formData.email}
                    className="h-12 sm:h-10"
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </FormControl>
                {errors.email && (
                  <p className="text-red-500 text-base sm:text-sm">
                    {errors.email[0]}
                  </p>
                )}
              </FormItem>
            )}
          />
          {/* Password input field */}
          <FormField
            control={form.control}
            name="password"
            render={() => (
              <FormItem>
                <FormLabel htmlFor="password" className="text-base sm:text-sm">
                  Password
                </FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    id="password"
                    value={formData.password}
                    className="h-12 sm:h-10"
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                  />
                </FormControl>
                {errors.password && (
                  <p className="text-red-500 text-base sm:text-sm">
                    {errors.password[0]}
                  </p>
                )}
              </FormItem>
            )}
          />
          {/* Checkbox and Forgot Password */}
          <div className="flex justify-between">
            {/* Checkbox */}
            <div className="flex items-center space-x-2">
              <Checkbox id="terms" />
              <Label htmlFor="terms" className="text-base sm:text-sm">
                Remember Me
              </Label>
            </div>
            {/* Forgot Password */}
            <p className="underline text-base sm:text-sm font-semibold">
              Forgot Password?
            </p>
          </div>
          {/* Login button */}
          <Button
            type="submit"
            disabled={isRedirecting}
            className="w-full text-base sm:text-sm py-6 sm:py-5"
          >
            Login
          </Button>
          {/* How to register */}
          <p className="text-base sm:text-sm">
            Don&apos;t have an account?{" "}
            <span className="underline">How to register</span>
          </p>
          {/* T's & C's */}
          <p className="text-xs">
            By logging in you agree to our{" "}
            <span className="underline">Terms of Use</span> and our{" "}
            <span className="underline">Privacy Policy</span>
          </p>
        </form>
      </Form>
    </div>
  );
};

export default LoginForm;
