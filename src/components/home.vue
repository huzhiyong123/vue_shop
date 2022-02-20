<template>
  <el-container class="home-container">
    <el-header>
      <div>
        <span> 电商后台管理系统 </span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="iscpllapse ? '64px' : '200px'">
        <div class="toggle-button" @click="togglecollapse">|||</div>
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409eff"
          :unique-opened="true"
          :collapse="iscpllapse"
          :collapse-transition="false"
          router
          :default-active="activepath"
        >
          <el-submenu
            :index="item.id + ''"
            v-for="item in menulist"
            :key="item.id"
          >
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{ item.authName }}</span>
            </template>

            <el-menu-item
              :index="'/' + subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
              @click="savenavstate('/' + subItem.path)"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>

      <el-main>
        <router-view> </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      menulist: [],
      iscpllapse: false,
      activepath: "",
    };
  },

  created() {
    this.getMenuList();
    this.activepath = window.sessionStorage.getItem("activepath");
  },

  methods: {
    logout() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    async getMenuList() {
      const { data: res } = await this.$http.get("menus");
      if (res.meta.status !== 200)
        return this.$message.console.error(res.meta.msg);
      this.menulist = res.data;
      console.log(res);
    },
    togglecollapse() {
      this.iscpllapse = !this.iscpllapse;
    },
    savenavstate(activepath) {
      window.sessionStorage.setItem("activepath", activepath);
      this.activepath = activepath;
    },
  },
};
</script>

<style lang="less" scoped>
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  font-size: 30px;
  padding-left: 0;
}
.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: none;
  }
}
.el-main {
  background-color: #eaedf1;
}
.home-container {
  width: 100%;
  height: 100%;
}
.icofont {
  margin-left: 10px;
}
.toggle-button {
  background-color: #4a504a;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>