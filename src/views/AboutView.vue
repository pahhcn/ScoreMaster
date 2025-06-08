<template>
  <div class="about-wrapper">
    <a-card title="关于成绩管理系统" :bordered="false" class="about-card">
      <template #extra>
        <a-tag color="arcoblue">v1.0</a-tag>
      </template>
      <p>
        本系统是一个高效的成绩管理平台，旨在为学校、教师和学生提供便捷的成绩管理服务。
      </p>
      <a-divider>主要功能</a-divider>
      <a-list :bordered="false" size="large">
        <a-list-item>添加、删除、修改、查询成绩信息</a-list-item>
        <a-list-item>查询某学生各科成绩、总分、平均分</a-list-item>
        <a-list-item>按某科成绩、总分、平均分进行排序显示</a-list-item>
        <a-list-item>快速筛选特定学生，如姓名模糊匹配（如王XX）</a-list-item>
        <a-list-item>支持任意科目特定成绩范围的查询</a-list-item>
      </a-list>
      <a-divider>系统特点</a-divider>
      <a-descriptions :column="1" bordered>
        <a-descriptions-item label="高效管理">支持批量操作，快速处理大量成绩数据</a-descriptions-item>
        <a-descriptions-item label="灵活查询">多条件组合查询，满足不同场景需求</a-descriptions-item>
        <a-descriptions-item label="直观展示">支持按科目、总分、平均分排序，数据一目了然</a-descriptions-item>
        <a-descriptions-item label="易用性">界面简洁，操作便捷，适合不同用户群体</a-descriptions-item>
      </a-descriptions>
      <a-divider>联系我们</a-divider>
      <p>如有建议或问题，请联系成绩管理系统开发团队。</p>
    </a-card>
  </div>
</template>

<script setup>
</script>

<style scoped>
.about-wrapper {
  max-width: 90%;
  margin: auto;
}
.about-card {
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
  border-radius: 12px;
}
</style>