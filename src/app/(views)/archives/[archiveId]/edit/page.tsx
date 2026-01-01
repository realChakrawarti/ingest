"use client";

import { use } from "react";

import withAuth from "~/features/auth/with-auth-hoc";
import EditArchive from "~/views/edit-archive";

type EditArchivePageParams = {
  archiveId: string;
};

function EditArchivePage({ params }: { params: Promise<EditArchivePageParams> }) {
  const { archiveId } = use(params);
  return <EditArchive archiveId={archiveId} />;
}

export default withAuth(EditArchivePage);
