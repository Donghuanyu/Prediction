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
    showUser: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
  
  }
})