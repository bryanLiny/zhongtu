/**
 * url 请求地址
 * success 成功的回调
 * fail 失败的回调
 */
function _get(url, header, success, fail) {
  console.log("------start---_get----");
  wx.request({
    url: url,
    header: header,
    success: function (res) {
      success(res);
    },
    fail: function (res) {
      fail(res);
    }
  });

  console.log("----end-----_get----");
}

/**
 * url 请求地址
 * success 成功的回调
 * fail 失败的回调
 */
function _post_form(url, data, success, fail) {
  console.log("----_post--start-------");
  wx.request({
    url: url,
    header: {
      'content-type': 'application/x-www-form-urlencoded',
    },
    method: 'POST',
    data: { data: data },
    success: function (res) {
      success(res);
    },
    fail: function (res) {
      fail(res);
    }
  });
  console.log("----end-----_get----");
}

/**
* url 请求地址
* success 成功的回调
* fail 失败的回调
*/
function _post_json(url, data, success, fail) {
  console.log("----_post--start-------");
  wx.request({
    url: url,
    header: {
      'content-type': 'application/json',
    },
    method: 'POST',
    data: data,
    success: function (res) {
      success(res);
    },
    fail: function (res) {
      fail(res);
    }
  });

  console.log("----end----_post-----");
}
module.exports = {
  _get: _get,
  _post: _post_form,
  _post_json: _post_json
}