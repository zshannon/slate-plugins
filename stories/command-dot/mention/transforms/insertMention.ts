import { Editor, Transforms } from 'slate';
import { setDefaults } from '@udecode/slate-plugins';
import { DEFAULTS_HBSMENTION } from '../defaults';
import { HBSMentionNode, HBSMentionNodeData, HBSMentionPluginOptions } from '../types';

export const insertMention = (
  editor: Editor,
  mentionable: HBSMentionNodeData,
  options?: HBSMentionPluginOptions
) => {
  const { hbsmention } = setDefaults(options, DEFAULTS_HBSMENTION);

  const mentionNode: HBSMentionNode = {
    type: hbsmention.type,
    children: [{ text: '' }],
    ...mentionable,
  };
  Transforms.insertNodes(editor, mentionNode);
  Transforms.move(editor);
};
