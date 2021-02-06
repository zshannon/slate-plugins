import * as React from "react";
import Select from "react-select";
import { classNamesFunction, styled } from "@uifabric/utilities";
import { Transforms } from "slate";
import { ReactEditor, useEditor, useFocused, useSelected } from "slate-react";
import { getHandler } from "@udecode/slate-plugins";
import {
  ScopeType,
  HBSMentionElementProps,
  HBSMentionElementStyleProps,
  HBSMentionElementStyles,
  HBSMentionNodeData,
  HBSMentionsEditor,
  HBSMentionsScope,
  ParameterType,
  isValue,
  isFunction,
  isParameter,
  isVariable,
  idForScopeType,
} from "../types";
import { getMentionElementStyles } from "./MentionElement.styles";

const getClassNames = classNamesFunction<
  HBSMentionElementStyleProps,
  HBSMentionElementStyles
>();

interface ParameterProps {
  onChange: (input: ScopeType | undefined) => void;
  parameter: ParameterType;
  scope: HBSMentionsScope;
}

const Parameter = ({ onChange, parameter, scope }: ParameterProps) => {
  const selected = useSelected();
  const focused = useFocused();
  console.log({ parameter, selected, focused });
  const matches = scope.filter(
    (x) =>
      x.type === parameter.type ||
      (isFunction(x) && x.returnType === parameter.type)
  );
  const handleOnChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    console.log({ e });
    onChange(matches.find((s) => e.target.value === idForScopeType(s)));
  };
  const { value } = parameter;

  return (
    <select onChange={handleOnChange} value={idForScopeType(value)}>
      <option value="">blank</option>
      {matches.map((option) => (
        <option value={idForScopeType(option)}>{option.name}</option>
      ))}
    </select>
  );
};

/**
 *   MentionElement with no default styles.
 * [Use the `styles` API to add your own styles.](https://github.com/OfficeDev/office-ui-fabric-react/wiki/Component-Styling)
 */
export const HBSMentionElementBase = ({
  attributes,
  children,
  element,
  prefix,
  className,
  styles,
  htmlAttributes,
  as: Tag = "span",
  onClick,
  renderLabel = (mentionable: HBSMentionNodeData) =>
    `${mentionable.scopeType.name}`,
}: HBSMentionElementProps) => {
  const selected = useSelected();
  const focused = useFocused();
  const e = useEditor();
  const editor = (e as unknown) as HBSMentionsEditor & ReactEditor;
  const path = ReactEditor.findPath(editor, element);

  // TODO: get scope for current element
  const { scope } = editor;

  const classNames = getClassNames(styles, {
    className,
    // Other style props
    selected,
    focused,
  });

  const { scopeType } = element;
  // if (isFunction(scopeType)) {
  //   // TODO: filter scope
  //   console.log({ element, scope });
  //   const handleOnChange = (index: number) => (x?: ScopeType) => {
  //     const nextElement = {
  //       ...element,
  //       scopeType: {
  //         ...scopeType,
  //         parameters: scopeType.parameters.map((p, i) => (index === i ? {
  //           ...p,
  //           value: x,
  //         } : p))
  //       },
  //     }
  //     Transforms.setNodes(editor, nextElement, {
  //       at: path,
  //     })
  //   }
  //   return (
  //     <div
  //       {...attributes}
  //       data-slate-value={element.value}
  //       className={classNames.root}
  //       contentEditable={false}
  //       onClick={getHandler(onClick, element)}
  //       {...htmlAttributes}
  //     >
  //       <pre>{scopeType.name}</pre>
  //       {/* {scopeType.parameters.map((parameter, i) => (
  //         <Parameter onChange={handleOnChange(i)} parameter={parameter} scope={scope} />
  //       ))} */}
  //       {children}
  //     </div>
  //   );
  // }

  if (isValue(scopeType)) {
    // TODO: filter scope
    console.log({ children, element, scope });
    // const handleOnChange = (x?: ScopeType) => {
    //   const nextElement = {
    //     ...element,
    //     scopeType: {
    //       ...scopeType,
    //       parameters: scopeType.parameters.map((p, i) => (index === i ? {
    //         ...p,
    //         value: x,
    //       } : p))
    //     },
    //   }
    //   Transforms.setNodes(editor, nextElement, {
    //     at: path,
    //   })
    // }
    return (
      <div
        {...attributes}
        data-slate-value={element.value}
        className={classNames.root}
        contentEditable={false}
        onClick={getHandler(onClick, element)}
        {...htmlAttributes}
      >
        <span>{scopeType.name}</span>
        {children}
      </div>
    );
  }
  if (isParameter(scopeType)) {
    // TODO: filter scope
    console.log({ children, element, scope, focused, selected });
    // const handleOnChange = (x?: ScopeType) => {
    //   const nextElement = {
    //     ...element,
    //     scopeType: {
    //       ...scopeType,
    //       parameters: scopeType.parameters.map((p, i) => (index === i ? {
    //         ...p,
    //         value: x,
    //       } : p))
    //     },
    //   }
    //   Transforms.setNodes(editor, nextElement, {
    //     at: path,
    //   })
    // }

    const { value } = scopeType;
    console.log({ value, path });
    if (!value) {
      const options = scope.filter(
        (x) =>
          x.type === scopeType.inputType ||
          (isFunction(x) && x.returnType === scopeType.inputType)
      ).map(type => ({ label: type.name, value: idForScopeType(type) }))
      return <div
        {...attributes}
        data-slate-value={element.value}
        className={classNames.root}
        contentEditable={false}
        onClick={getHandler(onClick, element)}
        {...htmlAttributes}
      >
        {focused ? 'selected' : 'not'}
        <Select options={options} />
        {children}
      </div>
      ;
    }
    const options = scope.filter(
      (x) =>
        x.type === scopeType.inputType ||
        (isFunction(x) && x.returnType === scopeType.inputType)
    ).map(type => ({ label: type.name, value: idForScopeType(type) }))
    return (
      <div
        {...attributes}
        data-slate-value={element.value}
        className={classNames.root}
        contentEditable={false}
        onClick={getHandler(onClick, element)}
        {...htmlAttributes}
      >
        <Select options={options} value={idForScopeType(scopeType)} />
        {children}
      </div>
    );
  }
  if (isFunction(scopeType)) {
    const options = scope.filter(
      (x) => true // TODO: look at parent for inputType
        // x.type === scopeType.inputType ||
        // (isFunction(x) && x.returnType === scopeType.inputType)
    ).map(type => ({ label: type.name, value: idForScopeType(type) }))
    return (
      <div
        {...attributes}
        data-slate-value={element.value}
        className={classNames.root}
        contentEditable={false}
        onClick={getHandler(onClick, element)}
        {...htmlAttributes}
      >
        {!focused && <span>{scopeType.name}</span>}
        {focused && <Select options={options} value={options.find(({ value }) => idForScopeType(scopeType) === value)} />}
        {children}
      </div>
    );
  }

  return (
    <Tag
      {...attributes}
      data-slate-value={element.value}
      className={classNames.root}
      contentEditable={false}
      onClick={getHandler(onClick, element)}
      {...htmlAttributes}
    >
      {prefix}
      {renderLabel(element)}
      {children}
    </Tag>
  );
};

/**
 * MentionElement
 */
export const HBSMentionElement = styled<
  HBSMentionElementProps,
  HBSMentionElementStyleProps,
  HBSMentionElementStyles
>(HBSMentionElementBase, getMentionElementStyles, undefined, {
  scope: "HBSMentionElement",
});
