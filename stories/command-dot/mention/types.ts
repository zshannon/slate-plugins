import { IStyle } from "@uifabric/styling";
import { IStyleFunctionOrObject } from "@uifabric/utilities";
import type { Editor } from "slate";
import { RenderElementProps } from "slate-react";
import {
  Deserialize,
  ElementWithAttributes,
  HtmlAttributesProps,
  NodeToProps,
  RenderNodeOptions,
  RenderNodePropsOptions,
  RootProps,
} from "@udecode/slate-plugins";

// useMention options
export interface UseHBSMentionOptions extends HBSMentionPluginOptions {
  // Character triggering the mention select
  trigger?: string;
  // Maximum number of suggestions
  maxSuggestions?: number;
  // Function to match mentionnables for a given search
  mentionableFilter?: (
    search: string
  ) => (mentionable: HBSMentionNodeData, scope: HBSMentionsScope) => boolean;
}

// Data of Element node
export type HBSMentionNodeData = {
  scopeType: ScopeType;
};

// Element node
export interface HBSMentionNode
  extends ElementWithAttributes,
    HBSMentionNodeData {}

// renderElement options given as props
export interface HBSMentionRenderElementPropsOptions {
  /**
   * Call to provide customized styling that will layer on top of the variant rules.
   */
  styles?: IStyleFunctionOrObject<
    HBSMentionElementStyleProps,
    HBSMentionElementStyles
  >;

  /**
   * Prefix rendered before mention
   */
  prefix?: string;
  onClick?: (mentionNode: HBSMentionNode) => void;
  renderLabel?: (mentionable: HBSMentionNodeData) => string;
}

// renderElement props
export interface HBSMentionElementProps
  extends RenderElementProps,
    RenderNodePropsOptions,
    HtmlAttributesProps,
    HBSMentionRenderElementPropsOptions {
  element: HBSMentionNode;
}

export type HBSMentionKeyOption = "hbsmention";

// Plugin options
export type HBSMentionPluginOptionsValues = RenderNodeOptions &
  RootProps<HBSMentionRenderElementPropsOptions> &
  NodeToProps<HBSMentionNode, HBSMentionRenderElementPropsOptions> &
  Deserialize;
export type HBSMentionPluginOptionsKeys = keyof HBSMentionPluginOptionsValues;
export type HBSMentionPluginOptions<
  Value extends HBSMentionPluginOptionsKeys = HBSMentionPluginOptionsKeys
> = Partial<
  Record<HBSMentionKeyOption, Pick<HBSMentionPluginOptionsValues, Value>>
>;

// renderElement options
export type HBSMentionRenderElementOptionsKeys = HBSMentionPluginOptionsKeys;
export interface HBSMentionRenderElementOptions
  extends HBSMentionPluginOptions<HBSMentionRenderElementOptionsKeys> {}

// deserialize options
export interface HBSMentionDeserializeOptions
  extends HBSMentionPluginOptions<"type" | "rootProps" | "deserialize"> {}

export interface WithHBSMentionOptions
  extends HBSMentionPluginOptions<"type"> {}

export interface HBSMentionElementStyles {
  /**
   * Style for the root element.
   */
  root?: IStyle;

  // Insert MentionElement classNames below
}

export interface HBSMentionElementStyleProps {
  /**
   * Accept custom classNames
   */
  className?: string;

  // Insert MentionElement style props below
  selected?: boolean;
  focused?: boolean;
}

export interface ScopeType {
  name: string;
  type: string;
}

const constantTypes = ["DateTime", "number", "string"];

export interface ConstantType extends ScopeType {
  type: "DateTime" | "number" | "string";
}

export interface VariableType extends ScopeType {
  type: "variable";
  variableType: ConstantType["type"];
}

export type ParameterType = Omit<ConstantType | VariableType, "name"> & {
  allowUserInput?: boolean;
  value?: ScopeType;
};

export interface FunctionType extends ScopeType {
  parameters: Array<ParameterType>;
  returnType: string;
  type: "function";
}

export type HBSMentionsScope = Array<FunctionType | ConstantType>;

export interface HBSMentionsEditor extends Editor {
  scope: HBSMentionsScope;
}

export const isConstant = (input: ScopeType): input is ConstantType =>
  constantTypes.includes(input.type);

export const isFunction = (input: ScopeType): input is FunctionType =>
  input.type === "function";

export const isVariable = (input: ScopeType): input is VariableType =>
  input.type === "variable";

export const idForScopeType = (input: ScopeType | undefined) => {
  if (!input) return `undef`
  if (isConstant(input)) return `constant-${input.name}`
  if (isVariable(input)) return `variable-${input.name}-${input.variableType}`
  if (isFunction(input)) return `function-${input.name}-${input.returnType}-${input.parameters.length}`
  return JSON.stringify(input);
};
