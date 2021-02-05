import React, { useState } from "react";
import { RenderElementProps } from "slate-react";
import { Example } from "../components/editable-plugins.stories";

export const EditableVoidElement = ({
  attributes,
  children,
  ...props
}: RenderElementProps) => {
  const [inputValue, setInputValue] = useState("");
  console.log(props);
  let element = props.element;
  //Two types of editableVoid
  return (
    // Need contentEditable=false or Firefox has issues with certain input types.
    <div {...attributes} contentEditable={false}>
      <div>
        {element.name ? (
          <>
            {element.name}
            <input
              style={{ margin: "8px 0" }}
              type="text"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
              }}
            />
          </>
        ) : null}
      </div>
      {children}
    </div>
  );
};
