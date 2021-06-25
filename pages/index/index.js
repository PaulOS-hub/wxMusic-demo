// index.js
// 获取应用实例
const app = getApp()
import request from "../../utils/request"
// console.log(app) 整个小程序实例 this
Page({
  data: {
    bannerList: [],
    hasBanner: false,
    recommendList: [],
    rankList: [],
    hasrankList: false
  },
  // 事件处理函数

  async onLoad() {
    let { banners } = await request('/banner', { type: 2 })
    let { result } = await request('/personalized', { limit: 10 })
    let resultArr = []
    let index = 0
    while (index < 5) {
      let data = await request('/top/list', { idx: index++ }) // idx排行类别，0-20
      let arr = { name: data.playlist.name, tracks: data.playlist.tracks.slice(0, 3) }
      resultArr.push(arr)
      this.setData({
        rankList: resultArr,
        hasrankList: true
      })
    }
    this.setData({
      bannerList: banners,
      hasBanner: true,
      recommendList: result
    })
  },

  toRecommend() {
    if (!wx.getStorageSync('userInfo')) {
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      })
      wx.reLaunch({
        url: '/pages/login/login',
      })
    } else {
      wx.navigateTo({
        url: '/songPackage/pages/recommendSong/index',
      })
    }

  },
  onShow() {
  },
  changeSwiper(e) {
    // console.log(e)
  },
  // 获取openID
  // getOpid() {
  //   wx.login({
  //     success: async res => {
  //       let code = res.code
  //       let data = await request("/getOpenId", { code })
  //     }
  //   })
  // }
})
