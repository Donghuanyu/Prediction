// pages/Authorized/Authorized.js
const URL = require('../../utils/url.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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
   * 退出
   */
  quit: function () {
    wx.navigateBack({
      delta: 1,
    })
  },

  /**
   * 获取用户信息
   */
  onGotUserInfo: function (result) {
    console.log(result.detail.userInfo)
    getApp().globalData.userInfo = result.detail.userInfo
    var that = this
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        that.createUser(res.code)
      }
    })
  },

  /**
   * 将微信登录的code发送到后台处理
   */
  createUser: function (code) {
    console.log(code)
    wx.request({
      method: 'POST',
      url: URL.createUser(),
      data: {
        code: code,
        user: getApp().globalData.userInfo
      },
      header: {
        "Content-Type": "application/json"
      },
      success: res => {
        console.log(res);
        if ('200' == res.data.code) {
          //成功
          getApp().globalData.userInfo['id'] = res.data.data.id
          getApp().globalData.userInfo['openId'] = res.data.data.openId
        }
        console.log(getApp().globalData.userInfo);
      }
    })
  }
})