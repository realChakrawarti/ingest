import type { ZCatalogChannel } from "~/entities/catalogs/models";

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

function ChannelTable({
  channels,
  handleDelete,
}: {
  channels: ZCatalogChannel[];
  handleDelete: (id: string) => Promise<void>;
}) {
  return (
    <Table>
      <TableCaption>A list of channels.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="max-w-[50px]">SL No</TableHead>
          <TableHead className="max-w-[150px]">Channel</TableHead>
          <TableHead>Channel ID</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {channels?.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="h-4 text-center">
              No channel added yet.
            </TableCell>
          </TableRow>
        ) : (
          channels?.map((catalogChannel, idx: number) => {
            const { channelHandle, channelId, channelLogo, channelTitle } =
              catalogChannel;
            return (
              <TableRow key={channelId}>
                <TableCell>{idx + 1}</TableCell>
                <TableCell>
                  <div className="flex gap-2 items-center">
                    {channelLogo ? (
                      <img
                        src={channelLogo}
                        alt={channelTitle}
                        className="size-6 rounded-lg"
                      />
                    ) : null}

                    {channelHandle ? (
                      <OutLink
                        href={`https://www.youtube.com/${channelHandle}`}
                      >
                        <p>{channelTitle}</p>
                      </OutLink>
                    ) : (
                      <p>{channelTitle}</p>
                    )}
                  </div>
                </TableCell>
                <TableCell>{channelId}</TableCell>
                <TableCell>
                  <DeleteModal
                    label={
                      <>
                        This action cannot be undone. This will permanently
                        remove{" "}
                        <span className="text-primary">{channelTitle}</span>{" "}
                        channel from the catalog?
                      </>
                    }
                    onDelete={() => handleDelete(channelId)}
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

export default ChannelTable;
