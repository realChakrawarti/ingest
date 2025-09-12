import Cloudflare from "cloudflare";

const client = new Cloudflare({
  apiToken: process.env.CLOUDFLARE_API_TOKEN,
});

export const kv = client.kv.namespaces;

export const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
export const namespaceId = process.env.CLOUDFLARE_KV_NAMESPACE_ID;
