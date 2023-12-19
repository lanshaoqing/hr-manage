<template>
  <div class="container">
    <div class="app-container">
      <el-tree :data="depts" :props="defaultProps" default-expand-all :expand-on-click-node="false">
        <template v-slot="{ data }">
          <el-row type="flex" justify="space-between" align="middle" style="width: 100%; height: 40px;">
            <el-col>{{ data.name }}</el-col>
            <el-col :span="4">
              <span class="tree-manage">{{ data.manageName }}</span>
              <el-dropdown @command="operateDept($event,data.id)">
                <span class="el-dropdown-link">
                  操作<i class="el-icon-arrow-down el-icon--right" />
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="add">添加子部门</el-dropdown-item>
                  <el-dropdown-item command="edit">编辑部门</el-dropdown-item>
                  <el-dropdown-item command="del">删除</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-col>
          </el-row>
        </template>
      </el-tree>
    </div>
    <AddDept ref="addDept" :show-dialog.sync="showDialog" :current-id="currentId" @updateDepartment="getDepartment" />
  </div>
</template>
<script>
import { getDepartment, delDepartment } from '@/api/department'
import { transListToTreeData } from '@/utils'
import AddDept from './components/app-dept'
export default {
  name: 'Department',
  components: {
    AddDept
  },
  data() {
    return {
      depts: [],
      defaultProps: {
        label: 'name',
        children: 'children'
      },
      showDialog: false,
      currentId: null
    }
  },
  created() {
    this.getDepartment()
  },
  methods: {
    async getDepartment() {
      const result = await getDepartment()
      this.depts = transListToTreeData(result, 0)
    },
    async operateDept(type, id) {
      if (type === 'add') {
        this.showDialog = true
        this.currentId = id
      } else if (type === 'edit') {
        this.showDialog = true
        this.currentId = id
        this.$nextTick(() => {
          this.$refs.addDept.getDepartmentDetail()
        })
      } else {
        this.$confirm('确认删除么').then(async() => {
          await delDepartment(id)
          this.$message.success('删除部门成功')
          this.getDepartment()
        })
      }
    }
  }
}
</script>
<style scoped>
.app-container {
  padding: 30px 140px;
  font-size: 14px;

}

.tree-manage {
  width: 50px;
  display: inline-block;
  margin: 10px;
}
</style>
