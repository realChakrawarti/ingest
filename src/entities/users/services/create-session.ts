import { refs } from "~/shared/lib/firebase/refs";
import { createNanoidToken } from "~/shared/utils/nanoid-token";

export async function createSession(userId: string) {
  const userRef = refs.users.doc(userId);
  const sessionId = createNanoidToken(16);
  await userRef.update({
    sessionId: sessionId,
    updatedAt: new Date(),
  });
}
