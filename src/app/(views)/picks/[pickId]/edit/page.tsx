"use client";

import { useParams } from "next/navigation";

import withAuth from "~/features/auth/with-auth-hoc";

import EditPick from "~/views/edit-pick";

type EditPickPageParams = {
  pickId: string;
};

function EditPickPage() {
  const { pickId } = useParams<EditPickPageParams>();
  return <EditPick pickId={pickId} />;
}

export default withAuth(EditPickPage);