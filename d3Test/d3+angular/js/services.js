/**
 * Created by Yan Jixian on 2015/1/23.
 */
var zhudelabServices = angular.module('zhudelabServices', ['ngResource']);

var responseInterceptor =  function (res) {
    if(res.status === 403 || res.status === 401) {
        $location.url('/login');
    }
    return res;
};

zhudelabServices.factory('adminService', ['$resource', '$locale',
    function($resource, $location){
        return $resource('/api/auth/:id', {}, {
            login: {method:'POST', params: {id: 'login'}},
            logout: {method:'get', params: {id: 'logout'}},
            auth: {method:'POST', params: {id: 'me'},
                interceptor: {
                    response: responseInterceptor
                }}   //返回user
        });
    }
]);

//认证服务
zhudelabServices.factory('authService', ['adminService', '$location', '$rootScope',
    function(adminService, $location, $rootScope){
        return {
            auth: function (fn) {
                adminService.auth(function (data) {
                    fn.call(this, data);
                }, function (err) {
                    if (err.status == 401)
                        $location.url('/login');
                });
            },
            setUser: function (user) {
                $rootScope.$user = user;
                $rootScope.$broadcast('userChanged');
            },
            hasPermission: function (permissionArr) {
                return $rootScope.$user && permissionArr.indexOf($rootScope.$user.role) > -1;
            }
        }
    }
]);

//系统日志
zhudelabServices.factory('logService', ['$resource',
    function($resource){
        return $resource('/api/log/:id',{}, {
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
                    options: {
                        skip:0, limit: 20, sort:{ timestamp :-1}
                    }
                },
                transformResponse : function (data) {
                    return angular.fromJson(data).list;
                },
                interceptor: {
                    response: responseInterceptor
                }
            },
            total: {
                method: 'GET',
                url: '/api/log/length',
                interceptor: {
                    response: responseInterceptor
                }
            }
        });
    }
]);

//文章服务
zhudelabServices.factory('articleService', ['$resource',
    function($resource){
        return $resource('/api/article/:id', {id: '@id'}, {
            query: {isArray: true, transformResponse : function (data) {
                return angular.fromJson(data).list;
            }},
            pageQuery: {isArray: true, params: {
                dsl: 'mog',
                options: {skip:0, limit: 20, sort:{createTime:-1}}
            }, transformResponse : function (data) {
                return angular.fromJson(data).list;
            }},
            update: {method: 'PUT',
                interceptor: {
                    response: responseInterceptor
                }},
            total: {method: 'GET', url: '/api/article/attribute/length'}
        });
    }
]);

//经纪人服务
zhudelabServices.factory('agentService', ['$resource',
    function($resource){
        return $resource('/api/agent/:id', {id: '@id'}, {
            query: {isArray: true, transformResponse : function (data) {
                return angular.fromJson(data).list;
            }},
            pageQuery: {isArray: true, params: {
                dsl: 'mog',
                options: {skip:0, limit: 20, sort:{createTime:-1}}
            }, transformResponse : function (data) {
                return angular.fromJson(data).list;
            }, interceptor: {
                    response: responseInterceptor
                }},
            update: {method: 'PUT',
                interceptor: {
                    response: responseInterceptor
                }},
            total: {method: 'GET', url: '/api/agent/attribute/length'},
            customers: {
                isArray: true,
                method: 'GET',
                params: {
                    dsl: 'mog',
                    options: {skip:0, limit: 20, sort:{createTime:-1}}
                },
                url: '/api/agent/:id/customers',
                transformResponse : function (data) {
                    return angular.fromJson(data).list;
                },
                interceptor: {
                    response: responseInterceptor
                }
            },
            customersTotal: {
                method: 'GET',
                url: '/api/agent/:id/customers/length'
            },
            addCustomer: {
                method: 'POST',
                url: '/api/agent/:id/customers',
                interceptor: {
                    response: responseInterceptor
                }
            },
            editCustomer: {
                method: 'PUT',
                url: '/api/agent/:aid/customers/:cid',
                interceptor: {
                    response: responseInterceptor
                }
            },
            delCustomer: {
                method: 'DELETE',
                url: '/api/agent/:aid/customers/:cid',
                interceptor: {
                    response: responseInterceptor
                }
            },
            getCustomer: {
                method: 'GET',
                url: '/api/agent/customers/:id',
                interceptor: {
                    response: responseInterceptor
                },
                transformResponse : function (data) {
                    return angular.fromJson(data).customer;
                }
            },
            assignAgents: {method: 'POST', url: '/api/agent/:id/agents',
                interceptor: {
                    response: responseInterceptor
                }
            },
            agents: {
                method: 'GET',
                url: '/api/agent/:id/agents',
                isArray: true,
                params: {
                    dsl: 'mog',
                    options: {skip:0, limit: 20, sort:{createTime:-1}}
                },
                transformResponse : function (data) {
                    return angular.fromJson(data).list;
                },
                interceptor: {
                    response: responseInterceptor
                }
            },
            agentsTotal: {method: 'GET', url: '/api/agent/:id/agents/length'}
        });
    }
]);

//普通用户服务
zhudelabServices.factory('userService', ['$resource',
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

//订单服务
zhudelabServices.factory('orderService', ['$resource', function ($resource) {
    return $resource('/api/order/:id', {id: '@id'}, {
        query: {
            isArray: true,
            transformResponse : function (data) {
                return angular.fromJson(data).list;
            },
            params: {
                dsl: 'mog',
                options: {sort:{createTime:-1}}
            },
            interceptor: {
                response: responseInterceptor
            }
        },
        pageQuery: {
            method: 'get',
            isArray: true,
            params: {
                dsl: 'mog',
                options: {skip:0, limit: 20, sort:{createTime:-1}}
            },
            transformResponse : function (data) {
                return angular.fromJson(data).list;
            },
            interceptor: {
                response: responseInterceptor
            }
        },
        update: {
            method: 'PUT',
            interceptor: {
                response: responseInterceptor
            }},
        delete: {
            method: 'DELETE',
            interceptor: {
                response: responseInterceptor
            }
        },
        total: {
            method: 'GET',
            url: '/api/order/:id/length'
        }
    });
}]);

//商品服务
zhudelabServices.factory('goodService', ['$resource', function($resource){
        return $resource('/api/good/:id', {id: '@id'}, {
            query: {isArray: true, transformResponse : function (data) {
                return angular.fromJson(data).list;
            }},
            pageQuery: {isArray: true, params: {
                dsl: 'mog',
                options: {skip:0, limit: 20, sort:{createTime:-1}}
            }, transformResponse : function (data) {
                return angular.fromJson(data).list;
            }},
            update: {method: 'PUT',
                interceptor: {
                    response: responseInterceptor
                }},
            subnumber: {method: 'GET', url: '/api/good/:id/subnumber'},
            total: {method: 'GET', url: '/api/good/:id/length'}
        });
    }
]);