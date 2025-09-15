"use client";

import { Check, ChevronsUpDown, Settings } from "lucide-react";
import { useLayoutEffect, useState } from "react";
import { toast } from "sonner";

import type { ZUserSettings } from "~/entities/users/models";

import appConfig from "~/shared/app-config";
import { useLocalUserSettings } from "~/shared/hooks/use-local-user-settings";
import { indexedDB } from "~/shared/lib/api/dexie";
import fetchApi from "~/shared/lib/api/fetch";
import { LOCAL_USER_SETTINGS, videoLanguages } from "~/shared/lib/constants";
import { Button } from "~/shared/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/shared/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/shared/ui/dialog";
import { Input } from "~/shared/ui/input";
import { Label } from "~/shared/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "~/shared/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/shared/ui/select";
import { Separator } from "~/shared/ui/separator";
import { Slider } from "~/shared/ui/slider";
import { ToggleGroup, ToggleGroupItem } from "~/shared/ui/toggle-group";
import { cn } from "~/shared/utils/tailwind-merge";
import Log from "~/shared/utils/terminal-logger";

const initialSettings = {
  historyDays: 15,
  playbackRate: 1,
  syncId: "",
  videoLanguage: "",
  watchedPercentage: appConfig.watchedPercentage,
};

async function checkSyncId(syncId: string) {
  console.log("Validating SyncID: ", syncId);
  const result = fetchApi(`/session/valid?syncId=${syncId}`);
  return result;
}

const playbackRates = [0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0];
const historyPeriods = [0, 15, 30, 60, 90];

async function pushUserSettings(settings: ZUserSettings) {
  const { syncId, ...filterSettings } = settings;

  const result = await fetchApi(
    `/session/update?type=settings&syncId=${syncId}`,
    {
      body: JSON.stringify(filterSettings),
      method: "PUT",
    }
  );

  if (result.success) {
    toast("Settings has been pushed and is ready to synced across devices.");
  }
}

async function getUserSettings(syncId: string) {
  try {
    const result = await fetchApi(
      `/session/get?type=settings&syncId=${syncId}`
    );
    if (result.success) {
      console.log(">>>Fetched sync data", result.data);
      return result.data;
    }
  } catch (err) {
    Log.fail(err);
  }

  return null;
}

