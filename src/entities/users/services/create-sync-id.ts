import { refs } from "~/shared/lib/firebase/refs";
import { createNanoidToken } from "~/shared/utils/nanoid-token";

export async function createSyncId(userId: string) {
  const userRef = refs.users.doc(userId);
  const generatedSyncId = createNanoidToken(16);
  await userRef.update({
    syncId: generatedSyncId,
    updatedAt: new Date(),
  });
}
