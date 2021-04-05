import { DefineComponent, Plugin } from 'vue';
export * from './src/types';
export * from './src/utils';

export declare const SignaturePad: DefineComponent<{}, {}, any> & { install: Exclude<Plugin['install'], undefined> };
