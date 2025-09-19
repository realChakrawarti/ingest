import { refs } from "~/shared/lib/firebase/refs";

export async function getSyncId(userId: string) {
  const userRef = refs.users.doc(userId);
  const userSnapshot = await userRef.get();

  const userData = userSnapshot.data();
  const syncId = userData?.syncId;

  return syncId;
}
