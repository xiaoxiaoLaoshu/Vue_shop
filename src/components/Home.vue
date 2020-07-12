<template>
  <div id="app">
    <el-button type="info" @click="logout">退出</el-button>Home 组件
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    logout() {
      window.sessionStorage.clear();
      this.$router.push("./login");
    }
  }
};
</script>

<style lang="less" scoped>
</style>