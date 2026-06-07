import { useMemo, useState, type ReactNode } from "react";
import styles from "./DemoWithCode.module.css";

type DemoWithCodeProps = {
  children: ReactNode;
  cssSource?: string;
  exportName?: string;
  source: string;
};

type CodeFile = {
  label: string;
  source: string;
};

export function DemoWithCode({ children, cssSource, exportName, source }: DemoWithCodeProps) {
  const [isCodeVisible, setIsCodeVisible] = useState(false);
  const [activeFileIndex, setActiveFileIndex] = useState(0);
  const files = useMemo(
    () => getCodeFiles(source, cssSource, exportName),
    [cssSource, exportName, source],
  );
  const resolvedActiveFileIndex = Math.min(activeFileIndex, files.length - 1);
  const activeFile = files[resolvedActiveFileIndex] ?? files[0];

  return (
    <section className={styles.root}>
      <div className={styles.preview}>{children}</div>
      {isCodeVisible ? (
        <div className={styles.codePanel}>
          <div className={styles.tabs} role="tablist" aria-label="Demo source files">
            {files.map((file, index) => (
              <button
                className={index === resolvedActiveFileIndex ? styles.tabActive : styles.tab}
                type="button"
                role="tab"
                aria-selected={index === resolvedActiveFileIndex}
                key={file.label}
                onClick={() => setActiveFileIndex(index)}
              >
                {file.label}
              </button>
            ))}
          </div>
          <pre className={styles.codeBlock}>
            <code>{renderHighlightedCode(activeFile.source)}</code>
          </pre>
        </div>
      ) : null}
      <button
        className={styles.toggle}
        type="button"
        aria-expanded={isCodeVisible}
        onClick={() => setIsCodeVisible((value) => !value)}
      >
        {isCodeVisible ? "Hide code" : "Show code"}
      </button>
    </section>
  );
}

function getCodeFiles(
  source: string,
  cssSource: string | undefined,
  exportName?: string,
): CodeFile[] {
  const files = [
    {
      label: "index.tsx",
      source: getDisplaySource(source, exportName),
    },
  ];

  if (cssSource) {
    files.push({
      label: getCssModuleLabel(source),
      source: cssSource.trim(),
    });
  }

  return files;
}

function getCssModuleLabel(source: string) {
  const match = source.match(/from\s+["']\.\/([^"']+\.module\.css)["']/);
  return match?.[1] ?? "styles.module.css";
}

function renderHighlightedCode(code: string) {
  return code.split("\n").map((line, index, lines) => (
    <span key={`${index}-${line}`} className={styles.line}>
      {highlightLine(line)}
      {index < lines.length - 1 ? "\n" : null}
    </span>
  ));
}

function highlightLine(line: string) {
  const pieces = line.split(
    /("[^"]*"|'[^']*'|`[^`]*`|\b(?:const|export|from|function|import|return|type)\b|<\/?[A-Z][\w.]*|[A-Za-z][\w-]*(?==))/g,
  );

  return pieces.map((piece, index) => {
    if (!piece) {
      return null;
    }

    let className: string | undefined;

    if (/^["'`]/.test(piece)) {
      className = styles.tokenString;
    } else if (/^(const|export|from|function|import|return|type)$/.test(piece)) {
      className = styles.tokenKeyword;
    } else if (/^<\/?[A-Z]/.test(piece)) {
      className = styles.tokenTag;
    } else if (/^[A-Za-z][\w-]*$/.test(piece)) {
      className = styles.tokenAttribute;
    }

    return className ? (
      <span className={className} key={`${index}-${piece}`}>
        {piece}
      </span>
    ) : (
      piece
    );
  });
}

function getDisplaySource(source: string, exportName?: string) {
  const normalizedSource = source.trim();

  if (!exportName) {
    return normalizedSource;
  }

  const exportedFunction = findExportedFunction(normalizedSource, exportName);

  if (!exportedFunction) {
    return normalizedSource;
  }

  const supportCode = getSupportCode(normalizedSource, exportedFunction.start);

  return [supportCode, exportedFunction.body.trim()].filter(Boolean).join("\n\n");
}

function findExportedFunction(source: string, exportName: string) {
  const signature = `export function ${exportName}`;
  const start = source.indexOf(signature);

  if (start === -1) {
    return null;
  }

  const bodyStart = source.indexOf("{", start);

  if (bodyStart === -1) {
    return null;
  }

  let depth = 0;
  let quote: '"' | "'" | "`" | null = null;
  let escaped = false;

  for (let index = bodyStart; index < source.length; index += 1) {
    const char = source[index];

    if (quote) {
      if (escaped) {
        escaped = false;
      } else if (char === "\\") {
        escaped = true;
      } else if (char === quote) {
        quote = null;
      }

      continue;
    }

    if (char === '"' || char === "'" || char === "`") {
      quote = char;
      continue;
    }

    if (char === "{") {
      depth += 1;
    } else if (char === "}") {
      depth -= 1;

      if (depth === 0) {
        return {
          body: source.slice(start, index + 1),
          start,
        };
      }
    }
  }

  return null;
}

function getSupportCode(source: string, end: number) {
  let cursor = 0;
  let supportCode = "";

  while (cursor < end) {
    const nextExport = source.indexOf("export function ", cursor);

    if (nextExport === -1 || nextExport >= end) {
      supportCode += source.slice(cursor, end);
      break;
    }

    supportCode += source.slice(cursor, nextExport);

    const bodyStart = source.indexOf("{", nextExport);

    if (bodyStart === -1 || bodyStart >= end) {
      break;
    }

    const functionEnd = findMatchingBrace(source, bodyStart);

    if (functionEnd === -1 || functionEnd >= end) {
      break;
    }

    cursor = functionEnd + 1;
  }

  return supportCode.trimEnd();
}

function findMatchingBrace(source: string, bodyStart: number) {
  let depth = 0;
  let quote: '"' | "'" | "`" | null = null;
  let escaped = false;

  for (let index = bodyStart; index < source.length; index += 1) {
    const char = source[index];

    if (quote) {
      if (escaped) {
        escaped = false;
      } else if (char === "\\") {
        escaped = true;
      } else if (char === quote) {
        quote = null;
      }

      continue;
    }

    if (char === '"' || char === "'" || char === "`") {
      quote = char;
      continue;
    }

    if (char === "{") {
      depth += 1;
    } else if (char === "}") {
      depth -= 1;

      if (depth === 0) {
        return index;
      }
    }
  }

  return -1;
}
