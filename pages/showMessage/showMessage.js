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
    sendBox: false,                   //是否是发件箱
    inBoxHasMore: false,
    sendBoxHasMore: false,
    isLodingMore: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    //判断本地用户是否存在
    var user = wx.getStorageSync('userInfo')
    if (user == null || user.id == null || "" == user.id) {
      this.setData({
        showEmptyView: true
      })
      wx.hideNavigationBarLoading()
      wx.navigateTo({
        url: '../authorized/authorized',
      })
      return
    }

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

    var user = null;
    user = getApp().globalData.userInfo
    if (user != null && user.id != null && '' != user.id) {
      this.data.userId = user.id
      this.setData({
        userId: user.id
      })
    }
  
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


    //判断本地用户是否存在
    if (this.data.user == null || this.data.user.id == null || "" == this.data.user.id) {
      var user = wx.getStorageSync("userInfo")
      wx.hideNavigationBarLoading()
      wx.hideLoading()
      if (user == null || user.id == null || "" == user.id) {
        this.setData({
          showEmptyView: true
        })
        wx.navigateTo({
          url: '../authorized/authorized',
        })
        return
      }else {
        this.data.user = user
        this.setData({
          user: user
        })
      }
      
    }



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
        if (res.data.data.sumPage == 0) {
          this.setData({
            showEmptyView: true,
            result: new Array()
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
          if (this.data.showEmptyView) {
            this.setData({
              showEmptyView: false
            })
          }
        }

        //如果当前页面已经是最后一页
        if (this.data.page == res.data.data.sumPage) {
          this.setData({
            inBoxHasMore: false
          })
        } else {
          this.setData({
            inBoxHasMore: true
          })
        }
      },
      fail: error => {
        this.turnToIndex()
      },
      complete: obj => {
        wx.hideLoading()
        if (this.data.isFresh) {
          wx.stopPullDownRefresh()
          wx.hideNavigationBarLoading()
        } else if (this.data.isLodingMore) {
          this.setData({
            isLodingMore: false
          })
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
        if (res.data.data.sumPage == 0) {
          this.setData({
            showEmptyView: true,
            sendBoxResult: new Array()
          })
          return
        }
        //有数据
        if (res.data.data.currentSize > 0) {
          if (this.data.pageSendBox == 1) {
            //如果是刷新，就清空之前的数据
            this.data.sendBoxResult = new Array()
          }
          this.data.sendBoxResult = this.data.sendBoxResult.concat(res.data.data.responseForMessages)
          console.log(this.data.sendBoxResult)
          var allData = this.data.sendBoxResult
          this.setData({
            sendBoxResult: allData
          })
          if (this.data.showEmptyView) {
            this.setData({
              showEmptyView: false
            })
          }
        }

        //如果当前页面已经是最后一页
        if (this.data.pageSendBox == res.data.data.sumPage) {
          this.setData({
            sendBoxHasMore: false
          })
        } else {
          this.setData({
            sendBoxHasMore: true
          })
        }
      },
      fail: error => {
        this.turnToIndex()
      },
      complete: obj => {
        wx.hideLoading()
        if (this.data.isFresh) {
          wx.stopPullDownRefresh()
          wx.hideNavigationBarLoading()
        } else if (this.data.isLodingMore) {
          this.setData({
            isLodingMore: false
          })
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

      if (this.data.inBox) {
        return
      }

      this.setData({
        inBox: true,
        sendBox: false
      })
      console.log('切换到收件箱：')
      console.log(this.data.result)
      if (this.data.result == null || this.data.result.length == 0) {
        this.getInBoxList()
      }else{
        if (this.data.showEmptyView) {
          this.setData({
            showEmptyView: false
          })
        }
      }
    }

    if (e.currentTarget.dataset.box == 'send') {
      if (this.data.sendBox) {
        return
      }
      this.setData({
        inBox: false,
        sendBox: true
      })
      console.log('切换到发件箱：')
      console.log(this.data.sendBoxResult)
      if (this.data.sendBoxResult == null || this.data.sendBoxResult.length == 0) {
        this.getSendBoxList()
      } else {
        if (this.data.showEmptyView) {
          this.setData({
            showEmptyView: false
          })
        }
      }
    }
  },

  /**
   * 点击页面，刷新数据
   */
  refreshData: function () {
    wx.showLoading({
      title: '加载中...',
      mask: true,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
    var pageName = 'page'
    if (this.data.inBox) {
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
   * 上拉加载更多
   */
  onReachBottom: function () {

    if (this.data.inBox) {
      //如果没有更多数据，返回
      if (!this.data.inBoxHasMore) {
        console.log("收件箱，没有更多数据")
        return
      }
      //如果正在加载，返回
      if (this.data.isLoading) {
        console.log("收件箱，正在加载更多")
        return
      }
      //增加页码
      var pageNum = this.data.page + 1
      this.setData({
        page: pageNum
      })
    } else if (this.data.sendBox) {
      //如果没有更多数据，返回
      if (!this.data.sendBoxHasMore) {
        console.log("发件箱，没有更多数据")
        return
      }
      //如果正在加载，返回
      if (this.data.isLoading) {
        console.log("发件箱，正在加载更多")
        return
      }
      //增加页码
      var pageNum = this.data.pageSendBox + 1
      this.setData({
        pageSendBox: pageNum
      })
    } else {
      return
    }

    this.setData({
      isLodingMore: true
    })

    this.getMessageList()

  }

})