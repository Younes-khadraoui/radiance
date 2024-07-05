import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { SignupForm } from "@/components/auth/SignupForm";

export default function Signup() {
  return (
    <div className="relative h-screen items-center justify-center grid ">
      <div className="absolute top-0 left-0 w-screen flex items-center justify-between p-4 ">
        <a href="/">
          <div className="font-extrabold text-xl cursor-pointer text-white">
            Radiance
          </div>
        </a>
        <a href="/login" className={cn(buttonVariants())}>
          Login
        </a>
      </div>
      <div className="lg:p-8  pt-20 md:pt-0 px-10 md:px-0">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight text-white">
              Create an account
            </h1>
            <p className="text-sm text-gray-300">
              Enter your email below to create your account
            </p>
          </div>
          <SignupForm />
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 ">Or continue with</span>
            </div>
          </div>
          <p className="px-8 text-center text-sm text-gray-300">
            By clicking continue, you agree to our{" "}
            <a
              href="/terms"
              className="underline underline-offset-4 hover:text-primary"
            >
              Terms of Service{" "}
            </a>
            and{" "}
            <a
              href="/privacy"
              className="underline underline-offset-4 hover:text-primary"
            >
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
