import React from "react";
import { Text, View, StyleSheet, Platform } from "react-native";
import { useColors } from "@/hooks/use-colors";

interface MarkdownRendererProps {
  content: string;
}

/**
 * Simple Markdown renderer for React Native.
 * Supports: headings (##, ###), bold (**), italic (*), bullet lists, horizontal rules, blockquotes, code.
 */
export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const colors = useColors();

  const lines = content.split("\n");

  const elements: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Horizontal rule
    if (/^---+$/.test(line.trim())) {
      elements.push(
        <View
          key={i}
          style={[styles.hr, { backgroundColor: colors.border }]}
        />,
      );
      i++;
      continue;
    }

    // H1
    if (line.startsWith("# ")) {
      elements.push(
        <Text key={i} style={[styles.h1, { color: colors.foreground }]}>
          {renderInline(line.slice(2), colors)}
        </Text>,
      );
      i++;
      continue;
    }

    // H2
    if (line.startsWith("## ")) {
      elements.push(
        <Text key={i} style={[styles.h2, { color: colors.foreground }]}>
          {renderInline(line.slice(3), colors)}
        </Text>,
      );
      i++;
      continue;
    }

    // H3
    if (line.startsWith("### ")) {
      elements.push(
        <Text key={i} style={[styles.h3, { color: colors.accent }]}>
          {renderInline(line.slice(4), colors)}
        </Text>,
      );
      i++;
      continue;
    }

    // H4
    if (line.startsWith("#### ")) {
      elements.push(
        <Text key={i} style={[styles.h4, { color: colors.foreground }]}>
          {renderInline(line.slice(5), colors)}
        </Text>,
      );
      i++;
      continue;
    }

    // Blockquote
    if (line.startsWith("> ")) {
      elements.push(
        <View
          key={i}
          style={[styles.blockquote, { borderLeftColor: colors.accent, backgroundColor: colors.surface }]}
        >
          <Text style={[styles.blockquoteText, { color: colors.muted }]}>
            {renderInline(line.slice(2), colors)}
          </Text>
        </View>,
      );
      i++;
      continue;
    }

    // Bullet list item
    if (line.match(/^[-*•]\s/)) {
      elements.push(
        <View key={i} style={styles.listItem}>
          <Text style={[styles.bullet, { color: colors.accent }]}>•</Text>
          <Text style={[styles.listText, { color: colors.foreground }]}>
            {renderInline(line.replace(/^[-*•]\s/, ""), colors)}
          </Text>
        </View>,
      );
      i++;
      continue;
    }

    // Numbered list item
    if (line.match(/^\d+\.\s/)) {
      const num = line.match(/^(\d+)\.\s/)?.[1] ?? "1";
      elements.push(
        <View key={i} style={styles.listItem}>
          <Text style={[styles.bullet, { color: colors.accent }]}>{num}.</Text>
          <Text style={[styles.listText, { color: colors.foreground }]}>
            {renderInline(line.replace(/^\d+\.\s/, ""), colors)}
          </Text>
        </View>,
      );
      i++;
      continue;
    }

    // Code block
    if (line.startsWith("```")) {
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      elements.push(
        <View key={i} style={[styles.codeBlock, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.codeText, { color: colors.foreground }]}>
            {codeLines.join("\n")}
          </Text>
        </View>,
      );
      i++;
      continue;
    }

    // Empty line
    if (line.trim() === "") {
      elements.push(<View key={i} style={styles.spacer} />);
      i++;
      continue;
    }

    // Regular paragraph
    elements.push(
      <Text key={i} style={[styles.paragraph, { color: colors.foreground }]}>
        {renderInline(line, colors)}
      </Text>,
    );
    i++;
  }

  return <View style={styles.container}>{elements}</View>;
}

// ─── Inline Renderer ─────────────────────────────────────────────────────────

function renderInline(text: string, colors: ReturnType<typeof useColors>): React.ReactNode {
  // Split by bold, italic, inline code
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g);

  return parts.map((part, idx) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <Text key={idx} style={{ fontWeight: "700", color: colors.foreground }}>
          {part.slice(2, -2)}
        </Text>
      );
    }
    if (part.startsWith("*") && part.endsWith("*") && !part.startsWith("**")) {
      return (
        <Text key={idx} style={{ fontStyle: "italic", color: colors.muted }}>
          {part.slice(1, -1)}
        </Text>
      );
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <Text
          key={idx}
          style={{
            fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
            backgroundColor: colors.surface,
            color: colors.foreground,
            fontSize: 13,
          }}
        >
          {part.slice(1, -1)}
        </Text>
      );
    }
    return <Text key={idx}>{part}</Text>;
  });
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    gap: 2,
  },
  h1: {
    fontSize: 22,
    fontWeight: "700",
    letterSpacing: -0.5,
    marginTop: 20,
    marginBottom: 8,
    lineHeight: 30,
  },
  h2: {
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: -0.3,
    marginTop: 18,
    marginBottom: 6,
    lineHeight: 26,
  },
  h3: {
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 0.2,
    marginTop: 14,
    marginBottom: 4,
    lineHeight: 22,
  },
  h4: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 10,
    marginBottom: 4,
    lineHeight: 20,
  },
  paragraph: {
    fontSize: 15,
    lineHeight: 24,
    marginVertical: 2,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    marginVertical: 2,
    paddingLeft: 4,
  },
  bullet: {
    fontSize: 15,
    lineHeight: 24,
    fontWeight: "700",
    width: 16,
    flexShrink: 0,
  },
  listText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 24,
  },
  blockquote: {
    borderLeftWidth: 3,
    paddingLeft: 12,
    paddingVertical: 8,
    paddingRight: 8,
    borderRadius: 4,
    marginVertical: 4,
  },
  blockquoteText: {
    fontSize: 14,
    lineHeight: 22,
    fontStyle: "italic",
  },
  codeBlock: {
    borderRadius: 8,
    borderWidth: 1,
    padding: 12,
    marginVertical: 6,
  },
  codeText: {
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
    fontSize: 13,
    lineHeight: 20,
  },
  hr: {
    height: 1,
    marginVertical: 16,
    borderRadius: 1,
  },
  spacer: {
    height: 6,
  },
});
