import { hash } from "crypto";

import appConfig from "~/shared/app-config";

const PIAuthKey = process.env.PODCAST_INDEX_AUTH_KEY;
const PISecretKey = process.env.PODCAST_INDEX_SECRET_KEY;

const podcastIndexApiBaseUrl = "https://api.podcastindex.org/api/1.0";

export function generatePodcastIndexHeaders() {
  const headers = new Headers();

  const HeaderTime = Math.floor(Date.now() / 1000);

  const key = PIAuthKey + PISecretKey + HeaderTime;
  const Authorization = hash("sha1", key, "hex");

  headers.set("User-Agent", `${appConfig.name}/${appConfig.version}`);
  headers.set("X-Auth-Key", PIAuthKey);
  headers.set("X-Auth-Date", `${HeaderTime}`);
  headers.set("Authorization", Authorization);

  return headers;
}

export const PODCAST_SEARCH = (query: string, limit: number = 10) =>
  `${podcastIndexApiBaseUrl}/search/byterm?q=${encodeURIComponent(query)}&max=${limit}`;

export const PODCAST_EPISODE_BY_ID = (
  id: number,
  since: number,
  limit: number = 10
) => {
  const url = `${podcastIndexApiBaseUrl}/episodes/byfeedid?id=${id}&since=${since}&max=${limit}&fulltext`;
  // oxlint-disable-next-line no-console
  console.log(url);
  return url;
};