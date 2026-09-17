import Spinner from "~/widgets/spinner";

export default function FeedsLoading() {
  return (
    <div className="mt-7 flex h-full flex-col items-center">
      <Spinner label="Feeds are being generated." className="size-7" />
    </div>
  );
}