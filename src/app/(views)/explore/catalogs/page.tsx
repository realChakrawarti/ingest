import Catalogs from "~/views/explore/catalogs";

export const dynamic = "force-dynamic";
export const revalidate = 300; // Cache the page for 5 minutes, unless revalidated on updates

export default async function CatalogsPage() {
  return <Catalogs />;
}
