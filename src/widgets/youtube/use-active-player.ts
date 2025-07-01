import { useEffect, useState } from "react";

import currentlyPlayingStore from "./currently-playing-store";

function useActivePlayerRef() {
  const [activePlayerRef, setActivePlayerRef] = useState<YT.Player | null>(
    null
  );

  useEffect(() => {
    const getActivePlayer: Parameters<
      typeof currentlyPlayingStore.subscribe
    >[0] = (state) => {
      if (state.playerRef) {
        setActivePlayerRef(state.playerRef);
      }
    };

    const unsubscribe = currentlyPlayingStore.subscribe(getActivePlayer);

    return () => {
      unsubscribe();
    };
  }, []);

  return activePlayerRef;
}

export default useActivePlayerRef;
