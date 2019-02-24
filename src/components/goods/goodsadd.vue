<template>
  <el-card class="box-card">
    <!-- 1.面包屑 -->
    <my-bread level1="商品列表" level2="商品列表"></my-bread>
    <!-- 提示 -->
    <el-alert title="添加商品信息" type="success" center show-icon class="alert"></el-alert>
    <!-- 步骤条 -->
    <!-- active是数字  1*active转数字 -->
    <el-steps :active="1*active" finish-status="success" simple style="margin-top: 20px">
      <el-step title="基本信息"></el-step>
      <el-step title="商品参数"></el-step>
      <el-step title="商品属性"></el-step>
      <el-step title="商品图片"></el-step>
      <el-step title="商品内容"></el-step>
    </el-steps>
    <!-- 最外层是el-form -->
    <!-- tab切换 style="height:300px;overflow:auto;" -->
    <el-form label-position="top" label-width="80px" :model="form">
      <el-tabs v-model="active" @tab-click="tagChange()" tab-position="left">
        <el-tab-pane label="基本信息" name="1">
          <el-form-item label="商品名称">
            <el-input v-model="form.goods_name"></el-input>
          </el-form-item>
          <el-form-item label="商品价格">
            <el-input v-model="form.goods_price"></el-input>
          </el-form-item>
          <el-form-item label="商品重量">
            <el-input v-model="form.goods_weight"></el-input>
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input v-model="form.goods_number"></el-input>
          </el-form-item>
          <el-form-item label="商品分类">
            <!-- 级联选择器 -->
            <el-cascader
              expand-trigger="hover"
              :options="options"
              v-model="selectedOptions"
              :props="defaultProp"
              @change="handleChange"
              clearable
            ></el-cascader>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品参数" name="2">
          <!-- 显示的是该三级分类的商品参数 -->
          <el-form-item :label="item1.attr_name" :key="i" v-for="(item1,i) in arrDyparams">
            <!-- 多选框 -->
            <el-checkbox-group v-model="item1.attr_vals">
              <el-checkbox border v-for="(item2,i) in item1.attr_vals" :key="i" :label="item2"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品属性" name="3">
          <!-- 静态参数的数据 -->
          <el-form-item :label="item.attr_name" v-for="(item,i) in arrStaticParams" :key="i">
            <el-input v-model="item.attr_vals"></el-input>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品图片" name="4">
          <el-form-item>
            <!-- baseUrl axios 发的请求 -->
            <!-- 图片被上传之前 临时图片会放在服务器路径里 -->
            <!-- 上传图片也需要设置请求头 -->
            <!-- C:\Users\HASEE\Desktop\api-server\tmp_uploads -->
            <el-upload
              action="http://localhost:8888/api/private/v1/upload"
              :headers="headers"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              list-type="picture"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="商品内容" name="5">
          <el-form-item>
            <!-- 富文本 -->
            <quill-editor v-model="form.goods_introduce" class="editor"></quill-editor>
            <!-- 表单元素 -->
            <el-button type="primary" class="btn" @click="addGoods()">添加商品</el-button>
          </el-form-item>
        </el-tab-pane>
      </el-tabs>
    </el-form>
  </el-card>
  <!-- <el-form-item label="名称">
    <el-input v-model="formLabelAlign.name"></el-input>
  </el-form-item>
  <el-form-item label="活动区域">
    <el-input v-model="formLabelAlign.region"></el-input>
  </el-form-item>
  -->
</template>

<script>
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

