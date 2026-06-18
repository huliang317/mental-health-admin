/// <reference types="vite/client" />
declare module '@wangeditor/editor-for-vue' {
  import type { DefineComponent } from 'vue'
  const Editor: DefineComponent<{
    modelValue?: string
    defaultConfig?: any
    mode?: string
  }>
  const Toolbar: DefineComponent<{
    editor?: any
    defaultConfig?: any
    mode?: string
  }>
  export { Editor, Toolbar }
}