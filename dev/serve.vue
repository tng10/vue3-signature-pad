<script lang="ts">
import { defineComponent, reactive, ref, Ref, toRefs } from 'vue';
import { ImageTypesEnum, SaveOutputsEnum } from '@/utils';
import { ISignaturePad, SignaturePadSavedSignatureDataURL, SignaturePadSavedSignatureFile } from '@/types';
import SignaturePad from '@/signature-pad.vue';

export default defineComponent({
  name: 'ServeDev',
  components: {
    SignaturePad
  },
  setup() {
    // state
    const state = reactive({
      customStyle: { border: "black 3px solid" },
      saveType: ImageTypesEnum.SVG,
      saveOutput: SaveOutputsEnum.FILE,
    });

    const signatureDataURL: Ref<string | null> = ref(null);
    const signatureFile: Ref<File | null> = ref(null);
    const signaturePad: Ref<ISignaturePad | null> = ref(null);

    // methods
    function getSignaturePad(): ISignaturePad {
      if (!signaturePad.value) {
        throw new Error("No signature pad ref could be found");
      }
      return signaturePad.value;
    }

    function clearSignature(): void {
      getSignaturePad().clearSignature();
    }

    function saveSignature(): SignaturePadSavedSignatureDataURL | SignaturePadSavedSignatureFile {
      const signature: SignaturePadSavedSignatureDataURL | SignaturePadSavedSignatureFile = getSignaturePad().saveSignature();
      return signature;
    }

    function onInput(value: string | File | null) {
      console.log('calling on input', value)
      if (!value) {
        signatureDataURL.value = null;
        signatureFile.value = null;
      } else if (value instanceof File) {
        signatureDataURL.value = null;
        signatureFile.value = value
      } else {
        signatureDataURL.value = value
        signatureFile.value = null;
      }
    }

    return {
      // state
      ...toRefs(state),
      signaturePad,
      signatureDataURL,
      signatureFile,
      // methods
      clearSignature,
      saveSignature,
      onInput,
    };
  },
});
</script>

<template>
  <div id="app">
    <signature-pad
      :modelValue="signatureFile"
      @input="onInput"
      :width="500"
      :height="300"
      :customStyle="customStyle"
      :saveType="saveType"
      :saveOutput="saveOutput"
      ref="signaturePad"
    >
    </signature-pad>

    <button @click="saveSignature">Save signature</button>

  </div>
</template>
