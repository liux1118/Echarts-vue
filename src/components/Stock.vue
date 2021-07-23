<template>
  <div class="com-container">
    <div class="com-chart" ref="stock_ref"></div>
  </div>
</template>

<script>
  export default {
    name: 'Stock',
    data() {
      return {
        chartInstane: null,
        allData: null, //从服务器中获取所有数据
        currentIndex: 0, //当前显示的数据页数
        timerId: null, //定时器标识
      }
    },
    created() {
      // 在组件创建完成之后 进行回调函数的注册
      this.$socket.registerCallBack('stockData', this.getData)
    },
    mounted() {
      this.initChart()
      // this.getData()
      this.$socket.send({
        action: 'getData',
        socketType: 'stockData',
        chartName: 'stock',
        value: ''
      })
      window.addEventListener('resize', this.screenAdapter)
      this.screenAdapter()
    },
    destroyed() {
      window.removeEventListener('resize', this.screenAdapter)
      clearInterval(this.timerId)
      // 在组件销毁的时候进行回调函数的取消
      this.$socket.unRegisterCallBack('stockData')
    },
    methods: {
      initChart() {
        this.chartInstane = this.$echarts.init(this.$refs.stock_ref, 'chalk')
        const initOption = {
          title: {
            text: '▎ 库存和销量分析',
            top: 20,
            left: 20,
          }
        }
        this.chartInstane.setOption(initOption);

        this.chartInstane.on('mouseover', () => clearInterval(this.timerId))
        this.chartInstane.on('mouseout', () => this.startInterval())
      },

      getData(ret) {
        // await this.$http.get()
        // 对allData进行赋值
        // const {data: ret} = await this.$http.get('stock')
        this.allData = ret
        // console.log(this.allData);

        this.updataChart()
        this.startInterval()
      },

      updataChart() {
        // 处理数据
        // 中心点坐标
        const centerArr = [
          ['18%', '40%'],
          ['50%', '40%'],
          ['82%', '40%'],
          ['34%', '75%'],
          ['66%', '75%'],
        ]
        // 销量圆环颜色
        const colorArr = [
          ['#4ff778', '#0ba82c'],
          ['#e5dd45', '#e8b11c'],
          ['#e8821c', '#e55445'],
          ['#5052ee', '#ab6ee5'],
          ['#23e5e5', '#2e72bf'],
        ]

        const start = this.currentIndex * 5
        const end = (this.currentIndex + 1) * 5
        const showData = this.allData.slice(start, end)

        const seriesArr = showData.map((item, index) => {
          return {
            type: 'pie',
            center: centerArr[index],
            hoverAnimation: false, //关闭鼠标移入饼图的动画
            labelLine: {
              show: false
            },
            label: {
              position: 'center',
              color: colorArr[index][0]
            },
            data: [
              { //销量
                name: item.name + '\n' + item.sales,
                value: item.sales,
                itemStyle: {
                  color: new this.$echarts.graphic.LinearGradient(0, 1, 0, 0, [
                    {
                      offset: 0,
                      color: colorArr[index][0]
                    },
                    {
                      offset: 1,
                      color: colorArr[index][1]
                    }
                  ])
                }
              },
              { //库存
                value: item.stock,
                itemStyle: {
                  color: '#333843'
                }
              }
            ],
          }
        })
        const dataOption = {
          series: seriesArr,
        }
        this.chartInstane.setOption(dataOption)
      },

      screenAdapter() {
        const titleFontSize = this.$refs.stock_ref.offsetWidth / 100 * 3.6
        const innerRadius = titleFontSize * 2
        const outterRadius = innerRadius * 1.125
        const adapterOption = {
          title: {
            textStyle: {
              fontSize: titleFontSize
            }
          },
          series: [
            {
              type: 'pie',
              radius: [innerRadius, outterRadius],
              label: {
                fontSize: titleFontSize / 2
              }
            },
            {
              type: 'pie',
              radius: [innerRadius, outterRadius],
              label: {
                fontSize: titleFontSize / 2
              }
            },
            {
              type: 'pie',
              radius: [innerRadius, outterRadius],
              label: {
                fontSize: titleFontSize / 2
              }
            },
            {
              type: 'pie',
              radius: [innerRadius, outterRadius],
              label: {
                fontSize: titleFontSize / 2
              }
            },
            {
              type: 'pie',
              radius: [innerRadius, outterRadius],
              label: {
                fontSize: titleFontSize / 2
              }
            },
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
          this.currentIndex++
          if (this.currentIndex > 1) {
            this.currentIndex = 0
          }

          this.updataChart() //更改完currentIndex后，需要重新更新数据
        }, 5000)
      }
    },
  }
</script>

<style lang="less" scoped>

</style>
