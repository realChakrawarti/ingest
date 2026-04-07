import { useSyncExternalStore } from "react";
import currentlyPlayingStore from "./currently-playing-store";

function useActivePlayerRef() {
  return useSyncExternalStore(
    currentlyPlayingStore.subscribe,
    currentlyPlayingStore.getState().getPlayerRef,
    () => null
  );
}

export default useActivePlayerRef;
