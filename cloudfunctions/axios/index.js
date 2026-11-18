// 云函数入口文件
const cloud = require('wx-server-sdk')
const axios = require('axios')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  const url = 'https://news-at.zhihu.com/api/4/news/latest'
  try{
    const res = await axios({
      url: url,
      method: 'GET',
      data: {},
      timeout: 6000,
      headers: {
        'Content-Type': 'application/json',
      },
    })
    return res.data
  }catch(e){
    console.error(e)
  }
}