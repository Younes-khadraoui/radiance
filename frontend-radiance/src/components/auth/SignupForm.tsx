import * as React from "react";
import { useMutation } from "@apollo/client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { REGISTER_USER } from "@/graphql/mutations";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}
export function SignupForm({ className, ...props }: UserAuthFormProps) {
  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [username, setUsername] = React.useState<string>("");
  const [registerUser, { loading, error }] = useMutation(REGISTER_USER);

  const navigate = useNavigate();

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();

    try {
      const { data } = await registerUser({
        variables: { email, username, password },
      });
      const token = data?.register.token;
      localStorage.setItem("authToken", token);

      setEmail("");
      setPassword("");
      setUsername("");
      navigate("/");
      window.location.reload();
    } catch (error) {
      console.error("Signup failed:", error);
    }
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={onSubmit}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="email">
              Email
            </Label>
            <Input
              id="email"
              placeholder="name@example.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
            <Label className="sr-only" htmlFor="username">
              Username
            </Label>
            <Input
              id="username"
              placeholder="Radiance Username"
              autoCapitalize="none"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
            />
            <Label className="sr-only" htmlFor="password">
              Password
            </Label>
            <Input
              id="password"
              placeholder="Password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error.message}</p>}
          <Button disabled={loading}>Sign up with Email</Button>
        </div>
      </form>
    </div>
  );
}
