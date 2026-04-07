import { createStore } from "zustand/vanilla";

type State = {
  player: YT.Player | null;
};

type Actions = {
  setPlayer: (playerRef: YT.Player | null) => void;
  getPlayer: () => YT.Player | null;
};

const currentlyPlayingStore = createStore<State & Actions>((set, get) => ({
  player: null,
  setPlayer: (player) => set({ player: player }),
  getPlayer: () => get().player,
}));

export default currentlyPlayingStore;
