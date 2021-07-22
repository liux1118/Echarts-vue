<template>
  <div class="com-container">
    <div class="com-chart" ref="trend_ref"></div>
  </div>
</template>

<script>
  export default {
    name: 'Trend',
    data() {
      return {
        chartInstane: null,
        allData: null, //从服务器中获取所有数据
      }
    },
    mounted() {
      this.initChart()
      this.getData()
      window.addEventListener('resize', this.screenAdapter)
      this.screenAdapter()
    },
    destroyed() {
      window.removeEventListener('resize', this.screenAdapter)
    },
    methods: {
      initChart() {
        this.chartInstane = this.$echarts.init(this.$refs.trend_ref, 'chalk')
        const initOption = {
          xAxis: {
            type: 'category',
            boundaryGap: false, //设置紧挨边缘
          },
          yAxis: {
            type: 'value',
          },
          grid: {
            top: '35%',
            right: '4%',
            bottom: '1%',
            left: "3%",
            containLabel: true,
          },
          tooltip: { //提示框
            trigger: 'axis',
          },
          legend: { //图例
            left: 30,
            top: '15%',
            icon: 'circle',
          }
        }
        this.chartInstane.setOption(initOption);
      },

      async getData() {
        // await this.$http.get()
        // 对allData进行赋值
        const {data: ret} = await this.$http.get('trend')
        console.log(ret);
        this.allData = ret

        this.updataChart()
      },

      updataChart() {
        // 处理数据
        const colorArr1 = [
          'rgba(11, 168, 44, 0.5)',
          'rgba(44, 110, 255, 0.5)',
          'rgba(22, 242, 217, 0.5)',
          'rgba(254, 33, 30, 0.5)',
          'rgba(250, 105, 0, 0.5)'
        ]
      // 全透明的颜色值
      const colorArr2 = [
        'rgba(11, 168, 44, 0)',
        'rgba(44, 110, 255, 0)',
        'rgba(22, 242, 217, 0)',
        'rgba(254, 33, 30, 0)',
        'rgba(250, 105, 0, 0)'
      ]
        // x轴数据（类目轴）
        const timeArr = this.allData.common.month;
        // y轴数据 series下的数据
        const valueArr = this.allData.map.data;
        const seriesArr = valueArr.map((item,index) => {
          return {
            name: item.name,
            type: 'line',
            data: item.data,
            stack: 'map', //设置堆叠图呈现
            areaStyle: { //设置填充
              color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: colorArr1[index]
                },
                {
                  offset: 1,
                  color: colorArr2[index]
                },
              ])
            },
          }
        })
        // 图例数据
        const legendArr = valueArr.map(item => item.name)

        const dataOption = {
          xAxis: {
            data: timeArr,
          },
          legend: { //图例
            data: legendArr,
          },
          series: seriesArr,

        }
        this.chartInstane.setOption(dataOption)
      },

      screenAdapter() {
        const adapterOption = {

        }
        this.chartInstane.setOption(adapterOption)
        this.chartInstane.resize()
      }
    },
  }
</script>

<style lang="less" scoped>

</style>
