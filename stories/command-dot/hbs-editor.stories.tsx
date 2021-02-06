import React, { useState } from "react";
import { Node } from "slate";
import { options } from "../config/initialValues";
import type { HBSMentionsScope } from "./mention";
import { EDITABLE_VOID } from "./types";

import { Example } from "./editable-voids.stories";

export default {
  title: "CommandDot/HBS Editor",
};

const initialValue: Node[] = [
  {
    children: [
      {
        type: "p",
        children: [
          {
            text: "",
          },
          {
            type: "hbs-mention",
            children: [
              {
                text: "",
              },
            ],
            scopeType: {
              name: "age",
              type: "number",
            },
          },
          {
            text: "",
          },
        ],
      },
    ],
  },
];

const scope: HBSMentionsScope = [
  {
    name: "add",
    parameters: [
      { name: "left", inputType: "number", type: "parameter" },
      { name: "right", inputType: "number", type: "parameter" },
    ],
    returnType: "number",
    type: "function",
  },
  {
    name: "formatDate",
    parameters: [{ name: "input", inputType: "DateTime", type: "parameter" }],
    returnType: "string",
    type: "function",
  },
  {
    name: "lowercase",
    parameters: [{ name: "input", inputType: "string", type: "parameter" }],
    returnType: "string",
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

export const HBSEditor = () => {
  const [value, setValue] = useState(initialValue);
  return (
    <>
      <Example scope={scope} setValue={setValue} value={value} />
      <pre>value: {JSON.stringify(value, null, 2)}</pre>
    </>
  );
};
