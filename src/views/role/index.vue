<template>
  <div class="container">
    <div class="app-container">
      <div class="role-operate">
        <el-button type="primary" size="mini">添加角色</el-button>
      </div>
      <el-table :data="list">
        <el-table-column prop="name" label="角色" align="center" width="200" />
        <el-table-column prop="state" label="启用" align="center" width="200" />
        <el-table-column prop="description" label="描述" align="center" />
        <el-table-column label="操作" align="center" />
      </el-table>
      <el-row type="flex" style="height: 60px;" align="middle" justify="end">
        <el-pagination
          layout="prev, pager, next"
        />
      </el-row>
    </div>
  </div>
</template>
<script>
import { getRoleList } from '@/api/role'
export default {
  name: 'Role',
  data() {
    return {
      list: []
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    async getRoleList() {
      const { rows } = await getRoleList()
      this.list = rows
    }
  }
}
</script>
<style scoped>
.role-operate{
  padding:10px;
}
</style>
