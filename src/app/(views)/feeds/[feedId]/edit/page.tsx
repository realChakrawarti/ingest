"use client";

import { useParams } from "next/navigation";

import withAuth from "~/features/auth/with-auth-hoc";

import EditCatalog from "~/views/edit-feed";

type EditCatalogPageParams = {
  feedId: string;
};

function EditCatalogPage() {
  const { feedId } = useParams<EditCatalogPageParams>();
  return <EditCatalog feedId={feedId} />;
}

export default withAuth(EditCatalogPage);
