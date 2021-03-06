zbase.load(["axios", "jquery"], function() {
    window.httputil = {
        post: async function (url, data) {
            return await this.request("post", url, data);
        },
        get: async function (url, data) {
            return await this.request("get", url, data);
        },
        request: async function (method, url, obj) {
            let data = method == "get" ? null : obj;
            let params = method != "get" ? null : obj;
            let header = method != "post" ? null : {
                'timestamp' : new Date().getTime(),
                'uid' : zbase.zuid(12),
            };

            try {
                let response = await strSender.request({
                    url: url,
                    method: method,
                    params: params,
                    data: data,
                    headers: header,
                });
                return response.data;
            } catch (e) {
                if (e.response != null)
                    if (e.response.status == 404){}
                        // window.location = "/404.html";
                    else if (e.response.status == 401 && e.response.data == 999)
                        window.location = "/login.html";
                    else
                        throw e.response;

                console.log(e);
                throw null;
            }
        }
    };

    const strSender = axios.create({
        baseURL: '/api',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        responseType: 'text',
        // 参数序列化
        paramsSerializer: function (params) {
            // console.log("paramsSerializer : ");
            // console.log(params);
            if (params == undefined)
                return params;
            return $.param(params);
        },
        // 请求前拦截器
        transformRequest: [function (data) {
            // console.log("transformRequest : ");
            // console.log(data);
            if (data == undefined)
                return data;
            return $.param(data);
        }],
        // 请求后拦截器
        transformResponse: [function (data) {
            // console.log("transformResponse : ");
            // console.log(data);
            try {
                if (data == null || data == '')
                    return null;
                return JSON.parse(data);
            } catch (e) {
                return data;
            }
        }],
        validateStatus: function (status) {
            return status == 200;
        },
    })
});