// pages/showMessage/showMessage.js
const URL = getApp().globalData.URL;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userId: "",
    result: new Array(),              //收件箱数据
    sendBoxResult: new Array(),       //发件箱数据
    page: 1,                          //收件箱页码
    pageSendBox: 1,                   //发件箱页码
    isFresh: false,                   //是否在刷新
    showEmptyView: false,             //是否显示空视图，用于没有数据时展示
    inBox: true,                      //是否是收件箱
    sendBox: false                    //是否是发件箱
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
    wx.showNavigationBarLoading()
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
    var pageName = 'page'
    if(this.data.inBox) {
      pageName = 'page'
    } else if (this.data.sendBox) {
      pageName = 'pageSendBox'
    }
    
    this.setData({
      [pageName]: 1,
      isFresh: true
    })
    wx.showNavigationBarLoading()
    this.getMessageList()
  },

  /**
   * 获取数据
   */
  getMessageList: function () {
    if (this.data.inBox) {
      this.getInBoxList()
      return
    }
    if (this.data.sendBox) {
      this.getSendBoxList()
      return
    }
  },

  /**
   * 获取收件箱消息列表
   */
  getInBoxList: function () {
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
        console.log(res)
        if (res.data.code != '200') {
          this.turnToIndex()
          return
        }
        //第一页就没有数据
        if (res.data.data.currentSize == 0 && this.data.page == 1) {
          this.setData({
            showEmptyView: true
          })
          return
        }
        //有数据
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
   * 获取发件箱消息列表
   */
  getSendBoxList: function () {
    wx.request({
      url: URL.getFromMessagePageList(),
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      data: {
        userId: this.data.userId,
        page: this.data.pageSendBox
      },
      success: res => {
        console.log(res)
        if (res.data.code != '200') {
          this.turnToIndex()
          return
        }
        //第一页就没有数据
        if (res.data.data.currentSize == 0 && this.data.pageSendBox == 1) {
          this.setData({
            showEmptyView: true
          })
          return
        }
        //有数据
        if (res.data.data.currentSize > 0) {
          if (this.data.page == 1) {
            //如果是刷新，就清空之前的数据
            this.data.sendBoxResult = new Array()
          }
          this.data.sendBoxResult = this.data.sendBoxResult.concat(res.data.data.responseForMessages)
          console.log(this.data.sendBoxResult)
          var allData = this.data.sendBoxResult
          this.setData({
            sendBoxResult: allData
          })
        }
      },
      fail: error => {
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
      success: res => {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.redirectTo({
            url: '../index/index',
          })
          this.setData({
            showEmptyView: true
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
  },

  /**
   * 切换收件箱，发件箱
   */
  selectBox: function (e) {

    if(e.currentTarget.dataset.box == 'in') {
      this.setData({
        inBox: true,
        sendBox: false
      })
      if (this.data.result == null || this.data.result.length == 0) {
        this.getInBoxList()
      }
    }

    if (e.currentTarget.dataset.box == 'send') {
      this.setData({
        inBox: false,
        sendBox: true
      })
      if (this.data.sendBoxResult == null || this.data.sendBoxResult.length == 0) {
        this.getSendBoxList()
      }
    }
  }
})