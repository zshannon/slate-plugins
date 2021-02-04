export const EDITABLE_VOID = "editable-void";

export interface ScopeType {
  name: string;
  type: string;
}

export interface ConstantType extends ScopeType {
  type: "DateTime" | "number" | "string";
}

export interface VariableType extends ScopeType {
  type: "variable";
  variableType: ConstantType["type"];
}

export interface FunctionType extends ScopeType {
  parameters: Array<
    Omit<ConstantType | VariableType, "name"> & {
      allowUserInput?: boolean;
      value?: string;
    }
  >;
  type: "function";
}
