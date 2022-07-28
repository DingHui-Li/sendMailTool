<template lang='pug'>
.page 
  Tools
  el-button(@click="test") test
  .task
    el-table(:data="accountList", lazy)
      el-table-column(label="编号", type="index", width="100")
      el-table-column(label="账号", property="id")
      el-table-column(label="总数")
        template(#default="{row}")
          div {{sendRecordMap[row?.id]?.length||0}}
      el-table-column(label="已发送")
      el-table-column(label="状态")
        template(#default="scope")
          el-tag(
            v-if="scope.row.status == '登录中'",
            color="#673AB7",
            style="color: #fff"
          ) {{ scope.row.status }}
          el-tag(
            v-else-if="scope.row.status == '登录失败'",
            color="#FF5252",
            style="color: #fff"
          ) {{ scope.row.status }}
          el-tag(
            v-else-if="scope.row.status.includes('查询中')",
            color="#3F51B5",
            style="color: #fff"
          ) {{ scope.row.status }}
          el-badge(
            v-else-if="scope.row.status.includes('发信中')",
            :value="scope.row.newCount"
          )
            el-tag(color="#8BC34A") {{ scope.row.status }}
          el-tag(v-else) {{ scope.row.status }}
      el-table-column
        template(#default="{ row }")
          el-button(type="success", @click="handleOpenDialog(row)") 发送记录
  el-dialog(v-model="dialog.open", :title="`${dialog.id}的发送记录`")
    el-table(:data="sendRecordMap[dialog.id]", height="60vh")
      el-table-column(label="编号", type="index", width="100")
      el-table-column(label="账号", property="id")
      el-table-column(label="名称", property="name")
      el-table-column(label="状态", property="status")
</template>
<script setup>
import { ref, onMounted, computed } from "vue";
import Tools from "./__com__/tools.vue";
import TaskItem from "./__com__/taskItem.vue";
import { start, accountMap, sendRecordMap } from "./provider/index";
import { Loading } from "@element-plus/icons-vue";

let accountList = computed(() => {
  return Object.values(accountMap.value);
});
let dialog = ref({
  open: false,
  id: "",
});

onMounted(() => {});
function test() {
  start();
}
function handleOpenDialog(e) {
  dialog.value.open = true;
  dialog.value.id = e.id;
  console.log(sendRecordMap.value);
}
</script>
<style scoped lang="less">
.page {
  padding: 15px;
  &:deep(.el-dialog) {
  }
}
</style>
