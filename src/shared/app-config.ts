import packageInfo from "../../package.json" with { type: "json" };
import { time } from "./utils/time";

class AppConfig {
  private _catalogUpdatePeriod = time.hours(4);
  private _catalogVideoLimit = 10;
  private _channelLogoUpdatePeriod = time.days(1);
  private _domain = "707x.in";
  private _githubRepo = "https://github.com/realChakrawarti/ingest";
  private _limitArchives = 10;
  private _limitCatalogs = 5;
  private _marketName = "Ingest";
  private _name = packageInfo.name;
  private _organization = "707x Labs";
  private _subDomain = "ingest";
  private _version = packageInfo.version;
  private _watchedPercentage = 95;

  get channelLogoUpdatePeriod(): number {
    return this._channelLogoUpdatePeriod;
  }

  get catalogVideoLimit(): number {
    return this._catalogVideoLimit;
  }

  get catalogUpdatePeriod(): number {
    return this._catalogUpdatePeriod;
  }

  get watchedPercentage(): number {
    return this._watchedPercentage;
  }

  get url(): string {
    return `https://${this._subDomain}.${this._domain}`;
  }

  get domain(): string {
    return this._domain;
  }

  get marketName(): string {
    return this._marketName;
  }

  get name(): string {
    return this._name;
  }

  get subDomain(): string {
    return this._subDomain;
  }

  get version(): string {
    return this._version;
  }

  get organization(): string {
    return this._organization;
  }

  get githubRepo(): string {
    return this._githubRepo;
  }

  get limitCatalogs(): number {
    return this._limitCatalogs;
  }

  get limitArchives(): number {
    return this._limitArchives;
  }
}

const appConfig = new AppConfig();

export default appConfig;
