<script setup>
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'

const scores = ref([])
const sortOptions = ref({
  field: 'total',
  order: 'desc',
})

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



const dynamicColumns = computed(() => {
  const cols = [...subjectColumns]
  const field = sortOptions.value.field

  if (field === 'total' || field === 'avg') {
    return [{ title: field === 'total' ? '总分' : '平均分', dataIndex: field }, ...cols]
  }

  const idx = cols.findIndex(col => col.dataIndex === field)
  if (idx !== -1) {
    const [target] = cols.splice(idx, 1)
    cols.unshift(target)
  }
  return cols
})

async function fetchSortedScores() {
  const { field, order } = sortOptions.value
  if (!field) {
    ElMessage.error('请选择排序字段')
    return
  }
  try {
    const res = await fetch(`http://localhost:3000/api/scores?sort=${field}&order=${order}`)
    if (res.ok) {
      scores.value = await res.json()
    } else {
      ElMessage.error('排序失败')
    }
  } catch (e) {
    ElMessage.error('服务器异常')
  }
}

</script>
<template>
  <div style="padding: 8px;">
    <el-card shadow="always" class="my-full-card">
      <template #header>
        <span>成绩排序</span>
      </template>
      <el-form :model="sortOptions" label-width="120px" layout="inline" @submit.prevent="fetchSortedScores">
        <el-form-item label="排序字段">
          <el-select v-model="sortOptions.field" placeholder="请选择排序字段" style="width: 200px;">
            <el-option label="总分" value="total" />
            <el-option label="平均分" value="avg" />
            <el-option
              v-for="col in subjectColumns"
              :key="col.dataIndex"
              :label="col.title"
              :value="col.dataIndex"
            />
            <el-option label="学号" value="xh" />
          </el-select>
        </el-form-item>
        <el-form-item label="排序方式">
          <el-radio-group v-model="sortOptions.order">
            <el-radio value="asc">升序</el-radio>
            <el-radio value="desc">降序</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="fetchSortedScores">排序</el-button>
        </el-form-item>
      </el-form>
      <el-table
  :data="scores"
  style="margin-top: 20px;min-width: 120px;"
  border
  stripe
  :header-cell-style="{ background: '#f5f7fa' }"
>
  <el-table-column prop="xh" label="学号" width="150" />
  <el-table-column prop="name" label="姓名" width="150" />
  

  <el-table-column
    v-for="col in dynamicColumns"
    :key="col.dataIndex"
    :prop="col.dataIndex"
    :label="col.title"
    width="140"
  />
  

  <template v-if="sortOptions.field !== 'total'">
    <el-table-column prop="total" label="总分" width="100" />
  </template>
  <template v-if="sortOptions.field !== 'avg'">
    <el-table-column prop="avg" label="平均分" width="100" />
  </template>
</el-table>
    </el-card>
  </div>
</template>

<style scoped>
.my-full-card {
  width: 100%;
  box-sizing: border-box;
}
</style>