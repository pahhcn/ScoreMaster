<script setup>
import { RouterLink, RouterView, useRoute } from 'vue-router'
const route = useRoute()
</script>

<template>
    <header>
      <img alt="Vue logo" class="logo" src="@/assets/logo_s.png" />
      <div class="menu-wrapper">
        <a-menu mode="horizontal" :selected-keys="[route.path]" style="flex: 1; min-width: 900px;">
          <a-menu-item key="/">
            <RouterLink to="/">首页</RouterLink>
          </a-menu-item>
          <a-menu-item key="/score-query">
            <RouterLink to="/score-query">成绩查询</RouterLink>
          </a-menu-item>
          <a-menu-item key="/score-sort">
            <RouterLink to="/score-sort">排序字段</RouterLink>
          </a-menu-item>
          <a-menu-item key="/add-score">
            <RouterLink to="/add-score">添加成绩</RouterLink>
          </a-menu-item>
          <a-menu-item key="/delete-score">
            <RouterLink to="/delete-score">删除成绩</RouterLink>
          </a-menu-item>
          <a-menu-item key="/edit-score">
            <RouterLink to="/edit-score">修改成绩</RouterLink>
          </a-menu-item>
          <a-menu-item key="/about">
            <RouterLink to="/about">关于页面</RouterLink>
          </a-menu-item>
        </a-menu>
      </div>
    </header>
    <RouterView />

</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
  display: flex;
  align-items: center;
  background: #fff;
  box-shadow: 0 2px 8px #f0f1f2;
  padding: 0 32px;
}
.logo {
  width: auto;
  height: auto;
  display: block;
  margin: 10px;
}
.menu-wrapper {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: space-between;
}
.full-page {
  min-height: 100vh;
  background: #f7f8fa;
  display: flex;
  flex-direction: column;
}
</style>
