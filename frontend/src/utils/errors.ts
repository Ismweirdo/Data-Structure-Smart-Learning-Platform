import axios from "axios";

interface ValidationError {
  msg?: string;
  message?: string;
}

export function getErrorMessage(error: unknown, fallback = "操作失败") {
  if (axios.isAxiosError(error)) {
    const detail = error.response?.data?.detail;
    if (typeof detail === "string") return detail;
    if (Array.isArray(detail)) {
      return detail
        .map((item: ValidationError) => item.msg || item.message)
        .filter(Boolean)
        .join("；") || fallback;
    }
    return error.message || fallback;
  }

  if (error instanceof Error) return error.message;
  return fallback;
}
