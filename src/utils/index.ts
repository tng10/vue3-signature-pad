import { SignaturePadData } from "../types";

export enum ImageTypesEnum {
  PNG = "image/png",
  JPEG = "image/jpeg",
  SVG = "image/svg+xml",
}

// eslint-disable-next-line
export const convert2NonReactive: (observerValue: any[]) => any = (
  observerValue
) => JSON.parse(JSON.stringify(observerValue));

export const TRANSPARENT_PNG: SignaturePadData = {
  x: 0,
  y: 0,
  src:
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
};
