"use client";

import type { HTMLProps } from "react";
import { ExternalLink } from "lucide-react";

import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";

import { OutLink } from "./out-link";

interface MarkdownViewerProps {
  content: string;
  showImage?: boolean;
}

function CustomLink({
  href,
  children,
  showImage,
  ...rest
}: HTMLProps<HTMLAnchorElement> & { showImage: boolean }) {
  const isImage = /\.(jpg|jpeg|png|gif|webp|svg|bmp)(\?[^)]*)?$/i.test(
    href || ""
  );

  if (isImage && showImage) {
    return (
      <img
        alt="-comment-image"
        src={href}
        className="h-auto max-h-96 w-full object-contain"
      />
    );
  }

  if (!href?.includes("https://")) {
    return children;
  }

  return (
    <OutLink
      className="inline-flex items-center gap-1 px-1 align-bottom"
      href={href || ""}
      {...rest}
    >
      <ExternalLink className="inline size-4 shrink-0" />
      <span className="line-clamp-1">{children}</span>
    </OutLink>
  );
}

export default function MarkdownHTML({
  content,
  showImage = true,
}: MarkdownViewerProps) {
  return (
    <ReactMarkdown
      components={{
        h1: "h3",
        h2: "h3",
        a(props) {
          const { href, children } = props;
          return (
            <CustomLink href={href} showImage={showImage}>
              {children}
            </CustomLink>
          );
        },
      }}
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw, rehypeSanitize]}
    >
      {content}
    </ReactMarkdown>
  );
}