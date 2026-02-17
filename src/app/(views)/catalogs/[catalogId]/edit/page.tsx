"use client";

import { useParams } from "next/navigation";

import withAuth from "~/features/auth/with-auth-hoc";

import EditCatalog from "~/views/edit-catalog";

type EditCatalogPageParams = {
  catalogId: string;
};

function EditCatalogPage() {
  const { catalogId } = useParams<EditCatalogPageParams>();
  return <EditCatalog catalogId={catalogId} />;
}

export default withAuth(EditCatalogPage);
