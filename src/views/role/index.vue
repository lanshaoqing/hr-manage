<template>
  <div class="container">
    <div class="app-container">
      <div class="role-operate">
        <el-button type="primary" size="mini" @click="showDialog = true">添加角色</el-button>
      </div>
      <el-table :data="list">
        <el-table-column prop="name" label="角色" align="center" width="200">
          <template v-slot="{row}">
            <el-input v-if="row.isEdit" v-model="row.editRow.name" size="mini" />
            <span v-else>{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="state" label="启用" align="center" width="200">
          <template v-slot="{row}">
            <el-switch v-if="row.isEdit" v-model="row.editRow.state" :active-value="1" :inactive-value="0" />
            <span v-else>{{ row.state===1 ? '已启用': row.state===0 ? '未启用':'0' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="描述" align="center">
          <template v-slot="{row}">
            <el-input v-if="row.isEdit" v-model="row.editRow.description" type="textarea" rows="1" />
            <span v-else>{{ row.description }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template v-slot="{row}">
            <template v-if="row.isEdit">
              <el-button size="mini" type="primary" @click="btnEditOK(row)">确定</el-button>
              <el-button size="mini" @click="row.isEdit=false">取消</el-button>
            </template>
            <template v-else>
              <el-button size="mini" type="text" @click="btnPermission(row.id)">分配权限</el-button>
              <el-button size="mini" type="text" @click="btnEditRow(row)">编辑</el-button>
              <el-popconfirm
                title="这是一段内容确定删除吗？"
                @onConfirm="confirmDel(row.id)"
              >
                <el-button slot="reference" style="margin-left: 10px;" size="mini" type="text">删除</el-button>
              </el-popconfirm>
            </template>
          </template>
        </el-table-column>
      </el-table>
      <el-row type="flex" style="height: 60px;" align="middle" justify="end">
        <el-pagination
          layout="prev, pager, next"
          :total="pageParams.total"
          :page-size="pageParams.pagesize"
          :current-page="pageParams.page"
          @current-change="pageChange"
        />
      </el-row>
    </div>
    <el-dialog :visible.sync="showDialog" title="新增角色" width="500px" @close="btnCancel">
      <el-form ref="roleForm" :model="roleForm" label-width="120px" :rules="rules">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="roleForm.name" size="mini" style="width: 300px;" />
        </el-form-item>
        <el-form-item label="启用" prop="state">
          <el-switch v-model="roleForm.state" size="mini" :active-value="1" :inactive-value="0" />
        </el-form-item>
        <el-form-item label="角色描述" prop="description">
          <el-input v-model="roleForm.description" type="textarea" style="width: 300px;" :rows="3" />
        </el-form-item>
        <el-form-item>
          <el-row
            type="flex"
            justify="center"
          >
            <el-col :span="12">
              <el-button type="primary" size="mini" @click="btnOK">确定</el-button>
              <el-button size="mini" @click="btnCancel">取消</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 权限弹层 -->
    <el-dialog :visible.sync="showPermissionDialog" title="分配权限">
      <el-tree
        ref="permTree"
        :data="permissionData"
        :props="props"
        show-checkbox
        default-expand-all
        :default-checked-keys="permIds"
        node-key="id"
        check-strictly
      />
      <el-row type="flex" justify="center">
        <el-col :span="6">
          <el-button type="primary" size="mini" @click="btnPermissionOK">确定</el-button>
          <el-button size="mini" @click="showPermissionDialog = false">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
import { getRoleList, addRole, updateRole, delRole, getRoleDetail, assignPerm } from '@/api/role'
import { getPermissionList } from '@/api/permission'
import { transListToTreeData } from '@/utils'
export default {
  name: 'Role',
  data() {
    return {
      list: [],
      pageParams: {
        page: 1,
        pagesize: 5,
        total: 0
      },
      showDialog: false,
      roleForm: {
        name: '',
        description: '',
        state: 0
      },
      rules: {
        name: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }],
        description: [{ required: true, message: '角色描述不能为空', trigger: 'blur' }]
      },
      showPermissionDialog: false,
      permissionData: [],
      props: {
        label: 'name'
      },
      currentRoleId: null,
      permIds: []
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    async getRoleList() {
      const { rows, total } = await getRoleList(this.pageParams)
      this.list = rows
      this.pageParams.total = total
      this.list.forEach(item => {
        this.$set(item, 'isEdit', false)
        this.$set(item, 'editRow', {
          state: item.state,
          name: item.name,
          description: item.description
        })
      })
    },
    pageChange(newpage) {
      this.pageParams.page = newpage
      this.getRoleList()
    },
    btnOK() {
      this.$refs.roleForm.validate(async valid => {
        if (valid) {
          await addRole(this.roleForm)
          this.$message.success('新增角色成功')
          this.getRoleList()
          this.btnCancel()
        }
      })
    },
    btnCancel() {
      this.$refs.roleForm.resetFields()
      this.showDialog = false
    },
    btnEditRow(row) {
      row.isEdit = true
      row.editRow.name = row.name
      row.editRow.state = row.state
      row.editRow.description = row.description
    },
    async btnEditOK(row) {
      if (row.editRow.name && row.editRow.description) {
        await updateRole({ ...row.editRow, id: row.id })
        this.$message.success('更新角色成功')
        Object.assign(row, {
          ...row.editRow,
          isEdit: false
        })// 规避eslint误判
      } else {
        this.$message.warning('角色和描述不能为空')
      }
    },
    async confirmDel(id) {
      await delRole(id)
      this.$message.success('删除角色成功')
      if (this.list.length === 1) this.pageParams.page--
      this.getRoleList()
    },
    async btnPermission(id) {
      this.currentRoleId = id
      const { permIds } = await getRoleDetail(id)
      this.permIds = permIds
      const result = await getPermissionList()
      this.permissionData = transListToTreeData(result, 0)
      this.showPermissionDialog = true
    },
    async btnPermissionOK() {
      await assignPerm({
        id: this.currentRoleId,
        permIds: this.$refs.permTree.getCheckedKeys()
      })
      this.$message.success('角色分配权限成功')
      this.showPermissionDialog = false
    }
  }
}
</script>
<style scoped>
.role-operate{
  padding:10px;
}
</style>
