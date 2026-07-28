import { beforeEach, expect, test, vi } from "vitest";
import { render } from "vitest-browser-react";

import type { ZVideoMetadataCompatible } from "~/entities/catalogs/models";

import { indexedDB } from "~/shared/lib/api/dexie";
import { LOCAL_USER_SETTINGS } from "~/shared/lib/constants";

import MarkedWatched from "./marked-watched";

const mockVideo: ZVideoMetadataCompatible = {
  channelId: "UCtest-channel",
  channelTitle: "Test Channel",
  publishedAt: "2024-01-01T00:00:00Z",
  videoAvailability: "none",
  videoDescription: "A test video description.",
  videoDuration: 600,
  videoId: "test-video-id",
  videoThumbnail: "https://example.com/thumbnail.jpg",
  videoTitle: "Test Video",
};

const defaultUserSettings = {
  historyDays: 30,
  playbackRate: 1,
  syncId: "",
  thumbnailGrayscale: 0,
  videoLanguage: "",
  watchedPercentage: 94,
};

beforeEach(async () => {
  localStorage.clear();
  localStorage.setItem(
    LOCAL_USER_SETTINGS,
    JSON.stringify(defaultUserSettings)
  );

  await indexedDB.delete();
  await indexedDB.open();
});

test("renders the mark watched action", async () => {
  const screen = await render(<MarkedWatched video={mockVideo} />);

  await expect
    .element(screen.getByRole("button", { name: /marked watched/i }))
    .toBeInTheDocument();
});

test("stores watched progress in IndexedDB", async () => {
  vi.useFakeTimers({ shouldAdvanceTime: true });

  try {
    const screen = await render(<MarkedWatched video={mockVideo} />);

    await screen.getByRole("button", { name: /marked watched/i }).click();

    const history = await indexedDB.history.get(mockVideo.videoId);

    expect(history?.completed).toBeGreaterThan(
      defaultUserSettings.watchedPercentage
    );
  } finally {
    vi.useRealTimers();
  }
});

test("renders mark unwatched when history exceeds the threshold", async () => {
  await indexedDB.history.put({
    ...mockVideo,
    completed: 100,
    duration: 600,
    updatedAt: Date.now(),
  });

  const screen = await render(<MarkedWatched video={mockVideo} />);

  await expect
    .element(screen.getByRole("button", { name: /marked unwatched/i }))
    .toBeInTheDocument();
});