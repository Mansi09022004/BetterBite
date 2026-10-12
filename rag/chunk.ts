// --- Stage 3 of the RAG pipeline: chunking. ---
// A paragraph-first recursive splitter (same idea as LangChain's
// RecursiveCharacterTextSplitter): pack whole paragraphs into a chunk up to
// `chunkSize` characters, and if a single paragraph is bigger than that,
// fall back to splitting it on sentence boundaries. Each new chunk starts
// with a small overlap carried over from the end of the previous chunk, so a
// fact that lands right on a chunk boundary doesn't get orphaned from its
// surrounding context.

export interface Chunk {
  chunkIndex: number;
  content: string;
}

interface ChunkOptions {
  chunkSize?: number;
  chunkOverlap?: number;
}

function splitIntoParagraphs(text: string): string[] {
  return text
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\s+/g, ' ').trim())
    .filter(Boolean);
}

function splitLongParagraph(paragraph: string, chunkSize: number): string[] {
  // The second branch catches a trailing fragment with no closing punctuation
  // (e.g. a sentence cut off by a PDF page break) so it isn't silently dropped.
  const sentences = paragraph.match(/[^.!?]+[.!?]+|[^.!?]+$/g) ?? [paragraph];
  const pieces: string[] = [];
  let current = '';

  for (const sentence of sentences) {
    if ((current + ' ' + sentence).trim().length > chunkSize && current) {
      pieces.push(current.trim());
      current = sentence;
    } else {
      current = (current + ' ' + sentence).trim();
    }
  }
  if (current) pieces.push(current.trim());
  return pieces;
}

export function chunkText(text: string, options: ChunkOptions = {}): Chunk[] {
  const chunkSize = options.chunkSize ?? 700;
  const chunkOverlap = options.chunkOverlap ?? 120;

  const paragraphs = splitIntoParagraphs(text).flatMap((p) =>
    p.length > chunkSize ? splitLongParagraph(p, chunkSize) : [p]
  );

  const chunks: string[] = [];
  let current = '';

  for (const paragraph of paragraphs) {
    const candidate = current ? `${current}\n\n${paragraph}` : paragraph;

    if (candidate.length > chunkSize && current) {
      chunks.push(current);
      // Start the overlap at a word boundary so a chunk never opens mid-word.
      let overlapTail = current;
      if (current.length > chunkOverlap) {
        const rawTail = current.slice(-chunkOverlap);
        const firstSpace = rawTail.search(/\s/);
        overlapTail = firstSpace === -1 ? '' : rawTail.slice(firstSpace).trim();
      }
      current = `${overlapTail}\n\n${paragraph}`.trim();
    } else {
      current = candidate;
    }
  }
  if (current) chunks.push(current);

  return chunks.map((content, chunkIndex) => ({ chunkIndex, content }));
}
