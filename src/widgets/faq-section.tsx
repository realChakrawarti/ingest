/* eslint-disable @stylistic/max-len */

import Linkify from "linkify-react";

import appConfig from "~/shared/app-config";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/shared/ui/accordion";
import { Button } from "~/shared/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/shared/ui/sheet";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: `What can I do with ${appConfig.marketName}?`,
    answer: `${appConfig.marketName} lets you create personalized collections of YouTube content. Instead of just subscribing to channels, you can build custom catalogs tailored to your interests. This makes it much easier to find exactly the videos you want to watch, when you want to watch them.`,
  },
  {
    question: `How do I use ${appConfig.marketName} to organize my YouTube content?`,
    answer: `It's simple! You select the YouTube channels you like, and you can even choose specific playlists from those channels for finer-grained control. ${appConfig.marketName} then automatically adds new videos to your curated catalogs, so you don't miss anything. Think of it as your own personalized TV guide for YouTube!`,
  },
  {
    question: "How often are new videos added to my catalogs?",
    answer: `${appConfig.marketName} checks for new videos from your selected channels and playlists every 4 hours, so your catalogs are always up-to-date.`,
  },
  {
    question: `Can I use ${appConfig.marketName} on my phone or tablet?`,
    answer: `Yes, ${appConfig.marketName} is designed to work seamlessly on mobile devices. Access your catalogs from your smartphone or tablet anytime, anywhere.`,
  },
  {
    question: `How secure is my data on ${appConfig.marketName}?`,
    answer:
      "We take your privacy seriously. Your viewing history and personal data are encrypted and never shared with anyone. You have full control over your data.",
  },
  {
    question: "Can I share my catalogs with friends?",
    answer:
      "Yes, you can easily share your curated catalogs with friends and family, allowing them to discover great content too. Your privacy settings remain in control.",
  },
  {
    question: "Can I download videos anonymously?",
    answer:
      "Yes, you can download videos anonymously using the privacy-focused cobalt.tools website. This allows you to save videos without revealing your identity or browsing history.",
  },
  {
    question: `Is ${appConfig.marketName} open source?`,
    answer: `Yes! ${appConfig.marketName} is completely open source and is hosted on GitHub. You can view the code, contribute to the project, or even host your own version.  Check it out here: ${appConfig.githubRepo}.`,
  },
];

export default function FAQSection() {
  return (
    <Sheet>
      <SheetTrigger className="absolute top-2 right-2 z-50">
        <Button variant="outline">FAQ</Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto w-full md:max-w-[450px] space-y-2">
        <SheetHeader className="text-left">
          <SheetTitle>Frequently Asked Questions</SheetTitle>
          <SheetDescription>
            Everything you need to know about organizing your YouTube experience
          </SheetDescription>
        </SheetHeader>
        <Accordion
          type="single"
          collapsible
          className="w-full"
          defaultValue="faq-0"
        >
          {faqs.map((faq, index) => (
            <AccordionItem
              className="transition-colors"
              key={`faq-${index}`}
              value={`faq-${index}`}
            >
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-balance">
                <p>
                  <Linkify
                    options={{
                      target: "_blank",
                      className:
                        "cursor-pointer text-[hsl(var(--primary))] hover:text-[hsl(var(--primary))]/70",
                    }}
                  >
                    {faq.answer}
                  </Linkify>
                </p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </SheetContent>
    </Sheet>
  );
}
