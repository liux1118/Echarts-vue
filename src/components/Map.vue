<template>
  <div class="com-container" @dblclick="revertMap">
    <div class="com-chart" ref="map_ref"></div>
  </div>
</template>

<script>
  import axios from 'axios'
  import {getProvinceMapInfo} from '@/utils/map_utils'
  // import {getProvinceMapInfo} from 'utils/map_utils'

  export default {
    name: 'Map',
    data() {
      return {
        chartInstane: null,
        allData: null, //从服务器中获取所有数据
        mapData: {}, //所获取的省份的地图矢量数据
      }
    },
    created() {
      // 在组件创建完成之后 进行回调函数的注册
      this.$socket.registerCallBack('trendData', this.getData)
    },
    mounted() {
      this.initChart()
      this.getData()
      window.addEventListener('resize', this.screenAdapter)
      this.screenAdapter()
    },
    destroyed() {
      window.removeEventListener('resize', this.screenAdapter)
      // 在组件销毁的时候进行回调函数的取消
      this.$socket.unRegisterCallBack('trendData')
    },
    methods: {
      async initChart() {
        this.chartInstane = this.$echarts.init(this.$refs.map_ref, 'chalk')
        // 获取中国地图的矢量数据
        // http://127.0.0.1:8999/static/map/china.json
        // 由于现在获取的地图数据存在本地，不能使用$http
        const ret = await axios.get('http://localhost:8999/static/map/china.json')
        console.log(ret);
        this.$echarts.registerMap('china', ret.data)
        const initOption = {
          title: {
            text: '▎商家分布',
            left: 20,
            top: 20,
          },
          geo: {
            type: 'map',
            map: 'china',
            top: '5%',
            bottom: '5%',
            itemStyle: { //地图颜色
              areaColor: '#2e72bf',
              borderColor: '#333'
            }
          },
          legend: {
            left: '5%',
            bottom: '5%',
            orient: 'vertical', //让图例竖直显示
          }
        }
        this.chartInstane.setOption(initOption);

        // 点击事件的监听
        this.chartInstane.on('click', async arg => {
          // arg.name 得到所点击的省份，但这个是中文，需要转为拼音
          // console.log(arg);
          const provinceInfo =  getProvinceMapInfo(arg.name)
          console.log(provinceInfo);
          // 获取这个省份的地图矢量数据
          // 判断当前点击的这个省份的地图矢量数据是否存在
          if (!this.mapData[provinceInfo.key]) {
            const ret = await axios.get('http://localhost:8999' + provinceInfo.path)
            // 保存数据
            this.mapData[provinceInfo.key] = ret.data

            this.$echarts.registerMap(provinceInfo.key, ret.data)
          }

          const changeOption = {
            geo: {
              map: provinceInfo.key,
            }
          }

          this.chartInstane.setOption(changeOption)
        })

      },

      async getData() {
        // await this.$http.get()
        // 对allData进行赋值
        // 调用updataChart方法更新图表
        // 从后台读取数据
        const {data: ret} = await this.$http.get('map')
        this.allData = ret
        console.log(this.allData);
        this.updataChart()
      },

      updataChart() {
        // 处理图表需要的数据
        // 图例的数据
        const legendArr = this.allData.map(item => item.name)
        const seriesArr = this.allData.map(item => {
          // return的这个对象就代表的是一个类别下的所有散点数据
          // 如果想在地图中显示散点的数据，我们需要给散点的图表添加一个配置，coordinateSystem: geo
          return {
            type: 'effectScatter',
            rippleEffect: { //涟漪效果
              scale: 6,
              brushType: 'stroke', //空心涟漪效果
            },
            name: item.name,
            data: item.children,
            coordinateSystem: 'geo',
          }
        })

        const dataOption = {
          legend: {
            data: legendArr,
          },
          series: seriesArr,
        }
        this.chartInstane.setOption(dataOption)
      },

      screenAdapter() {
        const titleFontSize = this.$refs.map_ref.offsetWidth / 100 * 3.6;
        const adapterOption = {
          title: {
            textStyle: {
              fontSize: titleFontSize,
            }
          },
          legend: { //设置图表自适应
            itemWidth: titleFontSize,
            itemHeight: titleFontSize / 2,
            itemGap: titleFontSize / 2, //间隔
            textStyle: {
              fontSize: titleFontSize / 2,
            }
          }
        }
        this.chartInstane.setOption(adapterOption)
        this.chartInstane.resize()
      },
      // 双击返回中国地图
      revertMap() {
        const revertOption = {
          geo: {
            map: 'china',
          }
        }
        this.chartInstane.setOption(revertOption)
      }
    },
  }
</script>

<style lang="less" scoped>

</style>

