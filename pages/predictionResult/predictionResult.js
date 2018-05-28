// pages/predictionResult/predictionResult.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: "../../image/icon_congratulations.png",
    predictionResult: null,
    tags: new Array(),
    tagsLeft: new Array(),
    tagsRight: new Array(),
    matchUsers: new Array(),
    showShare: false,
    avatarImg: null,
    windowHeight: null,
    windowWidth: null,
    hasDraw: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var systemInfo = wx.getSystemInfoSync();
    this.setData({
      windowWidth: systemInfo.windowWidth * 0.85,
      windowHeight: systemInfo.windowHeight * 0.80
    })
    var result = JSON.parse(options.result)
    console.log(result)
    if (result != null) {
      var left = new Array();
      var right = new Array();
      var index = result.tags.length / 2;
      for (var i = 0; i < result.tags.length; i++) {
        if (i > index - 1) {
          right.push(result.tags[i])
        }else {
          left.push(result.tags[i])
        }
      }
      var show = false;
      if (result.users != null && result.users.length > 0) {
        show = true;
      }else {
        show = false;
      }
      this.setData({
        predictionResult: result,
        tags: result.tags,
        tagsLeft: left,
        tagsRight: right,
        matchUsers: result.users,
        showUser: show
      })
    }
    if (getApp().globalData.userInfo != null && 
      getApp().globalData.userInfo.avatarUrl != null && 
      "" != getApp().globalData.userInfo.avatarUrl){
      this.setData({
        avatarUrl: getApp().globalData.userInfo.avatarUrl
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

    return {
      path: '/pages/index/index'
    }
  
  },

  /**
   * 分享按钮
   */
  shareResult: function (e) {
    
    if (this.data.hasDraw) {
      this.setData({
        showShare: true
      })
      return
    }
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    var that = this
    //下载头像
    wx.downloadFile({
      url: that.data.avatarUrl,
      success: res => {
        this.setData({
          avatarImg: res.tempFilePath
        })
        this.drawImage()
      },
      fail: error => {
        wx.hideLoading()
        console.log(error)
        wx.showModal({
          title: '提示',
          content: "出错了，请稍后再试",
          mask: true,
          showCancel: false,
          confirmText: '好的',
          success: res => {
            if (res.confirm) {
              console.log('用户点击确定')
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
        return;
      }
    })
  },

  /**
   * 绘制分享图片
   */
  drawImage() {

    console.log('开始绘制图片')
    //绘制canvas图片
    var that = this
    const ctx = wx.createCanvasContext('shareCanvas')
    
    //全局的背景色
    var color = '#85dbd0'
    var bgPath = '../../image/bg_qr.png'
    var portraitPath = that.data.avatarImg
    var hostNickname = getApp().globalData.userInfo.nickName
    var qrPath = '../../image/img_qr.jpg'
    var windowWidth = that.data.windowWidth
    var windowHeight = that.data.windowHeight
    var fontSize = 0.05 * windowWidth
    var scale = 1.6
    var step = 0.07
    //绘制背景图片
    ctx.drawImage(bgPath, 0, 0, windowWidth, windowHeight)
    //绘制标题
    ctx.setFillStyle(color)
    ctx.setFontSize(windowWidth * 0.08)
    ctx.setTextAlign('center')
    ctx.fillText('Congratulations', windowWidth / 2, 0.09 * windowWidth)
    //绘制头像
    ctx.save()
    ctx.beginPath()
    //画圆（X[圆心X坐标], Y[圆心Y坐标], R[圆形半径], 起始弧度, 总止弧度）
    ctx.arc(windowWidth / 2, 0.28 * windowWidth, 0.15 * windowWidth, 0, 2 * Math.PI)
    ctx.clip()  //裁剪
    ctx.drawImage(portraitPath, windowWidth / 2 - 0.15 * windowWidth, 0.12 * windowWidth, 0.3 * windowWidth, 0.3 * windowWidth)
    ctx.restore()
    //绘制名称 + 匹配结果类型
    ctx.setFillStyle(color)
    ctx.setFontSize(fontSize)
    ctx.setTextAlign('center')
    ctx.fillText(hostNickname + ' 属于：' + " " + this.data.predictionResult.value, windowWidth / 2, 0.48 * windowWidth)
    //循环绘制TAG标签
    var start = 0.48
    for (var i = 0; i < this.data.tags.length; i++) {
      start = start + step
      ctx.setFillStyle('gray')
      ctx.setFontSize(fontSize)
      ctx.setTextAlign('center')
      ctx.fillText(this.data.tags[i].title + '：' + this.data.tags[i].value, windowWidth / 2, start * windowWidth)
    }
    //绘制“你也来测一下吧”
    start = start + 0.1
    ctx.setFillStyle(color)
    ctx.setFontSize(fontSize)
    ctx.setTextAlign('center')
    ctx.fillText('你也来测一下吧', windowWidth / 2, start * windowWidth)
    //绘制二维码
    ctx.drawImage(qrPath, 0.64 * windowWidth / 2, (start + 0.05) * windowWidth, 0.32 * windowWidth, 0.32 * windowWidth)
    ctx.draw();
    wx.hideLoading()
    this.setData({
      hasDraw: true,
      showShare: true
    })
  },

  /**
   * 关闭分享页面
   */
  closeShareView: function () {
    this.setData({
      showShare: false
    })
  },

  /**
   * 保存分享图片
   */
  saveShareImg: function (e) {
    var that = this
    wx.showLoading({
      title: '请稍后...',
      mask: true
    })
    wx.canvasToTempFilePath({
      canvasId: 'shareCanvas',
      quality: 1,
      success: res => {
        console.log("保存图片成功：" + res.tempFilePath)
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: fileRes => {
            wx.hideLoading()
            wx.showModal({
              title: '提示',
              content: '保存成功，快去分享图片吧',
              showCancel: false,
              confirmText: '好的',
              success: function (res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                  that.closeShareView()
                }
              },
              fail: function (res) { },
              complete: function (res) { },
            })
          },
          fail: fileErro => {
            wx.hideLoading()
            wx.showModal({
              title: '提示',
              content: '抱歉，保存出错了',
              showCancel: false,
              confirmText: '知道了',
              success: function (res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                  that.setData({
                    showShare: false
                  })
                }
              },
              fail: function (res) { },
              complete: function (res) { },
            })
          },
          fail: erro => {
            wx.hideLoading()
            wx.showModal({
              title: '提示',
              content: '抱歉，保存出错了',
              showCancel: false,
              confirmText: '知道了',
              success: function (res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                }
              },
              fail: function (res) { },
              complete: function (res) { },
            })
          }
        })
        
      }
    }, this)
  },

  /**
   * 匹配用的点击事件
   */
  matchUserItemClick: function (e) {
    var clickUser = e.currentTarget.dataset.user
    wx.navigateTo({
      url: '../leaveMsg/leaveMsg?user=' + JSON.stringify(clickUser),
    })
  }
})