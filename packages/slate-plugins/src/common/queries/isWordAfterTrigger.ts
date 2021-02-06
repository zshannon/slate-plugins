import { Editor, Point } from 'slate';
import { escapeRegExp } from '../utils';
import { getText } from './getText';

/**
 * Is the word at the point after a trigger (punctuation character)
 * https://github.com/ianstormtaylor/slate/blob/master/packages/slate/src/utils/string.ts#L6
 */
export const isWordAfterTrigger = (
  editor: Editor,
  { at, trigger }: { at: Point; trigger: string }
) => {
  const charBefore = Editor.before(editor, at, { unit: 'character' });
  // Point at the start of previous word (excluding punctuation)
  const wordBefore = Editor.before(editor, at, { unit: 'word' });

  // Point before wordBefore
  const before = wordBefore && Editor.before(editor, wordBefore);
  const before2 = charBefore && Editor.before(editor, charBefore);

  // Range from before to start
  const beforeRange = before && Editor.range(editor, before, at);

  // Before text
  const beforeText = getText(editor, beforeRange);

  // Starts with char and ends with word characters
  const escapedTrigger = escapeRegExp(trigger);

  const beforeRegex = new RegExp(`^${escapedTrigger}([\\w|À-ÖØ-öø-ÿ]+)$`);
  console.log({charBefore,before2, beforeText,wordBefore, before, beforeRange}, beforeText.match(beforeRegex))

  // Match regex on before text
  const match = !!beforeText && beforeText.match(beforeRegex);

  return {
    range: beforeRange,
    match,
  };
};
