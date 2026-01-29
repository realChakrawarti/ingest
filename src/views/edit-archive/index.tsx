"use client";

import { toast } from "sonner";
import useSWR from "swr";

import type { ZArchiveByID } from "~/entities/archives/models";

import fetchApi from "~/shared/lib/api/fetch";
import { Badge } from "~/shared/ui/badge";
import { Separator } from "~/shared/ui/separator";

import BackLink from "~/widgets/back-link";
import GridContainer from "~/widgets/grid-container";
import Spinner from "~/widgets/spinner";

import AddVideoDialog from "./add-video-dialog";
import UpdateArchiveMeta from "./update-archive-meta";
import VideoCard from "./video-card";

export default function EditArchive({ archiveId }: { archiveId: string }) {
  const {
    data: archive,
    isLoading,
    error,
    mutate: revalidateArchive,
  } = useSWR(
    archiveId ? `/archives/${archiveId}` : null,
    (url) => fetchApi<ZArchiveByID>(url, { cache: "no-store" }),
    { revalidateOnFocus: false }
  );

  const archiveData = archive?.data;

  async function removeVideo(videoId: string) {
    const video = archiveData?.videos.find((item) => item.videoId === videoId);
    const result = await fetchApi(`/archives/${archiveId}/remove-video`, {
      body: JSON.stringify(video),
      method: "PATCH",
    });

    if (result.success) {
      revalidateArchive();
    }
    toast(result.message);
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center gap-2 justify-between p-3">
        <div className="flex gap-4 items-center">
          <BackLink className="size-6" href="/dashboard" />
          <Badge className="text-sm">
            {archiveData?.isPublic ? "Public" : "Private"}
          </Badge>
          <div>
            <h1 className="text-lg lg:text-xl">{archiveData?.title ?? ""}</h1>
            <h2 className="text-xs lg:text-sm">
              {archiveData?.description ?? ""}
            </h2>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <UpdateArchiveMeta
            revalidateArchive={revalidateArchive}
            archiveId={archiveId}
            title={archiveData?.title || ""}
            description={archiveData?.description || ""}
            isPublic={archiveData?.isPublic}
            lastUpdatedAt={archiveData?.lastUpdatedAt}
          />
          <AddVideoDialog
            archiveId={archiveId}
            revalidateArchive={revalidateArchive}
          />
        </div>
      </div>
      <Separator className="mb-4" />
      <div className="flex flex-col gap-1 p-3">
        {error ? <div>Something went wrong!</div> : null}
        {isLoading ? (
          <Spinner className="size-8" />
        ) : archiveData?.videos ? (
          <GridContainer>
            {archiveData?.videos.map((item) => {
              return (
                <VideoCard
                  key={item.videoId}
                  video={item}
                  removeVideo={removeVideo}
                />
              );
            })}
          </GridContainer>
        ) : (
          <p>No videos added yet.</p>
        )}
      </div>
    </div>
  );
}
