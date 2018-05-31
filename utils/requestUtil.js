const URL = require('url.js')

function buildWeChatForm (formId) {
  console.log("开始上传formId")
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
      console.log("formId上传成功")
    },
    fail: error => {
      console.log(error)
      console.log("formId上传失败")
    }
  })
}

module.exports = {
  buildWeChatForm: buildWeChatForm
}