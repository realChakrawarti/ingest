import { toast } from "sonner";
import useSWR from "swr";

import appConfig from "~/shared/app-config";
import fetchApi from "~/shared/lib/api/fetch";
import { Badge } from "~/shared/ui/badge";
import { ArchiveIcon } from "~/shared/ui/icons";
import Log from "~/shared/utils/terminal-logger";
import { getTimeDifference } from "~/shared/utils/time-diff";

import GridContainer from "~/widgets/grid-container";
import ArchiveCard from "~/widgets/item-card";
import NoItemCard from "~/widgets/no-item-card";
import Spinner from "~/widgets/spinner";

import CreateArchiveDialog from "./create-archive-dialog";

export default function ArchiveView() {
  const {
    data: archives,
    isLoading: isArchiveLoading,
    error: isArchiveError,
    mutate,
  } = useSWR("/archives", (url) => fetchApi(url, { cache: "no-store" }));

  const handleArchiveDelete = async (archiveId: string) => {
    if (archiveId) {
      try {
        const result = await fetchApi(`/archives/${archiveId}/delete`, {
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
    <div className="px-3 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-lg lg:text-xl flex items-center gap-3">
          <ArchiveIcon />
          <p>Archives</p>
          <Badge className="text-lg lg:text-xl text-primary" variant="outline">
            {archives?.data.length ?? 0}/{appConfig.limitArchives}
          </Badge>
        </h1>
        <CreateArchiveDialog
          disabled={(archives?.data.length ?? 0) >= appConfig.limitArchives}
          revalidateArchives={mutate}
        />
      </div>
      {isArchiveError && <p>Error loading archives</p>}
      {isArchiveLoading ? (
        <Spinner className="size-8" />
      ) : (
        <section className="w-full">
          {/* TODO: Maybe add a skeleton? */}
          {archives?.data.length ? (
            <GridContainer>
              {archives?.data.map((archive: any) => {
                const [_, lastUpdated] = getTimeDifference(
                  archive?.videoData?.updatedAt,
                  true,
                  false
                );
                return (
                  <ArchiveCard
                    type="archive"
                    key={archive.id}
                    onDelete={handleArchiveDelete}
                    id={archive?.id}
                    title={archive?.title}
                    description={archive?.description}
                    lastUpdated={lastUpdated}
                  />
                );
              })}
            </GridContainer>
          ) : (
            <NoItemCard icon={ArchiveIcon} title="No archives added yet." />
          )}
        </section>
      )}
    </div>
  );
}
