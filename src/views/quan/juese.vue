<template>
  <div>
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 角色列表区 -->
      <el-table :data="rolelist" stripe>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['bdbotton',il === 0 ? 'bdtop' : '','vcenter']"
              v-for="(item1,il) in scope.row.children"
              :key="item1.id"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeId(scope.row,item1.id)">{{ item1.authName }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级和三级权限 -->
              <el-col :span="19">
                <el-row
                  :class="[i2 === 0 ? '' : 'bdtop','vcenter']"
                  v-for="(item2,i2) in item1.children"
                  :key="item2.id"
                >
                  <!-- 渲染二级权限 -->
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeId(scope.row,item2.id)"
                    >{{ item2.authName }}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 渲染三级权限 -->
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      v-for="(item3,i3) in item2.children"
                      :key="i3"
                      closable
                      @close="removeId(scope.row,item3.id)"
                    >{{ item3.authName }}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作">
          <template width="300px" slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="small">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="small">删除</el-button>
            <el-button type="warning" icon="el-icon-star-off" size="small" @click="showSet(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分配权限的对话框 -->
    <el-dialog title="分配权限" :visible.sync="dialogVisible" width="30%" @close="setRightDia">
      <el-tree :data="rightsList" :props="treeProps" show-checkbox node-key="id" default-expand-all default-checked-keys="defkeys"></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
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
    return {
      rolelist: [],
      dialogVisible:false,
      rightsList:[],
      treeProps:{
          label:'authName',
          children:'children'
      },
      defkeys:[],
      roleId:''
    };
  },
  // 侦听器
  watch: {},
  // 组件实例创建完成，属性已绑定，但DOM还未生成，$ el属性还不存在
  created() {
    this.getRole();
  },
  //  el 被新创建的 vm.$ el 替换，并挂载到实例上去之后调用该钩子。
  //  如果 root 实例挂载了一个文档内元素，当 mounted 被调用时 vm.$ el 也在文档内。
  mounted() {},
  // 组件方法
  methods: {
    async getRole() {
      const { data: res } = await this.$axios.get("roles");
      console.log(res.data);
      if (res.meta.status !== 200) return this.$message.error("获取信息失败");
      this.rolelist = res.data;
    },
    // 删除三级权限
    async removeId(role, rightId) {
      const confirmResult = await this.$confirm("确定要删除吗?", "温馨提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).catch(err => err);
      if (confirmResult !== "confirm") {
        return this.$$message.info("取消删除");
      }
      const { data: res } = await this.$axios.delete(
        `roles/${role.id}/rights/${rightId}`
      );
      if (res.meta.status !== 200) {
        return this.$message.error("删除权限失败");
      }
      //   this.getRole()
      role.children = res.data;
    },
    // 展示分配权限的对话框
    async showSet(role) {
        this.roleId = role.id
        // 获取所有权限的数据
        const {data:res} = await this.$axios.get('rights/tree')
        if(res.meta.status !== 200){
            return this.$message.error('获取权限失败')
        }
        this.rightsList = res.data
        this.getLeafKeys(role,this.defkeys)
        this.dialogVisible = true
    },
    getLeafKeys(node,arr){
        if(!node.children){
            return arr.push(node.id)
        }
        node.children.forEach(item=>{
            this.getLeafKeys(item,arr)
        })

    },
    setRightDia(){
        this.defkeys = []
    },
    async allotRights(){
        const keys = [
            ...this.$refs.treeRef.allotRights(),
            ...this.$refs.treeRef.getHalfCheckedKeys()
        ]
        const idStr = keys.jion(',')
        const {data:res} = await this.$axios.post(`roles/${this.roleId}/rights`,{rids:idStr})
        if(res.meta.status !== 200){
            return this.$message.error('分配权限失败')
        }
        this.$message.success('分配权限成功')
        this.getRole()
        this.dialogVisible = false
    }
  },
  // 计算属性
  computed: {}
};
</script>

<style scoped>
.el-tag {
  margin: 10px; 
}
.bdtop {
  border-top: 1px solid #ddd;
}
.bdbotton {
  border-bottom: 1px solid #ddd;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
