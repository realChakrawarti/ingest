"use client";

import { Check, ChevronsUpDown, Settings } from "lucide-react";
import { type ChangeEvent, useState } from "react";
import { toast } from "sonner";
import useSWR from "swr";

import appConfig from "~/shared/app-config";
import useDebounce from "~/shared/hooks/use-debounce";
import { useLocalStorage } from "~/shared/hooks/use-local-storage";
import { indexedDB } from "~/shared/lib/api/dexie";
import { LOCAL_USER_SETTINGS, videoLanguages } from "~/shared/lib/constants";
import type { TUserSettings } from "~/shared/types-schema/types";
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

const initialSettings = {
  historyDays: 15,
  playbackRate: 1,
  syncId: "",
  videoLanguage: "",
  watchedPercentage: appConfig.watchedPercentage,
};

async function checkSyncId(syncId: string) {
  const result = await fetch(`/session/valid?syncId=${syncId}`);
  return result.json();
}

export function UserSettings() {
  const [_, setlocalUserSettings] = useLocalStorage<TUserSettings>(
    LOCAL_USER_SETTINGS,
    initialSettings
  );

  const [syncId, setSyncId] = useState<string>("");
  const debouncedSyncId = useDebounce(syncId, 1000);

  const { data, isLoading, mutate } = useSWR(
    null,
    () => checkSyncId(debouncedSyncId),
    {
      revalidateOnMount: false,
    }
  );

  const [userSettings, setUserSettings] = useState<TUserSettings>(
    JSON.parse(localStorage.getItem(LOCAL_USER_SETTINGS) ?? "{}")
  );

  function handleLocalChange(key: keyof TUserSettings, value: any) {
    setUserSettings((prev) => ({ ...prev, [key]: value }));
  }

  function resetSettings() {
    setlocalUserSettings(initialSettings);
    toast("Global settings has been reset.");
    window.location.reload();
  }

  function applySettings() {
    setlocalUserSettings(userSettings);
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

  async function validateSyncId(e: ChangeEvent<HTMLInputElement>) {
    setSyncId(e.target.value);

    if (e.target.value.length === 16) {
      await mutate();
      console.log(">>>", data);
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
          <form className="flex flex-col gap-3">
            <div className="grid grid-cols-1 md:grid-cols-[140px_1fr] items-center gap-2 justify-start">
              <Label className=" text-primary" htmlFor="sync-id">
                Sync ID
              </Label>
              <div className="space-y-1">
                <Input
                  id="sync-id"
                  value={userSettings.syncId}
                  onChange={(e) => validateSyncId(e)}
                  placeholder="Enter SyncID for cross-device synchronization"
                />
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
                <ToggleGroupItem className="p-1 h-6" value="0.5">
                  0.5x
                </ToggleGroupItem>
                <ToggleGroupItem className="p-1 h-6" value="0.75">
                  0.75x
                </ToggleGroupItem>
                <ToggleGroupItem className="p-1 h-6" value="1">
                  1.0x
                </ToggleGroupItem>
                <ToggleGroupItem className="p-1 h-6" value="1.25">
                  1.25x
                </ToggleGroupItem>
                <ToggleGroupItem className="p-1 h-6" value="1.5">
                  1.5x
                </ToggleGroupItem>
                <ToggleGroupItem className="p-1 h-6" value="1.75">
                  1.75x
                </ToggleGroupItem>
                <ToggleGroupItem className="p-1 h-6" value="2">
                  2x
                </ToggleGroupItem>
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
                  <SelectItem value="15">15 days</SelectItem>
                  <SelectItem value="30">30 days</SelectItem>
                  <SelectItem value="60">60 days</SelectItem>
                  <SelectItem value="90">90 days</SelectItem>
                  <SelectItem value="0">Never</SelectItem>
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
  localUserSettings: TUserSettings;
  handleLocalChange: (key: keyof TUserSettings, value: any) => void;
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
