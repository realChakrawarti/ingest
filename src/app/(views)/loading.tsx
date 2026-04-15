import Spinner from "~/widgets/spinner";

export default function RootLoading() {
  return (
    <div className="mt-7 flex h-full flex-col items-center">
      <Spinner className="size-7" />
    </div>
  );
}