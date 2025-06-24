"use client";

import {
  Bug,
  HelpCircle,
  Lightbulb,
  MailQuestion,
  PlusCircle,
} from "lucide-react";
import { useState } from "react";

import { toast } from "~/shared/hooks/use-toast";
import fetchApi from "~/shared/lib/api/fetch";
import { Button } from "~/shared/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/shared/ui/dialog";
import { Input } from "~/shared/ui/input";
import { Label } from "~/shared/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/shared/ui/select";
import { Textarea } from "~/shared/ui/textarea";
import { cn } from "~/shared/utils/tailwind-merge";

import { OutLink } from "./out-link";

type FeedbackType = "Bug" | "Improvement" | "Feature" | "General";

interface FeedbackData {
  name: string;
  email: string;
  feedback: string;
  type: FeedbackType;
}

const feedbackTypes: { [_key in FeedbackType]: JSX.Element } = {
  Bug: <Bug className="mr-2 h-4 w-4" />,
  Feature: <PlusCircle className="mr-2 h-4 w-4" />,
  General: <HelpCircle className="mr-2 h-4 w-4" />,
  Improvement: <Lightbulb className="mr-2 h-4 w-4" />,
};

const TITLE_CHAR_LIMIT = 96;

const initialFeedbackData: FeedbackData = {
  email: "",
  feedback: "",
  name: "",
  type: "General",
};

export default function Feedback() {
  const [feedbackData, setFeedbackData] =
    useState<FeedbackData>(initialFeedbackData);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { type, feedback, email = "", name = "" } = feedbackData;

    const title =
      feedback.length > TITLE_CHAR_LIMIT
        ? `${feedback.substring(0, TITLE_CHAR_LIMIT)}...`
        : feedback;
    const description = `
### Reporter
**Name:** ${name ? name : "N/A"}
**Email:** ${email ? email : "N/A"}

### Device Information
**Platform:** ${navigator.platform}
**User-Agent:** ${navigator.userAgent}
**Screen Resolution:** ${window.screen.width} x ${window.screen.height}
**Cookies Enabled:** ${navigator.cookieEnabled}

### Description
${feedback}
`;

    const payload = {
      description: description,
      title: `[${type.toUpperCase()}] ${title}`,
    };

    const result = await fetchApi("/feedback", {
      body: JSON.stringify(payload),
      method: "POST",
    });

    if (result.success) {
      toast({
        description: (
          <p>
            Issue link:{" "}
            <OutLink
              href={result.data.data}
              className="cursor-pointer text-[hsl(var(--primary))] hover:text-[hsl(var(--primary))]/70"
            >
              {result.data.data}
            </OutLink>
          </p>
        ),
        title: result.message,
      });
      setFeedbackData(initialFeedbackData);
    } else {
      toast({ title: "Unable to shared feedback." });
    }
  };
  return (
    <section>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            aria-label="Open feedback modal"
            variant="ghost"
            className={cn(
              "w-full justify-start px-2",
              "hover:bg-primary/5 hover:text-primary/80"
            )}
          >
            <MailQuestion className="mr-2 h-4 w-4" />
            Feedback
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Provide Feedback</DialogTitle>
            <DialogDescription>
              We appreciate your feedback. Please fill out the form below.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name (Optional)</Label>
              <Input
                id="name"
                value={feedbackData.name}
                onChange={(e) =>
                  setFeedbackData({ ...feedbackData, name: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email (Optional)</Label>
              <Input
                id="email"
                type="email"
                value={feedbackData.email}
                onChange={(e) =>
                  setFeedbackData({ ...feedbackData, email: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="feedback">Feedback</Label>
              <Textarea
                id="feedback"
                required
                value={feedbackData.feedback}
                onChange={(e) =>
                  setFeedbackData({ ...feedbackData, feedback: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Type of Feedback</Label>
              <Select
                value={feedbackData.type}
                onValueChange={(value: FeedbackType) =>
                  setFeedbackData({ ...feedbackData, type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select feedback type" />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(feedbackTypes) as FeedbackType[]).map(
                    (type) => (
                      <SelectItem key={type} value={type}>
                        <div className="flex items-center">
                          {feedbackTypes[type]}
                          {type}
                        </div>
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </div>
            <DialogClose>
              <Button type="submit" className="w-full">
                Submit Feedback
              </Button>
            </DialogClose>
          </form>
        </DialogContent>
      </Dialog>
    </section>
  );
}
