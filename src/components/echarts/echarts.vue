<template>
<el-card>
    <my-bread level1="数据统计" level2="数据报表"></my-bread>
    <div id="main" style="width: 700px;height:400px;"></div>
</el-card>
</template>

<script>
// 导入组件
var echarts = require('echarts')
export default {
    mounted() {
        this.useEchats()
    },
    methods: {
        async useEchats() {
            // 请求数据
            // `reports/type/1`
            // `reports/type=1`
            const res = await this.$http.get(`reports/type/1`)
            //初始化echarts实例
            var myChart = echarts.init(document.getElementById('main'));
            //指定图表的数据和配置项 
            //{legend: {data: Array(5),series:[{…}, {…}, {…}, {…}, {…}],xAxis: [{…}],yAxis: [{…}]}}



            let option2 = res.data.data
        
            console.log(res)
            // 代码来源于文档
            let option1 = {
                title: {
                    text: '堆叠区域图'
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        label: {
                            backgroundColor: '#6a7985'
                        }
                    }
                },
                toolbox: {
                    feature: {
                        saveAsImage: {}
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                }
            };
            // ES6展开运算符 ...arr ...obj
            // var option = {grid:{bottom: "3%",bottom: "3%"...},legend: {data: Array(5)},series:[{…}, {…}, {…}, {…}, {…}]
            //              title: {text: "堆叠区域图"},toolbox: {feature: {…}},tooltip: {trigger: "axis", axisPointer: {…}},xAxis: [{…}],yAxis: [{…}]}
            var option = { ...option1,...option2}
            console.log(option)
            //使用配置项和现实图表
            myChart.setOption(option);
        }

    }
}
</script>

<style>
#main {
    margin-top: 10px;
}
</style>
