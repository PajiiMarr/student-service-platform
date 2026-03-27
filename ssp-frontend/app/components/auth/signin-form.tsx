import { useState, useEffect } from "react";
import { Link } from "react-router";
import { formatFormErrors } from "~/utils/handler/error-handler";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

export function LoginForm({ fetcher }: { fetcher: any }) {
  const errors = fetcher.data?.errors;
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (errors) {
      setFieldErrors(formatFormErrors(errors));
    }
  }, [errors]);

  return (
    <div className="flex justify-center items-center w-full h-[80vh]">
      <fetcher.Form
        method="post"
        className="p-7 rounded-lg lg:shadow-lg w-full lg:w-1/3"
      >
        <h2 className="text-2xl font-bold text-center">Login your account</h2>

        {/* Username */}
        <div className="mb-2 mt-5">
          <div className="flex">
            <Label htmlFor="username" className="mb-2">
              Username<span className="text-red-500">*</span>
            </Label>
            {fieldErrors?.username && (
              <p className="ms-2 mb-2 text-xs text-red-600 flex items-center">
                {fieldErrors.username}
              </p>
            )}
          </div>
          <Input
            id="username"
            name="username"
            type="text"
            className={fieldErrors?.username ? "border-red-500 bg-red-50" : ""}
          />
        </div>

        {/* Password */}
        <div className="mb-2">
          <div className="flex">
            <Label htmlFor="password" className="mb-2">
              Password<span className="text-red-500">*</span>
            </Label>
            {fieldErrors?.password && (
              <p className="ms-2 mb-2 text-xs text-red-600 flex items-center">
                {fieldErrors.password}
              </p>
            )}
          </div>
          <Input
            id="password"
            name="password"
            type="password"
            className={fieldErrors?.password ? "border-red-500 bg-red-50" : ""}
          />
        </div>

        {/* Submit */}
        <div className="w-full mt-5">
          <button
            type="submit"
            className="rounded text-center text-white bg-red-700 w-full p-2 hover:bg-red-800 transition-colors disabled:opacity-50"
            disabled={fetcher.state === "submitting"}
          >
            {fetcher.state === "submitting" ? "Logging in..." : "Login"}
          </button>
        </div>

        {/* Signup Link */}
        <div className="flex flex-col mt-3 text-center">
          <Link to="/signup" className="text-blue-500 hover:underline cursor-pointer">
            Don't have an account? Sign up
          </Link>
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