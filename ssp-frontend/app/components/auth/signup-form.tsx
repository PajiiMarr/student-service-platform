import { useState, useEffect } from "react";
import { formatFormErrors } from "~/utils/handler/error-handler";

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
    <div className="flex justify-center items-center w-full h-full">
      <fetcher.Form method="post" className="p-10 rounded-lg shadow-lg w-1/4">
        <h2 className="text-2xl font-bold text-center mb-6">Create your account</h2>

        {/* Email field */}
        <div className="flex flex-col my-5">
          <label htmlFor="email" className="mb-2 font-medium">
            Email <span className="text-red-500">*</span>
          </label>
          {fieldErrors?.email && (
            <p className="mb-2 text-xs text-red-600 flex items-center">
              {fieldErrors.email}
            </p>
          )}
          <input
            type="email"
            name="email"
            id="email"
            className={`border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              fieldErrors?.email ? "border-red-500 bg-red-50" : "border-gray-300"
            }`}
            placeholder="Enter your email"
            required
          />
        </div>

        {/* Username field */}
        <div className="flex flex-col my-5">
          <label htmlFor="username" className="mb-2 font-medium">
            Username <span className="text-red-500">*</span>
          </label>
          {fieldErrors?.username && (
            <p className="mb-2 text-xs text-red-600 flex items-center">
              {fieldErrors.username}
            </p>
          )}
          <input
            type="text"
            name="username"
            id="username"
            className={`border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              fieldErrors?.username ? "border-red-500 bg-red-50" : "border-gray-300"
            }`}
            placeholder="Choose a username"
            required
          />
        </div>

        {/* Password field */}
        <div className="flex flex-col my-5">
          <label htmlFor="password" className="mb-2 font-medium">
            Password <span className="text-red-500">*</span>
          </label>
          {fieldErrors?.password && (
            <p className="mb-2 text-xs text-red-600 flex items-center">
              {fieldErrors.password}
            </p>
          )}
          <input
            type="password"
            name="password"
            id="password"
            className={`border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              fieldErrors?.password ? "border-red-500 bg-red-50" : "border-gray-300"
            }`}
            placeholder="Create a password (min. 8 characters)"
            onChange={(e) => checkPasswordStrength(e.target.value)}
            required
          />
          {passwordStrength && (
            <p className={`text-xs mt-1 ${
              passwordStrength === "weak" ? "text-red-500" : 
              passwordStrength === "medium" ? "text-yellow-500" : 
              "text-green-500"
            }`}>
              Password strength: {passwordStrength}
            </p>
          )}
        </div>

        {/* Confirm Password field */}
        <div className="flex flex-col my-5">
          <label htmlFor="confirm_password" className="mb-2 font-medium">
            Confirm Password <span className="text-red-500">*</span>
          </label>
          {fieldErrors?.confirm_password && (
            <p className="mb-2 text-xs text-red-600 flex items-center">
              {fieldErrors.confirm_password}
            </p>
          )}
          <input
            type="password"
            name="confirm_password"
            id="confirm_password"
            className={`border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              fieldErrors?.confirm_password ? "border-red-500 bg-red-50" : "border-gray-300"
            }`}
            placeholder="Confirm your password"
            required
          />
        </div>

        <div className="flex flex-col mt-3">
          <button
            className="bg-blue-500 hover:bg-blue-600 rounded-lg p-2 text-white font-medium transition-colors"
            type="submit"
            disabled={fetcher.state === "submitting"}
          >
            {fetcher.state === "submitting" ? "Signing up..." : "Sign up"}
          </button>
        </div>

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
