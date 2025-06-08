<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const welcomeMessage = ref({
  title: '欢迎来到成绩管理系统',
   etitle: 'Score Management System',
  description: '本系统为Linux课程作业----成绩管理服务。',
 
})

const containerHeight = ref('100vh')
function updateHeight() {
  const menuHeight = document.querySelector('.menu-wrapper')?.offsetHeight || 0
  const windowHeight = window.innerHeight
  containerHeight.value = `${windowHeight - menuHeight - 20 - 1}px`
}

onMounted(() => {
  updateHeight()
  window.addEventListener('resize', updateHeight)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateHeight)
})
</script>

<template>
  <div class="home-container" :style="{ height: containerHeight }">
    <div class="background-image">
      <a-card class="welcome-card" :bordered="false">
        <h1>{{ welcomeMessage.title }}</h1>
        <span>{{ welcomeMessage.etitle }}</span>
        <p>{{ welcomeMessage.description }}</p>
      </a-card>
    </div>
  </div>
</template>

<style scoped>
.home-container {
  position: relative;
  overflow: hidden;
}

.background-image {
  position: relative;
  width: 100%;
  height: 100%;
  background-image: url('@/assets/42.jpg'); 
  background-size: cover;
  background-position: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
}

.welcome-card {
  position: absolute;
  top: 35%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
  text-align: center;
  background: rgba(255, 255, 255, 0.0); 
  box-shadow: 0 4px 24px rgb(255, 255, 255);
  border-radius: 12px;
  border: none;
  padding: 24px;
}

.welcome-card h1 {
  font-size: 3rem;
  color: #fff;
  margin-bottom: 16px;
}

.welcome-card span {
  font-size: 1.5rem;
  color: #fff;
  margin-bottom: 24px;
  display: block;
}

.welcome-card p {
  font-size: 1.2rem;
  color: #fff;
  margin-bottom: 24px;
}

</style>