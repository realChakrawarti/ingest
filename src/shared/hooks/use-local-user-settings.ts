import type { ZUserSettings } from "~/entities/users/models";

import { LOCAL_USER_SETTINGS } from "../lib/constants";
import { useLocalStorage } from "./use-local-storage";

export function useLocalUserSettings(initialData: ZUserSettings | null) {
  const [localUserSettings, setLocalStorage] = useLocalStorage<ZUserSettings>(
    LOCAL_USER_SETTINGS,
    initialData
  );

  type UserSettingsKeys = keyof ZUserSettings;

  function setLocalUserSettingsField(
    key:
      | "historyDays"
      | "playbackRate"
      | "syncId"
      | "videoLanguage"
      | "watchedPercentage",
    value: ZUserSettings[UserSettingsKeys]
  ) {
    setLocalStorage({
      ...localUserSettings,
      [key]: value,
    });
  }

  function setLocalUserSettings(data: ZUserSettings) {
    setLocalStorage(data);
  }

  return { localUserSettings, setLocalUserSettings, setLocalUserSettingsField };
}
