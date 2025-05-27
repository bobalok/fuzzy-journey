import Link from 'next/link';
import React, { memo } from 'react';
import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { CodeBlock } from './code-block';

const components: Partial<Components> = {
  // @ts-expect-error
  code: CodeBlock,
  ol: ({ node, children, ...props }) => {
    return (
      <ol className="list-decimal list-outside ml-4" {...props}>
        {children}
      </ol>
    );
  },
  li: ({ node, children, ...props }) => {
    return (
      <li className="py-1" {...props}>
        {children}
      </li>
    );
  },
  ul: ({ node, children, ...props }) => {
    return (
      <ul className="list-decimal list-outside ml-4" {...props}>
        {children}
      </ul>
    );
  },
  strong: ({ node, children, ...props }) => {
    return (
      <span className="font-semibold" {...props}>
        {children}
      </span>
    );
  },
  a: ({ node, children, ...props }) => {
    return (
      // @ts-expect-error
      <Link
        className="text-blue-500 hover:underline"
        target="_blank"
        rel="noreferrer"
        {...props}
      >
        {children}
      </Link>
    );
  },
  h1: ({ node, children, ...props }) => {
    return (
      <h1 className="text-3xl font-semibold mt-6 mb-2" {...props}>
        {children}
      </h1>
    );
  },
  h2: ({ node, children, ...props }) => {
    return (
      <h2 className="text-2xl font-semibold mt-6 mb-2" {...props}>
        {children}
      </h2>
    );
  },
  h3: ({ node, children, ...props }) => {
    return (
      <h3 className="text-xl font-semibold mt-6 mb-2" {...props}>
        {children}
      </h3>
    );
  },
  h4: ({ node, children, ...props }) => {
    return (
      <h4 className="text-lg font-semibold mt-6 mb-2" {...props}>
        {children}
      </h4>
    );
  },
  h5: ({ node, children, ...props }) => {
    return (
      <h5 className="text-base font-semibold mt-6 mb-2" {...props}>
        {children}
      </h5>
    );
  },
  h6: ({ node, children, ...props }) => {
    return (
      <h6 className="text-sm font-semibold mt-6 mb-2" {...props}>
        {children}
      </h6>
    );
  },
};

const remarkPlugins = [remarkGfm];

// Create a wrapper function to catch and log any rendering errors
const safeRenderMarkdown = (content: string) => {
  try {
    // Use key based on content to ensure React recreates the component when content changes
    // This helps prevent hydration mismatches
    return (
      <div className="markdown-container">
        <ReactMarkdown
          key={`md-${content.substring(0, 20).replace(/\s/g, '-')}`}
          remarkPlugins={remarkPlugins}
          components={components}
          skipHtml={true} // Skip HTML to avoid nesting issues
        >
          {content}
        </ReactMarkdown>
      </div>
    );
  } catch (error) {
    console.error('Markdown rendering error:', error);
    return <div className="text-red-500">Error rendering markdown content</div>;
  }
};

const NonMemoizedMarkdown = ({ children }: { children: string }) => {
  // Handle undefined or null content gracefully
  if (!children) {
    return <div className="empty-markdown" />;
  }

  return safeRenderMarkdown(children);
};

export const Markdown = memo(
  NonMemoizedMarkdown,
  (prevProps, nextProps) => prevProps.children === nextProps.children,
);
