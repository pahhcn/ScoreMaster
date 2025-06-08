<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()
const form = ref({ query: '' })
const loading = ref(false)
const results = ref([])
const successMsg = ref('')
const errorMsg = ref('')

async function handleSearch() {
  if (!form.value.query) {
    errorMsg.value = '请输入学号或姓名'
    return
  }
  loading.value = true
  errorMsg.value = ''
  successMsg.value = ''
  try {
    const res = await fetch(
      `http://localhost:3000/api/scores?name=${form.value.query}`
    ).then((r) => r.json())
    if (res.length) {
      results.value = res
    } else {
      errorMsg.value = '未找到匹配的学生'
    }
  } catch (e) {
    errorMsg.value = '服务器异常'
  }
  loading.value = false
}

async function handleDelete(xh) {
  loading.value = true
  errorMsg.value = ''
  successMsg.value = ''
  try {
    const res = await fetch(`http://localhost:3000/api/scores/${xh}`, {
      method: 'DELETE',
    }).then((r) => r.json())
    if (res.success) {
      successMsg.value = '删除成功'
      ElMessage.success('删除成功')
      results.value = results.value.filter((item) => item.xh !== xh)
    } else {
      errorMsg.value = '删除失败'
    }
  } catch (e) {
    errorMsg.value = '服务器异常'
  }
  loading.value = false
}

function goBack() {
  router.push('/')
}
</script>
<template>
  <div style="max-width: 80%; margin: 40px auto;">
    <el-card shadow="always" class="my-full-card">
      <template #header>
        <span>删除学生成绩</span>
      </template>
      <el-form :model="form" label-width="auto" @submit.prevent="handleSearch">
        <el-form-item label="学号或姓名" required>
          <el-input v-model="form.query" placeholder="请输入学号或姓名" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="loading" @click="handleSearch">
            查询
          </el-button>
          <el-button style="margin-left: 16px" @click="goBack">返回</el-button>
        </el-form-item>
      </el-form>
      <el-table
        v-if="results.length"
        :data="results"
        style="margin-top: 20px"
        border
        stripe
      >
        <el-table-column prop="xh" label="学号" width="150" />
        <el-table-column prop="name" label="姓名" width="150" />
        <el-table-column label="操作" width="120">
          <template #default="scope">
            <el-button
              type="danger"
              size="small"
              @click="handleDelete(scope.row.xh)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
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
    </el-card>
  </div>
</template>

<style scoped>
.my-full-card {
  width: 100%;
  box-sizing: border-box;
}
</style>