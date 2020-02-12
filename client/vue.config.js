module.exports = {
  devServer: {
    public: process.env.VUE_APP_CLIENT_URL,
    disableHostCheck: true
  },
  "transpileDependencies": [
    "vuetify"
  ]
}
