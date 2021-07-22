<!--
  针对于 /sellerpaget这条路径而显示出来的
  在这个组件中，通过子组件注册的方式，要显示出Selle.vue这个组件
-->
<template>
  <div class="com-page">
    <seller></seller>
  </div>
</template>

<script>
  import Seller from 'components/Seller.vue'

  export default {
    name: 'SellerPage',
    components: {
        Seller,
    },
  }
</script>

<style lang="less" scoped>

</style>
