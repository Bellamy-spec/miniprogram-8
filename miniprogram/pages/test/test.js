// pages/test/test.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    html: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    wx.cloud.callFunction({
      name: "axios",
      data: {
        url: 'http://zz106gz.cn',
      },
    }).then(res => {
      // console.log('云函数获取到的网络数据', res)
      this.setData({
        html: this.pickBody(res.result),
      })
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

  pickBody(html) {
    const m = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
    let body = m ? m[1] : html;
    body = body
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      .replace(/<link[^>]*>/gi, '')
      .replace(/<iframe[\s\S]*?<\/iframe>/gi, '')
      .replace(/<video[\s\S]*?<\/video>/gi, '')
      .replace(/\son\w+="[^"]*"/gi, '')      // 去事件属性
      .replace(/javascript:/gi, '');
    // 再截 article/main/.content 之类
    const art = body.match(/<article[^>]*>([\s\S]*?)<\/article>/i);
    return art ? art[1] : body;
  },
})