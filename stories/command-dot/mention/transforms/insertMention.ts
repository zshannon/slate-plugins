import { Transforms } from "slate";
import { ReactEditor } from 'slate-react'
import { setDefaults } from "@udecode/slate-plugins";
import { DEFAULTS_HBSMENTION } from "../defaults";
import {
  HBSMentionNode,
  HBSMentionNodeData,
  HBSMentionPluginOptions,
  isFunction,
} from "../types";
import element from "slate-react/dist/components/element";

export const insertMention = (
  editor: ReactEditor,
  mentionable: HBSMentionNodeData,
  options?: HBSMentionPluginOptions
) => {
  const { hbsmention } = setDefaults(options, DEFAULTS_HBSMENTION);
  const { scopeType } = mentionable;
  if (isFunction(scopeType)) {
    const mentionNode: HBSMentionNode = {
      children: [
        ...scopeType.parameters.map((parameter) => ({
          children: [{ text: "" }],
          scopeType: parameter,
          type: hbsmention.type,
        })),
        { text: "" },
      ],
      scopeType,
      type: hbsmention.type,
    };
    const { selection } = editor
    console.log(selection?.anchor.path)
    Transforms.insertNodes(editor, mentionNode);
    console.log(selection?.anchor.path)
    if (selection) {
      const path = selection.anchor.path.slice(0, -1).concat(1, 1)
      console.log({path, selection,editor})
      Transforms.setSelection(editor, { path })
    }
    // console.log(mentionNode.children[0], selection)
    // const xxx = ReactEditor.findPath(editor, mentionNode.children[0])
    // console.log({xxx})
    // Transforms.move(editor, { pat}); // TODO: move to first blank
  } else {
    const mentionNode: HBSMentionNode = {
      type: hbsmention.type,
      children: [{ text: "" }],
      ...mentionable,
    };
    Transforms.insertNodes(editor, mentionNode);
    Transforms.move(editor);
  }
};
