import LoginForm from "@/components/login-form/page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | VisionMath",
  description: "Login to your VisionMath account",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <LoginForm />
    </div>
  );
}
