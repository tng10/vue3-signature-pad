<script lang="ts">
import { defineComponent, reactive, ref, Ref, toRefs } from 'vue';
import { ImageTypesEnum } from '@/utils';
import { ISignaturePad, SignaturePadSavedSignature } from '@/types';
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
    });

    const signatureDataURL: Ref<string | null> = ref(null);
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

    function saveSignature(): SignaturePadSavedSignature {
      const signature: SignaturePadSavedSignature = getSignaturePad().saveSignature();
      return signature;
    }

    function onInput(dataURL: string | null) {
      signatureDataURL.value = dataURL;
    }

    return {
      // state
      ...toRefs(state),
      signaturePad,
      signatureDataURL,
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
      :value="signatureDataURL"
      @input="onInput"
      :width="500"
      :height="300"
      :customStyle="customStyle"
      :saveType="saveType"
      ref="signaturePad"
    >
    </signature-pad>
  </div>
</template>
