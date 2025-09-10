export const SESSION_COOKIE_NAME = "__session";

export const Routes = {
  DASHBOARD: "/dashboard",
  ROOT: "/",
} as const;

export const Regex = {
  YOUTUBE_USER_CHANNEL:
    /https?:\/\/(?:www\.)?youtube\.com\/(?:(@[a-zA-Z0-9_-]+)(?:\/.*)?|channel\/([a-zA-Z0-9_-]+)(?:\/.*)?)/,
  YOUTUBE_VIDEO_LINK:
    /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/|shorts\/)|(?:(?:watch)?\?v(?:i)?=|&v(?:i)?=))([^#&?]*).*/,
};

export const LOCAL_USER_SETTINGS = "local-user-settings";
