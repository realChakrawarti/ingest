import packageInfo from "../../package.json" with { type: "json" };

class AppConfig {
  private _domain = "707x.in";
  private _marketName = "YTCatalog";
  private _name = packageInfo.name;
  private _subDomain = "ytcatalog";
  private _version = packageInfo.version;
  private _organization = "707x Labs";
  private _githubRepo = "https://github.com/realChakrawarti/yt-catalog";
  private _catalogVideoLimit = 10;
  private _watchedPercentage = 95;
  private _limitCatalogs = 5;
  private _limitArchives = 10;

  get watchedPercentage(): number {
    return this._watchedPercentage;
  }

  get catalogVideoLimit(): number {
    return this._catalogVideoLimit;
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
