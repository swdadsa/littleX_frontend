import axios from "axios";

export function getApiErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    const dataMessage = error.response?.data?.data;
    if (typeof dataMessage === "string" && dataMessage.trim().length > 0) {
      return dataMessage;
    }

    const message = error.response?.data?.message ?? error.message;
    if (typeof message === "string" && message.trim().length > 0) {
      return message;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Request failed. Please try again.";
}
