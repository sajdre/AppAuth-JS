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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestRequestor = exports.FetchRequestor = exports.JQueryRequestor = exports.Requestor = void 0;
var node_fetch_1 = require("node-fetch");
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
    function FetchRequestor() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    FetchRequestor.prototype.xhr = function (settings) {
        if (!settings.url) {
            return Promise.reject(new errors_1.AppAuthError('A URL must be provided.'));
        }
        var url = new URL(settings.url);
        var requestInit = { mode: undefined };
        requestInit.method = settings.method;
        requestInit.mode = 'cors';
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
        return node_fetch_1.default(url.toString(), requestInit).then(function (response) {
            if (response.status >= 200 && response.status < 300) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoieGhyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3hoci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7Ozs7Ozs7OztHQVlHOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFSCx5Q0FBdUQ7QUFFdkQsbUNBQXNDO0FBRXRDOztHQUVHO0FBQ0g7SUFBQTtJQUVBLENBQUM7SUFBRCxnQkFBQztBQUFELENBQUMsQUFGRCxJQUVDO0FBRnFCLDhCQUFTO0FBSS9COztHQUVHO0FBQ0g7SUFBcUMsbUNBQVM7SUFBOUM7O0lBZUEsQ0FBQztJQWRDLDZCQUFHLEdBQUgsVUFBTyxRQUE0QjtRQUNqQyw0REFBNEQ7UUFDNUQscUJBQXFCO1FBQ3JCLElBQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDN0IsT0FBTyxJQUFJLE9BQU8sQ0FBSSxVQUFDLE9BQU8sRUFBRSxNQUFNO1lBQ3BDLEdBQUcsQ0FBQyxJQUFJLENBQ0osVUFBQyxJQUFJLEVBQUUsVUFBVSxFQUFFLEtBQUs7Z0JBQ3RCLE9BQU8sQ0FBQyxJQUFTLENBQUMsQ0FBQztZQUNyQixDQUFDLEVBQ0QsVUFBQyxLQUFLLEVBQUUsVUFBVSxFQUFFLEtBQUs7Z0JBQ3ZCLE1BQU0sQ0FBQyxJQUFJLHFCQUFZLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztZQUNsQyxDQUFDLENBQUMsQ0FBQztRQUNULENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUNILHNCQUFDO0FBQUQsQ0FBQyxBQWZELENBQXFDLFNBQVMsR0FlN0M7QUFmWSwwQ0FBZTtBQWtCNUI7O0dBRUc7QUFDSDtJQUFvQyxrQ0FBUztJQUE3Qzs7SUFxREEsQ0FBQztJQXBEQyw0QkFBRyxHQUFILFVBQU8sUUFBNEI7UUFDakMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUU7WUFDakIsT0FBTyxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUkscUJBQVksQ0FBQyx5QkFBeUIsQ0FBQyxD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SCxVQUFPLFFBQTRCO1FBQ2pDLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFFLGNBQWM7SUFDdEMsQ0FBQztJQUNILG9CQUFDO0FBQUQsQ0FBQyxBQVBELENBQW1DLFNBQVMsR0FPM0M7QUFQWSxzQ0FBYSIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBDb3B5cmlnaHQgMjAxNyBHb29nbGUgSW5jLlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7IHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0XG4gKiBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICpcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmUgZGlzdHJpYnV0ZWQgdW5kZXIgdGhlXG4gKiBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUywgV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlclxuICogZXhwcmVzcyBvciBpbXBsaWVkLiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cbiAqL1xuXG5pbXBvcnQgZmV0Y2gsIHtSZXF1ZXN0SW5pdCwgUmVzcG9uc2V9IGZyb20gJ25vZGUtZmV0Y2gnXG5cbmltcG9ydCB7QXBwQXV0aEVycm9yfSBmcm9tICcuL2Vycm9ycyc7XG5cbi8qKlxuICogQW4gY2xhc3MgdGhhdCBhYnN0cmFjdHMgYXdheSB0aGUgYWJpbGl0eSB0byBtYWtlIGFuIFhNTEh0dHBSZXF1ZXN0LlxuICovXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgUmVxdWVzdG9yIHtcbiAgYWJzdHJhY3QgeGhyPFQ+KHNldHRpbmdzOiBKUXVlcnlBamF4U2V0dGluZ3MpOiBQcm9taXNlPFQ+O1xufVxuXG4vKipcbiAqIFVzZXMgJC5hamF4IHRvIG1ha2VzIHRoZSBBamF4IHJlcXVlc3RzLlxuICovXG5leHBvcnQgY2xhc3MgSlF1ZXJ5UmVxdWVzdG9yIGV4dGVuZHMgUmVxdWVzdG9yIHtcbiAgeGhyPFQ+KHNldHRpbmdzOiBKUXVlcnlBamF4U2V0dGluZ3MpOiBQcm9taXNlPFQ+IHtcbiAgICAvLyBOT1RFOiB1c2luZyBqcXVlcnkgdG8gbWFrZSBYSFIncyBhcyB3aGF0d2ctZmV0Y2ggcmVxdWlyZXNcbiAgICAvLyB0aGF0IEkgdGFyZ2V0IEVTNi5cbiAgICBjb25zdCB4aHIgPSAkLmFqYXgoc2V0dGluZ3MpO1xuICAgIHJldHVybiBuZXcgUHJvbWlzZTxUPigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICB4aHIudGhlbihcbiAgICAgICAgICAoZGF0YSwgdGV4dFN0YXR1cywganFYaHIpID0+IHtcbiAgICAgICAgICAgIHJlc29sdmUoZGF0YSBhcyBUKTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIChqcVhociwgdGV4dFN0YXR1cywgZXJyb3IpID0+IHtcbiAgICAgICAgICAgIHJlamVjdChuZXcgQXBwQXV0aEVycm9yKGVycm9yKSk7XG4gICAgICAgICAgfSk7XG4gICAgfSk7XG4gIH1cbn1cblxuXG4vKipcbiAqIFVzZXMgZmV0Y2ggQVBJIHRvIG1ha2UgQWpheCByZXF1ZXN0c1xuICovXG5leHBvcnQgY2xhc3MgRmV0Y2hSZXF1ZXN0b3IgZXh0ZW5kcyBSZXF1ZXN0b3Ige1xuICB4aHI8VD4oc2V0dGluZ3M6IEpRdWVyeUFqYXhTZXR0aW5ncyk6IFByb21pc2U8VD4ge1xuICAgIGlmICghc2V0dGluZ3MudXJsKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEFwcEF1dGhFcnJvcignQSBVUkwgbXVzdCBiZSBwcm92aWRlZC4nKSk7XG4gICAgfVxuICAgIGxldCB1cmw6IFVSTCA9IG5ldyBVUkwoPHN0cmluZz5zZXR0aW5ncy51cmwpO1xuICAgIGxldCByZXF1ZXN0SW5pdDogKFJlcXVlc3RJbml0Jnttb2RlOiBzdHJpbmcgfCB1bmRlZmluZWR9KSA9IHttb2RlOiB1bmRlZmluZWR9O1xuICAgIHJlcXVlc3RJbml0Lm1ldGhvZCA9IHNldHRpbmdzLm1ldGhvZDtcbiAgICByZXF1ZXN0SW5pdC5tb2RlID0gJ2NvcnMnO1xuXG4gICAgaWYgKHNldHRpbmdzLmRhdGEpIHtcbiAgICAgIGlmIChzZXR0aW5ncy5tZXRob2QgJiYgc2V0dGluZ3MubWV0aG9kLnRvVXBwZXJDYXNlKCkgPT09ICdQT1NUJykge1xuICAgICAgICByZXF1ZXN0SW5pdC5ib2R5ID0gPHN0cmluZz5zZXR0aW5ncy5kYXRhO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbGV0IHNlYXJjaFBhcmFtcyA9IG5ldyBVUkxTZWFyY2hQYXJhbXMoc2V0dGluZ3MuZGF0YSk7XG4gICAgICAgIHNlYXJjaFBhcmFtcy5mb3JFYWNoKCh2YWx1ZSwga2V5KSA9PsKge1xuICAgICAgICAgIHVybC5zZWFyY2hQYXJhbXMuYXBwZW5kKGtleSwgdmFsdWUpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBTZXQgdGhlIHJlcXVlc3QgaGVhZGVyc1xuICAgIHJlcXVlc3RJbml0LmhlYWRlcnMgPSB7fTtcbiAgICBpZiAoc2V0dGluZ3MuaGVhZGVycykge1xuICAgICAgZm9yIChsZXQgaSBpbiBzZXR0aW5ncy5oZWFkZXJzKSB7XG4gICAgICAgIGlmIChzZXR0aW5ncy5oZWFkZXJzLmhhc093blByb3BlcnR5KGkpKSB7XG4gICAgICAgICAgcmVxdWVzdEluaXQuaGVhZGVyc1tpXSA9IDxzdHJpbmc+c2V0dGluZ3MuaGVhZGVyc1tpXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IGlzSnNvbkRhdGFUeXBlID0gc2V0dGluZ3MuZGF0YVR5cGUgJiYgc2V0dGluZ3MuZGF0YVR5cGUudG9Mb3dlckNhc2UoKSA9PT0gJ2pzb24nO1xuXG4gICAgLy8gU2V0ICdBY2NlcHQnIGhlYWRlciB2YWx1ZSBmb3IganNvbiByZXF1ZXN0cyAoVGFrZW4gZnJvbVxuICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9qcXVlcnkvanF1ZXJ5L2Jsb2IvZTBkOTQxMTU2OTAwYTZiZmY3YzA5OGM4ZWE3MjkwNTI4ZTQ2OGNmOC9zcmMvYWpheC5qcyNMNjQ0XG4gICAgLy8gKVxuICAgIGlmIChpc0pzb25EYXRhVHlwZSkge1xuICAgICAgcmVxdWVzdEluaXQuaGVhZGVyc1snQWNjZXB0J10gPSAnYXBwbGljYXRpb24vanNvbiwgdGV4dC9qYXZhc2NyaXB0LCAqLyo7IHE9MC4wMSc7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZldGNoKHVybC50b1N0cmluZygpLCByZXF1ZXN0SW5pdCkudGhlbigocmVzcG9uc2U6IGFueSkgPT4ge1xuICAgICAgaWYgKHJlc3BvbnNlLnN0YXR1cyA+PSAyMDAgJiYgcmVzcG9uc2Uuc3RhdHVzIDwgMzAwKSB7XG4gICAgICAgIGNvbnN0IGNvbnRlbnRUeXBlID0gcmVzcG9uc2UuaGVhZGVycy5nZXQoJ2NvbnRlbnQtdHlwZScpO1xuICAgICAgICBpZiAoaXNKc29uRGF0YVR5cGUgfHwgKGNvbnRlbnRUeXBlICYmIGNvbnRlbnRUeXBlLmluZGV4T2YoJ2FwcGxpY2F0aW9uL2pzb24nKSAhPT0gLTEpKSB7XG4gICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLmpzb24oKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gcmVzcG9uc2UudGV4dCgpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IEFwcEF1dGhFcnJvcihyZXNwb25zZS5zdGF0dXMudG9TdHJpbmcoKSwgcmVzcG9uc2Uuc3RhdHVzVGV4dCkpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG59XG5cbi8qKlxuICogU2hvdWxkIGJlIHVzZWQgb25seSBpbiB0aGUgY29udGV4dCBvZiB0ZXN0aW5nLiBKdXN0IHVzZXMgdGhlIHVuZGVybHlpbmdcbiAqIFByb21pc2UgdG8gbW9jayB0aGUgYmVoYXZpb3Igb2YgdGhlIFJlcXVlc3Rvci5cbiAqL1xuZXhwb3J0IGNsYXNzIFRlc3RSZXF1ZXN0b3IgZXh0ZW5kcyBSZXF1ZXN0b3Ige1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgcHJvbWlzZTogUHJvbWlzZTxhbnk+KSB7XG4gICAgc3VwZXIoKTtcbiAgfVxuICB4aHI8VD4oc2V0dGluZ3M6IEpRdWVyeUFqYXhTZXR0aW5ncyk6IFByb21pc2U8VD4ge1xuICAgIHJldHVybiB0aGlzLnByb21pc2U7ICAvLyB1bnNhZmUgY2FzdFxuICB9XG59XG4iXX0=