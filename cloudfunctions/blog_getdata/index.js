// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

const db = cloud.database()
const _ = db.command
const $ = _.aggregate

// 云函数入口函数
exports.main = async (event, context) => {
  const data = (await db.collection('post').aggregate()
    .lookup({
      from: 'collect',
      localField: 'collect',
      foreignField: '_id',
      as: 'category',
    })
    // 数量取决于对功能的权衡，如果limit()中的值太小，就可能需要多次调用云函数，浪费资源；
    .limit(50)
    // 如果太大，一次请求的数据如果太多，首页加载就会变慢
    .end()
  ).list
  return data
}