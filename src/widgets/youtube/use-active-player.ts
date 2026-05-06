import { useSyncExternalStore } from "react";

import currentlyPlayingStore from "~/stores/currently-playing-store";

function useActivePlayerRef() {
  return useSyncExternalStore(
    currentlyPlayingStore.subscribe,
    currentlyPlayingStore.getState().getPlayer,
    () => null
  );
}

export default useActivePlayerRef;