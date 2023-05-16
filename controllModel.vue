<template>
  <el-dialog :title="source.title" :visible.sync="visible" width="80%" :before-close="handleClose" @close="handleClose">

    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
      <el-form-item label="控制面板名称" prop="controlPanelName">
        <el-input v-model="ruleForm.controlPanelName" />
      </el-form-item>
      <el-form-item label="回路" prop="controllPanelLoopStr">
        <el-input @focus="handleOpenTreeSelectModel" clearable @clear="handleClearTabel"
          v-model="ruleForm.controllPanelLoopStr" />
      </el-form-item>
      <el-form-item label="地址" prop="controlPanelAddress">
        <el-input v-model="ruleForm.controlPanelAddress" />
      </el-form-item>
    </el-form>


    <el-dialog width="80%" title="回路选择" :visible.sync="loopVisible" append-to-body>
      <el-row :gutter="12">
        <el-col :span="8">
          <el-input placeholder="输入关键字进行过滤" v-model="filterText" />
          <el-tree class="filter-tree" :load="loadNode" lazy show-checkbox :props="defaultProps"
            :filter-node-method="filterNode" node-key="id" :default-expanded-keys="expandedKeys" ref="tree"
            @check="checkNodes">
          </el-tree>
        </el-col>
        <el-col :span="16">
          <el-table :data="tableData" style="width: 100%">
            <el-table-column prop="label" label="城市" width="180">
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleLoopExpand">测试</el-button>
        <el-button @click="handleLoopCancle">取 消</el-button>
        <el-button type="primary" @click="handleLoopSubmit">确 定</el-button>
      </span>
    </el-dialog>


    <span slot="footer" class="dialog-footer">
      <el-button @click="handleCancle">取 消</el-button>
      <el-button type="primary" @click="handleSubmit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'controllModel',
  props: {
    source: {
      type: Object,
      default: () => ({
        title: ''
      })
    }
  },
  data () {
    return {
      filterText: '',
      defaultProps: {
        children: 'children',
        label: 'label',
        isLeaf: 'leaf'
      },
      treeData: [],
      visible: false,
      ruleForm: {
        controlPanelName: '',
        controllPanelLoopStr: '',
        controllPanelLoops: '',
        controlPanelAddress: '',
      },
      rules: {
        controlPanelName: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
        ],
        controlPanelAddress: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
        ],
      },
      loopVisible: false,
      tableData: [],
      expandedKeys: []
    }
  },
  watch: {
    filterText (val) {
      this.$refs.tree.filter(val);
    }
  },
  mounted () {
    this.cacheTable = []
  },
  methods: {
    async open () {
      this.visible = true
      await this.$nextTick()
    },
    handleClose () {
      this.visible = false
      this.$refs['ruleForm'].resetFields()
      Object.assign(this.ruleForm, this.$options.data().ruleForm)
    },
    handleCancle () {
      this.visible = false
    },
    handleSubmit () {
      this.visible = false
    },
    handleClearTabel () {
      this.tableData = []
      this.cacheTable = []
      this.$refs.tree.setCheckedKeys([]);
      this.expandedKeys = []
      for (let key in this.$refs.tree.store.nodesMap) {
        this.$refs.tree.store.nodesMap[key].expanded = false
      }
    },
    async handleOpenTreeSelectModel () {
      this.loopVisible = true
      const keys = this.cacheTable.map(data => data.id) || []
      await this.$nextTick()
      this.$refs.tree.setCheckedKeys(keys);
    },
    loadNode (node, resolve) {
      if (node.level === 0) {
        return resolve([{ label: '成都市', id: 11 }, { label: '绵阳市', id: 12 }]);
      }
      if (node.level > 1) return resolve([]);

      setTimeout(() => {
        let data = null
        if (node.data.id === 11) {
          data = [
            { id: 111, label: '锦江区', leaf: true }, { id: 112, label: '武侯区', leaf: true }, { id: 113, label: '金牛区', leaf: true }
          ];
        } else {
          data = [
            { id: 121, label: '涪城区', leaf: true }, { id: 122, label: '游仙区', leaf: true }, { id: 123, label: '安州区', leaf: true }
          ];
        }
        resolve(data);
      }, 500);
    },
    checkNodes (checkedNodes, checkedKeys,) {
      this.checkedNodes = checkedKeys.checkedNodes
      this.tableData = checkedKeys.checkedNodes.filter(check => ![11, 12].includes(check.id))
    },
    handleLoopCancle () {
      this.loopVisible = false
      this.tableData = this.cacheTable
      this.$refs.tree.setCheckedKeys([]);
    },
    handleLoopSubmit () {
      this.loopVisible = false
      this.ruleForm.controllPanelLoopStr = this.tableData.map(item => item.label).filter(data => data).join(',')
      this.cacheTable = this.tableData
    },
    handleLoopExpand () {
      this.tableData = [
        { id: 111, label: '锦江区', leaf: true }, { id: 112, label: '武侯区', leaf: true }
      ]
      const kesy = this.tableData.map(data => data.id)
      this.$refs.tree.setCheckedKeys(kesy);
    },
    filterNode (value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    }
  }
}
</script>

<style scoped></style>
