import Picks from "~/views/explore/picks";

export const revalidate = 300; // Cache the page for 5 minutes, unless revalidated on updates

export default function PicksPage() {
  return <Picks />;
}