import { quillEditor } from "vue-quill-editor";
export default {
  components: {
    quillEditor
  },
  data() {
    return {
      active: 1,
      // 添加商品的表单数据
      // goods_name 商品名称
      // goods_price 价格
      // goods_number 数量
      // goods_weight 重量
      // goods_introduce 介绍

      // 未处理的数据
      // goods_cat 以为','分割的分类列表 > 级联选择器绑定的数据 selectedOptions
      // this.selectoption -> string

      // pics 上传的图片临时路径（对象）
      // pics是数组[{pic:图片的临时路径}]

      // attrs 商品的参数（数组）
      // 该商品的动态参数和静态参数 -> 数组
      form: {
        goods_name: "",
        goods_price: "",
        goods_number: "",
        goods_weight: "",
        goods_introduce: "",

        goods_cat: "",
        pics: [],
        attrs: []
      },
      //级联选择器绑定的数据
      options: [],
      selectedOptions: [1, 3, 6],
      defaultProp: {
        label: "cat_name",
        value: "cat_id",
        children: "children"
      },
      //动态参数的数据数组
      arrDyparams: [],
      //静态参数的数据数组
      arrStaticParams: [],
      headers: {
        Authorization: localStorage.getItem("token")
      },
      path: ""
    };
  },
  created() {
    this.getGoodCate();
  },
  methods: {
    // 添加商品实现 -发送请求
    async addGoods() {
      //再发请求之前 处理 this.form中的未处理数据
      // goods_cat -> 分类  数组转成以 , 分割的字符串
      this.form.goods_cat = this.selectedOptions.join(",");

      // pics 再上传和移除图片时 进行赋值和删除 [].findIndex()
    

      // attrs -> 动态参数+静态参数数组 [{"attr_id":15,"attr_value":"ddd"}]
      // 动态参数数组
      this.arrDyparams
      //console.log(this.arrDyparams)
      // 遍历 + 取值 + 放在一个新数组中
      let arr1 = this.arrDyparams.map((item)=>{
          // item.attr_id和item.attr_vals
          return {"attr_id":item.attr_id,"attr_value":item.attr_vals}
      })
      //console.log(arr1)
      // 静态参数数组
     let arr2 = this.arrStaticParams.map((item)=>{
          // item.attr_id和item.attr_vals
          return {"attr_id":item.attr_id,"attr_value":item.attr_vals}
      })
      // 合并数组
      this.form.attrs =[...arr1,...arr2]

      const res = await this.$http.post(`goods`, this.form);
      console.log(res);
      //回到商品列表页
      this.$router.push({name:'goods'})
    },
    // 图片上传时的相关方法
    // file形参里面是当前操作的图片的相关信息(图片名 路径)
    // 预览
    handlePreview(file) {
      console.log("预览");
      console.log(file);
    },
    // 点X
    handleRemove(file) {
      // file.response.data.tmp_path 被删除图片的临时上传路径
      console.log("删除");
      console.log(file);
      // 从 this.form.pics 数组中 移除当前X掉的图片
      // 先获取该图片的索引
      // findIndex((item) => {}) 遍历数组 同时 把符合条件的元素的索引进行返回
      // item:[{pic:图片路径},{pic:图片路径}] item : 数组的每个单元
          let index = this.form.pics.findIndex((item) => {
            // 当图片上传成功的数组里面的某个单元对象的路径 == 删除的图片的路径 获取该单元的index值
            return  item.pic === file.response.data.tmp_path
    }) 
     // 删除该单元
      this.form.pics.splice(index, 1);
      // 获取删除图片的临时路径 在 this.form.pics[]数组中的索引值
    //   this.form.pics.forEach((item, index) => {
    //     if (item.pic ===file.response.data.tmp_path) {
    //       this.form.pics.splice(index, 1);
    //     }
    //   });
    console.log(this.form.pics)
    },
    // 上传成功
    handleSuccess(file) {
      // file.data.tmp_path 临时上传的图片路径
      console.log("上传成功");
      console.log(file);
      //this.path = file.data.tmp_path
      this.form.pics.push({ pic: file.data.tmp_path });
    },
    // 点击不同的tag时触发该方法
    async tagChange() {
      // 如果点击的是第二个tab 同时 三级分类要有值
      if (this.active === "2") {
        if (this.selectedOptions.length !== 3) {
          this.$message.warning("请先选择商品的三级分类");
          return;
        }
        // 获取数据
        // id -> 当前分类的分类id
        const res = await this.$http.get(
          `categories/${this.selectedOptions[2]}/attributes?sel=many`
        );
        // console.log(res);
        this.arrDyparams = res.data.data;
        //this.arrDyparams每个对象.attr_vals字符串->数组->v-for
        this.arrDyparams.forEach(item => {
          // 并不是所有的三级分类都有动态参数 -> "" -> [] -> v-for报错
          // if(item.attr_valus.length!==0){
          //      item.attr_vals = item.attr_vals.trim().split(',')
          // }
          // v-for可以遍历空数组
          item.attr_vals =
            item.attr_vals.length === 0
              ? []
              : (item.attr_vals = item.attr_vals.trim().split(","));
        });
      } else if (this.active === "3") {
        if (this.selectedOptions.length !== 3) {
          this.$message.warning("请先选择商品的三级分类");
          return;
        }
        // 获取静态参数得数据
        const res = await this.$http.get(
          `categories/${this.selectedOptions[2]}/attributes?sel=only`
        );
        console.log(res);
        this.arrStaticParams = res.data.data;
      }
    },
    // 级联选择器 @change触发的方法
    handleChange() {},
    // 获取三级分类的信息
    async getGoodCate() {
      const res = await this.$http.get(`categories?type=3`);
      //   console.log(res);
      this.options = res.data.data;
    }
  }
};
</script>

<style>
.alert {
  margin-top: 15px;
  height: 44px;
}
.steps {
  margin-top: 15px;
}
.box-card {
  height: 100%;
  overflow: auto;
}
.ql-editor {
  /* 富文本编辑区设置最小高度 字写多了超过此高度 高度会自动增加 */
  min-height: 250px;
}
.btn {
  float: right;
  margin-top: 15px;
  /* margin-right: 25px; */
}
.editor {
  margin-top: 15px;
}
</style>

