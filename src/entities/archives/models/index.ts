import { VideoDetails } from "~/entities/youtube/models";

export type ArchiveByIdResponse = {
  title: string;
  description: string;
  videos: VideoDetails[];
};
