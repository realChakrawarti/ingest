import Spinner from "~/widgets/spinner";

export default function ExploreLoading() {
  return (
    <div className="mt-7 flex h-full flex-col items-center">
      <Spinner label="" className="size-7" />
    </div>
  );
}