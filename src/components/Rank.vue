<template>
  <div class="com-container">
    <div class="com-chart" ref="rank_ref"></div>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  export default {
    name: 'Rank',
    data() {
      return {
        chartInstane: null,
        allData: null, //从服务器中获取所有数据
        startValue: 0, //区域缩放起点值
        endValue: 9,//区域缩放终点值
        timerId: null, //定时器标识
      }
    },
    created() {
      // 在组件创建完成之后 进行回调函数的注册
      this.$socket.registerCallBack('rankData', this.getData)
    },
    mounted() {
      this.initChart()
      // this.getData()
      this.$socket.send({
        action: 'getData',
        socketType: 'rankData',
        chartName: 'rank',
        value: ''
      })
      window.addEventListener('resize', this.screenAdapter)
      this.screenAdapter()
    },
    destroyed() {
      window.removeEventListener('resize', this.screenAdapter)
      clearInterval(this.timerId)
      // 在组件销毁的时候进行回调函数的取消
      this.$socket.unRegisterCallBack('rankData')
    },
    methods: {
      initChart() {
        this.chartInstane = this.$echarts.init(this.$refs.rank_ref, this.theme)
        const initOption = {
          title: {
            text: '▎ 地区销售排行',
            top: 20,
            left: 20,
          },
          grid: {
            top: '40%',
            right: '5%',
            buttom: '5%',
            left: '5%',
            containLabel: true,
          },
          tooltip: {
            show: true,
          },
          xAxis: {
            type: 'category',
          },
          yAxis: {
            type: 'value',
          },
          series: [
            {
              type: 'bar',
            }
          ]
        }
        this.chartInstane.setOption(initOption);
        this.chartInstane.on('mouseover', () => clearInterval(this.timerId))
        this.chartInstane.on('mouseout', () => this.startInterval())
      },

      getData(ret) {
        // await this.$http.get()
        // 对allData进行赋值
        // const {data: ret} = await this.$http.get('rank')
        this.allData = ret
        this.allData.sort((a, b) => b.value - a.value)
        // console.log(ret);

        this.updataChart()
        this.startInterval()
      },

      updataChart() {
        const colorArr = [
          ['#0ba82c', '#4ff778'],
          ['#2e72bf', '#23e5e5'],
          ['#5052ee', '#ab6ee5']
        ]
        // 处理数据
        // 所有省份所形成的数组
        const provinceArr = this.allData.map(item => item.name)
        // 所有省份对于的销售金额
        const valueArr = this.allData.map(item => item.value)

        const dataOption = {
          xAxis: {
            data: provinceArr,
          },
          // 区域缩放
          dataZoom: {
            show: false,
            startValue: this.startValue,
            endValue: this.endValue,
          },
          series: [
            {
              data: valueArr,
              itemStyle: {
                color: arg => {
                  // console.log(arg);
                  let targetColorArr = null
                  if (arg.value > 300) {
                    targetColorArr = colorArr[0]
                  } else if (arg.value > 200) {
                    targetColorArr = colorArr[1]
                  } else {
                    targetColorArr = colorArr[2]
                  }
                  return new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      offset: 0,
                      color: targetColorArr[0]
                    },
                    {
                      offset: 1,
                      color: targetColorArr[1]
                    }
                  ])
                }
              }
            }
          ]
        }
        this.chartInstane.setOption(dataOption)
      },

      screenAdapter() {
        const titleFontSize = this.$refs.rank_ref.offsetWidth /100 * 3.6
        const adapterOption = {
          title: {
            textStyle: {
              fontSize: titleFontSize,
            }
          },
          series: [
            {
              barWidth: titleFontSize,
              itemStyle: {
                barBorderRadius: [titleFontSize / 2, titleFontSize / 2, 0, 0]
              }
            }
          ]
        }
        this.chartInstane.setOption(adapterOption)
        this.chartInstane.resize()
      },

      startInterval() {
        if (this.timerId) {
          clearInterval(this.timerId)
        }
        this.timerId = setInterval(() => {
          this.startValue++;
          this.endValue++;
          if (this.endValue > this.allData.length - 1) {
            this.startValue = 0;
            this.endValue = 9;
          }
          this.updataChart()
        }, 2000)
      }
    },

    computed: {
      ...mapState(['theme'])
    },
    watch: {
      theme () {
        console.log('主题切换了')
        if (this.chartInstance) {
          this.chartInstance.dispose() // 销毁当前的图表
          this.initChart() // 重新以最新的主题名称初始化图表对象
          this.screenAdapter() // 完成屏幕的适配
          this.updateChart() // 更新图表的展示
        }
        // this.initChart() // 重新以最新的主题名称初始化图表对象
        // this.screenAdapter() // 完成屏幕的适配
        // if (this.updateChart) {
        //   this.updateChart() // 更新图表的展示
        // }
      }
    }
  }
</script>

<style lang="less" scoped>

</style>
