import { createStore } from "zustand/vanilla";

type State = {
  playerRef: YT.Player | null;
};

type Actions = {
  setPlayerRef: (playerRef: YT.Player | null) => void;
};

const currentlyPlayingStore = createStore<State & Actions>((set) => ({
  playerRef: null,
  setPlayerRef: (playerRef) => set({ playerRef: playerRef }),
}));

export default currentlyPlayingStore;
