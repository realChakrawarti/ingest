import { create } from "zustand";

import type {
  ZCatalogChannel,
  ZCatalogPlaylist,
  ZCatalogPodcast,
  ZCatalogSubreddit,
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
  savedSubreddits: ZCatalogSubreddit[];
  savedPodcasts: ZCatalogPodcast[];
  selectedPlaylists: ChannelPlaylist[];
  searchPlaylists: ChannelPlaylist[];
  channelPlaylists: ChannelPlaylist[];
  playlistInput: string;
  savedPlaylists: ZCatalogPlaylist[];
  formStep: Step;
  selectedSubreddits: ZCatalogSubreddit[];
  selectedPodcasts: ZCatalogPodcast[];
}

interface Actions {
  setChannelInfo: (channelInfo: ChannelDetails) => void;
  setVideoLink: (videoLink: Partial<VideoLink>) => void;
  setSavedPlaylists: (playlist: ZCatalogPlaylist[]) => void;
  setSavedChannels: (channels: ZCatalogChannel[]) => void;
  setSavedSubreddits: (subreddits: ZCatalogSubreddit[]) => void;
  setSavedPodcasts: (podcasts: ZCatalogPodcast[]) => void;
  setSelectedPlaylists: (selectedPlaylists: ChannelPlaylist[]) => void;
  setSearchPlaylists: (searchPlaylists: ChannelPlaylist[]) => void;
  setChannelPlaylists: (channelPlaylists: ChannelPlaylist[]) => void;
  setPlaylistInput: (input: string) => void;
  resetTempData: () => void;
  setFormStep: (step: Step) => void;
  setSelectedSubreddits: (selectedSubreddits: ZCatalogSubreddit[]) => void;
  setSelectedPodcasts: (selectedPodcasts: ZCatalogPodcast[]) => void;
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
  savedSubreddits: [],
  savedPodcasts: [],
  searchPlaylists: [],
  selectedPlaylists: [],
  selectedSubreddits: [],
  videoLink: { error: "", link: "" },
  selectedPodcasts: [],
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
      selectedSubreddits: [],
      videoLink: { error: "", link: "" },
      selectedPodcasts: [],
    }),
  setChannelInfo: (channelInfo) => set({ channelInfo: channelInfo }),
  setChannelPlaylists: (channelPlaylists) =>
    set({ channelPlaylists: channelPlaylists }),
  setFormStep: (step) => set({ formStep: step }),
  setPlaylistInput: (inputValue) => set({ playlistInput: inputValue }),
  setSavedChannels: (channels) => set({ savedChannels: channels }),
  setSavedPlaylists: (playlists) => set({ savedPlaylists: playlists }),
  setSavedSubreddits: (subreddits) => set({ savedSubreddits: subreddits }),
  setSavedPodcasts: (podcasts) => set({ savedPodcasts: podcasts }),
  setSearchPlaylists: (searchPlaylists) =>
    set({ searchPlaylists: searchPlaylists }),
  setSelectedPlaylists: (selectedPlaylists) =>
    set({ selectedPlaylists: selectedPlaylists }),
  setSelectedSubreddits: (selectedSubreddit) => {
    set({ selectedSubreddits: selectedSubreddit });
  },
  setVideoLink: (link) => {
    return set((state) => ({
      videoLink: {
        ...state.videoLink,
        ...link,
      },
    }));
  },
  setSelectedPodcasts: (selectedPodcasts) => {
    set({ selectedPodcasts: selectedPodcasts });
  },
}));

export default useCatalogStore;