import { useCallback } from "react";

import confetti from "canvas-confetti";

const count = 200;
const defaults = {
  decay: 0.94,
  gravity: 1,
  origin: { y: 0 },
  spread: 90,
  startVelocity: 30,
  ticks: 400,
};

export function useConfetti() {
  const triggerConfetti = useCallback(() => {
    function fire(particleRatio: number, opts: confetti.Options) {
      confetti(
        Object.assign({}, defaults, opts, {
          particleCount: Math.floor(count * particleRatio),
        })
      );
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
    });

    fire(0.2, {
      spread: 60,
    });

    fire(0.35, {
      decay: 0.91,
      scalar: 0.8,
      spread: 100,
    });

    fire(0.1, {
      decay: 0.92,
      scalar: 1.2,
      spread: 120,
      startVelocity: 25,
    });

    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  }, []);

  return triggerConfetti;
}