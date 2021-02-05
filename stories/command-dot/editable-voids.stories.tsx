import React, { useEffect, useMemo, useState, useContext } from "react";
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
  MentionPlugin,
  MentionSelect,
  useMention,
  MentionNodeData,
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
  component: MentionPlugin,
  subcomponents: {
    useMention,
    MentionSelect,
  },
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

  let mentionScope: MentionNodeData[] = [];
  //Assigning a value : String
  let count = 1;
  for (var key of Object.keys(scope)) {
    scope[key]["value"] = String(count);
    if (scope[key]["type"] == "function") {
      scope[key]["type"] = EDITABLE_VOID;
    }
    mentionScope.push(scope[key]);
    count += 1;
  }
  //console.log(mentionScope);

  const renderLabel = (mentionable: MentionNodeData) => {
    //console.log("here")
    const entry = mentionScope.find((m) => m.value === mentionable.value);
    if (!entry) return "unknown option";
    //editor.insertText('/')
    return (
      <div>
        {entry.name}
      </div>
    );
  };

  useEffect(() => {
    //console.log(value);
    if (setValueProp) {
      setValueProp(value);
    }
  }, [value]);

  //Plugins

  //Move pluggin down to use scope

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
    MentionPlugin({
      mention: {
        ...options.mention,
        rootProps: {
          onClick: (mentionable: MentionNodeData) =>
            console.info(`Hello, I'm ${mentionable}`),
          prefix: text("prefix", "/"),
          renderLabel,
        },
      },
    }),
  ];




  const withPlugins = [
    withReact,
    withHistory,
    withInlineVoid({ plugins }),
    withList(options),
    withAutoformat({ rules: autoformatRules }),
  ] as const;
  const {
    onAddMention,
    onChangeMention,
    onKeyDownMention,
    search,
    index,
    target,
    values,
  } = useMention(mentionScope, {
    maxSuggestions: 10,
    trigger: "/",
    mentionableFilter: (search: string) => (mentionable: MentionNodeData) =>
      //mentionable.email.toLowerCase().includes(search.toLowerCase()) ||
      mentionable.name.toLowerCase().includes(search.toLowerCase()),
  });
  const editor = useMemo(() => pipe(createEditor(), ...withPlugins), []);



  return (
    <Slate
      editor={editor}
      value={value}
      onChange={(newValue) => {
        //console.log(newValue)
        setValue(newValue as SlateDocument);
        onChangeMention(editor);
      }}
    >
      <EditablePlugins
        readOnly={boolean("readOnly", false)}
        plugins={plugins}
        placeholder={text("placeholder", "Enter some text...")}
        spellCheck={boolean("spellCheck", true)}
        onKeyDown={[onKeyDownMention]}
        onKeyDownDeps={[index, search, target]}
        options={value}
        autoFocus
      />
      <MentionSelect
        at={target}
        valueIndex={index}
        options={values}
        onClickMention={onAddMention}
        renderLabel={renderLabel}
      />
    </Slate>
  );
};
