<!--商家销量统计的横向柱状图-->
<template>
  <div class="com-container">
    <!-- com-chart呈现图表容器 -->
    <div class="com-chart" ref="seller_ref"></div>
  </div>
</template>

<script>
  export default {
    name: 'Seller',
    data() {
      return {
        chartInstance: null,
      }
    },
    mounted() {
      this.initChart(),
      this.getData()
    },
    methods: {
      // 初始化echartsInstance对象
      initChart() {
        // 拿到 dom com-chart 元素
        this.chartInstance = this.$echarts.init(this.$refs.seller_ref)
      },
      // 获取服务器的数据
      async getData() {
        // http://127.0.0.1:8888/api/seller
        // ajax请求
        // debugger
        const ret = await this.$http.get('seller')

        console.log(ret);
        this.updataChart()
          try {
              await this.$http.get()
              console.log(1);
        } catch{console.log("err")}
        },
      // 更新图表
      updataChart() {

      },
    },
  }
</script>

<style lang="less" scoped>

</style>
