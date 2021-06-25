// pages/songDetail/index.js
import moment from 'moment'
import request from '../../../utils/request'
import pubsub from 'pubsub-js'
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    musicId: "",
    isPlay: false,
    songDetail: {},
    musicUrl: "",
    curwidth: 0, // 滚动条长度
    currentTime: "00:00", // 实时时间
    durationTime: "00:00" // 总时长
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // const eventChannel = this.getOpenerEventChannel()
    // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
    // eventChannel.on('acceptDataFromOpenerPage', function (data) {
    //   console.log(JSON.parse(data))
    // })
    if (options.id) {
      this.queryIdDetailSongs(options.id)
      // if (app.globalData.musicPlayFlag) {
      //   this.setData({
      //     isPlay: true,
      //     musicId: options.id
      //   })
      //   this.musicControl(this.data.isPlay)
      // }
      // 刚进来时，播放
    }

    // 如果再次进来发现还是播放的那首歌，那就改变播放状态为true
    if (app.globalData.musicPlayFlag && app.globalData.musicID === options.id) {
      this.setData({
        isPlay: true
      })
    }
    // 通过系统控制播放音乐和暂停音乐，页面效果操作要匹配
    this.backgroundAudiManager = wx.getBackgroundAudioManager()
    this.backgroundAudiManager.onPlay(() => {
      this.trggleIsPlay(true)
      app.globalData.musicID = options.id
    })

    // 监听暂停
    this.backgroundAudiManager.onPause(() => {
      this.trggleIsPlay(false)
    })

    // 监听音乐停止
    this.backgroundAudiManager.onStop(() => {
      this.trggleIsPlay(false)
    })

    // 监听背景音频播放进度更新事件
    this.backgroundAudiManager.onTimeUpdate(() => {
      this.setData({
        // moment写入参数为ms
        currentTime: moment(this.backgroundAudiManager.currentTime * 1000).format("mm:ss"),
        curwidth: (this.backgroundAudiManager.currentTime / this.backgroundAudiManager.duration) * 450
      })
    })

    //监听背景音频自然播放结束事件 

    this.backgroundAudiManager.onEnded(() => {
      // 自动切换下一首歌，自动播放
      pubsub.publish("switchSong", {
        type: 'next',
        id: this.data.musicId
      })
      this.setData({
        currentTime: '00:00',
        curwidth: 0, // 还原进度条
      })
    })

    // 
    pubsub.subscribe("switchMusicID", (msg, data) => {
      this.queryIdDetailSongs(data)
      this.setData({
        isPlay: true,
        musicId: data,
        musicUrl: ""
      })
      this.musicControl(this.data.isPlay)

    })
  },

  trggleIsPlay(isPlay) {
    this.setData({

    })
    app.globalData.musicPlayFlag = isPlay
  },
  // 歌曲细节
  async queryIdDetailSongs(ids) {
    let data = await request("/song/detail", {
      ids
    })
    if (data.code !== 200) {
      return wx.showToast({
        title: '暂无歌曲信息',
        icon: 'none'
      })
    }
    this.setData({
      songDetail: data.songs[0],
      musicId: ids,
      durationTime: moment(data.songs[0].dt).format("mm:ss") // 格式化音乐总时长
    })
    // 动态修改窗口标题
    wx.setNavigationBarTitle({
      title: data.songs[0].name
    })
  },

  // 点击播放
  handleMusicPlay() {
    this.setData({
      isPlay: !this.data.isPlay
    })
    this.musicControl(this.data.isPlay)
  },

  // 切换上一首，下一首
  handleSwitch(e) {
    pubsub.publish("switchSong", {
      type: e.currentTarget.id,
      id: this.data.musicId
    })
  },

  // 控制音乐播放暂停
  async musicControl(isPlay, musicUrl = this.data.musicUrl) {
    if (isPlay) {
      // 播放音乐
      if (!this.data.musicUrl) {
        let { data } = await request("/song/url", {
          id: this.data.musicId
        })
        musicUrl = data[0].url
        this.setData({
          musicUrl
        })
      }
      this.backgroundAudiManager.src = musicUrl
      this.backgroundAudiManager.title = this.data.songDetail.name
    } else {
      this.backgroundAudiManager.pause()
    }
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
    pubsub.unsubscribe("switchMusicID")
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