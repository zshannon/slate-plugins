import React, { useState } from "react";
import { Node } from "slate";
import {
  options,
} from "../config/initialValues";
import { EDITABLE_VOID, FunctionType, ConstantType } from "./types";

import { Example } from "./editable-voids.stories";

export default {
  title: "CommandDot/HBS Editor",
};

const initialValue: Node[] = [
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

export const HBSEditor = () => {
  const [value, setValue] = useState(initialValue);
  const scope: Array<FunctionType | ConstantType> = [
    {
      name: "add",
      parameters: [
        { allowUserInput: true, type: "number" },
        { allowUserInput: true, type: "number" },
      ],
      type: "function",
    },
    {
      name: "formatDate",
      parameters: [{ type: "DateTime" }],
      type: "function",
    },
    {
      name: "lowercase",
      parameters: [{ type: "string" }],
      type: "function",
    },
    {
      name: "age",
      type: "number",
    },
    {
      name: "birthdate",
      type: "DateTime",
    },
    {
      name: "favoriteHoliday",
      type: "DateTime",
    },
    {
      name: "name",
      type: "string",
    },
    {
      name: "location",
      type: "string",
    },
  ];
  return (
    <>
      <Example scope={scope} setValue={setValue} value={value} />
      <pre>value: {JSON.stringify(value, null, 2)}</pre>
    </>
  );
};
