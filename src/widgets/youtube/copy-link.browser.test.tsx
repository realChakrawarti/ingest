import { beforeEach, expect, test, vi } from "vitest";
import { render } from "vitest-browser-react";

import { CopyLink } from "./components";

beforeEach(() => {
  vi.restoreAllMocks();
});

test("renders the copy link action", async () => {
  const screen = await render(<CopyLink videoId="test-video-id" />);

  await expect
    .element(screen.getByRole("button", { name: /copy link/i }))
    .toBeInTheDocument();
});

test("copies the YouTube link to the clipboard", async () => {
  vi.useFakeTimers({ shouldAdvanceTime: true });

  try {
    const writeText = vi.fn().mockResolvedValue(undefined);

    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });

    const screen = await render(<CopyLink videoId="dQw4w9WgXcQ" />);

    await screen.getByRole("button", { name: /copy link/i }).click();

    expect(writeText).toHaveBeenCalledWith(
      "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    );
  } finally {
    vi.useRealTimers();
  }
});
