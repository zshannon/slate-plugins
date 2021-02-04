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
import { EDITABLE_VOID, FunctionType, ConstantType } from "./types";

export default {
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
];

const withPlugins = [
  withReact,
  withHistory,
  withInlineVoid({ plugins }),
  withList(options),
  withAutoformat({ rules: autoformatRules }),
] as const;

interface ExampleProps {
  scope: Array<FunctionType | ConstantType>;
  setValue: (value: Array<Node>) => void;
  value: Array<Node>;
}

const defaultScope: Array<FunctionType | ConstantType> = [];

export const Example = ({
  scope = defaultScope,
  setValue: setValueProp,
  value: valueProp,
}: ExampleProps) => {
  const [value, setValue] = useState(valueProp || initialValueVoids);
  useEffect(() => {
    if (setValueProp) setValueProp(value);
  }, [value]);
  const editor = useMemo(() => pipe(createEditor(), ...withPlugins), []);

  // TODO: use `scope`

  return (
    <Slate
      editor={editor}
      value={value}
      onChange={(newValue) => setValue(newValue as SlateDocument)}
    >
      <EditablePlugins
        readOnly={boolean("readOnly", false)}
        plugins={plugins}
        placeholder={text("placeholder", "Enter some text...")}
        spellCheck={boolean("spellCheck", true)}
        autoFocus
      />
    </Slate>
  );
};
