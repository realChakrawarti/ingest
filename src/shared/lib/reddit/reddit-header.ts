import appConfig from "~/shared/app-config";

export function redditRequestHeaders(): Headers {
  const headers = new Headers();
  headers.set(
    "User-Agent",
    `web:ingest.707x.in:v${appConfig.version} (by /u/CURVX)`
  );
  headers.set("Accept", "application/json");

  return headers;
}
