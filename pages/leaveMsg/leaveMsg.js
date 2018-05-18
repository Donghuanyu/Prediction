// pages/leaveMsg/leaveMsg.js
const URL = getApp().globalData.URL;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //留言目标用户
    targetUser: null,
    user: getApp().globalData.userInfo
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options != null && options.user != null) {
      this.setData({
        targetUser: JSON.parse(options.user),
        user: getApp().globalData.userInfo
      })
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
  
  },

  /**
   * 提交留言
   */
  submit: function (e) {
    var that = this
    var msg = e.detail.value.message
    console.log("formId:" + e.detail.formId)
    if (msg == null || '' == msg) {
      wx.showToast({
        title: '请输入给对方的留言',
        mask: true,
        icon: 'none',
        duration: 3000
      })
      return
    }
    wx.showLoading({
      title: '请稍后...',
      mask: true
    })
    var message = {
      toUserId: this.data.targetUser.id,
      fromUserId: this.data.user.id,
      content: msg
    }
    console.log(message)
    wx.request({
      url: URL.leaveMessage(),
      method: 'POST',
      header: {
        "Content-Type": "application/json"
      },
      data: {
        message: message,
        formId: e.detail.formId
      },
      success: res => {
        wx.hideLoading()
        if ('200' != res.data.code) {
          wx.showModal({
            title: '提示',
            content: '出现了一些错误：' + res.data.msg,
            showCancel: false,
            confirmText: '我知道了',
            success: function (res) { },
            fail: function (res) { },
            complete: function (res) { },
          })
          return
        }
        wx.showModal({
          title: '提示',
          content: '留言成功',
          showCancel: false,
          confirmText: '好的',
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定')
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
            wx.navigateBack({
              delta: 1
            })
          },
          fail: function (res) { },
          complete: function (res) { },
        })
      },
      fail: err => {
        wx.hideLoading()
        wx.showModal({
          title: '提示',
          content: '抱歉，出现了一些错误，我们会尽快修复',
          showCancel: false,
          confirmText: '好的',
          success: function (res) { },
          fail: function (res) { },
          complete: function (res) { },
        })
        return
      }

    })
  }
})