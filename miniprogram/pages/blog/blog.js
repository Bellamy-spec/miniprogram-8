// pages/blog/blog.js
const app = getApp()
const db = wx.cloud.database()
const _ = db.command
Page({

  /**
   * 页面的初始数据
   */
  data: {
    blogData: [],
    incStar: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getData()
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

  async getData(){
    const blogData = (await wx.cloud.callFunction({
      name: 'blog_getdata',
    })).result
    console.log('云函数lookup查询到的数据', blogData)
    this.setData({
      blogData
    })

    // 获取一次数据链路比较长，还用到了云函数。为了让查看文章详情时不浪费资源，
    // 所以把博客的数据存储到globalData，减少云函数以及数据库的调用次数
    app.globalData.blogData = blogData
  },

  async addStar(e){
    const id = e.currentTarget.dataset.id
    const blog = this.data.blogData
    await blog.filter(post => {
      if(post._id == id){
        // post.addStar = true
        let stars = post.stars || 0   // 由于stars字段并没有预先写在记录里，所以可能为undefined
        let star = post.star || false
        post.star = !star
        if(post.star){
          post.stars = stars + 1
          this.setData({
            incStar: 1,
          })
        }else{
          post.stars = stars - 1
          this.setData({
            incStar: -1,
          })
        }
      }
    })
    this.setData({
      blogData: blog
    })

    // 再通过update()来更新点赞数也不迟
    await db.collection('post').where({
      _id: id
    })
    .update({
      data: {
        stars: _.inc(this.data.incStar),
      }
    })
  },

  // // 从列表中返回指定id文章
  // getPostById(id){
  //   for(let post in this.data.blogData){
  //     if(id == post._id){
  //       return post
  //     }
  //   }
  // },
})