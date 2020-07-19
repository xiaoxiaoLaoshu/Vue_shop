<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/logo.png" alt />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边栏区域 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <el-menu
          :default-active="activePath"
          class="el-menu-vertical-demo"
          background-color="#323744"
          text-color="#fff"
          :unique-opened="true"
          :collapse="isCollapse"
          :collapse-transition="false"
          :router="true"
        >
          <!-- 一级菜单 -->
          <el-submenu :index="menuList.id + ''" v-for="menuList in menuLists" :key="menuList.id">
            <template slot="title">
              <!-- 一级菜单图标 -->
              <i :class="iconObj[menuList.id]"></i>
              <!-- 一级菜单文字 -->
              <span>{{menuList.authName}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              v-for="subItem in menuList.children"
              :index="'/' + subItem.path"
              :key="subItem.id"
              @click="saveNav('/' + subItem.path)"
            >
              <!-- 二级菜单图标 -->
              <template slot="title"></template>
              <i class="el-icon-menu"></i>
              <!-- 二级菜单文字 -->
              <span>{{subItem.authName}}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧内容主体 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      // 左侧菜单数据
      menuLists: [],
      iconObj: {
        "125": "el-icon-user",
        "103": "el-icon-s-release",
        "101": "el-icon-s-marketing",
        "102": "el-icon-s-opportunity",
        "145": "el-icon-folder-add"
      },
      isCollapse: false,
      // 被激活的链接
      activePath: ""
    };
  },
  created() {
    this.getMenuList();
    this.activePath = window.sessionStorage.getItem("activePath");
  },
  methods: {
    logout() {
      window.sessionStorage.clear();
      this.$router.push("./login");
    },
    // 获取所有的菜单
    async getMenuList() {
      const { data: res } = await this.$http.get("menus");
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.menuLists = res.data;
      // console.log(res);
    },
    // 点击按钮，切换菜单的折叠和展开功能
    toggleCollapse() {
      this.isCollapse = !this.isCollapse;
    },
    // 保存链接的激活状态
    saveNav(clickPath) {
      window.sessionStorage.setItem("activePath", clickPath);
      this.activePath = clickPath;
    }
  }
};
</script>

<style lang="less" scoped>
.el-submenu [class^="el-icon-"] {
  padding-right: 10px;
}

.home-container {
  // width: 100%;
  height: 100%;
}
.el-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 0;
  background-color: #373c41;
  > div {
    display: flex;
    font-size: 18px;
    color: #fff;
    align-items: center;
    > img {
      width: 100px;
      height: 50%C;
    }
  }
}

.toggle-button {
  background-color: #485165;
  height: 16px;
  line-height: 14px;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}

.el-aside {
  background-color: #323744;
  .el-menu-item {
    border-radius: none;
  }
}

.el-main {
  background-color: #eaedf2;
}
</style>