/**
 * Created by Yan Jixian on 2015/1/23.
 */
var testServices = angular.module('testServices', ['ngResource']);


//普通用户服务
testServices.factory('userService', ['$resource',
    function($resource){
        return $resource('/api/user/:id', {id: '@id'}, {
            query: {
                isArray: true,
                transformResponse : function (data) {
                    return angular.fromJson(data).list;
                }
            },
            pageQuery: {
                isArray: true,
                params: {
                    dsl: 'mog',
                    conditions: {isAgent: false},
                    options: {skip:0, limit: 20, sort:{createTime:-1}}
                },
                transformResponse : function (data) {
                    return angular.fromJson(data).list;
                },
                interceptor: {
                    response: responseInterceptor
                }
            },
            update: {method: 'PUT',
                interceptor: {
                    response: responseInterceptor
                }},
            total: {method: 'GET', params: { conditions: {isAgent: false} },url: '/api/user/attribute/length'}
        });
    }
]);
