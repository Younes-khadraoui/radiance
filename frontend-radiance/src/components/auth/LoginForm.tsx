import * as React from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation } from "@apollo/client";
import { LOGIN_USER } from "@/graphql/mutations";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}
export function LoginForm({ className, ...props }: UserAuthFormProps) {
  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [LoginUser, { loading, error }] = useMutation(LOGIN_USER);

  const navigate = useNavigate();

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();

    try {
      const { data } = await LoginUser({
        variables: {
          email,
          password,
        },
      });
      if (data && data.login && data.login.token) {
        const { token } = data.login;
        localStorage.setItem("authToken", token);
      } else {
        console.error("Login failed: Unable to retrieve token from response.");
      }
      navigate("/");
      window.location.reload();
    } catch (error) {
      console.error("Login failed:", error);
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
            <Label className="sr-only" htmlFor="password">
              Password
            </Label>
            <Input
              id="password"
              placeholder="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              disabled={loading}
            />
          </div>
          {error && <p className="text-red-500">{error.message}</p>}
          <Button disabled={loading}>Log In with Email</Button>
        </div>
      </form>
    </div>
  );
}
