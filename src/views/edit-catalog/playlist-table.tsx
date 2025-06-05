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

interface PlaylistTableProps {
  playlists: any[];
  handleDelete: (_id: string) => void;
}

export default function PlaylistTable({
  playlists,
  handleDelete,
}: PlaylistTableProps) {
  return (
    <Table>
      <TableCaption>A list of playlists.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="max-w-[50px] font-semibold">SL No</TableHead>
          <TableHead className="max-w-[150px] font-semibold">
            Playlist Title
          </TableHead>
          <TableHead className="font-semibold">Playlist ID</TableHead>
          <TableHead className="text-center font-semibold">Channel</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {playlists?.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="h-4 text-center">
              No playlist added yet.
            </TableCell>
          </TableRow>
        ) : (
          playlists?.map((playlist, idx: number) => {
            const {
              playlistTitle,
              playlistId,
              channelLogo,
              channelTitle,
              channelHandle,
            } = playlist;
            return (
              <TableRow key={playlist?.id}>
                <TableCell>{idx + 1}</TableCell>
                <TableCell>{playlistTitle}</TableCell>
                <TableCell>{playlistId}</TableCell>
                <TableCell>
                  <div className="flex gap-2 items-center">
                    {playlist?.channelLogo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={channelLogo}
                        alt={channelTitle}
                        className="size-6 rounded-lg"
                      />
                    ) : null}
                    {channelHandle ? (
                      <OutLink
                        className="text-indigo-600 hover:text-indigo-500 visited:text-indigo-700"
                        href={`https://www.youtube.com/${channelHandle}`}
                      >
                        <p>{channelTitle}</p>
                      </OutLink>
                    ) : (
                      <p>{channelTitle}</p>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <DeleteModal
                    label={
                      <>
                        This action cannot be undone. This will permanently
                        remove{" "}
                        <span className="text-primary">{playlistTitle}</span>{" "}
                        playlist from the catalog?
                      </>
                    }
                    onDelete={() => handleDelete(playlistId)}
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
