import Link from "next/link";

import { Button } from "~/shared/ui/button";

export default function HeroSection() {
  return (
    <>
      {/* Hero */}
      <div className="relative overflow-hidden py-12 md:py-8">
        <div className="relative z-10">
          <div className="container pt-16 pb-0 lg:pt-20 lg:pb-8">
            <div className="mx-auto max-w-2xl text-center">
              <div className="animate-bounce-slow mb-4">
                <p className="text-primary font-hilmar mb-2 animate-pulse text-sm font-medium tracking-wider uppercase">
                  Feed Your Mind, Not the Noise.
                </p>
              </div>
              {/* Title */}
              <div className="mt-5 max-w-2xl">
                <h1 className="font-hilmar scroll-m-20 text-4xl font-semibold tracking-wider lg:text-5xl">
                  Organize Your Digital Universe
                </h1>
              </div>
              {/* End Title */}
              <div className="mt-5 max-w-3xl">
                <p className="text-muted-foreground leading-wide font-outfit text-lg">
                  Tired of endless scrolling through digital noise? Simplify
                  internet feed - just as good food nourishes the body, curated
                  content fuels the mind.
                </p>
              </div>
              {/* Buttons */}
              <div className="mt-8 flex flex-col items-center gap-3">
                <Link href="/explore">
                  <Button className="btn-drop-shadow w-24 px-4">Explore</Button>
                </Link>
              </div>
              {/* End Buttons */}
            </div>
          </div>
        </div>
      </div>
      {/* End Hero */}
    </>
  );
}