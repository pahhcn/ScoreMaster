
<template>
  <div style="max-width: 80%; margin: 40px auto;">
    <el-card shadow="always" class="my-full-card">
      <template #header>
        <span>修改学生成绩</span>
      </template>
      <el-form :model="form" label-width="auto" @submit.prevent="handleSubmit">
        <el-form-item label="学号" required>
          <el-input v-model="form.xh" placeholder="请输入学号" />
        </el-form-item>
        <el-form-item label="科目" required>
          <el-select v-model="form.subject" placeholder="请选择科目">
            <el-option
              v-for="col in subjectColumns"
              :key="col.dataIndex"
              :label="col.title"
              :value="col.dataIndex"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="分数" required>
          <el-input-number v-model="form.score" :min="0" :max="100" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="loading" @click="handleSubmit">
            修改成绩
          </el-button>
          <el-button style="margin-left: 16px" @click="goBack">返回</el-button>
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

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()
const form = ref({ xh: '', subject: '', score: null })
const loading = ref(false)
const successMsg = ref('')
const errorMsg = ref('')


const subjectColumns = [
  { title: 'e1', dataIndex: 'e1' },
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

async function handleSubmit() {
  if (!form.value.xh || !form.value.subject || form.value.score === null) {
    errorMsg.value = '请填写所有字段'
    return
  }
  loading.value = true
  errorMsg.value = ''
  successMsg.value = ''
  try {
    const res = await fetch(`http://localhost:3000/api/scores/${form.value.xh}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ [form.value.subject]: form.value.score }),
    }).then((r) => r.json())
    if (res.success) {
      successMsg.value = '修改成功'
      ElMessage.success('修改成功')
    } else {
      errorMsg.value = '修改失败'
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

<style scoped>
.my-full-card {
  width: 100%;
  box-sizing: border-box;
}
</style>