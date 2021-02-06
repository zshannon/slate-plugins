import { useCallback, useState } from 'react';
import { Editor, Range, Transforms } from 'slate';
import { isPointAtWordEnd, isWordAfterTrigger } from '@udecode/slate-plugins';
import { isCollapsed } from '@udecode/slate-plugins';
import { insertMention } from './transforms';
import { HBSMentionsEditor, HBSMentionNodeData, HBSMentionsScope, UseHBSMentionOptions } from './types';
import { getNextIndex, getPreviousIndex } from './utils';

export const useHBSMention = (
  {
    maxSuggestions = 10,
    trigger = '@',
    mentionableFilter = (search: string) => (c: HBSMentionNodeData) =>
      c.scopeType.name.toLowerCase().includes(search.toLowerCase()),
    ...options
  }: UseHBSMentionOptions = {}
) => {
  const [targetRange, setTargetRange] = useState<Range | null>(null);
  const [valueIndex, setValueIndex] = useState(0);
  const [scope, setScope] = useState<HBSMentionsScope>([])
  const [search, setSearch] = useState('');
  // TODO: this whole search function here is bad
  console.log({scope})
  const values = scope
    .filter(scopeType => mentionableFilter(search)({ scopeType }, scope))
    .slice(0, maxSuggestions).map(scopeType => ({ scopeType }));

  const onAddMention = useCallback(
    (editor: Editor, data: HBSMentionNodeData) => {
      if (targetRange !== null) {
        Transforms.select(editor, targetRange);
        insertMention(editor, data, options);
        return setTargetRange(null);
      }
    },
    [options, targetRange]
  );

  const onKeyDownMention = useCallback(
    (e: any, editor: Editor) => {
      if (targetRange) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          return setValueIndex(getNextIndex(valueIndex, values.length - 1));
        }
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          return setValueIndex(getPreviousIndex(valueIndex, values.length - 1));
        }
        if (e.key === 'Escape') {
          e.preventDefault();
          return setTargetRange(null);
        }

        if (['Tab', 'Enter'].includes(e.key)) {
          e.preventDefault();
          onAddMention(editor, values[valueIndex]);
          return false;
        }
      }
    },
    [
      values,
      valueIndex,
      setValueIndex,
      targetRange,
      setTargetRange,
      onAddMention,
    ]
  );

  const onChangeMention = useCallback(
    (editor: Editor) => {
      const { selection } = editor;

      if (selection && isCollapsed(selection)) {
        const cursor = Range.start(selection);

        const { range, match: beforeMatch } = isWordAfterTrigger(editor, {
          at: cursor,
          trigger,
        });
console.log({beforeMatch,range,cursor,trigger})
        if (beforeMatch && isPointAtWordEnd(editor, { at: cursor })) {
          setTargetRange(range as Range);
          const [, word] = beforeMatch;
          console.log({editor})
          console.log({word})
          const scope = (editor as HBSMentionsEditor).scope // TODO: update this for current target
          setScope(scope)
          setSearch(word);
          setValueIndex(0);
          return;
        }
      }

      setTargetRange(null);
    },
    [setTargetRange, setSearch, setValueIndex, trigger]
  );

  console.log({search, values})

  return {
    search,
    index: valueIndex,
    target: targetRange,
    values,
    onChangeMention,
    onKeyDownMention,
    onAddMention,
  };
};
