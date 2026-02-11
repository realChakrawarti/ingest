"use client";

import { useParams } from "next/navigation";

import withAuth from "~/features/auth/with-auth-hoc";

import EditArchive from "~/views/edit-archive";

type EditArchivePageParams = {
  archiveId: string;
};

function EditArchivePage() {
  const { archiveId } = useParams<EditArchivePageParams>();
  return <EditArchive archiveId={archiveId} />;
}

export default withAuth(EditArchivePage);
