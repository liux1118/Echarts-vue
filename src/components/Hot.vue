<template>
  <div class="com-container">
    <div class="com-chart" ref="hot_ref"></div>
    <span class="iconfont arr-left" @click="toLeft" :style="conStyle">&#xe6ef;</span>
    <span class="iconfont arr-right" @click="toRight" :style="conStyle">&#xe6ed;</span>
    <span class="cat-name" :style="conStyle">{{catName}}</span>
  </div>
</template>

<script>
  export default {
    name: 'Hot',
    data() {
      return {
        chartInstane: null,
        allData: null, //从服务器中获取所有数据
        currentIndex: 0, //当前所展示的一级分类数据
        titleFontSize: 0,
      }
    },
    computed: {
      catName() {
        if (!this.allData) {
          return ''
        } else {
          return this.allData[this.currentIndex].name
        }
      },
      conStyle() {
        return {
          fontSize: this.titleFontSize + 'px'
        }
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
        this.chartInstane = this.$echarts.init(this.$refs.hot_ref, 'chalk')
        const initOption = {
          title: {
            text: '▎ 热销商品销售金额占比统计',
            top: 20,
            left: 20,
          },
          legend: {
            top: '15%',
            icon: 'circle',
          },
          tooltip: {
            show: true,
            formatter: arg => {
              const thirdCategory = arg.data.children;
              // 计算出所以三级分类的数值总和
              let total = 0
              thirdCategory.forEach(item => total += item.value)
              let retStr = ''
              thirdCategory.forEach(item => {
                retStr += `
                  ${item.name}:${parseInt(item.value / total * 100) + '%'}
                  <br/>
                `
              })
              return retStr
            }
          },
          series: [
            {
              type: 'pie',
              label: {
                show: false,
              },
              emphasis: { //处于高亮时的样式
                label: {
                  show: true,
                },
                labelLine: {
                  show: false,
                }
              }
            }
          ]
        }
        this.chartInstane.setOption(initOption);
      },

      async getData() {
        // await this.$http.get()
        // 对allData进行赋值
        const {data: ret} = await this.$http.get('hotproduct')
        this.allData = ret
        console.log(this.allData);

        this.updataChart()
      },

      updataChart() {
        // 处理数据
        const legendData = this.allData[this.currentIndex].children.map(item => item.name)
        const seriesData = this.allData[this.currentIndex].children.map(item => {
          return {
            name: item.name,
            value: item.value,
            children: item.children,
          }
        })
        const dataOption = {
          legend: {
            data: legendData,
          },
          series:[
            {
              data: seriesData,
            }
          ]
        }
        this.chartInstane.setOption(dataOption)
      },

      screenAdapter() {
        this.titleFontSize = this.$refs.hot_ref.offsetWidth / 100 * 3.6
        const adapterOption = {
          title: {
            textStyle: {
              fontSize: this.titleFontSize
            }
          },
          legend: {
            itemWidth: this.titleFontSize / 2,
            itemHeight: this.titleFontSize / 2,
            itemGap: this.titleFontSize / 2,
            textStyle: {
              fontSize: this.titleFontSize / 2,
            },
          },
          series: [
            {
              radius: this.titleFontSize * 4.5,
              center: ['50%', '60%'],
            }
          ]
        }
        this.chartInstane.setOption(adapterOption)
        this.chartInstane.resize()
      },

      toLeft() {
        this.currentIndex--;
        if (this.currentIndex < 0) {
          this.currentIndex = this.allData.length - 1;
        }
        this.updataChart();
      },
      toRight() {
        this.currentIndex++;
        if (this.currentIndex > this.allData.length - 1) {
          this.currentIndex = 0;
        }
        this.updataChart();
      }
    },
  }
</script>

<style lang="less" scoped>
  .arr-left, .arr-right {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    color: #fff;
  }
  .arr-left {
    left: 10%;
  }
  .arr-right {
    right: 10%;
  }
  .cat-name {
    position: absolute;
    left: 80%;
    bottom: 20px;
    color: #fff;
  }
</style>
