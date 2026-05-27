import type { ZCatalogPodcast } from "~/entities/catalogs/models";

import { Button } from "~/shared/ui/button";
import { DeleteIcon } from "~/shared/ui/icons";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/shared/ui/table";

import { DeleteModal } from "~/widgets/delete-modal";
import { OutLink } from "~/widgets/out-link";

interface PodcastTableProps {
  podcasts: ZCatalogPodcast[];
  handleDelete: (id: number) => void;
}

export default function PodcastTable({
  podcasts,
  handleDelete,
}: PodcastTableProps) {
  return (
    <Table>
      <TableCaption>A list of podcasts.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="max-w-12.5">SL No</TableHead>
          <TableHead>Podcast title</TableHead>
          <TableHead>Podcast ID</TableHead>
          <TableHead />
        </TableRow>
      </TableHeader>
      <TableBody>
        {podcasts?.length === 0 ? (
          <TableRow>
            <TableCell colSpan={4} className="h-4 text-center">
              No podcast added yet.
            </TableCell>
          </TableRow>
        ) : (
          podcasts?.map((podcast, idx: number) => {
            const { podcastTitle, podcastArtwork, podcastLink, podcastId } =
              podcast;
            return (
              <TableRow key={podcastId}>
                <TableCell>{idx + 1}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {podcastArtwork ? (
                      <img
                        src={podcastArtwork}
                        alt={podcastLink}
                        className="size-6 rounded-lg"
                      />
                    ) : null}
                    {podcastLink ? (
                      <OutLink href={`https://www.reddit.com${podcastLink}`}>
                        <p>{podcastTitle}</p>
                      </OutLink>
                    ) : (
                      <p>{podcastTitle}</p>
                    )}
                  </div>
                </TableCell>
                <TableCell>{podcastId}</TableCell>
                <TableCell>
                  <DeleteModal
                    label={
                      <>
                        This action cannot be undone. This will permanently
                        remove{" "}
                        <span className="text-primary">{podcastTitle}</span>{" "}
                        podcast from the catalog?
                      </>
                    }
                    onDelete={() => handleDelete(podcastId)}
                  >
                    <Button variant="outline">
                      <DeleteIcon
                        size={24}
                        className="cursor-pointer text-red-700 hover:text-red-500"
                      />
                    </Button>
                  </DeleteModal>
                </TableCell>
              </TableRow>
            );
          })
        )}
      </TableBody>
    </Table>
  );
}