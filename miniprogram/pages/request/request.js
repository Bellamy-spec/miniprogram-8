// pages/request/request.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: '',
    stories: [],
    top_stories: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let that = this
    wx.request({
      url: 'https://news-at.zhihu.com/api/4/news/latest',   // 知乎日报最新话题
      header: {
        'content-type': 'application/json',   // 默认值
      },
      success: res => {
        console.log('网络请求成功之后获取到的数据', res)
        let date = res.data.date
        let stories = res.data.stories
        let top_stories = res.data.top_stories
        that.setData({
          date, stories, top_stories
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },

  axiosTest(){
    wx.cloud.callFunction({
      name: "axios",
      data: {
        url: 'https://news-at.zhihu.com/api/4/news/latest',
      },
    }).then(res => {
      console.log('云函数获取到的网络数据', res.result)
    })
  },

  getOpenID(){
    wx.cloud.callFunction({
      name: 'quickstartFunctions',
      data: {
        type: 'getOpenId',
      },
    }).then(res => {
      console.log('云函数获取到的OpenID', res.result)
    })
  },
})