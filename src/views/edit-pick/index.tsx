"use client";

import { toast } from "sonner";
import useSWR from "swr";

import type { ZPickByID } from "~/entities/picks/models";

import fetchApi from "~/shared/lib/api/fetch";
import { Badge } from "~/shared/ui/badge";
import { Separator } from "~/shared/ui/separator";

import BackLink from "~/widgets/back-link";
import { ItemSection } from "~/widgets/item-section";
import Spinner from "~/widgets/spinner";

import AddVideoDialog from "./add-video-dialog";
import UpdatePickMeta from "./update-pick-meta";
import VideoCard from "./video-card";

export default function EditPick({ pickId }: { pickId: string }) {
  const {
    data: pick,
    isLoading,
    error,
    mutate: revalidatePick,
  } = useSWR(
    pickId ? `/picks/${pickId}` : null,
    (url) => fetchApi<ZPickByID>(url),
    { revalidateOnFocus: false }
  );

  const pickData = pick?.data;

  async function removeVideo(videoId: string) {
    const video = pickData?.videos.find((item) => item.videoId === videoId);
    const result = await fetchApi(`/picks/${pickId}/remove-video`, {
      body: JSON.stringify(video),
      method: "PATCH",
    });

    if (result.success) {
      revalidatePick();
    }
    toast(result.message);
  }

  return (
    <div>
      <div className="flex flex-col justify-between gap-2 p-3 md:flex-row md:items-center">
        <div className="flex items-center gap-4">
          <BackLink className="size-6" href="/dashboard" />
          <Badge className="text-sm">
            {pickData?.isPublic ? "Public" : "Private"}
          </Badge>
          <div>
            <h1 className="text-lg lg:text-xl">{pickData?.title ?? ""}</h1>
            <h2 className="text-xs lg:text-sm">
              {pickData?.description ?? ""}
            </h2>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <UpdatePickMeta
            revalidatePick={revalidatePick}
            pickId={pickId}
            title={pickData?.title || ""}
            description={pickData?.description || ""}
            isPublic={pickData?.isPublic}
            lastUpdatedAt={pickData?.lastUpdatedAt}
          />
          <AddVideoDialog pickId={pickId} revalidatePick={revalidatePick} />
        </div>
      </div>
      <Separator className="mb-4" />
      <div className="flex flex-col gap-1 p-3">
        {error ? <div>Something went wrong!</div> : null}
        {isLoading ? (
          <Spinner className="size-8" />
        ) : pickData?.videos ? (
          <ItemSection>
            {pickData?.videos.map((item) => {
              return (
                <VideoCard
                  key={item.videoId}
                  video={item}
                  removeVideo={removeVideo}
                />
              );
            })}
          </ItemSection>
        ) : (
          <p>No videos added yet.</p>
        )}
      </div>
    </div>
  );
}