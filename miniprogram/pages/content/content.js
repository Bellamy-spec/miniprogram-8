// pages/content/content.js
const app = getApp()
const db = wx.cloud.database()
const _ = db.command
Page({

  /**
   * 页面的初始数据
   */
  data: {
    contentData: {},
    favority: false,
    favorites: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    console.log(options)
    this.getContent(options)
    this.updateViews(options)

    // 判断当前用户是否已收藏
    const user_doc = await db.collection('user').where({   // 更新用户收藏的文章的id
      _openid: '{openid}',
    }).get()
    // console.log('取出用户记录', user_doc)
    const user = user_doc.data[0]
    console.log('取出用户对象', user)
    console.log('当前文章id', options.id)
    console.log('用户收藏列表', user.favorites)
    if(user.favorites.includes(options.id)){
      console.log('当前用户已收藏这篇文章')
      this.setData({
        favority: true,
      })
    }else{
      console.log('当前用户还未收藏这篇文章')
      this.setData({
        favority: false,
      })
    }
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

  getContent(options){
    const blogData = app.globalData.blogData
    console.log(blogData)
    const data = blogData.filter(blog => {
      if(blog._id == options.id){
        return blog
      }
    })
    console.log(data[0])
    this.setData({
      contentData: data[0],
      favorites: data[0].favorites,   // 初始化收藏次数
    })
  },

  async updateViews(options){
    await db.collection('post').where({
      _id: options.id,
    })
    .update({
      data: {
        views: _.inc(1),
      },
    })
  },

  // 添加收藏
  async addFavor(){
    const id = this.data.contentData._id
    if(this.data.favority){
      // 取消收藏
      await db.collection('post').where({   // 更新收藏字段
        _id: id
      })
      .update({
        data: {
          favorites: _.inc(-1)
        },
      })

      await db.collection('user').where({   // 更新用户收藏的文章的id
        _openid: '{openid}',
      }).update({
        data: {
          favorites: _.pull(id)
        },
      })

      this.setData({    // 未收藏标记
        favority: false,
        favorites: this.data.favorites - 1,
      })

      // 同步更新appData数据
      const blogData = app.globalData.blogData
      const data = blogData.filter(blog => {
        if(blog._id == id){
          return blog
        }
      })
      data[0].favorites--
    }else{
      // 添加收藏
      await db.collection('post').where({   // 更新收藏字段
        _id: id
      })
      .update({
        data: {
          favorites: _.inc(1)
        },
      })

      await db.collection('user').where({   // 更新用户收藏的文章的id
        _openid: '{openid}',
      }).update({
        data: {
          favorites: _.push(id)
        },
      })

      this.setData({    // 已收藏标记
        favority: true,
        favorites: this.data.favorites + 1,
      })

      // 同步更新appData数据
      const blogData = app.globalData.blogData
      const data = blogData.filter(blog => {
        if(blog._id == id){
          return blog
        }
      })
      data[0].favorites++
    }
  },
})