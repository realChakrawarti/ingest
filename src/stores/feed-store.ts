import { create } from "zustand";

import type {
  ZFeedChannel,
  ZFeedPlaylist,
  ZFeedPodcast,
  ZFeedSubreddit,
} from "~/entities/feeds/models";
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
  savedChannels: ZFeedChannel[];
  savedSubreddits: ZFeedSubreddit[];
  savedPodcasts: ZFeedPodcast[];
  selectedPlaylists: ChannelPlaylist[];
  searchPlaylists: ChannelPlaylist[];
  channelPlaylists: ChannelPlaylist[];
  playlistInput: string;
  savedPlaylists: ZFeedPlaylist[];
  formStep: Step;
  selectedSubreddits: ZFeedSubreddit[];
  selectedPodcasts: ZFeedPodcast[];
}

interface Actions {
  setChannelInfo: (channelInfo: ChannelDetails) => void;
  setVideoLink: (videoLink: Partial<VideoLink>) => void;
  setSavedPlaylists: (playlist: ZFeedPlaylist[]) => void;
  setSavedChannels: (channels: ZFeedChannel[]) => void;
  setSavedSubreddits: (subreddits: ZFeedSubreddit[]) => void;
  setSavedPodcasts: (podcasts: ZFeedPodcast[]) => void;
  setSelectedPlaylists: (selectedPlaylists: ChannelPlaylist[]) => void;
  setSearchPlaylists: (searchPlaylists: ChannelPlaylist[]) => void;
  setChannelPlaylists: (channelPlaylists: ChannelPlaylist[]) => void;
  setPlaylistInput: (input: string) => void;
  resetTempData: () => void;
  setFormStep: (step: Step) => void;
  setSelectedSubreddits: (selectedSubreddits: ZFeedSubreddit[]) => void;
  setSelectedPodcasts: (selectedPodcasts: ZFeedPodcast[]) => void;
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

const useFeedStore = create<State & Actions>((set) => ({
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

export default useFeedStore;
