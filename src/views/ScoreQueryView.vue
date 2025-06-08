<script setup>
import { ref } from 'vue'
import { Message } from '@arco-design/web-vue'

const search = ref({
  name: '',
  xh: '',
  subject: '',
  min: null,
  max: null
})
const scores = ref([])
const columns = ref([
  { title: '学号', dataIndex: 'xh', width: 200, fixed: 'left' },
  { title: '姓名', dataIndex: 'name', width: 100 },
  { title: 'e1', dataIndex: 'e1', width: 80 },
  { title: 'e2', dataIndex: 'e2', width: 80 },
  { title: 'e3', dataIndex: 'e3', width: 80 },
  { title: '高等数学1-1 [4]', dataIndex: 'math1_1', width: 140 },
  { title: '高等数学1-2 [5]', dataIndex: 'math1_2', width: 140 },
  { title: '线性代数 [3]', dataIndex: 'linear_algebra', width: 140 },
  { title: '大学物理4-1 [3]', dataIndex: 'physics4_1', width: 200 },
  { title: '信息技术导论 [2]', dataIndex: 'info_tech_intro', width: 200 },
  { title: '高级语言程序设计 [3]', dataIndex: 'prog_lang', width: 200 },
  { title: '高级语言程序设计实验 [1]', dataIndex: 'prog_lang_lab', width: 200 },
  { title: '面向对象程序设计 [3]', dataIndex: 'oop', width: 200 },
  { title: '计算机组成原理 [3]', dataIndex: 'computer_org', width: 200 },
  { title: '离散数学 [4]', dataIndex: 'discrete_math', width: 200 },
  { title: '汇编语言程序设计 [2]', dataIndex: 'asm_prog', width: 200 },
  { title: '汇编语言程序设计实验 [1]', dataIndex: 'asm_prog_lab', width: 200 },
  { title: '程序设计训练 [1]', dataIndex: 'coding_training', width: 200 },
  { title: '计算机组成原理课程设计 [1]', dataIndex: 'computer_org_proj', width: 220 },
  { title: '数字系统与逻辑设计 [3]', dataIndex: 'logic_design', width: 200 },
  { title: '数字系统与逻辑设计实验 [1]', dataIndex: 'logic_design_lab', width: 220 },
  { title: 'JAVA语言程序设计 [3]', dataIndex: 'java_prog', width: 200 },
  { title: '计算机专业认知 [.5]', dataIndex: 'major_intro', width: 200 },
  { title: '思想道德修养与法律基础 [3]', dataIndex: 'morals_law', width: 220 },
  { title: '中国近现代史纲要 [2]', dataIndex: 'modern_history', width: 220 },
  { title: '马克思主义基本原理概论 [3]', dataIndex: 'marxism_intro', width: 220 },
  { title: '毛泽东思想和中国特色社会主义理论体系概论（1） [3]', dataIndex: 'mao_thought_1', width: 380 },
  { title: '贵州省情 [1]', dataIndex: 'guizhou_profile', width: 200 },
  { title: '体育1 [1]', dataIndex: 'pe1', width: 120 },
  { title: '大学生职业生涯规划 [.5]', dataIndex: 'career_planning', width: 200 },
  { title: '军事理论及军事训练 [2]', dataIndex: 'military_theory', width: 200 },
  { title: '大学生心理健康 [1]', dataIndex: 'mental_health', width: 200 },
  { title: '总分', dataIndex: 'total', width: 100 },
  { title: '平均分', dataIndex: 'avg', width: 100 }
])


async function fetchScores() {
  let url = 'http://localhost:3000/api/scores?'
  const params = []
  if (search.value.name) params.push(`name=${encodeURIComponent(search.value.name)}`)
  if (search.value.subject) params.push(`subject=${encodeURIComponent(search.value.subject)}`)
  if (search.value.min !== null && search.value.min !== undefined && search.value.min !== '') params.push(`min=${search.value.min}`)
  if (search.value.max !== null && search.value.max !== undefined && search.value.max !== '') params.push(`max=${search.value.max}`)
  if (params.length) url += params.join('&')
  else url = 'http://localhost:3000/api/scores'

  if (search.value.xh) {
    url = `http://localhost:3000/api/scores/${search.value.xh}`
    try {
      const res = await fetch(url)
      console.log('响应状态:', res.status)
      const text = await res.text()
      console.log('响应内容:', text)
      if (res.ok) {
        const data = JSON.parse(text)
        if (Array.isArray(data) && data.length === 0) {
          Message.error('未找到该学生')
          scores.value = []
        } else {
          scores.value = data
        }
      } else {
        Message.error('查询失败')
        scores.value = []
      }
    } catch (e) {
      Message.error('服务器异常')
      scores.value = []
    }
    return
  }

  // 普通查询
  try {
    const res = await fetch(url)
    if (res.ok) {
      scores.value = await res.json()
    } else {
      Message.error('查询失败')
      scores.value = []
    }
  } catch (e) {
    Message.error('服务器异常')
    scores.value = []
  }
}
</script>


<template>
  <div style="padding:24px;">
    <el-form :model="search" :inline="true" @submit.prevent="fetchScores">
      <el-form-item label="姓名">
        <el-input v-model="search.name" placeholder="支持模糊查询" />
      </el-form-item>
      <el-form-item label="学号">
        <el-input v-model="search.xh" placeholder="精确学号" />
      </el-form-item>
      <el-form-item label="科目">
        <el-input v-model="search.subject" placeholder="如 高等数学1-1" />
      </el-form-item>
      <el-form-item label="分数≥">
        <el-input-number v-model="search.min" />
      </el-form-item>
      <el-form-item label="分数≤">
        <el-input-number v-model="search.max" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="fetchScores">查询</el-button>
      </el-form-item>
    </el-form>
    <a-table :columns="columns" :data="scores" row-key="学号" style="margin-top:24px;" :scroll="{x:2200}">
      <template #bodyCell="{ column, record }">
        <span v-if="typeof record[column.dataIndex] === 'number'">{{ record[column.dataIndex] }}</span>
        <span v-else>{{ record[column.dataIndex] }}</span>
      </template>
    </a-table>
  </div>
</template>