"use client";

import { Check, ChevronsUpDown, Settings } from "lucide-react";
import { type PropsWithChildren, useState } from "react";
import { toast } from "sonner";
import useSWRMutation from "swr/mutation";

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
import { getTimeDifference } from "~/shared/utils/time-diff";

import Spinner from "./spinner";

const initialSettings = {
  historyDays: 15,
  playbackRate: 1,
  syncId: "",
  videoLanguage: "",
  watchedPercentage: appConfig.watchedPercentage,
};

const playbackRates = [0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0];
const historyPeriods = [0, 15, 30, 60, 90];

function FormElementContainer({ children }: PropsWithChildren) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[140px_1fr] items-center gap-2 justify-items-start">
      {children}
    </div>
  );
}

export function UserSettings() {
  const { localUserSettings, setLocalUserSettings } =
    useLocalUserSettings(initialSettings);

  const {
    data: remoteUserSettings,
    trigger,
    isMutating: isSyncing,
  } = useSWRMutation(`${localUserSettings.syncId}:settings`, () =>
    fetchApi(`/users/get-sync?type=settings&syncId=${localUserSettings.syncId}`)
  );

  const { trigger: pushUserSettings, isMutating } = useSWRMutation(
    `update-${localUserSettings.syncId}:settings`,
    (_, { arg }: { arg: { settings: ZUserSettings } }) => {
      const { syncId, ...filterSettings } = arg.settings;
      return fetchApi(`/users/update-sync?type=settings&syncId=${syncId}`, {
        body: JSON.stringify(filterSettings),
        method: "PUT",
      });
    }
  );

  const [userSettings, setUserSettings] = useState<ZUserSettings>(() => {
    const localSettings = globalThis.localStorage?.getItem(LOCAL_USER_SETTINGS);
    if (localSettings) {
      return JSON.parse(localSettings);
    }

    return initialSettings;
  });

  function handleLocalChange(key: keyof ZUserSettings, value: any) {
    setUserSettings((prev) => ({ ...prev, [key]: value }));
  }

  function resetSettings() {
    setLocalUserSettings(initialSettings);
    toast("Global settings has been reset.");
    window.location.reload();
  }

  async function applySettings() {
    setLocalUserSettings({ ...localUserSettings, ...userSettings });

    if (!localUserSettings.syncId) {
      toast("Global settings has been updated.", {
        description: "Please wait, page will refresh automatically.",
      });
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    }

    const pushedResult = await pushUserSettings({
      settings: { ...userSettings, syncId: localUserSettings.syncId },
    });

    if (pushedResult?.success) {
      toast(
        "Settings have been pushed and are ready to synced across devices.",
        {
          description: "Please wait, page will refresh automatically.",
        }
      );
      await trigger();
    }

    setTimeout(() => {
      window.location.reload();
    }, 1500);
  }

  async function clearHistory() {
    await indexedDB["history"].clear();
    toast("Watch history has been cleared.");
  }

  async function clearWatchLater() {
    await indexedDB["watch-later"].clear();
    toast("Watch later has been cleared.");
  }

  async function handleSettingsSync() {
    const pushedResult = await pushUserSettings({
      settings: { ...userSettings, syncId: localUserSettings.syncId },
    });

    if (pushedResult?.success) {
      toast(
        "Settings have been pushed and are ready to synced across devices.",
        {
          description: "Please wait, page will refresh automatically.",
        }
      );

      const syncResult = await trigger();

      if (syncResult?.success) {
        const syncData = {
          ...localUserSettings,
          ...syncResult.data,
        };
        setUserSettings(syncData);
        setLocalUserSettings(syncData);
      }
      toast(syncResult?.message);
    }
  }

  return (
    <section>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            aria-label="Open settings modal"
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
            <FormElementContainer>
              <Label className=" text-primary" htmlFor="sync-id">
                Sync ID
              </Label>
              <div className="space-y-1 text-sm w-full">
                {localUserSettings.syncId ? (
                  <div className="flex gap-1 items-center justify-between">
                    <p>{localUserSettings.syncId}</p>
                    <Button
                      className="flex items-center gap-2"
                      disabled={isSyncing || isMutating}
                      variant="outline"
                      onClick={handleSettingsSync}
                    >
                      {isSyncing ? (
                        <>
                          Syncing...
                          <Spinner className="size-4" />
                        </>
                      ) : (
                        "Sync"
                      )}
                    </Button>
                  </div>
                ) : (
                  <p>Login to create and setup SyncID</p>
                )}
                {remoteUserSettings?.data && (
                  <p className="text-xs ">
                    Updated{" "}
                    {getTimeDifference(
                      remoteUserSettings?.data?.updatedAt,
                      true
                    )[1].toLowerCase()}
                  </p>
                )}
              </div>
            </FormElementContainer>
            <Separator orientation="horizontal" />
            <FormElementContainer>
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
            </FormElementContainer>
            <FormElementContainer>
              <Label className=" text-primary" htmlFor="audio-language">
                Audio Language
              </Label>
              <VideoLanguagesCombo
                handleLocalChange={handleLocalChange}
                localUserSettings={userSettings}
              />
            </FormElementContainer>

            <FormElementContainer>
              <Label className=" text-primary" htmlFor="history-days">
                Keep History
              </Label>
              <Select
                value={userSettings?.historyDays?.toString()}
                onValueChange={(value) =>
                  handleLocalChange("historyDays", value)
                }
              >
                <SelectTrigger id="history-days" className="w-full">
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
            </FormElementContainer>
            <FormElementContainer>
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
                max={98}
                step={2}
              />
            </FormElementContainer>
            <Separator orientation="horizontal" />
            <FormElementContainer>
              <Label htmlFor="clear-watch-later" className="text-primary">
                Clear all Watch later
              </Label>
              <Button
                className="w-full"
                variant="outline"
                id="clear-watch-later"
                onClick={clearWatchLater}
              >
                Clear
              </Button>
            </FormElementContainer>
            <FormElementContainer>
              <Label htmlFor="clear-history" className="text-primary">
                Clear history records
              </Label>
              <Button
                className="w-full"
                variant="outline"
                id="clear-history"
                onClick={clearHistory}
              >
                Clear
              </Button>
            </FormElementContainer>
            <Separator orientation="horizontal" />
            <div className="grid grid-cols-[1fr_1fr] items-center gap-2 justify-start">
              <Button onClick={resetSettings}>Reset</Button>
              <Button disabled={isMutating} onClick={applySettings}>
                {isMutating ? (
                  <>
                    <Spinner className="size-4" />
                    Applying...
                  </>
                ) : (
                  "Apply"
                )}
              </Button>
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
                        handleLocalChange("videoLanguage", "");
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
