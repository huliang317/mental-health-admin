<template>
  <div>
    <el-button class="add" plain @click="openDialog('add')">添加文章</el-button>
  </div>

  <el-dialog
    v-model="dialogVisible"
    :title="dialogTitle"
    width="800px"
    align-center
    destroy-on-close
  >
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      :rules="rules"
      label-width="100px"
    >
      <el-form-item label="文章标题" prop="title">
        <el-input v-model="ruleForm.title" placeholder="请输入标题" />
      </el-form-item>

      <el-form-item label="所属分类" prop="categoryId">
        <el-select v-model="ruleForm.categoryId" placeholder="请选择分类" style="width: 100%">
          <el-option label="心理健康基础" :value="1" />
          <el-option label="情绪管理" :value="2" />
          <el-option label="压力缓解" :value="3" />
          <el-option label="人际关系" :value="4" />
        </el-select>
      </el-form-item>

      <el-form-item label="标签" prop="tags">
        <el-input v-model="ruleForm.tags" placeholder="请输入标签，多个用逗号分隔" />
      </el-form-item>

      <el-form-item label="文章摘要" prop="summary">
        <el-input v-model="ruleForm.summary" placeholder="请输入摘要" />
      </el-form-item>

      <!-- 封面图片 + 删除按钮 -->
      <el-form-item label="封面图片" prop="coverImage">
        <div class="upload-wrapper">
          <el-upload
            class="avatar-uploader"
            :auto-upload="false"
            :show-file-list="false"
            :on-change="handleFileChange"
            accept="image/*"
          >
            <img v-if="ruleForm.coverImage" :src="ruleForm.coverImage" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
          </el-upload>
          <el-button
            v-if="ruleForm.coverImage"
            type="danger"
            size="small"
            circle
            class="delete-image-btn"
            @click="removeImage"
          >
            <el-icon><Delete /></el-icon>
          </el-button>
        </div>
      </el-form-item>

      <!-- 文章内容 -->
      <el-form-item label="文章内容" prop="content">
        <div class="rich-text-wrapper">
          <RichText v-model="ruleForm.content" />
        </div>
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="submitForm">
          {{ dialogTitle }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { reactive, ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus, Delete } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import type { UploadFile } from 'element-plus'
import RichText from '../page/RichText.vue'
import { useAuthStore } from '@/stores/auth'
import axios from 'axios'

defineOptions({
  name: 'Add'
})

// 表单数据类型
interface RuleForm {
  id?: string
  title: string
  categoryId: number | string
  tags: string
  coverImage: string
  content: string
  summary: string
}

const emit = defineEmits<{
  (e: 'success'): void
}>()

const ruleFormRef = ref<FormInstance>()
const dialogVisible = ref(false)
const submitting = ref(false)
const mode = ref<'add' | 'edit'>('add')
const { token } = useAuthStore()

// 当前编辑的文章 ID
const currentId = ref('')

const ruleForm = reactive<RuleForm>({
  title: '',
  categoryId: '',
  tags: '',
  coverImage: '',
  summary: '',
  content: ''
})

// 弹窗标题
const dialogTitle = computed(() => mode.value === 'add' ? '新增文章' : '编辑文章')

// 验证规则
const rules: FormRules<RuleForm> = {
  title: [
    { required: true, message: '请输入文章标题', trigger: 'blur' },
    { min: 2, max: 50, message: '标题长度在2-50个字符', trigger: 'blur' }
  ],
  categoryId: [
    { required: true, message: '请选择分类', trigger: 'change' }
  ],
  tags: [
    { required: true, message: '请输入标签', trigger: 'blur' }
  ],
  coverImage: [
    { required: false, message: '请上传封面图片', trigger: 'change' }
  ],
  content: [
    { required: true, message: '请输入文章内容', trigger: 'blur' }
  ],
  summary: [
    { required: true, message: '请输入文章摘要', trigger: 'blur' }
  ]
}

// 打开弹窗
const openDialog = (type: 'add' | 'edit', row?: any) => {
  mode.value = type
  
  if (type === 'edit' && row) {
    currentId.value = row.id
    ruleForm.title = row.title || ''
    ruleForm.categoryId = row.categoryId || ''
    ruleForm.tags = row.tags || ''
    ruleForm.summary = row.summary || ''
    ruleForm.content = row.content || ''
    ruleForm.coverImage = row.coverImage || ''
  } else {
    resetForm()
  }
  
  dialogVisible.value = true
}

// 重置表单
const resetForm = () => {
  currentId.value = ''
  ruleForm.title = ''
  ruleForm.categoryId = ''
  ruleForm.tags = ''
  ruleForm.summary = ''
  ruleForm.content = ''
  ruleForm.coverImage = ''
  ruleFormRef.value?.clearValidate()
}

// 本地选择图片
const handleFileChange = (file: UploadFile) => {
  const reader = new FileReader()
  reader.onload = (e) => {
    ruleForm.coverImage = e.target?.result as string
  }
  reader.readAsDataURL(file.raw as File)
}

// 删除图片
const removeImage = () => {
  ruleForm.coverImage = ''
}

// 提交表单
const submitForm = async () => {
  if (!ruleFormRef.value) return
  if (submitting.value) return

  try {
    const valid = await ruleFormRef.value.validate()
    if (!valid) {
      ElMessage.error('请完善表单信息')
      return
    }

    submitting.value = true

    const requestData = {
      title: ruleForm.title,
      content: ruleForm.content,
      coverImage: '',
      categoryId: Number(ruleForm.categoryId),
      summary: ruleForm.summary,
      tags: ruleForm.tags,
      id: mode.value === 'edit' ? currentId.value : ''
    }

    let response
    if (mode.value === 'edit') {
      response = await axios.put(`/api/knowledge/article/${currentId.value}`, requestData, {
        headers: { token, 'Content-Type': 'application/json' }
      })
    } else {
      response = await axios.post('/api/knowledge/article', requestData, {
        headers: { token, 'Content-Type': 'application/json' }
      })
    }

    if (response.data.code === '200' || response.data.success === true) {
      ElMessage.success(mode.value === 'edit' ? '文章更新成功！' : '新增文章成功！')
      dialogVisible.value = false
      resetForm()
      emit('success')
    } else {
      ElMessage.error(response.data.msg || response.data.message || '操作失败')
    }
  } catch (error) {
    console.error('请求失败：', error)
    ElMessage.error('请求失败，请检查网络')
  } finally {
    submitting.value = false
  }
}

// 暴露方法给父组件
defineExpose({
  openDialog
})
</script>

<style scoped>
.add {
  color: white;
  border-radius: 5px;
  background-color: #409eff;
  width: 100px;
  height: 35px;
  margin-right: 50px;
}
.add:hover {
  background-color: #79bbff;
}

.upload-wrapper {
  position: relative;
  display: inline-block;
}

.avatar-uploader :deep(.el-upload) {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader :deep(.el-upload:hover) {
  border-color: var(--el-color-primary);
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar {
  width: 120px;
  height: 120px;
  display: block;
  object-fit: cover;
}

.delete-image-btn {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 24px;
  height: 24px;
  padding: 0;
}

.rich-text-wrapper {
  width: 100%;
  max-width: 650px;
}

.rich-text-wrapper :deep(.w-e-text-container) {
  min-height: 300px !important;
}

.rich-text-wrapper :deep(.w-e-toolbar) {
  flex-wrap: wrap;
}

:deep(.el-dialog__body) {
  max-height: 70vh;
  overflow-y: auto;
}
</style>