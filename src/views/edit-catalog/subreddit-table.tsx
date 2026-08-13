import { Trash2Icon } from "lucide-react";

import type { ZCatalogSubreddit } from "~/entities/catalogs/models";

import { Button } from "~/shared/ui/button";
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

interface SubredditTableProps {
  subreddits: ZCatalogSubreddit[];
  handleDelete: (_id: string) => void;
}

export default function SubredditTable({
  subreddits,
  handleDelete,
}: SubredditTableProps) {
  if (!subreddits.length) {
    return null;
  }

  return (
    <Table>
      <TableCaption>
        <b>{subreddits?.length} of 10</b> subreddits added.
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="max-w-12.5">SL No</TableHead>
          <TableHead>Subreddit</TableHead>
          <TableHead>Subreddit ID</TableHead>
          <TableHead />
        </TableRow>
      </TableHeader>
      <TableBody>
        {subreddits?.map((subreddit, idx: number) => {
          const {
            subredditName,
            subredditIcon,
            subredditUrl,
            subredditTitle,
            subredditId,
          } = subreddit;
          return (
            <TableRow key={subredditId}>
              <TableCell>{idx + 1}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {subredditIcon ? (
                    <img
                      src={subredditIcon}
                      alt={subredditUrl}
                      className="size-6 rounded-lg"
                    />
                  ) : null}
                  {subredditUrl ? (
                    <OutLink href={`https://www.reddit.com${subredditUrl}`}>
                      <p>{subredditTitle}</p>
                    </OutLink>
                  ) : (
                    <p>{subredditTitle}</p>
                  )}
                </div>
              </TableCell>
              <TableCell>
                r/{subredditName} - ({subredditId})
              </TableCell>
              <TableCell>
                <DeleteModal
                  label={
                    <>
                      This action cannot be undone. This will permanently remove{" "}
                      <span className="text-primary">{subredditTitle}</span>{" "}
                      subreddit from the catalog?
                    </>
                  }
                  onDelete={() => handleDelete(subredditId)}
                >
                  <Button variant="outline">
                    <Trash2Icon
                      size={24}
                      className="cursor-pointer text-red-700 hover:text-red-500"
                    />
                  </Button>
                </DeleteModal>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}