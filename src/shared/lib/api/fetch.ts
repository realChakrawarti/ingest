// TODO: Retry, throttle, cancel after 10 seconds

import { ApiResponse } from "../next/nx-response";
import TerminalLogger from "../terminal-logger";

async function fetchApi<T = any>(endpoint: string, options?: RequestInit) {
  if (!endpoint.startsWith("/")) {
    TerminalLogger.fail("Please append a trailing '/' on the endpoint");
    throw new Error("Please append a trailing '/' on the endpoint");
  }

  const URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}${endpoint}`;

  const response: Promise<ApiResponse<T>> = fetch(URL, options)
    .then((data) => data.json())
    .catch((err) => {
      TerminalLogger.fail(String(err));
      throw new Error(err?.message);
    });
  const awaitedResponse = await response;

  if (!awaitedResponse.success) {
    const error = new Error("An error occurred while fetching the data.");
    error.cause = response;
    throw error;
  }

  return response;
}

export default fetchApi;
