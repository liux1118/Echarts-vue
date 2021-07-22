module.exports = {
  // 关闭esline
  lintOnSave: false,
  devServer: {
    port: 8999, //端口号的配置
    // open: true, //自动打开浏览器
  },
  configureWebpack: {
    resolve: {
      alias: {
        // '@': 'src' 内部已经配置
        'assets': '@/assets',
        'common': '@/common',
        'components': '@/components',
        'network': '@/network',
        'views': '@/views',
        'utils': '@/utils',
      }
    }
  }
}
