<template>
  <div style="border: 1px solid #dcdfe6; border-radius: 4px">
    <Toolbar
      :editor="editorRef"
      :defaultConfig="toolbarConfig"
      mode="default"
      style="border-bottom: 1px solid #dcdfe6"
    />
    <Editor
      v-model="valueHtml"
      :defaultConfig="editorConfig"
      mode="default"
      style="height: 300px; overflow-y: hidden"
      @onCreated="handleCreated"
      @onChange="handleChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, shallowRef, watch } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import '@wangeditor/editor/dist/css/style.css'

const props = defineProps<{
  modelValue?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const editorRef = shallowRef()
const valueHtml = ref(props.modelValue || '')

// ✅ 正确的工具栏配置
const toolbarConfig = {
  toolbarKeys: [
    'bold',        // 加粗
    'italic',      // 斜体
    'underline',   // 下划线
    'through',     // 删除线
    '|',
    'header1', 'header2', 'header3',
    '|',
    'color', 'bgColor',
    '|',
    'fontSize', 'fontFamily',
    '|',
    'justifyLeft', 'justifyCenter', 'justifyRight',
    '|',
    'numberedList',   // ✅ 有序列表（不是 insertOrderedList）
    'bulletedList',   // ✅ 无序列表（不是 insertUnorderedList）
    '|',
    'emotion', 'uploadImage', 'insertLink', 'code'
  ]
}

const editorConfig = {
  placeholder: '请输入文章内容...'
}

const handleCreated = (editor: any) => {
  editorRef.value = editor
}

const handleChange = () => {
  emit('update:modelValue', valueHtml.value)
}

watch(() => props.modelValue, (newVal) => {
  if (newVal !== valueHtml.value) {
    valueHtml.value = newVal || ''
  }
})
</script>