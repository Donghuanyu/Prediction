// pages/subject/subject.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //题目数据
    subjects: [],
    //当前题目
    subject: null,
    //显示答案数据
    answers: [],
    //提交的答案数据
    submitAnswers: new Array(),
    //题目类型
    type: "",
    //题目定位
    index: 0,
    showFinish: false,
    //当前题目选中的答案
    currentAnswer: "",
    //进度条百分比
    percent: 0,
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var title = options.title;
    wx.setNavigationBarTitle({
      title: title
      });
    var type = options.type;
    this.setData({
      type: type
    });
    this.getSubjectsByType();
  
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
   * 根据类型获取题目集合
   */
  getSubjectsByType: function () {
    wx.showLoading({
      title: '加载中...',
      mask: true
    });
    var that = this;
    wx.request({
      url: getApp().globalData.URL.getSubjects(),
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        type: that.data.type
      },
      success: function(res) {
        that.dealWithData(res.data)
      },
      fail: function(failedRes) {

      },
      complete: function() {
        wx.hideLoading()
      }
    });

  },

  /**
   * 处理数据
   */
  dealWithData: function (response) {

    var resultCode = response.code;
    if ("200" != resultCode){
      //失败
      wx.showToast({
        title: '获取数据失败',
        icon: 'none'
      });
      return
    }

    console.log(response);

    //成功
    this.setData({
      subjects: response.data,
      subject: response.data[0],
      answers: response.data[0].answers,
      index: 0
    });
  },

/**
 * 答案点击事件，
 * 将点击的答案存储在currentAnswer中
 */
  answerClick: function(event) {
    console.log(event)
    this.setData({
      currentAnswer: event.currentTarget.dataset.answer
    })
    
  }, 

/**
 * 下一题点击事件
 */
  nextClick: function(event) {

    //判断是否选择了答案
    var currentIndex = this.data.index;
    if (this.data.currentAnswer == null || "" == this.data.currentAnswer){
      wx.showToast({
        title: '请先完成当前题目',
        icon: 'none'
      })
      return
    }

    //如果的必答题，将答案放到列表中
    if ("true" == this.data.subject.necessary) {
      this.data.submitAnswers.push(this.data.currentAnswer);
      console.log(this.data.submitAnswers)
    }

    //判断是否是最后一题
    if (currentIndex < this.data.subjects.length){
      currentIndex = currentIndex + 1;
    }

    if (currentIndex >= this.data.subjects.length - 1) {
      this.setData({
        showFinish: true
      })
    }else {
      this.setData({
        showFinish: false
      })
    }

    //计算进度条百分比
    var currentPercent = (currentIndex / this.data.subjects.length) * 100
    //更改题目
    var currentSubject = this.data.subjects[currentIndex];
    this.setData({
      index: currentIndex,
      subject: currentSubject,
      answers: currentSubject.answers,
      currentAnswer: "",
      percent: currentPercent
    })
  },

  /**
   * 完成答题按钮点击事件
   */
  finishClick: function () {
    if (this.data.currentAnswer == null || "" == this.data.currentAnswer){
      wx.showToast({
        title: '请先完成当前题目',
        icon: 'none'
      })
      return
    }
    //提交数据
    wx.showLoading({
      title: '加载中...',
      mask: true
    });
    var that = this;
    var user = getApp().globalData.userInfo;
    user["openId"] = "default_test_001";
    user["gender"] = user.gender.toString();
    user["id"] = "";
    user["predictionResultId"] = "";
    delete user.country;
    delete user.province;
    var requestParam = {
      type: that.data.type,
      answerIds: that.data.submitAnswers,
      user: user
    }
    wx.request({
      url: getApp().globalData.URL.getPredictionResult(),
      method: 'POST',
      header: {
        "content-type": "application/json"
      },
      data: {
        type: that.data.type,
        answerIds: that.data.submitAnswers,
        user: user
      },
      success: function(res) {
        console.log(res);
        that.dealWithFinishData(res.data);
      },
      fail: function(failedRes) {

      },
      complete: function() {
        wx.hideLoading()
      }
    });

  },

  /**
   * 处理提交数据的结果
   */
  dealWithFinishData: function(result) {
    //失败
    if (result.code == null && "200" != result.code) {
      wx.showToast({
        title: '出错了，请再试一次',
        icon: 'none'
      })
      return
    }

    //成功，将答题结果传到结果页面
    wx.redirectTo({
      url: '../predictionResult/predictionResult?result=' + JSON.stringify(result.data)
    })
  }

})