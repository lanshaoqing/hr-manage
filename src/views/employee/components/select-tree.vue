<template>
  <el-cascader
    size="mini"
    :options="treeData"
    :props="props"
  />
</template>

<script>
import { getDepartment } from '@/api/department'
import { transListToTreeData } from '@/utils'
export default {
  data() {
    return {
      treeData: [],
      props: {
        label: 'name',
        value: 'id'
      }
    }
  },
  created() {
    this.getDepartment()
  },
  methods: {
    async getDepartment() {
      const result = await getDepartment()
      this.treeData = transListToTreeData(result, 0)
    }
  }
}
</script>
