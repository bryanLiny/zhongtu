//app.js
App({
  globalData: {
    userInfo: null, // 包含了微信用户的昵称和头像地址
    openid: '',
    appid: 'wx15d6ca4ad6e41cd8',//appid需自己提供，此处的appid我随机编写  
    secret: '84f45a7e8b406edf3f802d8bbdbd7aa6',//secret需自己提供，此处的secret我随机编写  
    serverPath: 'https://www.baby25.cn/jeesite/'
  },
  onLaunch: function () {
    // 登录
    var that = this;
    wx.login({
      success: function (res) {
        // 登录成功，获取到code值，可依据code获取openID
        if (res.code) {
          that.getOpenId(res.code);
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    });
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  getOpenId: function (code) {
    var that = this;
    var url = that.globalData.serverPath + 'api/common/member/getOpenId';
    wx.request({
      url: url,
      data: {
        code: code
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT    
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      }, // 设置请求的 header    
      success: function (res) {
        var data = res.data.data;
        var openid = data.openid;
        // 设置全局变量的值
        that.globalData.openid = openid;
        // 将token存储到本地
        wx.setStorageSync('openid', openid);
        // wx.setStorage({
        //   'key': 'openid',
        //   'data': openid,
        // });
        that.getMemberLogin(openid);
      }
    });
  },
  getMemberLogin: function (openid) {
    var that = this;
    var url = that.globalData.serverPath + 'api/common/member';
    var memberInfo = {};
    wx.getUserInfo({
      success: res => {
        // 可以将 res 发送给后台解码出 unionId
        var userInfo = res.userInfo
        wx.request({
          url: url,
          data: {
            key: openid,
            name: userInfo.nickName,
            mobile: '',
            imgUrl: userInfo.avatarUrl,
          },
          method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT    
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          }, // 设置请求的 header    
          success: function (res) {
            // console.log(res);
            var data = res.data;
            if (data.code == '0') {
              data = data.data;
              memberInfo.memberId = data.memberId;
              memberInfo.userId = data.memberId;
              memberInfo.token = data.token;
            } else {
              memberInfo.memberId = '';
              memberInfo.userId = '';
              memberInfo.token = '';
            }
            wx.setStorageSync('memberInfo', memberInfo);
          }
        });
      }
    })
  }
})