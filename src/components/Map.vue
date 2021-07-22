<template>
  <div class="com-container">
    <div class="com-chart" ref="map_ref"></div>
  </div>
</template>

<script>
  import axios from 'axios'
  // import map from '../../public/static/map/'
  export default {
    name: 'Map',
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
      async initChart() {
        this.chartInstane = this.$echarts.init(this.$refs.map_ref)
        // 获取中国地图的矢量数据
        // http://127.0.0.1:8999/static/map/china.json
        // 由于现在获取的地图数据存在本地，不能使用$http
        const ret = await axios.get('http://localhost:8999/static/map/china.json')
        console.log(ret);
        this.$echarts.registerMap('china', ret.data)
        const initOption = {
          geo: {
            type: 'map',
            map: 'china',
          }
        }
        this.chartInstane.setOption(initOption);
      },

      async getData() {
        // await this.$http.get()
        // 对allData进行赋值

        this.updataChart()
      },

      updataChart() {
        // 处理数据
        const dataOption = {

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

