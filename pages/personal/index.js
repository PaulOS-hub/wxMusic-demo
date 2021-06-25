// pages/personal/index.js
let startY = 0 // 起始坐标
let moveY = 0 // 结束坐标
let moveDistance = 0 // 距离
import request from "../../utils/request"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    coverTransform: "translateY(200)",
    coveTransition: "1s",
    userInfo: {},
    recentPlayList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let data = wx.getStorageSync('userInfo')
    if (data) {
      this.setData({
        userInfo: data
      })
    }

    this.getRecentList()
  },

  async getRecentList() {
    let data = await request("/user/record", {
      uid: this.data.userInfo.userId,
      type: 0
    })
    this.setData({
      recentPlayList: data.allData.slice(0, 10).map((item, index) => {
        item.id = index++
        return item
      })
    })
  },

  handleTouchStart(event) {
    startY = event.touches[0].clientY
    this.setData({
      coveTransition: "0.5s"
    })
  },
  handleTouchMove(event) {
    moveY = event.touches[0].clientY
    moveDistance = moveY - startY
    if (moveDistance <= 0) {
      return
    }
    else if (moveDistance >= 80) {
      moveDistance = 80
    }
    this.setData({
      coverTransform: `translateY(${moveDistance}rpx)`
    })
  },
  handleTouchEnd() {
    moveDistance = 0
    this.setData({
      coverTransform: `translateY(${moveDistance}rpx)`,
      coveTransition: "1s"
    })
  },

  toLogin() {
    wx.navigateTo({
      url: '/pages/login/login',
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})