"use client";

import { use } from "react";

import withAuth from "~/features/auth/with-auth-hoc";

import EditCatalog from "~/views/edit-catalog";

type EditCatalogPageParams = {
  catalogId: string;
};

function EditCatalogPage({ params }: { params: Promise<EditCatalogPageParams> }) {
  const { catalogId } = use(params);
  return <EditCatalog catalogId={catalogId} />;
}

export default withAuth(EditCatalogPage);
