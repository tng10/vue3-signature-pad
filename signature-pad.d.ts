import { DefineComponent, Plugin } from 'vue';

declare const SignaturePad: DefineComponent<{}, {}, any> & { install: Exclude<Plugin['install'], undefined> };
export default SignaturePad;
