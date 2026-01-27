import appConfig from "~/shared/app-config";

import { OutLink } from "./out-link";

export default function Footer() {
  return (
    <footer className="h-auto flex items-center border-t">
      <div className="p-3 self-end flex justify-between container mx-auto">
        <OutLink
          className="cursor-pointer text-xs dark:text-gray-300 dark:hover:text-gray-100"
          href={`${appConfig.githubRepo}/blob/main/CHANGELOG.md`}
        >
          <p className="tracking-wider">v{appConfig.version}</p>
        </OutLink>
      </div>
    </footer>
  );
}
