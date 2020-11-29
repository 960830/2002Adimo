<template>
  <el-container>
    <el-header>
      <h3>后台管理系统</h3>
      <el-button type="danger" @click="tchu">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="iscollapse?'64px':'200px'">
        <div class="toggle-button" @click="leftdiv">|||</div>
        <el-menu
          default-active="2"
          class="el-menu-vertical-demo"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#aaddff"
          router
          :unique-opened="true"
          :collapse="iscollapse"
          :collapse-transition="false"
        >
          <el-menu-item index="/list">
            <i class="el-icon-menu"></i>
            <span slot="title">首页</span>
          </el-menu-item>
          <el-submenu :index="item.id + ''" v-for="item in leftMenu" :key="item.id">
            <template slot="title">
              <i :class="iconList[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <el-menu-item-group>
              <el-menu-item
                :index="'/'+subItem.path + ''"
                v-for="subItem in item.children"
                :key="subItem.path"
              >
                <i class="el-icon-menu"></i>
                <span slot="title">{{ subItem.authName }}</span>
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  // 组件参数 接收来自父组件的数据
  props: [],
  // 局部注册的组件
  components: {},
  // 组件状态值
  data() {
    return {
      leftMenu: [],
      iconList: {
        "125": "iconfont el-icon-s-custom",
        "103": "iconfont el-icon-s-flag",
        "101": "iconfont el-icon-s-shop",
        "102": "iconfont el-icon-s-order",
        "145": "iconfont el-icon-s-platform"
      },
      iscollapse: false,
      navList:[],
    };
  },
  // 侦听器
  watch: {},
  // 组件实例创建完成，属性已绑定，但DOM还未生成，$ el属性还不存在
  created() {
    this.gitLeft();
  },
  //  el 被新创建的 vm.$ el 替换，并挂载到实例上去之后调用该钩子。
  //  如果 root 实例挂载了一个文档内元素，当 mounted 被调用时 vm.$ el 也在文档内。
  mounted() {
    this.getHeight();
    document.addEventListener("resize", this.getHeight);
  },
  // 组件方法
  methods: {
    //   屏幕自适应高度
    getHeight() {
      let html = document.documentElement || document.body;
      let height = html.clientHeight;
      let aside = document.querySelector(".el-aside");
      aside.style.height = height - 60 + "px";
    },
    //   退出
    tchu() {
      this.$confirm("您确定要退出吗?", "温馨提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          sessionStorage.clear();
          this.$message.success("退出成功");
          this.$router.push("/login");
          this.$message({
            type: "success",
            message: "退出成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消退出"
          });
        });
    },
    // 获取左侧菜单栏信息
    async gitLeft() {
      const { data: res } = await this.$axios.get("menus");
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.leftMenu = res.data;
    },
    leftdiv() {
      this.iscollapse = !this.iscollapse;
    }
  },
  // 计算属性
  computed: {}
};
</script>

<style lang="scss" scoped>
.el-header {
  background-color: #545c64;
  color: #333;
  line-height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  h3 {
    color: #e9eef3;
    font-size: 24px;
  }
}

.el-aside {
  background-color: #545c64;
  color: #333;
}
.el-menu {
  border: none;
}

.el-main {
  background-color: #e9eef3;
  color: #333;
}
.el-submenu__title i {
  margin-right: 10px;
}
.toggle-button {
  background: rgb(78, 79, 94);
  color: #e9eef3;
  text-align: center;
  line-height: 40px;
  font-size: 14px;
}
</style>
