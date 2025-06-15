import { create } from "zustand";

import { CatalogList } from "~/entities/catalogs/models";
import { ChannelPlaylist } from "~/entities/youtube/models";

type VideoLink = {
  link: string;
  error: string;
};

type Step = "url" | "channel" | "playlists";

type ChannelInfo = { title: string; id: string };

interface State {
  channelInfo: ChannelInfo;
  videoLink: VideoLink;
  savedChannels: CatalogList<"channel">[];
  selectedPlaylists: ChannelPlaylist[];
  searchPlaylists: ChannelPlaylist[];
  channelPlaylists: ChannelPlaylist[];
  playlistInput: string;
  savedPlaylists: CatalogList<"playlist">[];
  formStep: Step;
}

interface Actions {
  setChannelInfo: (_channelInfo: ChannelInfo) => void;
  setVideoLink: (_videoLink: Partial<VideoLink>) => void;
  setSavedPlaylists: (_playlist: CatalogList<"playlist">[]) => void;
  setSavedChannels: (_channels: CatalogList<"channel">[]) => void;
  setSelectedPlaylists: (_selectedPlaylists: ChannelPlaylist[]) => void;
  setSearchPlaylists: (_searchPlaylists: ChannelPlaylist[]) => void;
  setChannelPlaylists: (_channelPlaylists: ChannelPlaylist[]) => void;
  setPlaylistInput: (_input: string) => void;
  resetTempData: () => void;
  setFormStep: (_step: Step) => void;
}

const initialState: State = {
  channelInfo: {
    title: "",
    id: "",
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
      channelInfo: {
        title: "",
        id: "",
      },
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
