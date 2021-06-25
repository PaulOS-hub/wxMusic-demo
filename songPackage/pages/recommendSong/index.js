// pages/recommendSong/index.js
import request from '../../../utils/request'
import pubsub from 'pubsub-js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    day: "",
    month: "",
    dailyList: [],
    currentSongIndex: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.queryCookie()
    pubsub.subscribe("switchSong", (msg, data) => {
      let { id } = data // 当前歌ID
      let { currentSongIndex, dailyList } = this.data
      if (data.type === 'next') {
        if (currentSongIndex === dailyList.length - 1){
          currentSongIndex = 0
        }else{
          currentSongIndex += 1
        }
        
      } else {
        if (currentSongIndex === 0) {
          currentSongIndex = dailyList.length - 1
        } else {
          currentSongIndex -= 1
        }
      }
      this.setData({
        currentSongIndex
      })
      const changedMusicId = dailyList[currentSongIndex].id
      pubsub.publish("switchMusicID", changedMusicId) // 传递下一首上一首ID
    })
  },

  initDate() {
    this.setData({
      day: new Date().getDate(),
      month: new Date().getMonth() + 1
    })
  },

  //是否登录
  queryCookie() {

    if (!wx.getStorageSync('cookies')) {
      wx.showToast({
        title: '请先登录',
        icon: "none",
        success: () => {
          // 跳到登录此时是必须要无法回退的页面，所以用relaunch
          wx.reLaunch({
            url: '/pages/login/login',
          })
        }
      })
    } else {
      // 已登录
      this.initDate()
      this.getList()
    }

  },

  async getList() {
    let { data } = await request("/recommend/songs", {})
    console.log(data)
    this.setData({
      dailyList: data.dailySongs
    })
  },

  toSongDetail(event) {
    // 路由传参query类型的传参，有长度限制，长度过长会自动被截取
    this.setData({
      currentSongIndex: event.currentTarget.dataset.suoyin
    })
    wx.navigateTo({
      url: `/songPackage/pages/songDetail/index?id=${event.currentTarget.dataset.detail.id}`
      // success: function (res) {
      //   // 通过eventChannel向被打开页面传送数据
      //   res.eventChannel.emit('acceptDataFromOpenerPage', { data: obj })
      // }
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