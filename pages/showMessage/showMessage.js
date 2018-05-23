// pages/showMessage/showMessage.js
const URL = getApp().globalData.URL;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userId: "",
    result: new Array(),       //我收到的留言
    page: 1,             //我收到的留言页码
    isFresh: false      //是否再刷新
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var user = null;
    user = getApp().globalData.userInfo
    if (user != null && user.id != null && '' != user.id) {
      this.data.userId = user.id
      this.setData({
        userId: user.id
      })
      this.getMessageList()
      return
    }
    user = wx.getStorageSync("userInfo")
    if (user != null && user.id != null && '' != user.id) {
      this.data.userId = user.id
      this.setData({
        userId: user.id
      })
      this.getMessageList()
      return
    }
    wx.showLoading({
      title: '请稍后...',
      mask: true,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
    wx.getUserInfo({
      withCredentials: false,
      lang: 'zh_CN',
      success: res => {
        getApp().globalData.userInfo = res.userInfo
        // 登录
        wx.login({
          success: loginRes => {
            // 发送 res.code 到后台换取 openId, sessionKey, unionId
            this.createUser(loginRes.code)
          }
        })
      },
      fail: function (res) { },
      complete: function (res) { },
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
   * 下拉刷新
   */
  onPullDownRefresh: function () {
    this.setData({
      page: 1,
      isFresh: true
    })
    wx.showNavigationBarLoading()
    this.getMessageList()
  },

  /**
   * 获取消息列表
   */
  getMessageList: function () {
    wx.showLoading({
      title: '请稍后...',
    })
    wx.request({
      url: URL.getMessagePageList(),
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      data: {
        userId: this.data.userId,
        page: this.data.page
      },
      success: res => {
        wx.hideLoading()
        console.log(res)
        if (res.data.code != '200') {
          this.turnToIndex()
          return
        }
        if (res.data.data.currentSize > 0) {
          if (this.data.page == 1) {
            //如果是刷新，就清空之前的数据
            this.data.result = new Array()
          }
          this.data.result = this.data.result.concat(res.data.data.responseForMessages)
          console.log(this.data.result)
          var allData = this.data.result
          this.setData({
            result: allData
          })
        }
      },
      fail: error => {
        wx.hideLoading()
        this.turnToIndex()
      },
      complete: obj => {
        if (this.data.isFresh) {
          wx.stopPullDownRefresh()
          wx.hideNavigationBarLoading()
        }
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
        wx.hideLoading()
        if ('200' == res.data.code) {
          //成功
          getApp().globalData.userInfo['id'] = res.data.data.id
          getApp().globalData.userInfo['openId'] = res.data.data.openId
          wx.setStorage({
            key: 'userInfo',
            data: getApp().globalData.userInfo,
          })
          this.data.userId = res.data.data.id
          this.getMessageList()
          console.log(getApp().globalData.userInfo);
        } else {
          this.turnToIndex()
        }
        
      },
      fail: error => {
        wx.hideLoading()
        this.turnToIndex()
      }
    })
  }
})