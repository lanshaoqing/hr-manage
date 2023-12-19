<template>
  <div class="container">
    <div class="app-container">
      <el-tree :data="depts" :props="defaultProps" default-expand-all>
        <template v-slot="{ data }">
          <el-row type="flex" justify="space-between" align="middle" style="width: 100%; height: 40px;">
            <el-col>{{ data.name }}</el-col>
            <el-col :span="4">
              <span class="tree-manage">{{ data.manageName }}</span>
              <el-dropdown>
                <span class="el-dropdown-link">
                  操作<i class="el-icon-arrow-down el-icon--right" />
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>添加子部门</el-dropdown-item>
                  <el-dropdown-item>编辑部门</el-dropdown-item>
                  <el-dropdown-item>删除</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-col>
          </el-row>
        </template>
      </el-tree>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Department',
  data() {
    return {
      depts: [
        {
          name: '1', manageName: '管理员', children: [{
            name: '2', manageName: '管理员2'
          }, { name: '3', manageName: '管理员3' }]
        }
      ],
      defaultProps: {
        label: 'name',
        children: 'children'
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
