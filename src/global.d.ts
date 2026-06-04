import type { EnvType } from "./env";

declare module "lite-youtube-embed" {
  class LiteYTEmbed extends HTMLElement {
    async getYTPlayer(): Promise<YT.Player>;
  }
}

declare global {
  namespace NodeJS {
    interface ProcessEnv extends EnvType {}
  }
  interface HTMLElementTagNameMap {
    "lite-youtube": LiteYTEmbed;
  }
}