import Archives from "~/views/explore/archives";

export const revalidate = 300; // Cache the page for 5 minutes, unless revalidated on updates

export default function ArchivesPage() {
  return <Archives />;
}
