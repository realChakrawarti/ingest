import type { PodcastSearchResult } from "../models";

import {
  generatePodcastIndexHeaders,
  PODCAST_SEARCH,
} from "~/shared/lib/api/podcast-index-endpoints";
import { jsonResult } from "~/shared/utils/json-return";
import Log from "~/shared/utils/terminal-logger";

export async function getPodcasts(input: string) {
  try {
    const response = await fetch(PODCAST_SEARCH(input), {
      headers: generatePodcastIndexHeaders(),
    });

    if (!response.ok) {
      const text = await response.text();
      Log.fail(
        `Failed to fetch podcasts:\n${response.status}\n${response.statusText}\n${text}`
      );
      return jsonResult.error("Unable to query the podcast.").return();
    }

    const data: PodcastSearchResult = await response.json();

    if (data.status && data.feeds.length) {
      return jsonResult.success(data.feeds).return();
    }

    return jsonResult.success([]).return();
  } catch (err) {
    Log.fail(err);
    return jsonResult.error("Unable to query the podcast.").return();
  }
}