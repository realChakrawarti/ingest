// TODO: Retry, throttle, cancel after 10 seconds

import Log from "~/shared/utils/terminal-logger";

type EndpointPrefixes =
  | "archives"
  | "catalogs"
  | "users"
  | "logout"
  | "youtube"
  | "feedback";
export type EndpointURL = `/${EndpointPrefixes}${string}`;

import type { ApiResponse } from "../next/nx-response";

// biome-ignore lint/suspicious/noExplicitAny: Remove any with unknown and make sure to type all its usages
async function fetchApi<T = any>(endpoint: EndpointURL, options?: RequestInit) {
  const URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}${endpoint}`;

  const response: Promise<ApiResponse<T>> = fetch(URL, options)
    .then((data) => data.json())
    .catch((err) => {
      Log.fatal(`Failed on ${URL}`, err);
    });

  const awaitedResponse = await response;

  if (!awaitedResponse?.success) {
    Log.fail("An error occurred while fetching the data.");
  }

  return response;
}

export default fetchApi;
