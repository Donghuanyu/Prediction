// pages/showMessage/showMessage.js
const URL = getApp().globalData.URL;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userId: "",
    result: null
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var userId = getApp().globalData.userInfo.id
    this.getMessageList(userId)
    this.setData({
      userId: userId
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
   * 获取消息列表
   */
  getMessageList: function (userId) {
    wx.showLoading({
      title: '请稍后...',
    })
    wx.request({
      url: URL.getMessageList(),
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      data: {
        userId: userId
      },
      success: res => {
        wx.hideLoading()
        console.log(res)
        if (res.data.code != '200') {
          this.turnToIndex()
          return
        }
        this.setData({
          result: res.data.data
        })
      },
      fail: error => {
        wx.hideLoading()
        this.turnToIndex()
      }
    })
  },

  /**
   * 跳转到首页
   */
  turnToIndex: function () {
    wx.showModal({
      title: '提示',
      content: '抱歉，出现了一些错误，您暂时无法查看消息列表',
      showCancel: false,
      confirmText: '知道了',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.redirectTo({
            url: '../index/index',
          })
        }
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  }
})