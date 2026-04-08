import Spinner from "~/widgets/spinner";

export default function ArchivesLoading() {
  return (
    <div className="mt-7 flex h-full flex-col items-center">
      <Spinner label="Archives are being generated." className="size-7" />
    </div>
  );
}