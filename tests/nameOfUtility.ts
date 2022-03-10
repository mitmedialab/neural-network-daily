import { Interface } from "readline";

export type format = (className: string, memberName: string) => string;

export const _class: format = (className: string) => className;
export const _constructor: format = (className: string) => `${className}()`;
export const _member: format = (className: string, memberName: string) => memberName;
export const _property: format = (className: string, memberName: string) => `${className}.${memberName}`;
export const _function: format = (className: string, memberName: string) => `${_property(className, memberName)}()`;
export const _array: format = (className: string, memberName: string) => `${_property(className, memberName)}[]`;

const defaultFormats: format[] = [_class, _constructor, _member, _property, _function, _array];

const nameOf = <T extends Object>(constructor: { prototype: T }, format?: format, member?: keyof T & string): string => {
  const className = constructor.prototype.constructor.name;
  if (!format) return className;

  if (format !== _constructor && format !== _class && member === undefined) {
    throw new Error("No member was provided, so cannot format a pattern that leverages the member's name");
  }
  return format(className, member as string);
};

export default nameOf;