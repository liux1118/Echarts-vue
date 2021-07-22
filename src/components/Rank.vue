<template>
  <div class="com-container">
    <div class="com-chart" ref="rank_ref"></div>
  </div>
</template>

<script>
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
    mounted() {
      this.initChart()
      this.getData()
      window.addEventListener('resize', this.screenAdapter)
      this.screenAdapter()
    },
    destroyed() {
      window.removeEventListener('resize', this.screenAdapter)
      clearInterval(this.timerId)
    },
    methods: {
      initChart() {
        this.chartInstane = this.$echarts.init(this.$refs.rank_ref, 'chalk')
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

      async getData() {
        // await this.$http.get()
        // 对allData进行赋值
        const {data: ret} = await this.$http.get('rank')
        this.allData = ret
        this.allData.sort((a, b) => b.value - a.value)
        console.log(ret);

        this.updataChart()
        this.startInterval()
      },

      updataChart() {
        // const colorArr = [
        //   ['#0ba82c', '#4ff778'],
        //   ['#2e72bf', '#23e5e5'],
        //   ['#5052ee', '#ab6ee5']
        // ]
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
                  // let targetColorArr = null
                  if (arg.value > 300) {
                    // targetColorArr = colorArr[0]
                    return new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                      {
                        offset: 0,
                        color: '#0ba82c'
                      },
                      {
                        offset: 1,
                        color: '#4ff778'
                      }
                    ])
                  } else if (arg.value > 200) {
                    // targetColorArr = colorArr[1]
                    return new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                      {
                        offset: 0,
                        color: '#2e72bf'
                      },
                      {
                        offset: 1,
                        color: '#23e5e5'
                      }
                    ])
                  } else {
                    // targetColorArr = colorArr[3]
                    return new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                      {
                        offset: 0,
                        color: '#5052ee'
                      },
                      {
                        offset: 1,
                        color: '#ab6ee5'
                      }
                    ])
                  }
                  // return new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  //   {
                  //     offset: 0,
                  //     color: targetColorArr[0]
                  //   },
                  //   {
                  //     offset: 1,
                  //     color: targetColorArr[1]
                  //   }
                  // ])
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
  }
</script>

<style lang="less" scoped>

</style>
