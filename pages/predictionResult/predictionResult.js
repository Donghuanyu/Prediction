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
    windowWidth: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var systemInfo = wx.getSystemInfoSync();
    this.setData({
      windowHeight: systemInfo.screenHeight,
      windowWidth: systemInfo.screenWidth
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
  
  },

  /**
   * 分享按钮
   */
  shareResult: function (e) {
    var that = this
    this.setData({
      showShare: true
    })
    //下载头像
    wx.downloadFile({
      url: that.data.avatarUrl,
      success: res => {
        this.setData({
          avatarImg: res.tempFilePath
        })
        this.drawImage()
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
    var bgPath = '../../image/bg_qr.png'
    var portraitPath = that.data.avatarImg
    var hostNickname = getApp().globalData.userInfo.nickName

    // var qrPath = that.data.qrcode_temp
    var windowWidth = that.data.windowWidth
    var windowHeight = that.data.windowHeight
    var scale = 1.6
    //绘制背景图片
    ctx.drawImage(bgPath, 0, 0, windowWidth, windowHeight * 0.7)

    //绘制头像
    ctx.save()
    ctx.beginPath()
    ctx.arc(windowWidth / 2, 0.32 * windowWidth, 0.15 * windowWidth, 0, 2 * Math.PI)
    ctx.clip()
    ctx.drawImage(portraitPath, 0.7 * windowWidth / 2, 0.17 * windowWidth, 0.3 * windowWidth, 0.3 * windowWidth)
    ctx.restore()
    //绘制第一段文本
    ctx.setFillStyle('#ffffff')
    ctx.setFontSize(0.037 * windowWidth)
    ctx.setTextAlign('center')
    ctx.fillText(hostNickname + ' 正在参加疯狂红包活动', windowWidth / 2, 0.52 * windowWidth)
    //绘制第二段文本
    ctx.setFillStyle('#ffffff')
    ctx.setFontSize(0.037 * windowWidth)
    ctx.setTextAlign('center')
    ctx.fillText('邀请你一起来领券抢红包啦~', windowWidth / 2, 0.57 * windowWidth)
    //绘制二维码
    // ctx.drawImage(qrPath, 0.64 * windowWidth / 2, 0.75 * windowWidth, 0.36 * windowWidth, 0.36 * windowWidth)
    //绘制第三段文本
    ctx.setFillStyle('#ffffff')
    ctx.setFontSize(0.037 * windowWidth)
    ctx.setTextAlign('center')
    ctx.fillText('长按二维码领红包', windowWidth / 2, 1.36 * windowWidth)
    ctx.draw();
  }
})