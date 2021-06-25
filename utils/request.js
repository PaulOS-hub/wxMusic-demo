import { BASE_RUL } from './config'
export default (url, data, method = "GET") => {
    return new Promise((resolve, reject) => {
        wx.request({
            url: BASE_RUL + url,
            data,
            header: {
                cookie: wx.getStorageSync('cookies').find(item => item.indexOf('MUSIC_U') !== -1) ? wx.getStorageSync('cookies').find(item => item.indexOf('MUSIC_U') !== -1) : ''
            },
            method,
            success: res => {
                if (data.isLogin) {
                    wx.setStorage({
                        data: res.cookies,
                        key: 'cookies',
                    })
                }
                resolve(res.data)
            },
            fail: err => {
                reject(err)
            }
        })
    })
}