// Whitespace- and indentation-aware typing comparison engine.
//
// Rules:
// - Horizontal spacing between tokens on the same line is flexible: extra or
//   missing spaces around operators/punctuation never count as an error.
// - Leading indentation at the start of a line MUST match exactly.
// - Newlines must match exactly (no line-break tolerance).
// - Spacing inside string/char literals ("...", '...', `...`) MUST match exactly.
//
// The engine works incrementally: call `evaluateTyped` with the full typed
// string so far and it re-derives per-character correctness plus how far
// into the reference solution the user has effectively progressed.

export type CharStatus = 'correct' | 'incorrect' | 'extra';

export interface CharResult {
  char: string;
  status: CharStatus;
}

export interface TypingEvaluation {
  results: CharResult[];
  /** Index into the reference string the user has effectively reached. */
  refPos: number;
  /** True once refPos has reached the end of the reference. */
  isComplete: boolean;
}

export function isHorizontalSpace(ch: string | undefined): boolean {
  return ch === ' ' || ch === '\t';
}

/**
 * Marks which whitespace characters in the reference are "strict" (must be
 * typed exactly): leading indentation on each line, and any whitespace
 * inside a string/char/template literal. All other horizontal whitespace
 * between tokens on the same line is flexible.
 */
export function computeStrictMask(reference: string): boolean[] {
  const strict: boolean[] = new Array(reference.length).fill(false);
  let atLineStart = true;
  let literalQuote: string | null = null;

  for (let i = 0; i < reference.length; i++) {
    const c = reference[i];

    if (literalQuote) {
      if (c === '\\') {
        // Escaped character: neither counts as line-start logic nor is
        // treated as flexible; skip its escapee without reinterpreting it.
        i++;
        continue;
      }
      if (isHorizontalSpace(c)) strict[i] = true;
      if (c === literalQuote) literalQuote = null;
      continue;
    }

    if (c === '"' || c === "'" || c === '`') {
      literalQuote = c;
      atLineStart = false;
      continue;
    }

    if (c === '\n') {
      atLineStart = true;
      continue;
    }

    if (isHorizontalSpace(c)) {
      strict[i] = atLineStart;
      continue;
    }

    atLineStart = false;
  }

  return strict;
}

/**
 * Compares `typed` against `reference` allowing flexible inter-token
 * horizontal whitespace, while still enforcing exact indentation, newlines,
 * and literal contents.
 */
export function evaluateTyped(reference: string, typed: string, strictMask?: boolean[]): TypingEvaluation {
  const strict = strictMask ?? computeStrictMask(reference);
  const results: CharResult[] = [];
  let refPos = 0;

  for (const ch of typed) {
    if (!isHorizontalSpace(ch)) {
      // A non-space keystroke skips past any optional (flexible) reference
      // whitespace the user chose not to type.
      while (refPos < reference.length && isHorizontalSpace(reference[refPos]) && !strict[refPos]) {
        refPos++;
      }
    }

    const atFlexibleSpaceSlot = refPos >= reference.length || !strict[refPos];

    if (isHorizontalSpace(ch) && atFlexibleSpaceSlot) {
      // Extra/optional space typed by the user -- always accepted.
      if (refPos < reference.length && isHorizontalSpace(reference[refPos]) && !strict[refPos]) {
        refPos++;
      }
      results.push({ char: ch, status: 'correct' });
      continue;
    }

    if (refPos >= reference.length) {
      results.push({ char: ch, status: 'extra' });
      continue;
    }

    const expected = reference[refPos];
    results.push({ char: ch, status: ch === expected ? 'correct' : 'incorrect' });
    refPos++;
  }

  return { results, refPos, isComplete: refPos >= reference.length && typed.length > 0 };
}

export interface SessionStats {
  /** Net WPM: only correctly-typed characters count, like Monkeytype's "wpm". */
  wpm: number;
  /** Raw WPM: every keystroke counts (correct, incorrect, and extra alike). */
  rawWpm: number;
  accuracy: number;
  correctChars: number;
  incorrectChars: number;
  extraChars: number;
}

/**
 * Standard WPM scoring, split into "raw" (every keystroke counts) and net
 * "wpm" (only correctly-typed characters count) -- matching the raw/wpm
 * distinction shown on Monkeytype-style results screens.
 */
export function computeSessionStats(results: CharResult[], elapsedMs: number): SessionStats {
  const correctChars = results.filter((r) => r.status === 'correct').length;
  const incorrectChars = results.filter((r) => r.status === 'incorrect').length;
  const extraChars = results.filter((r) => r.status === 'extra').length;
  const totalTyped = results.length;
  const minutes = Math.max(elapsedMs / 60000, 1 / 60000);
  const rawWpm = totalTyped > 0 ? Math.round((totalTyped / 5) / minutes) : 0;
  const wpm = correctChars > 0 ? Math.round((correctChars / 5) / minutes) : 0;
  const accuracy = totalTyped > 0 ? Math.round((correctChars / totalTyped) * 1000) / 10 : 100;
  return { wpm, rawWpm, accuracy, correctChars, incorrectChars, extraChars };
}
