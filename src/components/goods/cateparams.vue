<template>
  <el-card>
    <my-bread level1="商品管理" level2="分类参数"></my-bread>
    <el-alert title="只允许为第三级分类设置参数" type="error" class="alert"></el-alert>
    <el-form label-position="left" label-width="80px" class="formcascader">
      <el-form-item label="商品分类">
        <!-- 级联选择器 -->
        <!-- 绑定属性以后是js数据 不绑定是字符串 -->
        {{selectedOptions}}
        <el-cascader
          expand-trigger="hover"
          :show-all-levels="false"
          :options="options"
          v-model="selectedOptions"
          :props="defaultProp"
          @change="handleChange"
          clearable
        ></el-cascader>
      </el-form-item>
    </el-form>
    <!-- tabs -->
    <el-tabs v-model="active" @tab-click="handleClick">
      <el-tab-pane label="动态参数" name="1">
        <!-- 按钮   -->
        <el-button type="danger">设置动态参数</el-button>
        <!-- 表格  arrDyparams:数组 每个单元是一个对象 attr_XXX是对象的键名-->
        <el-table :data="arrDyparams" style="width: 100%">
          <!-- 第一列 向下显示-->
          <el-table-column type="expand" label="#">
            <!-- slot-scope="scope"  scope是el-table 绑定的数据arrDyparams-->
            <!-- 标签内只能写"字符串" 要用js数据 必须使用template 绑定slot-scope="scope" scope是el-table 绑定的数据arrDyparamst -->
            <template slot-scope="scope">
              <!-- el-tag -->
              <!-- scope.row.attr_vals 动态参数数组-->
              <el-tag
                :key="tag"
                v-for="tag in scope.row.attr_vals"
                closable
                :disable-transitions="false"
                @close="handleClose(scope.row,tag)"
              >{{tag}}</el-tag>
              <el-input
                class="input-new-tag"
                v-if="inputVisible"
                v-model="inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm(scope.row)"
                @blur="handleInputConfirm(scope.row)"
              ></el-input>
              <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
            </template>
          </el-table-column>
          <!-- 第二例 -->
          <el-table-column label="属性名称" prop="attr_name"></el-table-column>
          <!-- 第三列 -->
          <el-table-column label="操作" prop="name">
            <template slot-scope="scope">
              <el-button
                size="mini"
                plain
                type="primary"
                icon="el-icon-edit"
                circle
                @click="showEditUserDia(scope.row)"
              ></el-button>
              <el-button
                @click="showDeleUserMsgBox(scope.row.id)"
                size="mini"
                plain
                type="danger"
                icon="el-icon-delete"
                circle
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="静态参数" name="2">
        <!-- 按钮   -->
        <el-button type="danger">设置静态参数</el-button>
        <!-- 表格 -->
        <el-table :data="arrStaticparams" style="width: 100%">
          <!-- 第一列 -->
          <el-table-column type="index" label="#"></el-table-column>
          <!-- 第二例 -->
          <el-table-column label="属性名称" prop="attr_name"></el-table-column>
          <!-- 第三列 -->
          <el-table-column label="属性值" prop="attr_vals"></el-table-column>
          <!-- 第四列 -->
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                plain
                type="primary"
                icon="el-icon-edit"
                circle
                @click="showEditUserDia(scope.row)"
              ></el-button>
              <el-button
                @click="showDeleUserMsgBox(scope.row.id)"
                size="mini"
                plain
                type="danger"
                icon="el-icon-delete"
                circle
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      //级联选择器绑定的数据
      options: [],
      selectedOptions: [],
      defaultProp: {
        label: "cat_name",
        value: "cat_id",
        children: "children"
      },
      // 动态参数的数据数组
      arrDyparams: [],
      // 静态数据table
      arrStaticparams: [],
      // tabs切换
      active: "1",
      // 动态数据列表
      list: [],
      // 动态数据添加/删除
      inputVisible: false,
      inputValue: ""
    };
  },
  created() {
    this.getGoodCate();
  },
  methods: {
    // 点击X按钮
    async handleClose(row, tag) {
      row.attr_vals.splice(row.attr_vals.indexOf(tag), 1);
      // 发送请求 put categories/:id/attributes/:attrId
      // put 请求体 {attr_name:?,attr_sel:?,attr_vals:?}
      // attr_name 参数名称 不能为空
      // attr_sel [only,many] 不能为空
      // attr_vals 如果是 many 就需要填写值的选项，以逗号分隔
      let putData = {
        // put请求 请求体
        // 数据名字
        attr_name: row.attr_name,
        // 数据类型
        attr_sel: "many",
        // 更改后数据的数据数组
        attr_vals: row.attr_vals.join(",")
      };
      const res = await this.$http.put(
        `categories/${this.selectedOptions[2]}/attributes/${row.attr_id}`,
        putData
      );
      //console.log(res);
    },
    // 点击newTag+按钮
    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    // 回车键 or 失去焦点
    async handleInputConfirm(row) {
      let inputValue = this.inputValue;
      if (inputValue) {
        row.attr_vals.push(inputValue);
      }
      // 发送请求
      let putData = {
        // put请求 请求体
        // 数据名字
        attr_name: row.attr_name,
        // 数据类型
        attr_sel: "many",
        // 更改后数据的数据数组
        attr_vals: row.attr_vals.join(",")
      };
      const res = await this.$http.put(
        `categories/${this.selectedOptions[2]}/attributes/${row.attr_id}`,
        putData
      );
      //console.log(res);
      this.inputVisible = false;
      this.inputValue = "";
    },
    // tab切换时
    async handleClick() {
      // 点击第二个选项卡
      if (this.active === "2") {
        // 并且级联选择器有三级选项
        if (this.selectedOptions.length === 3) {
          // 获取静态参数得数据
          const res = await this.$http.get(
            `categories/${this.selectedOptions[2]}/attributes?sel=only`
          );
          console.log(res);
          this.arrStaticParams = res.data.data;
          console.log(this.arrStaticParams);

        }
      }
    },
    //级联选择器改变
    async handleChange() {
      if (this.selectedOptions.length === 3) {
        // 获取动态参数
        // 获取数据
        // id -> 当前分类的分类id
        const res = await this.$http.get(
          `categories/${this.selectedOptions[2]}/attributes?sel=many`
        );
        this.arrDyparams = res.data.data;
        this.arrDyparams.forEach(item => {
          item.attr_vals =
            item.attr_vals.length === 0
              ? []
              : (item.attr_vals = item.attr_vals.trim().split(","));
        });
        //console.log(this.arrDyparams);
      }
    },
    // 获取三级分类数据
    async getGoodCate() {
      const res = await this.$http.get(`categories?type=3`);
      //   console.log(res);
      this.options = res.data.data;
    }
  }
};
</script>

<style>
.alert,
.formcascader {
  margin-top: 15px;
}
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
