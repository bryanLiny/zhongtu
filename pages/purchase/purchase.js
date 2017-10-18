// pages/purchase/purchase.js
import util from "../../utils/util.js";
import httpsReq from "../../utils/httpsReq.js"
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    sortindex: 0,  //排序索引
    sortid: null,  //排序id
    sort: [],
    activitylist: [], //会议室列表列表
    scrolltop: null, //滚动位置
    pageNo: 0,  //分页
    memberInfo: null,
    char_gt: '>'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var memberInfo = null;
    var getMenberInfo;
    var that = this;
    getMenberInfo = setInterval(function (evt) { // 启用定时器获取memberInfo数据，避免网络异步请求，memberInfo还未存储在本地，而page.onLoad已加载完成memberInfo报undefined或者null的问题
      memberInfo = wx.getStorageSync('memberInfo');
      if (memberInfo) {
        console.log(memberInfo)
        that.fetchPurchaseData(memberInfo);
        that.setData({
          memberInfo: memberInfo
        });
        clearInterval(getMenberInfo); // 获取成功，清除定时器
      }
    }, 500);
  },
  scanCode: function (event) {
    var that = this;
    this.setData({
      pageNo: 0
    });
    wx.scanCode({
      success: (res) => {
        var userId = res.result;
        var memberInfo = that.data.memberInfo;
        memberInfo.userId = userId;
        that.setData({
          memberInfo: memberInfo
        });
        console.log(memberInfo)
        this.fetchPurchaseData(that.data.memberInfo);
      }
    })
  },
  fetchPurchaseData: function (memberInfo) {  //获取会议室列表
    var that = this;
    that.setData({
      pageNo: that.data.pageNo + 1
    })
    const pageNo = that.data.pageNo;
    // 获取活动列表
    var url = app.globalData.serverPath + 'api/pt/ptActivities/list?pageNo=' + pageNo + '&pageSize=' + 10 + '&status=0&userId=' + memberInfo.userId;
    var header = {
      'authorization': memberInfo.memberId + '_' + memberInfo.token
    };
    httpsReq._get(url, header, function (res) {
      var data = res.data.data;
      console.log(data)
      if (data) {
        that.setData({
          activitylist: that.data.activitylist.concat(data)
        });
      }
    }, function (res) {
      console.log('error')
      console.log(res)
    })
  },
  setSortBy: function (e) { //选择排序方式
    const d = this.data;
    const dataset = e.currentTarget.dataset;
    this.setData({
      sortindex: dataset.sortindex,
      sortid: dataset.sortid
    })
    console.log('排序方式id：' + this.data.sortid);
  },
  setStatusClass: function (e) { //设置状态颜色
    console.log(e);
  },
  scrollHandle: function (e) { //滚动事件
    this.setData({
      scrolltop: e.detail.scrollTop
    })
  },
  goToTop: function () { //回到顶部
    this.setData({
      scrolltop: 0
    })
  },
  scrollLoading: function () { //滚动加载
    this.fetchPurchaseData();
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
    this.setData({
      pageNo: 0,
      activitylist: []
    })
    this.fetchPurchaseData(this.data.memberInfo);
    this.fetchSortData();
    setTimeout(() => {
      wx.stopPullDownRefresh()
    }, 1000)
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