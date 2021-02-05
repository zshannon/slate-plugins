import * as React from "react";
import { useEffect, useRef } from "react";
import { classNamesFunction, styled } from "@uifabric/utilities";
import { ReactEditor, useSlate } from "slate-react";
import { getPreventDefaultHandler } from "@udecode/slate-plugins";
import { PortalBody } from "@udecode/slate-plugins";
import { HBSMentionNodeData, HBSMentionsEditor } from "../types";
import { getMentionSelectStyles } from "./MentionSelect.styles";
import {
  HBSMentionSelectProps,
  HBSMentionSelectStyleProps,
  HBSMentionSelectStyles,
} from "./MentionSelect.types";

const getClassNames = classNamesFunction<
  HBSMentionSelectStyleProps,
  HBSMentionSelectStyles
>();

export const HBSMentionSelectBase = ({
  className,
  styles,
  at,
  options,
  valueIndex,
  onClickMention,
  renderLabel = (
    mentionable: HBSMentionNodeData
  ) => mentionable.scopeType.name,
  ...props
}: HBSMentionSelectProps) => {
  const classNames = getClassNames(styles, {
    className,
  });

  const ref: any = useRef();
  const editor = useSlate();

  useEffect(() => {
    if (at && options.length > 0) {
      const el = ref.current;
      const domRange = ReactEditor.toDOMRange(editor, at);
      const rect = domRange.getBoundingClientRect();
      if (el) {
        el.style.top = `${rect.top + window.pageYOffset + 24}px`;
        el.style.left = `${rect.left + window.pageXOffset}px`;
      }
    }
  }, [options.length, editor, at]);

  if (!at || !options.length) {
    return null;
  }

  return (
    <PortalBody>
      <div ref={ref} className={classNames.root} {...props}>
        {options.map((option, i) => (
          <div
            key={`${i}${option.scopeType.name}${option.scopeType.type}`}
            className={
              i === valueIndex
                ? classNames.mentionItemSelected
                : classNames.mentionItem
            }
            onMouseDown={getPreventDefaultHandler(
              onClickMention,
              editor,
              option
            )}
          >
            {renderLabel(option)}
          </div>
        ))}
      </div>
    </PortalBody>
  );
};

export const HBSMentionSelect = styled<
  HBSMentionSelectProps,
  HBSMentionSelectStyleProps,
  HBSMentionSelectStyles
>(HBSMentionSelectBase, getMentionSelectStyles, undefined, {
  scope: "HBSMentionSelect",
});
