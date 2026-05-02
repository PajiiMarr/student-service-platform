import { useState, useEffect } from "react";
import { formatFormErrors } from "~/utils/handler/error-handler";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

export function SignupForm({ fetcher }: { fetcher: any }) {
  const errors = fetcher.data?.errors;
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [passwordStrength, setPasswordStrength] = useState("");

  // Transform errors when they come from the server
  useEffect(() => {
    if (errors) {
      setFieldErrors(formatFormErrors(errors));
    }
  }, [errors]);

  // Password strength checker (optional)
  const checkPasswordStrength = (password: string) => {
    if (password.length === 0) {
      setPasswordStrength("");
      return;
    }
    if (password.length < 8) {
      setPasswordStrength("weak");
    } else if (password.length < 12) {
      setPasswordStrength("medium");
    } else {
      setPasswordStrength("strong");
    }
  };

  return (
    <div className="flex justify-center items-center w-full h-[80vh]">
      <fetcher.Form method="post" className="p-7 rounded-lg lg:shadow-lg w-full lg:w-1/3">
        <h2 className="text-2xl font-bold text-center">Create your account</h2>
        <p className="text-center mb-6">Sign up to get started</p>

        {/* Email field */}
        <div className="mb-4">
          <div className="flex">
            <Label htmlFor="email" className="mb-2">
              Email <span className="text-red-500">*</span>
            </Label>
            {fieldErrors?.email && (
              <p className="ms-2 mb-2 text-xs text-red-600 flex items-center">
                {fieldErrors.email}
              </p>
            )}
          </div>
          <Input
            type="email"
            name="email"
            id="email"
            className={fieldErrors?.email ? "border-red-500 bg-red-50" : ""}
            placeholder="Enter your email"
            required
          />
        </div>

        {/* Username field */}
        <div className="mb-4">
          <div className="flex">
            <Label htmlFor="username" className="mb-2">
              Username <span className="text-red-500">*</span>
            </Label>
            {fieldErrors?.username && (
              <p className="ms-2 mb-2 text-xs text-red-600 flex items-center">
                {fieldErrors.username}
              </p>
            )}
          </div>
          <Input
            type="text"
            name="username"
            id="username"
            className={fieldErrors?.username ? "border-red-500 bg-red-50" : ""}
            placeholder="Choose a username"
            required
          />
        </div>

        {/* Password field */}
        <div className="mb-4">
          <div className="flex">
            <Label htmlFor="password" className="mb-2">
              Password <span className="text-red-500">*</span>
            </Label>
            {fieldErrors?.password && (
              <p className="ms-2 mb-2 text-xs text-red-600 flex items-center">
                {fieldErrors.password}
              </p>
            )}
          </div>
          <Input
            type="password"
            name="password"
            id="password"
            className={fieldErrors?.password ? "border-red-500 bg-red-50" : ""}
            placeholder="Create a password (min. 8 characters)"
            onChange={(e) => checkPasswordStrength(e.target.value)}
            required
          />
          {passwordStrength && (
            <p
              className={`text-xs mt-1 ${
                passwordStrength === "weak"
                  ? "text-red-500"
                  : passwordStrength === "medium"
                    ? "text-yellow-500"
                    : "text-green-500"
              }`}
            >
              Password strength: {passwordStrength}
            </p>
          )}
        </div>

        {/* Confirm Password field */}
        <div className="mb-4">
          <div className="flex">
            <Label htmlFor="confirm_password" className="mb-2">
              Confirm Password <span className="text-red-500">*</span>
            </Label>
            {fieldErrors?.confirm_password && (
              <p className="ms-2 mb-2 text-xs text-red-600 flex items-center">
                {fieldErrors.confirm_password}
              </p>
            )}
          </div>
          <Input
            type="password"
            name="confirm_password"
            id="confirm_password"
            className={fieldErrors?.confirm_password ? "border-red-500 bg-red-50" : ""}
            placeholder="Confirm your password"
            required
          />
        </div>

        {/* Submit */}
        <div className="w-full">
          <button
            type="submit"
            className="rounded text-center text-white bg-red-700 w-full mt-5 p-2 hover:bg-red-800 transition-colors disabled:opacity-50"
            disabled={fetcher.state === "submitting"}
          >
            {fetcher.state === "submitting" ? "Signing up..." : "Sign up"}
          </button>
        </div>

        {/* General error */}
        {fieldErrors?.general && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm text-center flex items-center justify-center">
              {fieldErrors.general}
            </p>
          </div>
        )}
      </fetcher.Form>
    </div>
  );
}