import { Trash2Icon } from "lucide-react";

import type { ZFeedPlaylist } from "~/entities/feeds/models";

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

interface PlaylistTableProps {
  playlists: ZFeedPlaylist[];
  handleDelete: (_id: string) => void;
}

export default function PlaylistTable({
  playlists,
  handleDelete,
}: PlaylistTableProps) {
  if (!playlists.length) {
    return null;
  }

  return (
    <Table>
      <TableCaption>
        <b>{playlists?.length} of 15</b> playlists added.
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="max-w-12.5">SL No</TableHead>
          <TableHead className="max-w-37.5">Playlist Title</TableHead>
          <TableHead>Playlist ID</TableHead>
          <TableHead className="text-center">Channel</TableHead>
          <TableHead />
        </TableRow>
      </TableHeader>
      <TableBody>
        {playlists?.map((playlist, idx: number) => {
          const {
            playlistTitle,
            playlistId,
            channelLogo,
            channelTitle,
            channelHandle,
          } = playlist;
          return (
            <TableRow key={playlist?.playlistId}>
              <TableCell>{idx + 1}</TableCell>
              <TableCell>{playlistTitle}</TableCell>
              <TableCell>{playlistId}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {channelLogo ? (
                    <img
                      src={channelLogo}
                      alt={channelTitle}
                      className="size-6 rounded-lg"
                    />
                  ) : null}
                  {channelHandle ? (
                    <OutLink href={`https://www.youtube.com/${channelHandle}`}>
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
                      This action cannot be undone. This will permanently remove{" "}
                      <span className="text-primary">{playlistTitle}</span>{" "}
                      playlist from the feed?
                    </>
                  }
                  onDelete={() => handleDelete(playlistId)}
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