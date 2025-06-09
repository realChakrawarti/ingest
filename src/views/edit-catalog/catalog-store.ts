import { create } from "zustand";

import { CatalogList } from "~/entities/catalogs/models";
import type { PlaylistItem } from "~/shared/types-schema/types";

export type LocalChannel = {
  title: string;
  id: string;
};

type VideoLink = {
  link: string;
  error: string;
};

type ChannelInfo = { title: string; id: string };

interface State {
  channelInfo: ChannelInfo;
  videoLink: VideoLink;
  localChannels: LocalChannel[];
  savedChannels: CatalogList[];
  localPlaylists: PlaylistItem[];
  searchPlaylists: any[];
  channelPlaylists: any[];
  playlistInput: string;
  savedPlaylists: CatalogList[];
  fetchedChannelPlaylists: boolean;
}

interface Actions {
  setChannelInfo: (_channelInfo: ChannelInfo) => void;
  setVideoLink: (_videoLink: Partial<VideoLink>) => void;
  setSavedPlaylists: (_playlist: CatalogList[]) => void;
  setLocalChannels: (_localChannels: LocalChannel[]) => void;
  setSavedChannels: (_channels: CatalogList[]) => void;
  setLocalPlaylists: (_localPlaylists: PlaylistItem[]) => void;
  setSearchPlaylists: (_searchPlaylists: any[]) => void;
  setChannelPlaylists: (_channelPlaylists: any[]) => void;
  setPlaylistInput: (_input: string) => void;
  resetLocalPlaylist: () => void;
  setFetchedChannelPlaylists: (_arg: boolean) => void;
}

const initialState: State = {
  channelInfo: {
    title: "",
    id: "",
  },
  channelPlaylists: [],
  fetchedChannelPlaylists: false,
  localChannels: [],
  localPlaylists: [],
  playlistInput: "",
  savedChannels: [],
  savedPlaylists: [],
  searchPlaylists: [],
  videoLink: { error: "", link: "" },
};

const useCatalogStore = create<State & Actions>((set) => ({
  ...initialState,
  resetLocalPlaylist: () =>
    set({
      channelInfo: {
        title: "",
        id: "",
      },
      channelPlaylists: [],
      fetchedChannelPlaylists: false,
      localPlaylists: [],
      playlistInput: "",
      searchPlaylists: [],
      videoLink: { error: "", link: "" },
    }),
  setChannelInfo: (channelInfo) => set({ channelInfo: channelInfo }),
  setChannelPlaylists: (channelPlaylists) =>
    set({ channelPlaylists: channelPlaylists }),
  setFetchedChannelPlaylists: (arg) => set({ fetchedChannelPlaylists: arg }),
  setLocalChannels: (localChannels) => set({ localChannels }),
  setLocalPlaylists: (localPlaylists) =>
    set({ localPlaylists: localPlaylists }),
  setPlaylistInput: (inputValue) => set({ playlistInput: inputValue }),
  setSavedChannels: (channels) => set({ savedChannels: channels }),
  setSavedPlaylists: (playlists) => set({ savedPlaylists: playlists }),
  setSearchPlaylists: (searchPlaylists) =>
    set({ searchPlaylists: searchPlaylists }),
  setVideoLink: (link) => {
    return set((state) => ({
      videoLink: {
        ...state.videoLink,
        ...link,
      },
    }));
  },
}));

export default useCatalogStore;
