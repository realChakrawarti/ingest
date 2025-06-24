"use client";

import useSWR from "swr";

import type { ArchiveByIdResponse } from "~/entities/archives/models";

import { toast } from "~/shared/hooks/use-toast";
import fetchApi from "~/shared/lib/api/fetch";
import { Separator } from "~/shared/ui/separator";

import BackLink from "~/widgets/back-link";
import GridContainer from "~/widgets/grid-container";
import Spinner from "~/widgets/spinner";

import AddVideoDialog from "./add-video-dialog";
import UpdateArchiveMeta from "./update-archive-meta";
import VideoCard from "./video-card";

export default function EditArchive({ archiveId }: { archiveId: string }) {
  const {
    data: archiveData,
    isLoading,
    error,
    mutate: revalidateArchive,
  } = useSWR(
    archiveId ? `/archives/${archiveId}` : null,
    (url) => fetchApi<ArchiveByIdResponse>(url, { cache: "no-store" }),
    { revalidateOnFocus: false }
  );

  async function removeVideo(videoId: string) {
    const video = archiveData?.data?.videos.find(
      (item) => item.videoId === videoId
    );
    const result = await fetchApi(`/archives/${archiveId}/remove-video`, {
      body: JSON.stringify(video),
      method: "PATCH",
    });

    if (result.success) {
      revalidateArchive();
    }
    toast({ title: result.message });
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center gap-2 justify-between p-3">
        <div className="flex gap-4 items-center">
          <BackLink className="size-6" href="/dashboard" />
          <div>
            <h1 className="text-lg lg:text-xl">
              {archiveData?.data?.title ?? ""}
            </h1>
            <h2 className="text-xs lg:text-sm">
              {archiveData?.data?.description ?? ""}
            </h2>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <UpdateArchiveMeta
            revalidateArchive={revalidateArchive}
            archiveId={archiveId}
            title={archiveData?.data?.title || ""}
            description={archiveData?.data?.description || ""}
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
        ) : archiveData?.data?.videos ? (
          <GridContainer>
            {archiveData?.data?.videos.map((item) => {
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
