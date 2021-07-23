<!--商家销量统计的横向柱状图-->
<template>
  <div class="com-container">
    <!-- com-chart呈现图表容器 -->
    <div class="com-chart" ref="seller_ref">

    </div>
  </div>
</template>

<script>
  export default {
    name: 'Seller',
    data() {
      return {
        chartInstance: null,
        allData: null, //服务器返回的数据
        currentPage: 1, //当前显示的页数
        totalPage: 0, //一共有多少页
        timeId: null, //定时器的标识
      }
    },
    created() {
      // 在组件创建完成之后 进行回调函数的注册
      this.$socket.registerCallBack('sellerData', this.getData)
    },
    mounted() { // dom结构加载完成
      this.initChart(),
      // this.getData(),
      this.$socket.send({
        action: 'getData',
        socketType: 'sellerData',
        chartName: 'seller',
        value: ''
      })
      window.addEventListener('resize', this.screenAdapter),
      // 在页面加载完成后，主动进行屏幕适配
      this.screenAdapter()
    },
    destroyed() {
      // 销毁定时器
      clearInterval(this.timeId),
      // 在组件销毁时，监听取消
      window.removeEventListener('resize', this.screenAdapter)
      // 在组件销毁的时候进行回调函数的取消
      this.$socket.unRegisterCallBack('sellerData')
    },
    methods: {
      // 初始化echartsInstance对象
      initChart() {
        // 拿到 dom com-chart 元素
        this.chartInstance = this.$echarts.init(this.$refs.seller_ref, 'chalk')
        // 对图表初始化配置的控制
        const initOption = {
          title: {
            text: '▎商家销售量统计',
            left: 20,
            top: 20
          },
          grid: { //设置柱状图坐标系，各边的距离
            top: '20%',
            right: '6%',
            botton: '3%',
            left: '3%',
            containLabel: true, //设置 百分比的距离包含坐标系中的文字
          },
          xAxis: {
            type: 'value',
          },
          yAxis: {
            type: 'category',
            // data: sellerNames,
          },
          tooltip: { //提示框
            trigger: 'axis', //鼠标移入坐标轴时触发
            axisPointer: { //背景设置
              type: 'line',
              z: 0,
              lineStyle: {
                color: '#2d3443',
              }
            }
          },
          series: [
            {
              type: 'bar',
              // data: sellerValues,
              label: { //文字展示
                show: true,
                position: 'right',
                textStyle: {
                  color: 'white'
                }
              },
              itemStyle: {
                // 指明颜色渐变的方向
                // 指明不同百分比之下颜色的值
                // 线性渐变
                // color: new this.$echarts.graphic.LinearGradient(x1,y1,x2,y2)
                // 由左向右
                color: new this.$echarts.graphic.LinearGradient(0,0,1,0, [
                  { // 0% 时的颜色
                    offset: 0,
                    color: '#5052EE',
                  },
                  { //100%时的颜色
                    offset: 1,
                    color: '#AB6EE5'
                  },
                ])
              }
            }
          ]
        };
        this.chartInstance.setOption(initOption)
        // 对图表对象进行鼠标事件的监听
        this.chartInstance.on('mouseover', () => clearInterval(this.timeId))
        this.chartInstance.on('mouseout', () => this.startInterval())
      },
      // 获取服务器的数据
      getData(ret) {
        // http://127.0.0.1:8888/api/seller
        // ajax请求
        // const {data: ret} = await this.$http.get('seller');
        // console.log(ret);
        this.allData = ret;
        // 对数组进行排序 升序
        this.allData.sort((a, b) => a.value - b.value)
        // 每5个元素显示一页
        this.totalPage = this.allData.length % 5 === 0 ? this.allData.length / 5 : this.allData.length / 5 + 1;

        this.updataChart();
        // 启动定时器
        this.startInterval();
      },

      // 更新图表
      updataChart() {
        // .slice(start, end) 对数组元素进行截取
        const start = (this.currentPage - 1) * 5;
        const end = this.currentPage * 5;

        const showData = this.allData.slice(start, end)
        const sellerNames = showData.map((item) => item.name)
        const sellerValues = showData.map((item) => item.value)
        const dataOption = {
          yAxis: {
            data: sellerNames,
          },
          series: [
            {
              data: sellerValues,
            }
          ]
        }
        this.chartInstance.setOption(dataOption)
      },

      startInterval() {
        if (this.timeId) {
          clearInterval(this.timeId)
        }
        this.timeId = setInterval(() => { //定时器 3s
          this.currentPage++;
          if (this.currentPage > this.totalPage) {
            this.currentPage = 1;
          }
          this.updataChart()
        }, 3000)
      },

      // 当浏览器的大小发生变化时，调用方法进行屏幕适配
      screenAdapter() {
        // console.log(this.$refs.seller_ref.offsetWidth);
        const titleFontSize = this.$refs.seller_ref.offsetWidth /100 * 3.6;
        // 和分辨率大小相关的配置项
        const adapterOption = {
          title: {
            textStyle: {
              fontSize: titleFontSize,
            },
          },
          tooltip: { //提示框
            axisPointer: { //背景设置
              lineStyle: {
                width: titleFontSize,
              }
            }
          },
          series: [
            {
              barWidth: titleFontSize,
              itemStyle: {
                barBorderRadius:[0, titleFontSize / 2, titleFontSize / 2, 0], //圆角
              }
            }
          ]
        };
        this.chartInstance.setOption(adapterOption)
        // 手动调用图表对象的resize才能有效果
        this.chartInstance.resize()
      }
    },
  }
</script>

<style lang="less" scoped>

</style>
