import { admin } from "~/shared/lib/firebase/admin";
import { refs } from "~/shared/lib/firebase/refs";

export async function deletePick(userId: string, pickId: string) {
  const pickRef = refs.picks.doc(pickId);

  const userPickRef = refs.userPicks(userId).doc(pickId);

  const batch = admin.db.batch();

  try {
    batch.delete(pickRef);
    batch.delete(userPickRef);
    await batch.commit();
  } catch (err) {
    if (err instanceof Error) {
      return err.message;
    }
    return "Unable to delete the pick.";
  }
}