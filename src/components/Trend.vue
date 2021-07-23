<template>
  <div class="com-container">
    <div class="title" :style="comStyle">
      <span>{{'▎ ' + showTitle}}</span>
      <span class="iconfont title-icon"
        @click="showChoice = !showChoice"
        :style="comStyle">&#xe6eb;</span>
      <div class="select-con" v-show="showChoice" :style="marginStyle">
        <div class="select-item"
          v-for="item in selectTypes"
          :key="item.key"
          @click="handleSelect(item.key)">
          {{item.text}}
        </div>
      </div>
    </div>
    <div class="com-chart" ref="trend_ref"></div>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import { getThemeValue } from 'utils/theme_utils'

  export default {
    name: 'Trend',
    data() {
      return {
        chartInstane: null,
        allData: null, //从服务器中获取所有数据
        showChoice: false, //是否隐藏可选标题
        choiceType: 'map',//显示的数据类型
        titleFontSize: 0, //指明标题字体大小
      }
    },
    created() {
      // 在组件创建完成之后 进行回调函数的注册
      this.$socket.registerCallBack('trendData', this.getData)
    },
    mounted() {
      this.initChart()
      // this.getData()
      // 发送数据给服务器，告诉服务器，我现在需要数据
      this.$socket.send({
        action: 'getData',
        socketType: 'trendData',
        chartName: 'trend',
        value: ''
      })
      window.addEventListener('resize', this.screenAdapter)
      this.screenAdapter()
    },
    destroyed() {
      window.removeEventListener('resize', this.screenAdapter)
      // 在组件销毁的时候进行回调函数的取消
      this.$socket.unRegisterCallBack('trendData')
    },
    computed: {
      selectTypes() {
        if (!this.allData) {
          return []
        } else {
          return this.allData.type.filter(item => item.key !== this.choiceType)
        }
      },
      showTitle() {
        if (!this.allData) {
          return ''
        } else {
          return this.allData[this.choiceType].title
        }
      },
      // 设置标题的样式
      comStyle() {
        return {
          fontSize: this.titleFontSize + 'px',
          color: getThemeValue(this.theme).titleColor
        }
      },
      marginStyle() {
        return {
          marginLeft: this.titleFontSize + 'px'
        }
      },
      ...mapState(['theme'])
    },
    methods: {
      initChart() {
        this.chartInstane = this.$echarts.init(this.$refs.trend_ref, this.theme)
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
            left: 20,
            top: '15%',
            icon: 'circle',
          }
        }
        this.chartInstane.setOption(initOption);
      },
      // ret 就是服务端发送给客户端的图表的数据
      getData(ret) {
        // await this.$http.get()
        // 对allData进行赋值
        // const {data: ret} = await this.$http.get('trend')
        // console.log(ret);
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
        const valueArr = this.allData[this.choiceType].data;
        const seriesArr = valueArr.map((item,index) => {
          return {
            name: item.name,
            type: 'line',
            data: item.data,
            stack: this.choiceType, //设置堆叠图呈现
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
        this.titleFontSize = this.$refs.trend_ref.offsetWidth / 100 * 3.6

        const adapterOption = {
          legend: {
            itemWidth: this.titleFontSize,
            itemHeight: this.titleFontSize,
            itemGap: this.titleFontSize,
            textStyle: {
              fontSize: this.titleFontSize / 2,
            }
          }
        }
        this.chartInstane.setOption(adapterOption)
        this.chartInstane.resize()
      },

      handleSelect(currentType) {
        this.choiceType = currentType
        this.updataChart()
        this.showChoice = false
      }
    },

    watch: {
      theme() {
        console.log('主题切换了')
        if (this.chartInstance) {
          this.chartInstance.dispose() // 销毁当前的图表
        }
        this.initChart() // 重新以最新的主题名称初始化图表对象
        this.screenAdapter() // 完成屏幕的适配
        if (this.updateChart) {
          this.updateChart() // 更新图表的展示

        }
      }
    }
  }
</script>

<style lang="less" scoped>
  .title {
    position: absolute;
    left: 20px;
    top: 20px;
    z-index: 10;
    color: #fff;
  }
  .title-icon {
    margin-left: 10px;
    cursor: pointer; //更改鼠标样式为小手
  }
  .select-con {
    background-color: #222733;
  }
</style>
