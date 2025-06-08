

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'

const route = useRoute()
const router = useRouter()
const isEdit = computed(() => !!route.params.xh)
const loading = ref(false)
const successMsg = ref('')
const errorMsg = ref('')


const subjectColumns = [
  { title: 'e1', dataIndex: 'e1'},
  { title: 'e2', dataIndex: 'e2' },
  { title: 'e3', dataIndex: 'e3' },
  { title: '高等数学1-1 [4]', dataIndex: 'math1_1' },
  { title: '高等数学1-2 [5]', dataIndex: 'math1_2' },
  { title: '线性代数 [3]', dataIndex: 'linear_algebra' },
  { title: '大学物理4-1 [3]', dataIndex: 'physics4_1' },
  { title: '信息技术导论 [2]', dataIndex: 'info_tech_intro' },
  { title: '高级语言程序设计 [3]', dataIndex: 'prog_lang' },
  { title: '高级语言程序设计实验 [1]', dataIndex: 'prog_lang_lab' },
  { title: '面向对象程序设计 [3]', dataIndex: 'oop' },
  { title: '计算机组成原理 [3]', dataIndex: 'computer_org' },
  { title: '离散数学 [4]', dataIndex: 'discrete_math' },
  { title: '汇编语言程序设计 [2]', dataIndex: 'asm_prog' },
  { title: '汇编语言程序设计实验 [1]', dataIndex: 'asm_prog_lab' },
  { title: '程序设计训练 [1]', dataIndex: 'coding_training' },
  { title: '计算机组成原理课程设计 [1]', dataIndex: 'computer_org_proj' },
  { title: '数字系统与逻辑设计 [3]', dataIndex: 'logic_design' },
  { title: '数字系统与逻辑设计实验 [1]', dataIndex: 'logic_design_lab' },
  { title: 'JAVA语言程序设计 [3]', dataIndex: 'java_prog' },
  { title: '计算机专业认知 [.5]', dataIndex: 'major_intro' },
  { title: '思想道德修养与法律基础 [3]', dataIndex: 'morals_law' },
  { title: '中国近现代史纲要 [2]', dataIndex: 'modern_history' },
  { title: '马克思主义基本原理概论 [3]', dataIndex: 'marxism_intro' },
  { title: '毛泽东思想和中国特色社会主义理论体系概论（1） [3]', dataIndex: 'mao_thought_1' },
  { title: '贵州省情 [1]', dataIndex: 'guizhou_profile' },
  { title: '体育1 [1]', dataIndex: 'pe1' },
  { title: '大学生职业生涯规划 [.5]', dataIndex: 'career_planning' },
  { title: '军事理论及军事训练 [2]', dataIndex: 'military_theory' },
  { title: '大学生心理健康 [1]', dataIndex: 'mental_health' },
]

const form = ref({
  xh: '',
  name: '',
  math1_1: null,
  math1_2: null,
  linear_algebra: null,
  physics4_1: null,
  prog_lang: null,
  oop: null,
})

onMounted(() => {
  if (isEdit.value) {
    fetchScore()
  }
})

async function fetchScore() {
  loading.value = true
  try {
    const res = await fetch(`http://localhost:3000/api/scores/${route.params.xh}`)
    const data = await res.json()
    if (data && data.length) {
      Object.assign(form.value, data[0])
    } else {
      errorMsg.value = '未找到该学生成绩'
    }
  } catch (e) {
    errorMsg.value = '查询失败'
  }
  loading.value = false
}

async function handleSubmit(e) {
  if (e && e.preventDefault) e.preventDefault()
  loading.value = true
  errorMsg.value = ''
  successMsg.value = ''
  try {
    let url, method
    if (isEdit.value) {
      url = `http://localhost:3000/api/scores/${form.value.xh}`
      method = 'PUT'
    } else {
      url = `http://localhost:3000/api/scores`
      method = 'POST'
    }
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form.value),
    }).then((r) => r.json())
    if (res.success) {
      successMsg.value = isEdit.value ? '修改成功' : '添加成功'
      ElMessage.success(successMsg.value)
    } else {
      errorMsg.value = '操作失败'
    }
  } catch (e) {
    errorMsg.value = '服务器异常'
  }
  loading.value = false
}

async function handleDelete() {
  try {
    await ElMessageBox.confirm('确定要删除该同学的所有成绩吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
  } catch {
    return
  }
  loading.value = true
  errorMsg.value = ''
  successMsg.value = ''
  try {
    const res = await fetch(`http://localhost:3000/api/scores/${form.value.xh}`, {
      method: 'DELETE',
    }).then((r) => r.json())
    if (res.success) {
      successMsg.value = '删除成功'
      ElMessage.success('删除成功')
      setTimeout(() => router.push('/score-query'), 1000)
    } else {
      errorMsg.value = '删除失败'
    }
  } catch (e) {
    errorMsg.value = '服务器异常'
  }
  loading.value = false
}

function goBack() {
  router.push('/score-query')
}
</script>
<template>
  <div style="max-width:80%;margin:40px auto;">
    <el-card shadow="always" class="my-full-card">
      <template #header>
        <span v-if="isEdit">编辑成绩（学号：{{ form.xh }}）</span>
        <span v-else>添加成绩</span>
      </template>
      <el-form :model="form" label-width="auto" @submit.prevent="handleSubmit">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="学号" required>
              <el-input v-model="form.xh" :disabled="isEdit" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="姓名" required>
              <el-input v-model="form.name" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col v-for="col in subjectColumns" :key="col.dataIndex" :span="12">
            <el-form-item
              :label="col.title"
            >
              <el-input-number
                v-model="form[col.dataIndex]"
                :min="0"
                :max="100"
                style="width: 100%"
                controls-position="right"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item>
          <el-button type="primary" :loading="loading" @click="handleSubmit">
            {{ isEdit ? '保存修改' : '添加成绩' }}
          </el-button>
          <el-button
            v-if="isEdit"
            type="danger"
            style="margin-left: 16px"
            :loading="loading"
            @click="handleDelete"
          >
            删除该同学成绩
          </el-button>
          <el-button style="margin-left: 16px" @click="goBack">返回查询页</el-button>
        </el-form-item>
        <el-alert
          v-if="successMsg"
          type="success"
          :closable="false"
          show-icon
          style="margin-top: 16px"
        >
          {{ successMsg }}
        </el-alert>
        <el-alert
          v-if="errorMsg"
          type="error"
          :closable="false"
          show-icon
          style="margin-top: 16px"
        >
          {{ errorMsg }}
        </el-alert>
      </el-form>
    </el-card>
  </div>
</template>
<style scoped>

::v-deep(.el-form-item__label) {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  width: 100%;
}
.my-full-card {
  width: 100%;
  box-sizing: border-box;
}


</style>