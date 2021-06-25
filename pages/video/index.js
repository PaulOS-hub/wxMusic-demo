// pages/video/index.js
import request from "../../utils/request"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoList: [],
    navId: "",
    list: [], // 视频列表
    hasList: false,
    videoId: "",
    istriggered: false,
    videoUpdateTime: [] // 记录播放位置
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getList()
  },
  // tab scroll data
  async getList() {
    let { data } = await request("/video/group/list", {})
    this.setData({
      videoList: data.slice(0, 14),
      navId: data[0].id
    })
    // 获取视频
    this.getVideoList(this.data.navId)
  },

  changNav(event) {
    let navId = event.currentTarget.id
    this.setData({
      navId,
      list: []
    })
    wx.showLoading({
      title: '正在加载中...',
    })
    this.getVideoList(navId)
  },

  // 更多视频video list
  async getVideoList(navId) {
    if (!navId) return
    let videoListData = await request("/video/group", { id: navId })
    this.setData({
      list: videoListData.datas.map((item, index) => {
        item.id = index++
        return item
      })
    })
    setTimeout(() => {
      this.setData({
        hasList: true,
      })
      wx.hideLoading({
        complete: (res) => {
          setTimeout(() => {
            this.setData({
              istriggered: false
            })
          }, 1000);
        },
      })
    });

  },
  handlePlay(event) {
    let vid = event.currentTarget.id
    // 确认当前播放的视频和点击播放的视频，不是同一个视频。
    // 实例挂到this上，第一次是不存在的，undefined，然后进行赋值，再次进入时，这个值是上一个的值，然后再进行第二次赋值
    // this.vid !== vid && this.videoContext && this.videoContext.stop()
    // this.vid = vid
    this.setData({
      videoId: vid
    })
    console.log(123)
    this.videoContext = wx.createVideoContext(vid)
    let videoItem = this.data.videoUpdateTime.find(item => item.vid === vid)
    if (videoItem) {   //记住上一次播放的位置
      this.videoContext.seek(videoItem.currentTime)
    } else {
      this.videoContext.play()  //转换video标签的时候能直接播放
    }
  },

  handleUpdateTime(event) {
    let { videoUpdateTime } = this.data
    let obj = {
      vid: event.currentTarget.id, // 视频id
      currentTime: event.detail.currentTime // 当前视频播放了几秒
    }
    let videItem = videoUpdateTime.find(item => item.vid === obj.vid)
    if (videItem) {
      // 如果记录过播放，把time更新
      videItem.currentTime = event.detail.currentTime
    } else {
      // 没播放过，则推入新数据
      videoUpdateTime.push(obj)
    }
    this.setData({
      videoUpdateTime
    })


  },
  // 视频播放结束后，移除这个播放视频的对象
  handleEnded(event) {
    let { videoUpdateTime } = this.data
    let vid = event.currentTarget.id
    videoUpdateTime.splice(
      videoUpdateTime.findIndex(item => item.vid === vid), 1
    )
    this.setData({
      videoUpdateTime
    })
  },

  // 下拉刷新
  bindrefresherrefresh() {
    this.getVideoList(this.data.navId)
  },

  // 上拉加载
  bindscrolltolower() {
    console.log(123)
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
   * 页面相关事件处理函数--监听用户下拉动作, 需要在app.json里配置
   */
  onPullDownRefresh: function () {
    console.log("下拉")
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log("上拉触底")

  },
  toSearch(){
    wx.navigateTo({
      url: '/pages/search/index',
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function ({ from }) {
    // from 是来自button转发还是menu转发
    // 自定义转发内容
    // return {
    //   title: "123",
    //   page: "/pages/video/index",
    //   imageUrl: "/static"
    // }
  }
})