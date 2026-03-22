export function SignupForm({ fetcher }: { fetcher: any }) {
  const errors = fetcher.data?.errors;

  return (
    <div className="flex justify-center items-center w-full h-full">
      <fetcher.Form method="post" className="p-10 rounded-lg shadow-lg w-1/4">
        <h2>Create your account</h2>

        <div className="flex flex-col my-5">
          <label htmlFor="email">Email</label>
          {errors?.email && (
            <p className="ml-2 text-xs text-red-600">{errors.email}</p>
          )}
          <input
            type="email"
            name="email"
            id="email"
            className="border rounded-lg p-2"
          />
        </div>

        <div className="flex flex-col my-5">
          <label htmlFor="username">Username</label>
          {errors?.username && (
            <p className="ml-2 text-xs text-red-600">{errors.username}</p>
          )}
          <input
            type="text"
            name="username"
            id="username"
            className="border rounded-lg p-2"
          />
        </div>

        <div className="flex flex-col my-5">
          <label htmlFor="password">Password</label>
          {errors?.password && (
            <p className="ml-2 text-xs text-red-600">{errors.password}</p>
          )}
          <input
            type="password"
            name="password"
            id="password"
            className="border rounded-lg p-2"
          />
        </div>

        <div className="flex flex-col my-5">
          <label htmlFor="password">Confirm Password</label>
          <input
            type="password"
            name="confirm_password"
            id="confirm_password"
            className="border rounded-lg p-2"
          />
        </div>

        <div className="flex flex-col mt-3">
          <button
            className="bg-red-500 rounded-lg p-2 text-white"
            type="submit"
          >
            {fetcher.state === "submitting" ? "Signing up..." : "Signup"}
          </button>
        </div>

        {errors?.general && (
          <p className="text-red-600 text-sm text-center mt-2">
            {errors?.general}
          </p>
        )}
      </fetcher.Form>
    </div>
  );
}
