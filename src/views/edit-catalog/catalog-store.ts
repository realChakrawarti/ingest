import { create } from "zustand";

import type {
  ZCatalogChannel,
  ZCatalogPlaylist,
} from "~/entities/catalogs/models";
import type {
  ChannelDetails,
  ChannelPlaylist,
} from "~/entities/youtube/models";

type VideoLink = {
  link: string;
  error: string;
};

type Step = "url" | "channel" | "playlists";

interface State {
  channelInfo: ChannelDetails;
  videoLink: VideoLink;
  savedChannels: ZCatalogChannel[];
  selectedPlaylists: ChannelPlaylist[];
  searchPlaylists: ChannelPlaylist[];
  channelPlaylists: ChannelPlaylist[];
  playlistInput: string;
  savedPlaylists: ZCatalogPlaylist[];
  formStep: Step;
}

interface Actions {
  setChannelInfo: (_channelInfo: ChannelDetails) => void;
  setVideoLink: (_videoLink: Partial<VideoLink>) => void;
  setSavedPlaylists: (_playlist: ZCatalogPlaylist[]) => void;
  setSavedChannels: (_channels: ZCatalogChannel[]) => void;
  setSelectedPlaylists: (_selectedPlaylists: ChannelPlaylist[]) => void;
  setSearchPlaylists: (_searchPlaylists: ChannelPlaylist[]) => void;
  setChannelPlaylists: (_channelPlaylists: ChannelPlaylist[]) => void;
  setPlaylistInput: (_input: string) => void;
  resetTempData: () => void;
  setFormStep: (_step: Step) => void;
}

const initialState: State = {
  channelInfo: {
    channelDescription: "",
    channelHandle: "",
    channelId: "",
    channelLogo: "",
    channelSubscriberCount: 0,
    channelTitle: "",
    channelVideoCount: 0,
    channelViewCount: 0,
  },
  channelPlaylists: [],
  formStep: "url",
  playlistInput: "",
  savedChannels: [],
  savedPlaylists: [],
  searchPlaylists: [],
  selectedPlaylists: [],
  videoLink: { error: "", link: "" },
};

const useCatalogStore = create<State & Actions>((set) => ({
  ...initialState,
  resetTempData: () =>
    set({
      channelInfo: initialState.channelInfo,
      channelPlaylists: [],
      formStep: "url",
      playlistInput: "",
      searchPlaylists: [],
      selectedPlaylists: [],
      videoLink: { error: "", link: "" },
    }),
  setChannelInfo: (channelInfo) => set({ channelInfo: channelInfo }),
  setChannelPlaylists: (channelPlaylists) =>
    set({ channelPlaylists: channelPlaylists }),
  setFormStep: (step) => set({ formStep: step }),
  setPlaylistInput: (inputValue) => set({ playlistInput: inputValue }),
  setSavedChannels: (channels) => set({ savedChannels: channels }),
  setSavedPlaylists: (playlists) => set({ savedPlaylists: playlists }),
  setSearchPlaylists: (searchPlaylists) =>
    set({ searchPlaylists: searchPlaylists }),
  setSelectedPlaylists: (selectedPlaylists) =>
    set({ selectedPlaylists: selectedPlaylists }),
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
