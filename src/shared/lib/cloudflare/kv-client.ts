import "server-only";

import Cloudflare from "cloudflare";

const client = new Cloudflare({
  apiToken: process.env.CLOUDFLARE_API_TOKEN,
});

export const kv = client.kv.namespaces;

export const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
export const namespaceId = process.env.CLOUDFLARE_KV_NAMESPACE_ID;

if (!process.env.CLOUDFLARE_API_TOKEN) {
  throw new Error("CLOUDFLARE_API_TOKEN is not set");
}
if (!accountId) {
  throw new Error("CLOUDFLARE_ACCOUNT_ID is not set");
}
if (!namespaceId) {
  throw new Error("CLOUDFLARE_KV_NAMESPACE_ID is not set");
}
