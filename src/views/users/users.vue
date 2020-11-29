<template>
  <div>
    <el-card>
      <!-- form表单区域 -->
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item>
          <el-input
            placeholder="请输入内容"
            class="input-with-select"
            v-model="query"
            clearable
            @clear="search"
          >
            <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getUserflag = true">添加</el-button>
        </el-form-item>
      </el-form>
      <!-- table表格区域 -->
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="id" label="ID"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="userstate(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <div>
              <el-button type="primary" icon="el-icon-edit" circle @click="editList(scope.row.id)"></el-button>
              <el-button type="danger" icon="el-icon-delete" circle @click="delList(scope.row.id)"></el-button>
              <el-button type="warning" icon="el-icon-star-off" circle @click="setRole(scope.row)"></el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!-- 添加弹框 -->
      <el-dialog title="添加用户" :visible.sync="getUserflag" @close="adduserFlog">
        <el-form :model="getUserlist" ref="form" :rules="rules">
          <el-form-item prop="username">
            <el-input v-model="getUserlist.username" placeholder="请输入用户名"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input type="password" v-model="getUserlist.password" placeholder="请输入密码"></el-input>
          </el-form-item>
          <el-form-item prop="email">
            <el-input v-model="getUserlist.email" placeholder="请输入邮箱"></el-input>
          </el-form-item>
          <el-form-item prop="mobile">
            <el-input v-model="getUserlist.mobile" placeholder="请输入电话"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="getUserflag = false">取 消</el-button>
          <el-button type="primary" @click="getuserItem">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 修改 -->
      <el-dialog title="修改页面" :visible.sync="editFlog" @close="edititem">
        <el-form :model="editUsers" ref="editUsersref" :rules="editUsersrules">
          <el-form-item prop="username">
            <el-input v-model="editUsers.username" placeholder="请输入用户名" disabled></el-input>
          </el-form-item>
          <el-form-item prop="email">
            <el-input v-model="editUsers.email" placeholder="请输入邮箱"></el-input>
          </el-form-item>
          <el-form-item prop="mobile">
            <el-input v-model="editUsers.mobile" placeholder="请输入电话"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="editFlog = false">取 消</el-button>
          <el-button type="primary" @click="editAdd">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagenum"
        :page-sizes="[3,6,9]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <!-- 分配角色的对话框 -->
    <el-dialog title="分配角色" :visible.sync="dialogVisible" width="30%" @close="setRoledia">
      <div>
        <p>当前的用户：{{ userInfo.username }}</p>
        <p>当前的角色：{{ userInfo.role_name }}</p>
        <p>
          分配新角色：
          <el-select v-model="selectRoleId" placeholder="请选择">
            <el-option
              v-for="item in roleslist"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRole">确 定</el-button>
      </span>
    </el-dialog>
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
    //   自定义校验规则
    // 验证邮箱的正则
    var checkEmail = (rule, value, cd) => {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
      if (regEmail.test(value)) {
        return cd();
      }
      cd(new Error("请输入正确的邮箱"));
    };
    // 验证手机号
    var checkMobile = (rule, value, cd) => {
      const regMoble = /^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
      if (regMoble.test(value)) {
        return cd();
      }
      cd(new Error("请输入正确的电话"));
    };
    return {
      // 获取用户列表
      tableData: [],
      query: "",
      pagenum: 1,
      pagesize: 3,
      total: 0,
      //   添加用户
      getUserflag: false,
      //   修改
      editFlog: false,
      editUsers: {
        username: "",
        email: "",
        mobile: ""
      },
      // 修改表单的验证规则
      editUsersrules: {
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "请输入电话", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" }
        ]
      },
      getUserlist: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 5, max: 12, message: "请输入5到12位字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 5, max: 12, message: "请输入5到12位字符", trigger: "blur" }
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "请输入电话", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" }
        ]
      },
      dialogVisible: false,
      userInfo: {},
      roleslist: [],
      selectRoleId:''
    };
  },
  // 侦听器
  watch: {},
  // 组件实例创建完成，属性已绑定，但DOM还未生成，$ el属性还不存在
  created() {},
  //  el 被新创建的 vm.$ el 替换，并挂载到实例上去之后调用该钩子。
  //  如果 root 实例挂载了一个文档内元素，当 mounted 被调用时 vm.$ el 也在文档内。
  mounted() {
    this.getUsers();
  },
  // 组件方法
  methods: {
    //   获取用户列表
    async getUsers() {
      const { data: res } = await this.$axios.get(
        `users?query=${this.query}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`
      );
      //   console.log(res)
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.tableData = res.data.users;
      this.total = res.data.total;
    },
    // 添加用户
    getuserItem() {
      this.$refs.form.validate(async valid => {
        if (!valid) return;
        // 发起网络请求
        const { data: res } = await this.$axios.post("users", this.getUserlist);
        console.log(res);
        if (res.meta.status !== 201) {
          return this.$message.error("添加用户失败");
        }
        this.$message.success("添加用户成功");
        this.getUserflag = false;
        this.getUsers();
      });
    },
    // 刷新页面
    adduserFlog() {
      this.$refs.form.resetFields();
    },
    // 删除
    async delList(id) {
      const delForm = await this.$confirm(
        "此操作将永久删除该用户, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);
      if (delForm !== "confirm") {
        return this.$message.info("已取消删除");
      }
      const { data: res } = await this.$axios.delete("users/" + id);
      if (res.meta.status !== 200) return this.$message.error("删除失败");
      this.$message.success(res.meta.msg);
      this.getUsers();
    },
    // 修改
    // 获取修改内容
    async editList(id) {
      const { data: res } = await this.$axios.get("users/" + id);
      if (res.meta.status !== 200)
        return this.$message.error("查询用户信息失败");
      this.editUsers = res.data;
      this.editFlog = true;
    },
    edititem() {
      this.$refs.editUsersref.resetFields();
    },
    editAdd() {
      this.$refs.editUsersref.validate(async valid => {
        if (!valid) return;
        const { data: res } = await this.$axios.put(
          "users/" + this.editUsers.id,
          {
            email: this.editUsers.email,
            mobile: this.editUsers.mobile
          }
        );
        if (res.meta.status !== 200) {
          return this.$message.error("更新用户信息失败");
        }
        this.editFlog = false;
        this.getUsers();
        this.$message.success("更新用户信息成功");
      });
    },
    // 分页
    handleSizeChange(size) {
      this.pagesize = size;
      this.getUsers();
    },
    handleCurrentChange(num) {
      this.pagenum = num;
      this.getUsers();
    },
    // 查找
    search() {
      this.getUsers();
    },
    // 状态
    async userstate(userInfo) {
      console.log(userInfo);
      const { data: res } = await this.$axios.put(
        `users/${userInfo.id}/state/${userInfo.mg_state}`
      );
      if (res.meta.status !== 200) {
        userInfo.mg_state = !userInfo.mg_state;
        return this.$message.error("更新失败");
      }
      this.$message.success("更新成功");
    },
    async setRole(userInfo) {
      this.userInfo = userInfo;

      // 获取所有的角色列表
      const { data: res } = await this.$axios.get("roles");
      if (res.meta.status !== 200) {
        return this.$message.error("获取信息失败");
      }
      this.roleslist = res.data;

      this.dialogVisible = true;
    },
    async saveRole(){
      if(!this.selectRoleId){
        return this.$message.error('请选择要分配的角色')
      }
      const {data:res} = await this.$axios.put(`users/${this.userInfo.id}/role`,{rid:this.selectRoleId})
      if(res.meta.status !== 200){
        this.$message.error('更新用户角色失败')
      }
      this.$message.success('更新用户成功')
      this.getUsers()
      this.dialogVisible=false
    },
    setRoledia(){
      this.selectRoleId = ''
      this.userInfo = []
    }
  },
  // 计算属性
  computed: {}
};
</script>

<style scoped>
</style>
