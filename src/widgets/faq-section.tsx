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
    answer: `${appConfig.marketName} lets you create personalized collections of content from both YouTube and Reddit. You can build custom catalogs tailored to your interests, making it much easier to find exactly the videos and trending posts you want to see, when you want to see them. You don't even need to sign up or log in to watch videos or read posts.`,
    question: `What can I do with ${appConfig.marketName}?`,
  },
  {
    answer: `It's simple! You can select the YouTube channels you like, and even choose specific playlists from those channels for finer control. You can also add your favorite subreddits to your catalogs. ${appConfig.marketName} then automatically adds new videos or trending posts to your curated catalogs, so you don't miss anything. Think of it as your own personalized feed for YouTube and Reddit!`,
    question: `How do I use ${appConfig.marketName} to organize my content?`,
  },
  {
    answer: `${appConfig.marketName} checks for new content from your selected channels, playlists, and subreddits every 4 hours, so your catalogs are always up-to-date.`,
    question: "How often are new videos and posts added to my catalogs?",
  },
  {
    answer: `Yes, ${appConfig.marketName} is designed to work seamlessly on mobile devices. Access your catalogs from your smartphone or tablet anytime, anywhere.`,
    question: `Can I use ${appConfig.marketName} on my phone or tablet?`,
  },
  {
    answer:
      "We take your privacy seriously. Your viewing history and personal data are encrypted and never shared with anyone. Your watching history is stored directly on your device, and you have full control over your data.",
    question: `How secure is my data on ${appConfig.marketName}?`,
  },
  {
    answer:
      "Yes, you can easily share your curated catalogs with friends and family, allowing them to discover great content too. Your privacy settings remain in control.",
    question: "Can I share my catalogs with friends?",
  },
  {
    answer:
      "Yes, you can download videos anonymously using the privacy-focused cobalt.tools website. This allows you to save videos without revealing your identity or Browse history.",
    question: "Can I download videos anonymously?",
  },
  {
    answer: `Yes! ${appConfig.marketName} is completely open source and is hosted on GitHub. You can view the code, contribute to the project, or even host your own version. Check it out here: ${appConfig.githubRepo}.`,
    question: `Is ${appConfig.marketName} open source?`,
  },
];

export default function FAQSection() {
  return (
    <Sheet>
      <SheetTrigger className="absolute top-2 right-2 z-50" asChild>
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
          {faqs.map((faq, idx) => (
            <AccordionItem
              className="transition-colors"
              key={`${faq.question}-${idx}`}
              value={`faq-${idx}`}
            >
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent className="flex flex-col gap-4 text-balance">
                <p>
                  <Linkify
                    options={{
                      className:
                        "cursor-pointer text-[hsl(var(--primary))] hover:text-[hsl(var(--primary))]/70",
                      target: "_blank",
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
