import { DefineComponent, Plugin } from 'vue';
export * from '@/types';
export * as Utils from '@/utils';

declare const SignaturePad: DefineComponent<{}, {}, any> & { install: Exclude<Plugin['install'], undefined> };
export default SignaturePad;
