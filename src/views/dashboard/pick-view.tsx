import { ArchiveIcon } from "lucide-react";

import { toast } from "sonner";
import useSWR from "swr";

import appConfig from "~/shared/app-config";
import fetchApi from "~/shared/lib/api/fetch";
import { Badge } from "~/shared/ui/badge";
import Log from "~/shared/utils/terminal-logger";
import { getTimeDifference } from "~/shared/utils/time-diff";

import GridContainer from "~/widgets/grid-container";
import PickCard from "~/widgets/item-card";
import NoItemCard from "~/widgets/no-item-card";
import Spinner from "~/widgets/spinner";

import CreatePickDialog from "./create-pick-dialog";

export default function PickView() {
  const {
    data: picks,
    isLoading: isPickLoading,
    error: isPickError,
    mutate,
  } = useSWR("/picks", (url) => fetchApi(url));

  const handlePickDelete = async (pickId: string) => {
    if (pickId) {
      try {
        const result = await fetchApi(`/picks/${pickId}/delete`, {
          method: "DELETE",
        });
        mutate();
        toast(result.message);
      } catch (err) {
        Log.fail(err);
      }
    }
  };

  return (
    <div className="space-y-4 px-3">
      <div className="flex items-center justify-between">
        <h1 className="flex items-center gap-3 text-lg lg:text-xl">
          <ArchiveIcon />
          <p>Picks</p>
          <Badge className="text-primary text-lg lg:text-xl" variant="outline">
            {picks?.data.length ?? 0}/{appConfig.limitPicks}
          </Badge>
        </h1>
        <CreatePickDialog
          disabled={(picks?.data.length ?? 0) >= appConfig.limitPicks}
          revalidatePicks={mutate}
        />
      </div>
      {isPickError && <p>Error loading picks</p>}
      {isPickLoading ? (
        <Spinner className="size-8" />
      ) : (
        <section className="w-full">
          {/* TODO: Maybe add a skeleton? */}
          {picks?.data.length ? (
            <GridContainer>
              {picks?.data.map((pick: any) => {
                const [_, lastUpdated] = getTimeDifference(
                  pick?.videoData?.updatedAt,
                  true,
                  false
                );
                return (
                  <PickCard
                    isPublic={pick?.isPublic}
                    type="pick"
                    key={pick.id}
                    onDelete={handlePickDelete}
                    id={pick?.id}
                    title={pick?.title}
                    description={pick?.description}
                    lastUpdated={lastUpdated}
                  />
                );
              })}
            </GridContainer>
          ) : (
            <NoItemCard icon={ArchiveIcon} title="No picks added yet." />
          )}
        </section>
      )}
    </div>
  );
}
