import { cleanInput } from "./clean";

function cleanFormData(formData: FormData) {
  const cleaned: Record<string, string> = {};

  for (const [key, value] of formData.entries()) {
    cleaned[key] = cleanInput(String(value));
  }

  return cleaned;
}

export default cleanFormData;