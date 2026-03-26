// User-friendly error message mapping
export const errorMessages: Record<string, string> = {
  // Database/technical messages to user-friendly messages
  "duplicate key value violates unique constraint": "This email is already registered. Please use a different email or login.",
  "Email already in use": "This email is already registered. Would you like to login instead?",
  "Username already exists": "This username is taken. Please choose another one.",
  "password too short": "Password must be at least 8 characters long.",
  "invalid email format": "Please enter a valid email address (e.g., name@example.com).",
  "email is required": "Email address is required.",
  "username is required": "Username is required.",
  "password is required": "Password is required.",
  "passwords do not match": "Passwords do not match. Please re-enter your password.",
  "connection refused": "Unable to connect to the server. Please check your internet connection.",
  "network error": "Network error. Please check your internet connection and try again.",
  "internal server error": "Something went wrong on our end. Please try again later.",
  "request failed with status code 500": "Server error. Our team has been notified. Please try again later.",
  "request failed with status code 503": "Service temporarily unavailable. Please try again in a few minutes.",
  "too many requests": "Too many attempts. Please wait a moment before trying again.",
  "token expired": "Your session has expired. Please refresh and try again.",
  "unauthorized": "You're not authorized to perform this action.",
  "forbidden": "You don't have permission to access this resource.",
  "invalid credentials": "Invalid email or password. Please try again.",
  "user not found": "No account found with this email address.",
  "account locked": "Your account has been locked due to too many failed attempts. Please reset your password.",
  "email not verified": "Please verify your email address before logging in.",
};

// Helper function to format error messages
export const formatErrorMessage = (error: string | any): string => {
  // Handle different error types
  let errorMessage = "";
  
  if (typeof error === 'string') {
    errorMessage = error;
  } else if (error?.message) {
    errorMessage = error.message;
  } else if (error?.data?.message) {
    errorMessage = error.data.message;
  } else {
    return "Something went wrong. Please try again.";
  }
  
  // Check for exact matches
  if (errorMessages[errorMessage]) {
    return errorMessages[errorMessage];
  }
  
  // Check for partial matches
  for (const [key, message] of Object.entries(errorMessages)) {
    if (errorMessage.toLowerCase().includes(key.toLowerCase())) {
      return message;
    }
  }
  
  // Default fallback
  return "Something went wrong. Please try again.";
};

// Format multiple errors from form data
export const formatFormErrors = (errors: Record<string, any>): Record<string, string> => {
  const formatted: Record<string, string> = {};

  if (errors) {
    Object.keys(errors).forEach(key => {
      const value = errors[key];

      if (typeof value === "string") {
        // Try to map it, but fall back to the original string (not "something went wrong")
        const mapped = errorMessages[value] 
          ?? Object.entries(errorMessages).find(([k]) => value.toLowerCase().includes(k.toLowerCase()))?.[1];
        formatted[key] = mapped ?? value; // ← use original if no mapping found
      } else if (Array.isArray(value) && value.length > 0) {
        // Laravel-style arrays: { field: ["message"] }
        formatted[key] = value[0];
      } else {
        formatted[key] = formatErrorMessage(value);
      }
    });
  }

  return formatted;
};

// Handle API error responses
export const handleApiError = (error: any): { message: string; status?: number } => {
  const status = error?.response?.status;
  let message = formatErrorMessage(error);
  
  // Add specific handling for different status codes
  if (status === 401) {
    message = "Please login to continue.";
  } else if (status === 403) {
    message = "You don't have permission to perform this action.";
  } else if (status === 404) {
    message = "The requested resource was not found.";
  } else if (status === 429) {
    message = "Too many requests. Please try again later.";
  } else if (status === 500) {
    message = "Server error. Our team has been notified.";
  }
  
  return { message, status };
};

// Validation error messages (frontend validation)
export const validationMessages = {
  required: (field: string) => `${field} is required.`,
  minLength: (field: string, min: number) => `${field} must be at least ${min} characters.`,
  maxLength: (field: string, max: number) => `${field} cannot exceed ${max} characters.`,
  email: "Please enter a valid email address.",
  passwordMatch: "Passwords do not match.",
  passwordStrength: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
};