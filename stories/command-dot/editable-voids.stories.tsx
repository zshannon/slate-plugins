import React, { useEffect, useMemo, useState } from "react";
import { boolean, text } from "@storybook/addon-knobs";
import {
  BlockquotePlugin,
  BoldPlugin,
  CodeBlockPlugin,
  CodePlugin,
  EditablePlugins,
  ExitBreakPlugin,
  HeadingPlugin,
  ItalicPlugin,
  ListPlugin,
  ParagraphPlugin,
  pipe,
  ResetBlockTypePlugin,
  SoftBreakPlugin,
  StrikethroughPlugin,
  SlateDocument,
  UnderlinePlugin,
  withAutoformat,
  withInlineVoid,
  withList,
} from "@udecode/slate-plugins";
import { createEditor, Node } from "slate";
import { withHistory } from "slate-history";
import { Slate, withReact } from "slate-react";
import {
  options,
  headingTypes,
  optionsResetBlockTypes,
} from "../config/initialValues";
import { autoformatRules } from "../config/autoformatRules";
import { EditableVoidPlugin } from "./EditableVoidPlugin";
import { EDITABLE_VOID } from "./types";

import {
  DEFAULTS_HBSMENTION,
  HBSMentionNodeData,
  HBSMentionPlugin,
  HBSMentionSelect,
  useHBSMention,
  withHBSMentions,
  HBSMentionsScope,
} from "./mention";

export default {
  component: Example,
  title: "CommandDot/Editable Voids",
};

const initialValueVoids: Node[] = [
  {
    children: [
      {
        type: options.p.type,
        children: [
          {
            text:
              "In addition to nodes that contain editable text, you can insert void nodes, which can also contain editable elements, inputs, or an entire other Slate editor.",
          },
        ],
      },
      {
        type: EDITABLE_VOID,
        children: [{ text: "" }],
      },
      {
        type: options.p.type,
        children: [
          {
            text: "",
          },
        ],
      },
    ],
  },
];

const plugins = [
  ParagraphPlugin(options),
  BoldPlugin(),
  ItalicPlugin(),
  UnderlinePlugin(),
  CodePlugin(),
  StrikethroughPlugin(),
  BlockquotePlugin(options),
  ListPlugin(options),
  HeadingPlugin(options),
  CodeBlockPlugin(options),
  ResetBlockTypePlugin(optionsResetBlockTypes),
  SoftBreakPlugin({
    rules: [
      { hotkey: "shift+enter" },
      {
        hotkey: "enter",
        query: {
          allow: [options.code_block.type, options.blockquote.type],
        },
      },
    ],
  }),
  ExitBreakPlugin({
    rules: [
      {
        hotkey: "mod+enter",
      },
      {
        hotkey: "mod+shift+enter",
        before: true,
      },
      {
        hotkey: "enter",
        level: 0,
        query: {
          allow: headingTypes,
          end: true,
          start: true,
        },
      },
    ],
  }),
  EditableVoidPlugin(),
  HBSMentionPlugin({
    hbsmention: {
      ...DEFAULTS_HBSMENTION,
      rootProps: {
        onClick: (mentionable: HBSMentionNodeData) =>
          console.info(mentionable),
        prefix: text("prefix", "/"),
        renderLabel: (
          mentionable: HBSMentionNodeData
        ) => JSON.stringify(mentionable),
      },
    },
  }),
];

const renderLabel = (
  mentionable: HBSMentionNodeData
) => {
  return mentionable.scopeType.name
};

const withPlugins = [
  withReact,
  withHistory,
  withInlineVoid({ plugins }),
  withList(options),
  withAutoformat({ rules: autoformatRules }),
] as const;

interface ExampleProps {
  scope: HBSMentionsScope;
  setValue: (value: Array<Node>) => void;
  value: Array<Node>;
}

const defaultScope: HBSMentionsScope = [];

export const Example = ({
  scope = defaultScope,
  setValue: setValueProp,
  value: valueProp,
}: ExampleProps) => {
  const [value, setValue] = useState(valueProp || initialValueVoids);
  useEffect(() => {
    if (setValueProp) setValueProp(value);
  }, [value]);
  const editor = useMemo(
    () =>
      pipe(createEditor(), ...withPlugins, withHBSMentions({ scope })),
    [scope]
  );
  const {
    onAddMention,
    onChangeMention,
    onKeyDownMention,
    search,
    index,
    target,
    values,
  } = useHBSMention({
    maxSuggestions: 10,
    trigger: "/",
  });
  return (
    <Slate
      editor={editor}
      value={value}
      onChange={(newValue) => {
        setValue(newValue as SlateDocument);
        onChangeMention(editor);
      }}
    >
      <EditablePlugins
        onKeyDown={[onKeyDownMention]}
        onKeyDownDeps={[index, search, target]}
        plugins={plugins}
        placeholder={text("placeholder", "Enter some text...")}
        readOnly={boolean("readOnly", false)}
        spellCheck={boolean("spellCheck", true)}
        autoFocus
      />
      <HBSMentionSelect
        at={target}
        valueIndex={index}
        options={values}
        onClickMention={onAddMention}
        renderLabel={renderLabel}
      />
    </Slate>
  );
};
