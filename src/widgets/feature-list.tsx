import { Card, CardDescription, CardHeader, CardTitle } from "~/shared/ui/card";
import {
  BanIcon,
  BookOpenIcon,
  LayoutIcon,
  MoonIcon,
  PhoneIcon,
  RefreshIcon,
  ShareIcon,
  ShieldIcon,
} from "~/shared/ui/icons";

export default function FeatureList() {
  return (
    <div className="container px-4 py-8 mx-auto">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="transition-colors hover:bg-accent">
          <CardHeader>
            <div className="flex items-center space-x-2 mb-2">
              <BookOpenIcon className="w-5 h-5 text-primary" />
              <CardTitle className="tracking-normal leading-normal">
                Personalized Catalogs
              </CardTitle>
            </div>
            <CardDescription>
              Create custom catalogs for your favorite channels, tailored to
              your interests.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="transition-colors hover:bg-accent">
          <CardHeader>
            <div className="flex items-center space-x-2 mb-2">
              <RefreshIcon className="w-5 h-5 text-primary" />
              <CardTitle className="tracking-normal leading-normal">
                Automated Updates
              </CardTitle>
            </div>
            <CardDescription>
              Stay up-to-date with the latest videos from your channels,
              automatically updated every 4 hours.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="transition-colors hover:bg-accent">
          <CardHeader>
            <div className="flex items-center space-x-2 mb-2">
              <LayoutIcon className="w-5 h-5 text-primary" />
              <CardTitle className="tracking-normal leading-normal">
                Simple and Intuitive Interface
              </CardTitle>
            </div>
            <CardDescription>
              A clean and user-friendly design makes it easy to navigate and
              find the videos you want.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="transition-colors hover:bg-accent">
          <CardHeader>
            <div className="flex items-center space-x-2 mb-2">
              <ShareIcon className="w-5 h-5 text-primary" />
              <CardTitle className="tracking-normal leading-normal">
                Shareable Catalogs
              </CardTitle>
            </div>
            <CardDescription>
              Share your curated catalogs with friends and family, making it
              easy to discover new content together.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="transition-colors hover:bg-accent">
          <CardHeader>
            <div className="flex items-center space-x-2 mb-2">
              <BanIcon className="w-5 h-5 text-primary" />
              <CardTitle className="tracking-normal leading-normal">
                Ad-Free Experience
              </CardTitle>
            </div>
            <CardDescription>
              Enjoy a seamless viewing experience without interruptions from
              ads.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="transition-colors hover:bg-accent">
          <CardHeader>
            <div className="flex items-center space-x-2 mb-2">
              <MoonIcon className="w-5 h-5 text-primary" />
              <CardTitle className="tracking-normal leading-normal">
                Dark Mode
              </CardTitle>
            </div>
            <CardDescription>
              Reduce eye strain and enhance your viewing experience with dark
              mode.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="transition-colors hover:bg-accent">
          <CardHeader>
            <div className="flex items-center space-x-2 mb-2">
              <PhoneIcon className="w-5 h-5 text-primary" />
              <CardTitle className="tracking-normal leading-normal">
                Mobile-Friendly
              </CardTitle>
            </div>
            <CardDescription>
              Access your curated catalogs on your smartphone or tablet,
              anytime, anywhere.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="transition-colors hover:bg-accent">
          <CardHeader>
            <div className="flex items-center space-x-2 mb-2">
              <ShieldIcon className="w-5 h-5 text-primary" />
              <CardTitle className="tracking-normal leading-normal">
                Privacy-Focused
              </CardTitle>
            </div>
            <CardDescription>
              Your data privacy is our top priority. We use industry-standard
              security measures to protect your information.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
