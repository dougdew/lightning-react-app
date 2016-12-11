import * as lcc from "lightning-container";

let REST_URL_PREFIX = "/services/data/v37.0";

function toQueryString(obj) {
    let parts = [],
        i;
    for (i in obj) {
        if (obj.hasOwnProperty(i) && obj[i]) {
            parts.push(encodeURIComponent(i) + "=" + encodeURIComponent(obj[i]));
        }
    }
    return parts.join("&");
}

function request(obj) {

    return new Promise((resolve, reject) => {

        let xhr = new XMLHttpRequest();

        if (obj.params) {
            obj.url += '?' + toQueryString(obj.params);
        }

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status > 199 && xhr.status < 300) {
                    if (obj.filter) {
                        resolve(xhr.responseText ? obj.filter(JSON.parse(xhr.responseText)) : undefined);
                    }
                    else {
                        resolve(xhr.responseText ? JSON.parse(xhr.responseText) : undefined);
                    }
                } else {
                    reject(xhr.responseText);
                }
            }
        };

        xhr.open(obj.method, REST_URL_PREFIX + obj.url, true);
        xhr.setRequestHeader("Accept", "application/json");
        if (obj.contentType) {
            xhr.setRequestHeader("Content-Type", obj.contentType);
        }
        xhr.setRequestHeader("Authorization", "Bearer " + lcc.getRESTAPISessionKey());
        xhr.send(obj.data ? JSON.stringify(obj.data) : undefined);
    });

}

export let get = (url, params, filter) => request({method: "GET", url, params, filter});

export let post = (url, data) => request({method: "POST", contentType: "application/json", url, data});

export let put = (url, data) => request({method: "PUT", contentType: "application/json", url, data});

export let patch = (url, data) => request({method: "PATCH", contentType: "application/json", url, data});

export let del = (url) => request({method: "DELETE", url});
