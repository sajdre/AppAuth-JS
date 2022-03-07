"use strict";
/*
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the
 * License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied. See the License for the specific language governing permissions and
 * limitations under the License.
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestRequestor = exports.FetchRequestor = exports.JQueryRequestor = exports.Requestor = void 0;
var errors_1 = require("./errors");
/**
 * An class that abstracts away the ability to make an XMLHttpRequest.
 */
var Requestor = /** @class */ (function () {
    function Requestor() {
    }
    return Requestor;
}());
exports.Requestor = Requestor;
/**
 * Uses $.ajax to makes the Ajax requests.
 */
var JQueryRequestor = /** @class */ (function (_super) {
    __extends(JQueryRequestor, _super);
    function JQueryRequestor() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    JQueryRequestor.prototype.xhr = function (settings) {
        // NOTE: using jquery to make XHR's as whatwg-fetch requires
        // that I target ES6.
        var xhr = $.ajax(settings);
        return new Promise(function (resolve, reject) {
            xhr.then(function (data, textStatus, jqXhr) {
                resolve(data);
            }, function (jqXhr, textStatus, error) {
                reject(new errors_1.AppAuthError(error));
            });
        });
    };
    return JQueryRequestor;
}(Requestor));
exports.JQueryRequestor = JQueryRequestor;
/**
 * Uses fetch API to make Ajax requests
 */
var FetchRequestor = /** @class */ (function (_super) {
    __extends(FetchRequestor, _super);
    function FetchRequestor(fetch) {
        var _this = _super.call(this) || this;
        _this.fetch = fetch;
        return _this;
    }
    FetchRequestor.prototype.xhr = function (settings) {
        if (!settings.url) {
            return Promise.reject(new errors_1.AppAuthError('A URL must be provided.'));
        }
        var url = new URL(settings.url);
        var requestInit = { mode: undefined };
        requestInit.method = settings.method;
        requestInit.mode = 'cors';
        requestInit.credentials = 'include';
        if (settings.data) {
            if (settings.method && settings.method.toUpperCase() === 'POST') {
                requestInit.body = settings.data;
            }
            else {
                var searchParams = new URLSearchParams(settings.data);
                searchParams.forEach(function (value, key) {
                    url.searchParams.append(key, value);
                });
            }
        }
        // Set the request headers
        requestInit.headers = {};
        if (settings.headers) {
            for (var i in settings.headers) {
                if (settings.headers.hasOwnProperty(i)) {
                    requestInit.headers[i] = settings.headers[i];
                }
            }
        }
        var isJsonDataType = settings.dataType && settings.dataType.toLowerCase() === 'json';
        // Set 'Accept' header value for json requests (Taken from
        // https://github.com/jquery/jquery/blob/e0d941156900a6bff7c098c8ea7290528e468cf8/src/ajax.js#L644
        // )
        if (isJsonDataType) {
            requestInit.headers['Accept'] = 'application/json, text/javascript, */*; q=0.01';
        }
        return this.fetch(url.toString(), requestInit).then(function (response) {
            if (response.status >= 200 && response.status < 300) {
                console.log(' ------------- response ---------------', response);
                console.log(' ------------- headers ---------------', response.headers);
                console.log(' ------------- content-type ---------------', response.headers.get('content-type'));
                console.log(' ------------- set-cookie ---------------', response.headers.get('set-cookie'));
                console.log(' ------------- Set-Cookie ---------------', response.headers.get('Set-Cookie'));
                console.log.apply(console, __spreadArray([' ------------- response headers ---------------'], response.headers));
                var contentType = response.headers.get('content-type');
                if (isJsonDataType || (contentType && contentType.indexOf('application/json') !== -1)) {
                    return response.json();
                }
                else {
                    return response.text();
                }
            }
            else {
                return Promise.reject(new errors_1.AppAuthError(response.status.toString(), response.statusText));
            }
        });
    };
    return FetchRequestor;
}(Requestor));
exports.FetchRequestor = FetchRequestor;
/**
 * Should be used only in the context of testing. Just uses the underlying
 * Promise to mock the behavior of the Requestor.
 */
