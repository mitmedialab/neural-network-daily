import { readable } from "svelte/store"
import EParticipantRole from "./shared/enums/EParticipantRole"

export type TColor = {
  red: number,
  green: number,
  blue: number,
  alpha?: number
}

export const lime: TColor = {
  red: 168,
  green: 222,
  blue: 0
};

const yellow: TColor = {
  red: 248,
  green: 193,
  blue: 97
}

const blue: TColor = {
  red: 85,
  green: 192,
  blue: 207
}

const magenta: TColor = {
  red: 193,
  green: 83,
  blue: 116
}

const purple: TColor = {
  red: 94,
  green: 92,
  blue: 151
}

const black: TColor = {
  red: 0,
  green: 0,
  blue: 0
}

const layerToColor: Record<EParticipantRole, TColor> = {
  [EParticipantRole.InputLayer]: yellow,
  [EParticipantRole.HiddenLayer1]: blue,
  [EParticipantRole.HiddenLayer2]: magenta,
  [EParticipantRole.OutputLayer]: purple,
  [EParticipantRole.Facilitator]: black,
}


type TColorVar = "--color"
type TColorCssTags = "background-color" | "color" | TColorVar;

export const getRgba = (role: EParticipantRole, customAlpha?: number) => {
  const { red, green, blue, alpha } = layerToColor[role];
  const toRGBA = (a: number) => `rgba(${red}, ${green}, ${blue}, ${a})`;
  const rgba = customAlpha ? toRGBA(customAlpha) : alpha ? toRGBA(alpha) : toRGBA(1);
  return rgba;
}

export const getColorCssForLayer = (role: EParticipantRole, cssTag?: TColorCssTags) => {
  const { red, green, blue, alpha } = layerToColor[role];
  const css = alpha ? `rgba(${red}, ${green}, ${blue}, ${alpha})` : `rgb(${red}, ${green}, ${blue})`
  if (cssTag) return `${cssTag}: ${css};`
  return css;
}

function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

export function rgbToHex(color: TColor) {
  const { red, green, blue } = color;
  return "#" + componentToHex(red) + componentToHex(green) + componentToHex(blue);
}