<template>
  <el-select 
    v-model="selectedValue" 
    placeholder="请选择" 
    style="width: 150px" 
    clearable
    @change="handleChange"
  >
    <el-option
      v-for="item in data"
      :key="item.id"
      :label="item.useData"
      :value="item.id"
    />
  </el-select>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'

defineOptions({
  name: 'Myselect'
})

const props = defineProps<{
  options?: any[]        // 分类数据（type=0 时使用）
  type?: 0 | 1           // 0: 分类, 1: 状态（固定选项）
}>()

// 状态固定选项
const statusOptions = [
  { id: 1, useData: '发布' },
  { id: 2, useData: '下线' }
]

const emit = defineEmits<{
  (e: 'update:modelValue', value: any): void
  (e: 'change', data: { id: number; useData: string }): void
}>()

const selectedValue = ref<number | string>('')

// 处理数据
const data = computed(() => {
  if (props.type === 1) {
    // type=1: 直接返回固定的状态选项
    return statusOptions
  }
  
  // type=0: 从接口数据中提取分类
  if (!props.options) return []
  return props.options.map((item: any) => ({
    id: item.id,
    useData: item.categoryName || item.name || ''
  }))
})

const handleChange = (val: number | string) => {
  const selected = data.value.find(item => item.id === val)
  if (selected) {
    emit('change', selected)
    emit('update:modelValue', selected)
  }
}
</script>

<style scoped>
</style>