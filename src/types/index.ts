import { ImageTypesEnum, SaveOutputsEnum } from "@/utils";
import {
  default as OriginalSignaturePad,
  Options,
  PointGroup,
} from "signature_pad";

export interface SignaturePadOptions extends Options {}

export interface SignaturePadCustomStyle {
  [key: string]: string;
}

export interface SignaturePadComponentProps {
  width: number;
  height: number;
  saveType: ImageTypesEnum;
  saveOutput: SaveOutputsEnum;
  customStyle: SignaturePadCustomStyle;
  options: SignaturePadOptions;
  images: any[];
}

export interface SignaturePadData {
  x: number;
  y: number;
  src: string;
}

export interface SignaturePadComponentState {
  cacheImages: any[];
  onResizeHandler: null | (() => void);
  signaturePad: OriginalSignaturePad;
  signatureData: SignaturePadData;
}

export interface SignaturePadSavedSignatureDataURL {
  isEmpty: boolean;
  data: string | null;
  output: string;
}

export interface SignaturePadSavedSignatureFile {
  isEmpty: boolean;
  file: File | null;
  output: string;
}

export interface ISignaturePad {
  saveSignature(
    type?: ImageTypesEnum,
    encoderOptions?: number
  ): SignaturePadSavedSignatureDataURL | SignaturePadSavedSignatureFile;
  undoSignature(): void;
  mergeImageAndSignature(customSignature: SignaturePadData): any;
  addImages(images: any[]): any;
  fromDataURL(
    dataURL: string,
    options: { ratio?: number; width?: number; height?: number },
    callback: (error?: string | Event) => void
  ): void;
  fromData(data: PointGroup[]): void;
  toDataURL(type: ImageTypesEnum, encoderOptions?: number): string;
  toData(): PointGroup[];
  lockSignaturePad(): void;
  openSignaturePad(): void;
  lockSignaturePad(): void;
  openSignaturePad(): void;
  isEmpty(): boolean;
  getPropImagesAndCacheImages(): any[];
  clearCacheImages(): any[];
  clearSignature(): void;
}
