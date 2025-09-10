"use client";

import { Settings } from "lucide-react";

import { useLocalStorage } from "~/shared/hooks/use-local-storage";
import { LOCAL_USER_SETTINGS } from "~/shared/lib/constants";
import { Button } from "~/shared/ui/button";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/shared/ui/select";
import { ToggleGroup, ToggleGroupItem } from "~/shared/ui/toggle-group";
import { cn } from "~/shared/utils/tailwind-merge";

export interface TUserSettings {
  playbackRate: number;
  historyDays: number;
  syncId: string;
}

export function UserSettings() {
  const [localUserSettings, setlocalUserSettings] =
    useLocalStorage<TUserSettings>(LOCAL_USER_SETTINGS, {
      historyDays: 15,
      playbackRate: 1,
      syncId: "",
    });

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
            <div className="grid grid-cols-[125px_1fr] items-center gap-2 justify-start">
              <Label htmlFor="playback-rate" className="text-base text-primary">
                Playback Rate
              </Label>
              <ToggleGroup
                id="playback-rate"
                type="single"
                value={localUserSettings?.playbackRate?.toString()}
                onValueChange={(value) =>
                  value &&
                  setlocalUserSettings({
                    ...localUserSettings,
                    playbackRate: Number.parseFloat(value),
                  })
                }
                className="flex gap-1 items-center"
              >
                <ToggleGroupItem value="0.5">0.5x</ToggleGroupItem>
                <ToggleGroupItem value="0.75">0.75x</ToggleGroupItem>
                <ToggleGroupItem value="1">1.0x</ToggleGroupItem>
                <ToggleGroupItem value="1.25">1.25x</ToggleGroupItem>
                <ToggleGroupItem value="1.5">1.5x</ToggleGroupItem>
                <ToggleGroupItem value="1.75">1.75x</ToggleGroupItem>
                <ToggleGroupItem value="2">2x</ToggleGroupItem>
              </ToggleGroup>
            </div>

            <div className="grid grid-cols-[125px_1fr] items-center gap-2 justify-start">
              <Label className="text-base text-primary" htmlFor="history-days">
                Keep History
              </Label>
              <Select
                value={localUserSettings?.historyDays?.toString()}
                onValueChange={(value) =>
                  setlocalUserSettings({
                    ...localUserSettings,
                    historyDays: value,
                  })
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

            <div className="grid grid-cols-[125px_1fr] items-center gap-2 justify-start">
              <Label className="text-base text-primary" htmlFor="sync-id">
                Sync ID <sup>soon</sup>
              </Label>
              <Input
                disabled
                id="sync-id"
                value={localUserSettings.syncId}
                onChange={(e) =>
                  setlocalUserSettings({
                    ...localUserSettings,
                    syncId: e.target.value,
                  })
                }
                placeholder="Enter SyncID for cross-device synchronization"
              />
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
}
