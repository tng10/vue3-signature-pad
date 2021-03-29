import { SignaturePadData } from "../types";

export enum ImageTypesEnum {
  PNG = "image/png",
  JPEG = "image/jpeg",
  SVG = "image/svg+xml",
}

export enum SaveOutputsEnum {
  FILE = "file",
  DATA_URL = "data_url",
}

export function binaryStringToFile(bstr: string, filename: string, mimeType: string, lastModified: number = Date.now()) {
  let n = bstr.length;
  let u8arr = new Uint8Array(n);
  while(n--){
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, {type: mimeType, lastModified: lastModified});
}

export function dataURLtoFile(dataUrl: string, filename: string, lastModified: number = Date.now()) {
  const arr: string[] = dataUrl.split(',');
  const leftSideArr: string = arr[0]
  const parts: RegExpMatchArray | null = leftSideArr.match(/:(.*?);/);
  if (!parts) {
    throw new Error('Invalid data url')
  }
  const mimeType: string = parts[1];
  const bstr = atob(arr[1]);
  return binaryStringToFile(bstr, filename, mimeType, lastModified)
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