var TestRequestor = /** @class */ (function (_super) {
    __extends(TestRequestor, _super);
    function TestRequestor(promise) {
        var _this = _super.call(this) || this;
        _this.promise = promise;
        return _this;
    }
    TestRequestor.prototype.xhr = function (settings) {
        return this.promise; // unsafe cast
    };
    return TestRequestor;
}(Requestor));
exports.TestRequestor = TestRequestor;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoieGhyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3hoci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7Ozs7Ozs7OztHQVlHOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVILG1DQUFzQztBQUV0Qzs7R0FFRztBQUNIO0lBQUE7SUFHQSxDQUFDO0lBQUQsZ0JBQUM7QUFBRCxDQUFDLEFBSEQsSUFHQztBQUhxQiw4QkFBUztBQUsvQjs7R0FFRztBQUNIO0lBQXFDLG1DQUFTO0lBQTlDOztJQWVBLENBQUM7SUFkQyw2QkFBRyxHQUFILFVBQU8sUUFBNEI7UUFDakMsNERBQTREO1FBQzVELHFCQUFxQjtRQUNyQixJQUFNLEdBQUcsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzdCLE9BQU8sSUFBSSxPQUFPLENBQUksVUFBQyxPQUFPLEVBQUUsTUFBTTtZQUNwQyxHQUFHLENBQUMsSUFBSSxDQUNKLFVBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRSxLQUFLO2dCQUN0QixPQUFPLENBQUMsSUFBUyxDQUFDLENBQUM7WUFDckIsQ0FBQyxFQUNELFVBQUMsS0FBSyxFQUFFLFVBQVUsRUFBRSxLQUFLO2dCQUN2QixNQUFNLENBQUMsSUFBSSxxQkFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFDbEMsQ0FBQyxDQUFDLENBQUM7UUFDVCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFDSCxzQkFBQztBQUFELENBQUMsQUFmRCxDQUFxQyxTQUFTLEdBZTdDO0FBZlksMENBQWU7QUFrQjVCOztHQUVHO0FBQ0g7SUFBb0Msa0NBQVM7SUFDM0Msd0JBQVksS0FBVTtRQUF0QixZQUNFLGlCQUFPLFNBRVI7UUFEQyxLQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQzs7SUFDckIsQ0FBQztJQUNELDRCQUFHLEdBQUgsVUFBTyxRQUE0QjtRQUNqQyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRTtZ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TyxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQztnQkFDekQsSUFBSSxjQUFjLElBQUksQ0FBQyxXQUFXLElBQUksV0FBVyxDQUFDLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUU7b0JBQ3JGLE9BQU8sUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDO2lCQUN4QjtxQkFBTTtvQkFDTCxPQUFPLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQztpQkFDeEI7YUFDRjtpQkFBTTtnQkFDTCxPQUFPLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxxQkFBWSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLEVBQUUsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7YUFDMUY7UUFDSCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFDSCxxQkFBQztBQUFELENBQUMsQUFqRUQsQ0FBb0MsU0FBUyxHQWlFNUM7QUFqRVksd0NBQWM7QUFtRTNCOzs7R0FHRztBQUNIO0lBQW1DLGlDQUFTO0lBQzFDLHVCQUFtQixPQUFxQjtRQUF4QyxZQUNFLGlCQUFPLFNBQ1I7UUFGa0IsYUFBTyxHQUFQLE9BQU8sQ0FBYzs7SUFFeEMsQ0FBQztJQUNELDJCQUFHLEdBQUgsVUFBTyxRQUE0QjtRQUNqQyxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBRSxjQUFjO0lBQ3RDLENBQUM7SUFDSCxvQkFBQztBQUFELENBQUMsQUFQRCxDQUFtQyxTQUFTLEdBTzNDO0FBUFksc0NBQWEiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogQ29weXJpZ2h0IDIwMTcgR29vZ2xlIEluYy5cbiAqXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpOyB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdFxuICogaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZVxuICogTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXJcbiAqIGV4cHJlc3Mgb3IgaW1wbGllZC4gU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXG4gKi9cblxuaW1wb3J0IHtBcHBBdXRoRXJyb3J9IGZyb20gJy4vZXJyb3JzJztcblxuLyoqXG4gKiBBbiBjbGFzcyB0aGF0IGFic3RyYWN0cyBhd2F5IHRoZSBhYmlsaXR5IHRvIG1ha2UgYW4gWE1MSHR0cFJlcXVlc3QuXG4gKi9cbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBSZXF1ZXN0b3Ige1xuICBhYnN0cmFjdCB4aHI8VD4oc2V0dGluZ3M6IEpRdWVyeUFqYXhTZXR0aW5ncyk6IFByb21pc2U8VD47XG4gIGZldGNoOiBhbnk7XG59XG5cbi8qKlxuICogVXNlcyAkLmFqYXggdG8gbWFrZXMgdGhlIEFqYXggcmVxdWVzdHMuXG4gKi9cbmV4cG9ydCBjbGFzcyBKUXVlcnlSZXF1ZXN0b3IgZXh0ZW5kcyBSZXF1ZXN0b3Ige1xuICB4aHI8VD4oc2V0dGluZ3M6IEpRdWVyeUFqYXhTZXR0aW5ncyk6IFByb21pc2U8VD4ge1xuICAgIC8vIE5PVEU6IHVzaW5nIGpxdWVyeSB0byBtYWtlIFhIUidzIGFzIHdoYXR3Zy1mZXRjaCByZXF1aXJlc1xuICAgIC8vIHRoYXQgSSB0YXJnZXQgRVM2LlxuICAgIGNvbnN0IHhociA9ICQuYWpheChzZXR0aW5ncyk7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlPFQ+KChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIHhoci50aGVuKFxuICAgICAgICAgIChkYXRhLCB0ZXh0U3RhdHVzLCBqcVhocikgPT4ge1xuICAgICAgICAgICAgcmVzb2x2ZShkYXRhIGFzIFQpO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgKGpxWGhyLCB0ZXh0U3RhdHVzLCBlcnJvcikgPT4ge1xuICAgICAgICAgICAgcmVqZWN0KG5ldyBBcHBBdXRoRXJyb3IoZXJyb3IpKTtcbiAgICAgICAgICB9KTtcbiAgICB9KTtcbiAgfVxufVxuXG5cbi8qKlxuICogVXNlcyBmZXRjaCBBUEkgdG8gbWFrZSBBamF4IHJlcXVlc3RzXG4gKi9cbmV4cG9ydCBjbGFzcyBGZXRjaFJlcXVlc3RvciBleHRlbmRzIFJlcXVlc3RvciB7XG4gIGNvbnN0cnVjdG9yKGZldGNoOiBhbnkpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuZmV0Y2ggPSBmZXRjaDtcbiAgfVxuICB4aHI8VD4oc2V0dGluZ3M6IEpRdWVyeUFqYXhTZXR0aW5ncyk6IFByb21pc2U8VD4ge1xuICAgIGlmICghc2V0dGluZ3MudXJsKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEFwcEF1dGhFcnJvcignQSBVUkwgbXVzdCBiZSBwcm92aWRlZC4nKSk7XG4gICAgfVxuICAgIGxldCB1cmw6IFVSTCA9IG5ldyBVUkwoPHN0cmluZz5zZXR0aW5ncy51cmwpO1xuICAgIGxldCByZXF1ZXN0SW5pdDogKFJlcXVlc3RJbml0Jnttb2RlOiBzdHJpbmcgfCB1bmRlZmluZWR9KSA9IHttb2RlOiB1bmRlZmluZWR9O1xuICAgIHJlcXVlc3RJbml0Lm1ldGhvZCA9IHNldHRpbmdzLm1ldGhvZDtcbiAgICByZXF1ZXN0SW5pdC5tb2RlID0gJ2NvcnMnO1xuICAgIHJlcXVlc3RJbml0LmNyZWRlbnRpYWxzID0gJ2luY2x1ZGUnO1xuXG4gICAgaWYgKHNldHRpbmdzLmRhdGEpIHtcbiAgICAgIGlmIChzZXR0aW5ncy5tZXRob2QgJiYgc2V0dGluZ3MubWV0aG9kLnRvVXBwZXJDYXNlKCkgPT09ICdQT1NUJykge1xuICAgICAgICByZXF1ZXN0SW5pdC5ib2R5ID0gPHN0cmluZz5zZXR0aW5ncy5kYXRhO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGV0IHNlYXJjaFBhcmFtcyA9IG5ldyBVUkxTZWFyY2hQYXJhbXMoc2V0dGluZ3MuZGF0YSk7XG4gICAgICAgIHNlYXJjaFBhcmFtcy5mb3JFYWNoKCh2YWx1ZSwga2V5KSA9PsKge1xuICAgICAgICAgIHVybC5zZWFyY2hQYXJhbXMuYXBwZW5kKGtleSwgdmFsdWUpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBTZXQgdGhlIHJlcXVlc3QgaGVhZGVyc1xuICAgIHJlcXVlc3RJbml0LmhlYWRlcnMgPSB7fTtcbiAgICBpZiAoc2V0dGluZ3MuaGVhZGVycykge1xuICAgICAgZm9yIChsZXQgaSBpbiBzZXR0aW5ncy5oZWFkZXJzKSB7XG4gICAgICAgIGlmIChzZXR0aW5ncy5oZWFkZXJzLmhhc093blByb3BlcnR5KGkpKSB7XG4gICAgICAgICAgcmVxdWVzdEluaXQuaGVhZGVyc1tpXSA9IDxzdHJpbmc+c2V0dGluZ3MuaGVhZGVyc1tpXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IGlzSnNvbkRhdGFUeXBlID0gc2V0dGluZ3MuZGF0YVR5cGUgJiYgc2V0dGluZ3MuZGF0YVR5cGUudG9Mb3dlckNhc2UoKSA9PT0gJ2pzb24nO1xuXG4gICAgLy8gU2V0ICdBY2NlcHQnIGhlYWRlciB2YWx1ZSBmb3IganNvbiByZXF1ZXN0cyAoVGFrZW4gZnJvbVxuICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9qcXVlcnkvanF1ZXJ5L2Jsb2IvZTBkOTQxMTU2OTAwYTZiZmY3YzA5OGM4ZWE3MjkwNTI4ZTQ2OGNmOC9zcmMvYWpheC5qcyNMNjQ0XG4gICAgLy8gKVxuICAgIGlmIChpc0pzb25EYXRhVHlwZSkge1xuICAgICAgcmVxdWVzdEluaXQuaGVhZGVyc1snQWNjZXB0J10gPSAnYXBwbGljYXRpb24vanNvbiwgdGV4dC9qYXZhc2NyaXB0LCAqLyo7IHE9MC4wMSc7XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuZmV0Y2godXJsLnRvU3RyaW5nKCksIHJlcXVlc3RJbml0KS50aGVuKChyZXNwb25zZTogYW55KSA9PiB7XG4gICAgICBpZiAocmVzcG9uc2Uuc3RhdHVzID49IDIwMCAmJiByZXNwb25zZS5zdGF0dXMgPCAzMDApIHtcbiAgICAgICAgY29uc29sZS5sb2coJyAtLS0tLS0tLS0tLS0tIHJlc3BvbnNlIC0tLS0tLS0tLS0tLS0tLScsIHJlc3BvbnNlKVxuICAgICAgICBjb25zb2xlLmxvZygnIC0tLS0tLS0tLS0tLS0gaGVhZGVycyAtLS0tLS0tLS0tLS0tLS0nLCByZXNwb25zZS5oZWFkZXJzKVxuICAgICAgICBjb25zb2xlLmxvZyhcbiAgICAgICAgICAgICcgLS0tLS0tLS0tLS0tLSBjb250ZW50LXR5cGUgLS0tLS0tLS0tLS0tLS0tJywgcmVzcG9uc2UuaGVhZGVycy5nZXQoJ2NvbnRlbnQtdHlwZScpKVxuICAgICAgICBjb25zb2xlLmxvZygnIC0tLS0tLS0tLS0tLS0gc2V0LWNvb2tpZSAtLS0tLS0tLS0tLS0tLS0nLCByZXNwb25zZS5oZWFkZXJzLmdldCgnc2V0LWNvb2tpZScpKVxuICAgICAgICBjb25zb2xlLmxvZygnIC0tLS0tLS0tLS0tLS0gU2V0LUNvb2tpZSAtLS0tLS0tLS0tLS0tLS0nLCByZXNwb25zZS5oZWFkZXJzLmdldCgnU2V0LUNvb2tpZScpKVxuICAgICAgICBjb25zb2xlLmxvZygnIC0tLS0tLS0tLS0tLS0gcmVzcG9uc2UgaGVhZGVycyAtLS0tLS0tLS0tLS0tLS0nLCAuLi5yZXNwb25zZS5oZWFkZXJzKVxuICAgICAgICBjb25zdCBjb250ZW50VHlwZSA9IHJlc3BvbnNlLmhlYWRlcnMuZ2V0KCdjb250ZW50LXR5cGUnKTtcbiAgICAgICAgaWYgKGlzSnNvbkRhdGFUeXBlIHx8IChjb250ZW50VHlwZSAmJiBjb250ZW50VHlwZS5pbmRleE9mKCdhcHBsaWNhdGlvbi9qc29uJykgIT09IC0xKSkge1xuICAgICAgICAgIHJldHVybiByZXNwb25zZS5qc29uKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLnRleHQoKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG5ldyBBcHBBdXRoRXJyb3IocmVzcG9uc2Uuc3RhdHVzLnRvU3RyaW5nKCksIHJlc3BvbnNlLnN0YXR1c1RleHQpKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxufVxuXG4vKipcbiAqIFNob3VsZCBiZSB1c2VkIG9ubHkgaW4gdGhlIGNvbnRleHQgb2YgdGVzdGluZy4gSnVzdCB1c2VzIHRoZSB1bmRlcmx5aW5nXG4gKiBQcm9taXNlIHRvIG1vY2sgdGhlIGJlaGF2aW9yIG9mIHRoZSBSZXF1ZXN0b3IuXG4gKi9cbmV4cG9ydCBjbGFzcyBUZXN0UmVxdWVzdG9yIGV4dGVuZHMgUmVxdWVzdG9yIHtcbiAgY29uc3RydWN0b3IocHVibGljIHByb21pc2U6IFByb21pc2U8YW55Pikge1xuICAgIHN1cGVyKCk7XG4gIH1cbiAgeGhyPFQ+KHNldHRpbmdzOiBKUXVlcnlBamF4U2V0dGluZ3MpOiBQcm9taXNlPFQ+IHtcbiAgICByZXR1cm4gdGhpcy5wcm9taXNlOyAgLy8gdW5zYWZlIGNhc3RcbiAgfVxufVxuIl19