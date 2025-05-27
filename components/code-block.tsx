'use client';

interface CodeBlockProps {
  node: any;
  inline: boolean;
  className: string;
  children: any;
}

export function CodeBlock({
  node,
  inline,
  className,
  children,
  ...props
}: CodeBlockProps) {
  // For inline code - this is simple and works well inside paragraphs
  if (inline) {
    return (
      <code
        className={`${className} text-sm bg-zinc-100 dark:bg-zinc-800 py-0.5 px-1 rounded-md`}
        {...props}
      >
        {children}
      </code>
    );
  }

  // For block code - use a simpler approach with just divs
  // Using a single wrapper div with stable class names
  return (
    <div className="code-block-wrapper py-4">
      <div className="text-sm w-full overflow-x-auto bg-zinc-100 dark:bg-zinc-900 p-4 border border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-zinc-50 font-mono">
        {children}
      </div>
    </div>
  );
}