export function UserSettings() {
  const { localUserSettings, setLocalUserSettings, setLocalUserSettingsField } =
    useLocalUserSettings(initialSettings);

  const [syncId, setSyncId] = useState<string>(() => {
    if (globalThis.localStorage?.getItem(LOCAL_USER_SETTINGS)) {
      const parsedData = JSON.parse(
        globalThis.localStorage.getItem(LOCAL_USER_SETTINGS) ?? "{}"
      );

      return parsedData.syncId ?? "";
    }
  });

  useLayoutEffect(() => {
    if (syncId) {
      getUserSettings(syncId);
    }
  }, []);

  const [userSettings, setUserSettings] = useState<ZUserSettings>(
    JSON.parse(globalThis.localStorage?.getItem(LOCAL_USER_SETTINGS) ?? "{}")
  );

  function handleLocalChange(key: keyof ZUserSettings, value: any) {
    setUserSettings((prev) => ({ ...prev, [key]: value }));
  }

  function resetSettings() {
    setLocalUserSettings(initialSettings);
    toast("Global settings has been reset.");
    window.location.reload();
  }

  async function applySettings() {
    setLocalUserSettings(userSettings);
    await pushUserSettings(userSettings);

    toast("Global settings has been updated.");
    window.location.reload();
  }

  async function clearHistory() {
    await indexedDB["history"].clear();
    toast("Watch history has been cleared.");
  }

  async function clearWatchLater() {
    await indexedDB["watch-later"].clear();
    toast("Watch later has been cleared.");
  }

  async function validateSyncId() {
    if (syncId?.length === 16) {
      try {
        const result = await checkSyncId(syncId);

        if (result.success) {
          setLocalUserSettingsField("syncId", syncId);
          toast("Provided SyncID is valid.");
          const syncedData = await getUserSettings(syncId);
          if (syncedData) {
            console.log(">>>SYNCED DATA", syncedData);
            setLocalUserSettings({ syncId, ...syncedData });
          }
        }
      } catch (_err) {
        toast("Provided SyncID doesn't match any user.");
      }
    }
  }

  return (
    <section>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            aria-label="Open feedback modal"
            variant="ghost"
            className={cn(
              "w-full justify-start px-2",
              "hover:bg-primary/5 hover:text-primary/80"
            )}
          >
            <Settings className="mr-2 h-4 w-4" />
            <p className="tracking-wide">Settings</p>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>User settings</DialogTitle>
            <DialogDescription>
              Personalize your global experience
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex flex-col gap-3"
          >
            <div className="grid grid-cols-1 md:grid-cols-[140px_1fr] items-center gap-2 justify-start">
              <Label className=" text-primary" htmlFor="sync-id">
                Sync ID
              </Label>
              <div className="space-y-1">
                <div className="flex gap-1 items-center">
                  <Input
                    id="sync-id"
                    value={syncId}
                    onChange={(e) => setSyncId(e.target.value)}
                    placeholder="Enter SyncID for cross-device synchronization"
                  />
                  {localUserSettings.syncId ? (
                    <Button
                      onClick={() => {
                        setSyncId("");
                        setLocalUserSettingsField("syncId", "");
                      }}
                      variant="outline"
                    >
                      Reset
                    </Button>
                  ) : (
                    <Button onClick={validateSyncId}>Validate</Button>
                  )}
                </div>
              </div>
            </div>
            <Separator orientation="horizontal" />
            <div className="grid grid-cols-1 md:grid-cols-[140px_1fr] items-center gap-2 justify-start">
              <Label htmlFor="playback-rate" className=" text-primary">
                Playback Rate
              </Label>
              <ToggleGroup
                id="playback-rate"
                type="single"
                value={userSettings?.playbackRate?.toString()}
                onValueChange={(value) =>
                  value &&
                  handleLocalChange("playbackRate", Number.parseFloat(value))
                }
                className="flex gap-1 items-center"
              >
                {playbackRates.map((rate) => (
                  <ToggleGroupItem
                    key={rate}
                    className="p-1 h-6"
                    value={rate.toString()}
                  >
                    {rate}x
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-[140px_1fr] items-center gap-2 justify-start">
              <Label className=" text-primary" htmlFor="audio-language">
                Audio Language
              </Label>
              <VideoLanguagesCombo
                handleLocalChange={handleLocalChange}
                localUserSettings={userSettings}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[140px_1fr] items-center gap-2 justify-start">
              <Label className=" text-primary" htmlFor="history-days">
                Keep History
              </Label>
              <Select
                value={userSettings?.historyDays?.toString()}
                onValueChange={(value) =>
                  handleLocalChange("historyDays", value)
                }
              >
                <SelectTrigger id="history-days" className="w-auto">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {historyPeriods.map((period) => (
                    <SelectItem key={period} value={period.toString()}>
                      {period !== 0 ? `${period} days` : "Never"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-[140px_1fr] items-center gap-2 justify-start">
              <Label className=" text-primary" htmlFor="watched-percentage">
                Mark as Watched ({userSettings.watchedPercentage}%)
              </Label>
              <Slider
                onValueChange={(value) =>
                  handleLocalChange("watchedPercentage", value[0])
                }
                id="watched-percentage"
                value={[userSettings.watchedPercentage]}
                min={80}
                max={100}
                step={5}
              />
            </div>
            <Separator orientation="horizontal" />
            <div className="grid grid-cols-1 md:grid-cols-[140px_1fr] items-center gap-2 justify-start">
              <Label htmlFor="clear-watch-later" className="text-primary">
                Clear all Watch later
              </Label>
              <Button
                variant="outline"
                id="clear-watch-later"
                onClick={clearWatchLater}
              >
                Clear
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-[140px_1fr] items-center gap-2 justify-start">
              <Label htmlFor="clear-history" className="text-primary">
                Clear history records
              </Label>
              <Button
                variant="outline"
                id="clear-history"
                onClick={clearHistory}
              >
                Clear
              </Button>
            </div>
            <Separator orientation="horizontal" />
            <div className="grid grid-cols-[1fr_1fr] items-center gap-2 justify-start">
              <Button onClick={resetSettings}>Reset</Button>
              <Button onClick={applySettings}>Apply</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
}

export function VideoLanguagesCombo({
  localUserSettings,
  handleLocalChange,
}: {
  localUserSettings: ZUserSettings;
  handleLocalChange: (
    key: keyof ZUserSettings,
    value: ZUserSettings[keyof ZUserSettings]
  ) => void;
}) {
  const [open, setOpen] = useState(false);

  const localLanguage = localUserSettings.videoLanguage;

  return (
    <div className="w-full">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            // biome-ignore lint/a11y/useSemanticElements: ShadCN semantics
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {localLanguage
              ? videoLanguages.find(
                  (language) => language.value === localLanguage
                )?.label
              : "Default"}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command className="w-full">
            <CommandInput placeholder="Search language..." className="h-9" />
            <CommandList>
              <CommandEmpty>No such language found.</CommandEmpty>
              <CommandGroup>
                {videoLanguages.map((language) => (
                  <CommandItem
                    key={language.value}
                    value={language.value}
                    onSelect={(currentValue) => {
                      if (currentValue === localLanguage) {
                        handleLocalChange("videoLanguage", "zxx");
                      } else {
                        handleLocalChange("videoLanguage", currentValue);
                      }

                      setOpen(false);
                    }}
                  >
                    {language.label}
                    <Check
                      className={cn(
                        "ml-auto",
                        localLanguage === language.value
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
