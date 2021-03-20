import { DefineComponent, Plugin } from 'vue';
import * as Types from '@/types';
// import * as Utils from '@/utils';

declare const SignaturePad: DefineComponent<{}, {}, any> & { install: Exclude<Plugin['install'], undefined> };
export default SignaturePad;

export type ISignaturePad = Types.ISignaturePad;
export type SignaturePadComponentProps = Types.SignaturePadComponentProps;
export type SignaturePadComponentState = Types.SignaturePadComponentState;
export type SignaturePadCustomStyle = Types.SignaturePadCustomStyle;
export type SignaturePadData = Types.SignaturePadData;
export type SignaturePadOptions = Types.SignaturePadOptions;
export type SignaturePadSavedSignature = Types.SignaturePadSavedSignature;

export const enum ImageTypesEnum {
    PNG = "image/png",
    JPEG = "image/jpeg",
    SVG = "image/svg+xml",
}
