import type { ZCatalogSubreddit } from "~/entities/catalogs/models";

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

interface SubredditTableProps {
  subreddits: ZCatalogSubreddit[];
  handleDelete: (_id: string) => void;
}

export default function SubredditTable({
  subreddits,
  handleDelete,
}: SubredditTableProps) {
  return (
    <Table>
      <TableCaption>A list of subreddits.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="max-w-[50px]">SL No</TableHead>
          <TableHead>Subreddit</TableHead>
          <TableHead>Subreddit ID</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {subreddits?.length === 0 ? (
          <TableRow>
            <TableCell colSpan={4} className="h-4 text-center">
              No subreddit added yet.
            </TableCell>
          </TableRow>
        ) : (
          subreddits?.map((subreddit, idx: number) => {
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
                  <div className="flex gap-2 items-center">
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
                        This action cannot be undone. This will permanently
                        remove{" "}
                        <span className="text-primary">{subredditTitle}</span>{" "}
                        subreddit from the catalog?
                      </>
                    }
                    onDelete={() => handleDelete(subredditId)}
                  >
                    <Button variant="outline">
                      <DeleteIcon
                        size={24}
                        className="text-red-700 hover:text-red-500 cursor-pointer"
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
