import { SourceFile } from 'ts-morph';

export function formatSource(source: SourceFile) {
  source.formatText({
    indentSize: 2,
    ensureNewLineAtEndOfFile: true,
  });
}
