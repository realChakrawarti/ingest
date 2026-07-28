import type { ZCatalogChannel } from "../models";

import { FieldValue } from "firebase-admin/firestore";

import { refs } from "~/shared/lib/firebase/refs";

export async function updateCatalogChannels(
  userId: string,
  catalogId: string,
  channel: ZCatalogChannel
) {
  const userCatalogRef = refs.userCatalogs(userId).doc(catalogId);

  try {
    // 1. Busca os dados atuais do catálogo no banco
    const catalogSnap = await userCatalogRef.get();

    if (catalogSnap.exists) {
      const catalogData = catalogSnap.data();
      const currentList = catalogData?.list || [];

      // 2. Verifica se é um canal e se tem o mesmo ID
      const channelExists = currentList.some(
        (c: any) => c.type === "channel" && c.channelId === channel.channelId
      );

      // 3. Se existir, barra a operação e retorna o erro
      if (channelExists) {
        return "Este canal já está no catálogo!";
      }
    }

    // 4. Se não existir, salva normalmente
    await userCatalogRef.update({
      list: FieldValue.arrayUnion(channel),
      updatedAt: new Date(),
    });
  } catch (err) {
    if (err instanceof Error) {
      return err.message;
    }
    return "Unable to update catalog channels.";
  }
}