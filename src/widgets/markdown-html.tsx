"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import { OutLink } from "./out-link";
import { ExternalLink } from "lucide-react";
import { HTMLProps } from "react";

interface MarkdownViewerProps {
  content: string;
}

function CustomLink({ href, children, ...rest }: HTMLProps<HTMLAnchorElement>) {
  const isImage = /\.(jpg|jpeg|png|gif|webp|svg|bmp)(\?[^)]*)?$/i.test(
    href || ""
  );

  if (isImage) {
    return (
      <img
        alt="-comment-image"
        src={href}
        className="w-full h-auto max-h-96 object-contain"
      />
    );
  }

  if (!href?.includes("https://")) {
    return children;
  }

  return (
    <OutLink
      className="px-1 inline-flex items-center gap-1 align-bottom"
      href={href || ""}
      {...rest}
    >
      <ExternalLink className="size-4 inline shrink-0" />
      <span className="line-clamp-1">{children}</span>
    </OutLink>
  );
}

export default function MarkdownHTML({ content }: MarkdownViewerProps) {
  return (
    <ReactMarkdown
      components={{
        h1: "h3",
        h2: "h3",
        a(props) {
          const { href, children } = props;
          return <CustomLink href={href}>{children}</CustomLink>;
        },
      }}
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw, rehypeSanitize]}
    >
      {content}
    </ReactMarkdown>
  );
}
