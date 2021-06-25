// pages/search/index.js
import request from '../../utils/request'
import '../../utils/lodash'
import _ from 'lodash'
let isSend = false
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showKeyword: "搜索更多",
    hotList: [],
    searchVal: "",
    vagueList: [],
    historyList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initSearchInputKeyword()
    this.getHotlist()

    if (wx.getStorageSync('historyData')) {
      this.setData({
        historyList: wx.getStorageSync('historyData')
      })
    }
  },

  // 清空历史记录
  deleteHistory() {
    let that = this
    wx.showModal({
      title: '提示',
      content: '确定移除所有历史记录吗？',
      success(res) {
        if (res.confirm) {
          that.setData({
            historyList: []
          })
          wx.removeStorageSync('historyData')
        } else if (res.cancel) {
        }
      }
    })
  },

  // 默认关键字
  async initSearchInputKeyword() {
    const { data } = await request("/search/default", {})
    this.setData({
      showKeyword: data.showKeyword
    })
  },
  // 获取热榜列表
  async getHotlist() {
    let { data } = await request("/search/hot/detail", {})
    this.setData({
      hotList: data.map((item, index) => {
        item.id = index++
        return item
      })
    })
  },

  clcTrim(str) {
    return str.replace(/(^\s*)|(\s*$)/g, "");
  },
  // 清空
  clearAll() {
    this.setData({
      searchVal: "",
      vagueList: []
    })
  },
  // 表单内容回调
  handleInput(e) {
    this.setData({
      searchVal: e.detail.value
    })
    // 有keywords才请求接口
    if (this.clcTrim(this.data.searchVal)) {
      // 节流
      if (isSend) return
      isSend = true
      this.vagueSearch(this.clcTrim(e.detail.value))
      setTimeout(() => {
        isSend = false
      }, 300);
    }
  },

  // 模糊查询
  async vagueSearch(keywords, limit = 10) {
    let { result } = await request("/search", {
      keywords,
      limit,
    })
    let { historyList } = this.data

    if (historyList.length >= 10) historyList.pop()
    historyList.unshift(keywords)
    this.setData({
      vagueList: result.songs ? result.songs : [],
      historyList
    })
    wx.setStorageSync('historyData', Array.from(new Set(historyList)))
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