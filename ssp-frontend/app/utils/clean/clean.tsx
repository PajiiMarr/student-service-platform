export function cleanInput(data: any): any {
  if (typeof data === "string") {
    return data
      .trim()
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;")
      .replace(/\\/g, "");
  }

  if (Array.isArray(data)) {
    return data.map(cleanInput);
  }

  if (typeof data === "object" && data !== null) {
    const cleaned: any = {};
    for (const key in data) {
      cleaned[key] = cleanInput(data[key]);
    }
    return cleaned;
  }

  return data;
}