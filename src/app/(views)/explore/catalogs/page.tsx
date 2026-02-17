import Catalogs from "~/views/explore/catalogs";

export const revalidate = 300; // Cache the page for 5 minutes, unless revalidated on updates

export default function CatalogsPage() {
  return <Catalogs />;
}
