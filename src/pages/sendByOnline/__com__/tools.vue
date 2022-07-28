<template lang='pug'>
.tools
  .left
    .btns
      el-button 选择配置文件夹
      el-button 重新读取配置
      el-button(@click="onlyVip = !onlyVip")
        span(style="margin-right: 10px") 只发送VIP
        el-switch(v-model="onlyVip", style="pointer-events: none")
      el-button 清空列表
      el-button 重置进度
    .title 发送模式
    .btns
      el-radio-group(v-model="mode", size="normal")
        el-tooltip(
          effect="dark",
          content="每次发送会检测重复，发送速度较慢",
          placement="top-start"
        )
          el-radio-button(:label="1") 模式1
        el-tooltip(
          effect="dark",
          content="发送速度较快，但可能发送重复信件",
          placement="top-start"
        )
          el-radio-button(:label="2") 模式2
        el-tooltip(effect="dark", placement="top-start")
          template(#content)
            div(style="width: 250px; word-break: break-all") 启用多个线程同时发送，既有普通模式的重复检测功能，又具备极速模式的速度，但可能消耗更多的电脑资源
          el-radio-button(:label="3") 模式3
      el-input-number(
        v-if="mode == 3",
        v-model="threadNum",
        style="width: 110px; margin-left: 10px",
        :min="1",
        :max="5"
      )
  .right
    el-button 全部暂停
</template>
<script setup>
import { onlyVip, mode, threadNum } from "../provider/index";
</script>
<style scoped lang="less">
.tools {
  text-align: left;
  display: flex;
  .title {
    font-size: 14px;
    font-weight: bold;
    margin-bottom: 5px;
  }
  .left {
    flex: 1;
    .btns {
      flex-wrap: wrap;
      display: flex;
      margin-bottom: 15px;
    }
  }
  .right {
    display: flex;
    margin-right: 30rpx;
    justify-content: right;
  }
}
</style>
