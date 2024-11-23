"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeNoneIcon } from "@radix-ui/react-icons";
import { EyeIcon } from "lucide-react";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import axios from "axios";
import { toast } from "sonner";
import { signin } from "@/lib/utils";
import { useRouter } from 'next/navigation';

const userLoginFormSchema = z.object({
  emailAddress: z
    .string({ required_error: "Email address is required" }),
  password: z
    .string({ required_error: "Password is required" })
    .min(1, "Password is required")
    .min(8, "Password must have more than 8 characters"),
});

type UserLoginFormData = z.infer<typeof userLoginFormSchema>;

export default function Login() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const router = useRouter();

  const loginForm = useForm<UserLoginFormData>({
    resolver: zodResolver(userLoginFormSchema),
  });

  function onSubmit(values: UserLoginFormData) {
    console.log('[login]', values);
    setIsLoading(true);
    axios.post("/api/login", values)
      .then(({ data }) => {
        signin(data);
        router.push('/dashboard');
      })
      .catch((err) => {
        console.log(err);
        toast.error("Log in failed");
        setIsLoading(false);
      });
  }

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, [setShowPassword]);

  return (
    <div className="w-full h-screen flex justify-center">
      <div className="m-auto block p-3 w-96 pb-6">
        <p className="font-semibold text-5xl text-center mb-6">Techakids</p>
        <Form {...loginForm}>
          <form
            onSubmit={loginForm.handleSubmit(onSubmit)}
            className="flex w-full flex-col items-center gap-6"
          >
            <FormField
              control={loginForm.control}
              name="emailAddress"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter username"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={loginForm.control}
              name="password"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="Enter Password"
                        type={showPassword ? "text" : "password"}
                        {...field}
                        value={field.value ?? ""}
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 cursor-pointer">
                        {showPassword ? (
                          <EyeNoneIcon
                            className="h-5 w-5"
                            onClick={togglePasswordVisibility}
                          />
                        ) : (
                          <EyeIcon
                            className="h-5 w-5"
                            onClick={togglePasswordVisibility}
                          />
                        )}
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full rounded-full" disabled={isLoading}>
              LOG IN
              {isLoading && <LoadingSpinner className="w-4 h-4 ml-1" />}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
