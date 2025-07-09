"use client";

import withAuth from "~/features/auth/with-auth-hoc";

import EditCatalog from "~/views/edit-catalog";

type EditCatalogPageParams = {
  catalogId: string;
};

function EditCatalogPage({ params }: { params: EditCatalogPageParams }) {
  return <EditCatalog catalogId={params.catalogId} />;
}

export default withAuth(EditCatalogPage);
