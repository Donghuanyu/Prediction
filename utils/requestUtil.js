const URL = require('url.js')

function buildWeChatForm (formId) {
  var openId = wx.getStorageSync('userInfo').openId
  wx.request({
    url: URL.buildWeChatForm(),
    method: 'POST',
    header: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    data: {
      openId: openId,
      formId: formId
    },
    success: res => {
      console.log(res)
    },
    fail: error => {
      console.log(error)
    }
  })
}

module.exports = {
  buildWeChatForm: buildWeChatForm
}