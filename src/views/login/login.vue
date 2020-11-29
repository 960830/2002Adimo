<template>
  <div class="contenar">
    <div class="contenar_box">
      <div class="contenar_img">
        <img src="/img/6bc29d5863ddace01a8223b337625cc6.gif" alt />
      </div>
      <div class="contenar_item">
        <el-form ref="form" :model="user" :rules="rules" status-icon label-width="100px" class="demo-ruleForm">
          <el-form-item prop="username">
            <el-input type="text" v-model="user.username" placeholder="请输入用户名"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input type="password" v-model="user.password" placeholder="请输入密码"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="login">登录</el-button>
            <el-button type="primary" @click="cz">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
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
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 5, max: 12, message: "请输入5到12位字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 5, max: 12, message: "请输入5到12位密码", trigger: "blur" }
        ]
      },
      user: {
        password: "",
        username: ""
      }
    };
  },
  // 侦听器
  watch: {},
  // 组件实例创建完成，属性已绑定，但DOM还未生成，$ el属性还不存在
  created() {},
  //  el 被新创建的 vm.$ el 替换，并挂载到实例上去之后调用该钩子。
  //  如果 root 实例挂载了一个文档内元素，当 mounted 被调用时 vm.$ el 也在文档内。
  mounted() {},
  // 组件方法
  methods: {
    // 重置
    cz(){
        this.$refs.form.resetFields()
    },
    // 登录
    login(){
        this.$refs.form.validate(async valid=>{
            if(!valid) return;
           const {data:res} = await this.$axios.post("login",this.user);
            if(res.meta.status !== 200) return this.$message.error(res.meta.msg)
           this.$message.success(res.meta.msg)
           window.sessionStorage.setItem("token",res.data.token)
            this.$router.push("/home")
        })
    }
  },
  // 计算属性
  computed: {}
};
</script>

<style scoped>
.contenar {
  height: 100%;
  background: #aadd;
}
.contenar_box {
  width: 500px;
  height: 400px;
  border: 1px solid #ddd;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #fff;
}
.contenar_img {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  border: 1px solid #ddd;
  margin: 0 auto;
  position: absolute;
  top: -25%;
  right: 30%;
  background: #fff;
  padding: 10px;
  box-sizing: border-box;
}
img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: #ddd;
}
.contenar_item {
  width: 100%;
  margin-top: 200px;
}
.el-form-item {
  margin-right: 80px;
}
</style>
