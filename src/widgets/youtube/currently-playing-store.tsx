import { createStore } from "zustand/vanilla";

type State = {
  playerRef: YT.Player | null;
};

type Actions = {
  setPlayerRef: (playerRef: YT.Player | null) => void;
  getPlayerRef: () => YT.Player | null;
};

const currentlyPlayingStore = createStore<State & Actions>((set, get) => ({
  playerRef: null,
  setPlayerRef: (playerRef) => set({ playerRef: playerRef }),
  getPlayerRef: () => get().playerRef,
}));

export default currentlyPlayingStore;
