<script lang="ts">
/* eslint-disable no-unused-vars */
import {
  defineComponent,
  SetupContext,
  h,
  reactive,
  toRefs,
  computed,
  onMounted,
  ref,
  onBeforeUnmount,
  PropType,
  watch,
  Ref,
} from "vue";

import { default as OriginalSignaturePad, PointGroup } from "signature_pad";
import mergeImages from "merge-images";

import { TRANSPARENT_PNG, ImageTypesEnum, SaveOutputsEnum, convert2NonReactive, dataURLtoFile } from "@/utils";
import {
  SignaturePadComponentProps,
  SignaturePadComponentState,
  SignaturePadCustomStyle,
  SignaturePadData,
  SignaturePadOptions,
  SignaturePadSavedSignatureDataURL,
  SignaturePadSavedSignatureFile,
} from "@/types";

const DEFAULT_OPTIONS: SignaturePadOptions = {
  dotSize: (0.5 + 2.5) / 2,
  minWidth: 0.5,
  maxWidth: 2.5,
  throttle: 16,
  minDistance: 5,
  backgroundColor: "rgba(0,0,0,0)",
  penColor: "black",
  velocityFilterWeight: 0.7,
  // onBegin: (event) => {},
  // onEnd: (event) => {},
};

export default /*#__PURE__*/defineComponent({
  name: "VueSignaturePad",
  props: {
    modelValue: {
      type: [String, File] as PropType<string | File>,
      required: false,
    },
    width: {
      type: Number,
      default: 250,
      validator: function (value: number) {
        return 0 <= value && value <= 99999;
      },
    },
    height: {
      type: Number,
      default: 150,
      validator: function (value: number) {
        return 0 <= value && value <= 99999;
      },
    },
    saveType: {
      type: String as PropType<ImageTypesEnum>,
      default: ImageTypesEnum.PNG,
      validator: function (value: string) {
        const allowedValues: string[] = Object.values(ImageTypesEnum);
        if (!allowedValues.includes(value)) {
          console.warn(
            `The Image type is incorrect! Supported ones are ${allowedValues.join(
              ", "
            )}.`
          );
          return false;
        }
        return true;
      },
    },
    saveOutput: {
      type: String as PropType<SaveOutputsEnum>,
      default: SaveOutputsEnum.DATA_URL,
      validator: function (value: string) {
        const allowedValues: string[] = Object.values(SaveOutputsEnum);
        if (!allowedValues.includes(value)) {
          console.warn(
            `The save output is incorrect! Supported ones are ${allowedValues.join(
              ", "
            )}.`
          );
          return false;
        }
        return true;
      },
    },
    customStyle: {
      type: Object as PropType<SignaturePadCustomStyle>,
      default: () => {
        return {};
      },
    },
    options: {
      type: Object as PropType<SignaturePadOptions>,
      default: () => {
        return DEFAULT_OPTIONS;
      },
    },
    images: {
      type: Array as PropType<any[]>,
      default: () => {
        return [] as any[];
      },
    },
  },
  setup(props: SignaturePadComponentProps, context: SetupContext) {
    // state
    const state: SignaturePadComponentState = reactive({
      cacheImages: [],
      onResizeHandler: null,
      signaturePad: {} as any,
      signatureData: TRANSPARENT_PNG,
    });

    // ref: signaturePadCanvas
    const signaturePadCanvas: Ref<HTMLCanvasElement | null> = ref(null);

    // computed properties
    const signaturePadCanvasElement: Ref<HTMLCanvasElement> = computed(() => {
      if (!signaturePadCanvas.value) {
        throw new Error(
          'No canvas could be found with this "ref" in the template'
        );
      }
      return signaturePadCanvas.value;
    });

    const propsImagesAndCustomImages = computed(() => {
      const nonReactiveProrpImages = Array.from(
        convert2NonReactive(props.images)
      );
      const nonReactiveCachImages = Array.from(
        convert2NonReactive(state.cacheImages)
      );

      return [...nonReactiveProrpImages, ...nonReactiveCachImages];
    });

    // watch
    watch(
      () => props.options,
      (nextOptions: SignaturePadOptions) => {
        Object.keys(nextOptions).forEach((option: any) => {
          if (
            Object.prototype.hasOwnProperty.call(state.signaturePad, option)
          ) {
            (state.signaturePad as any)[option] =
              nextOptions[option as keyof SignaturePadOptions];
          }
        });
      }
    );

    // methods
    function resizeCanvas(): void {
      const canvas: HTMLCanvasElement = signaturePadCanvasElement.value;
      const data: PointGroup[] = state.signaturePad.toData();
      const ratio: number = Math.max(window.devicePixelRatio || 1, 1);

      canvas.width = canvas.offsetWidth * ratio;
      canvas.height = canvas.offsetHeight * ratio;
      const context: CanvasRenderingContext2D | null = canvas.getContext("2d")
      if (context) {
        context.scale(ratio, ratio);
      }
      
      state.signaturePad.clear();
      state.signatureData = TRANSPARENT_PNG;
      state.signaturePad.fromData(data);
    }

    function saveSignature(
      type: ImageTypesEnum = props.saveType,
      encoderOptions?: number
    ): SignaturePadSavedSignatureDataURL | SignaturePadSavedSignatureFile {
      if (state.signaturePad.isEmpty()) {
        if (props.saveOutput === SaveOutputsEnum.FILE) {
          return {
            isEmpty: true,
            file: null,
            output: SaveOutputsEnum.FILE,
          }
        } else if(props.saveOutput === SaveOutputsEnum.DATA_URL) {
          return {
            isEmpty: true,
            data: null,
            output: SaveOutputsEnum.DATA_URL,
          }
        } else {
          throw new Error(`This saveOutput ${props.saveOutput} is not supported`)
        }
      }

      const dataURL = state.signaturePad.toDataURL(type, encoderOptions);
      state.signatureData.src = dataURL;

      if (props.saveOutput === SaveOutputsEnum.FILE) {
         return {
           isEmpty: false,
           file: dataURLtoFile(dataURL, 'signature'),
           output: SaveOutputsEnum.FILE,
         }
      } else if (props.saveOutput === SaveOutputsEnum.DATA_URL) {
        return {
          isEmpty: false,
          data: dataURL,
          output: SaveOutputsEnum.DATA_URL,
        }
      } else {
        throw new Error(`This saveOutput ${props.saveOutput} is not supported`)
      }
    }

    function undoSignature(): void {
      const record = state.signaturePad.toData();

      if (record) {
        state.signaturePad.fromData(record.slice(0, -1));
      }
    }

    function completedSignature() {
      const savedSignature: SignaturePadSavedSignatureDataURL | SignaturePadSavedSignatureFile = saveSignature();
      let inputData: string | File | null = null;
      if (savedSignature.output === SaveOutputsEnum.FILE) {
        inputData = (savedSignature as SignaturePadSavedSignatureFile).file
      } else if (savedSignature.output === SaveOutputsEnum.DATA_URL) {
        inputData = (savedSignature as SignaturePadSavedSignatureDataURL).data;
      }
      context.emit("input", inputData);
    }

    function mergeImageAndSignature(customSignature: SignaturePadData): any {
      state.signatureData = customSignature;

      return mergeImages([
        ...props.images,
        ...state.cacheImages,
        state.signatureData,
      ]);
    }

    function addImages(images: any[] = []): any {
      state.cacheImages = [...state.cacheImages, ...images] as never[];

      return mergeImages([
        ...props.images,
        ...state.cacheImages,
        state.signatureData,
      ]);
    }

    function fromDataURL(
      dataURL: string,
      options: { ratio?: number; width?: number; height?: number } = {},
      callback: (error?: string | Event) => void
    ): void {
      state.signaturePad.fromDataURL(dataURL, options, callback);
    }

    function fromData(data: PointGroup[]): void {
      state.signaturePad.fromData(data);
    }

    function toDataURL(
      type: ImageTypesEnum = ImageTypesEnum.PNG,
      encoderOptions?: number
    ): string {
      return state.signaturePad.toDataURL(type, encoderOptions);
    }

    function toData(): PointGroup[] {
      return state.signaturePad.toData();
    }

    function lockSignaturePad(): void {
      state.signaturePad.off();
    }

    function openSignaturePad(): void {
      state.signaturePad.on();
    }

    function isEmpty(): boolean {
      return state.signaturePad.isEmpty();
    }

    function getPropImagesAndCacheImages(): any[] {
      return propsImagesAndCustomImages.value;
    }

    function clearCacheImages(): any[] {
      state.cacheImages = [];
      return state.cacheImages;
    }

    function clearSignature(): void {
      state.signaturePad.clear();
      context.emit("input", null);
    }

    // hooks
    onMounted(() => {
      const canvas: HTMLCanvasElement = signaturePadCanvasElement.value;
      const signaturePad = new OriginalSignaturePad(canvas, {
        onEnd: completedSignature,
        ...props.options,
      });
      state.signaturePad = signaturePad;

      state.onResizeHandler = resizeCanvas;

      window.addEventListener("resize", state.onResizeHandler, false);

      resizeCanvas();
    });

    onBeforeUnmount(() => {
      if (state.onResizeHandler) {
        window.removeEventListener("resize", state.onResizeHandler, false);
      }
    });

    return {
      // data
      ...toRefs(state),
      signaturePadCanvas,
      // computed properties
      propsImagesAndCustomImages,
      // methods
      resizeCanvas,
      saveSignature,
      undoSignature,
      mergeImageAndSignature,
      addImages,
      fromDataURL,
      toDataURL,
      fromData,
      toData,
      lockSignaturePad,
      openSignaturePad,
      isEmpty,
      getPropImagesAndCacheImages,
      clearCacheImages,
      clearSignature,
    };
  },
  render() {
    const { width, height, customStyle } = this;

    const baseStyle: { [key: string]: string } = {
      width: `${width}px`,
      height: `${height}px`,
    };

    return h(
      "div",
      {
        style: { ...baseStyle, ...customStyle },
      },
      [
        h("canvas", {
          style: {
            width: "100%",
            height: "100%",
          },
          ref: "signaturePadCanvas",
        }),
      ]
    );
  },
});
</script>
