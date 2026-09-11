import Feeds from "~/views/explore/feeds";

export const revalidate = 300; // Cache the page for 5 minutes, unless revalidated on updates

export default function FeedsPage() {
  return <Feeds />;
}