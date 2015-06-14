/**
 * Created by Yan Jixian on 2015/1/26.
 */

var zhudelabControllers = angular.module('zhudelabControllers', []);

zhudelabControllers.pageSize = 10;

zhudelabControllers.controller('HeaderCtrl', ['$rootScope', '$scope', '$location', 'adminService', 'authService', 'cfpLoadingBar', function ($rootScope, $scope, $location, adminService, authService, cfpLoadingBar) {
    $scope.logout = function () {
        adminService.logout(function () {
            authService.setUser(null);
            $location.url('/login');
        });
    };

    $scope.$on('$routeChangeStart', function(scope, next, current) {
        if (next.$$route && next.$$route.loadingBar) {
            cfpLoadingBar.start();
        }
        var permissionArr = next.$$route && next.$$route.permission;
        if(angular.isArray(permissionArr) && !authService.hasPermission(permissionArr)) {
            $location.url('/error/401');
        }
    });

}]);

zhudelabControllers.controller('DashboardCtrl', ['adminService', 'authService','$rootScope', '$scope', '$location', function (adminService, authService, $rootScope, $scope, $location) {


}]);

zhudelabControllers.controller('ErrorCtrl', ['$rootScope', '$scope', '$routeParams','errors', function ( $rootScope, $scope, $routeParams, errors) {
    var code = $routeParams.code;
    $scope.error = errors[code].message;
}]);

//系统日志
zhudelabControllers.controller('LogsCtrl',['$scope', '$location', 'logService', function ($scope, $location, logService) {
    $scope.pageSize = zhudelabControllers.pageSize;
    $scope.currentPage = 1;
    updateItem();

    $scope.pageClick = function (page) {
        $scope.logs = logService.pageQuery({
            options: {skip:$scope.pageSize* (page-1),
            limit: $scope.pageSize,
            sort:{timestamp:-1}}
        });
    };
    //$scope.del = function (id) {
    //    if (window.confirm('确认删除？')){
    //        articleService.delete({id: id}, function () {
    //            updateItem();
    //        });
    //    }
    //};

    function updateItem() {
        logService.total( function (data) {
            $scope.total = data.data.count;
        });
        $scope.logs = logService.pageQuery({
            options: {skip:$scope.pageSize* ($scope.currentPage-1),
                limit: $scope.pageSize,
                sort:{timestamp:-1}}
        });
    }

}]);

//用户登录
zhudelabControllers.controller('LoginCtrl', ['$rootScope','$scope', '$location', 'adminService', 'authService',function ($rootScope, $scope, $location, adminService, authService) {

    $scope.login= function (username, password) {

        adminService.login({username:username,password:password}, function (data) {
            if (data.ok === false) {
                alert('用户信息错误', data.err);
            }else {
                authService.setUser(data.user);
                $location.url('/dashboard');
            }

        });
    };
}]);


//文章管理控制器
//获取文章
zhudelabControllers.controller('ArticlesCtrl',['$scope', '$location', 'articleService', 'authService', 'cfpLoadingBar', function ($scope, $location, articleService, authService, cfpLoadingBar) {
    $scope.pageSize = zhudelabControllers.pageSize;
    $scope.currentPage = 1;
   updateItem();

    $scope.pageClick = function (page) {
        $scope.articles = articleService.pageQuery({conditions:{type: 'information'}, options: {skip:$scope.pageSize* (page-1), limit: $scope.pageSize, sort:{createTime:-1}}});
    };
    $scope.del = function (id) {
        if (window.confirm('确认删除？')){
            articleService.delete({id: id}, function () {
                updateItem();
            });
        }
    };

    $scope.edit = function (id) {
        cfpLoadingBar.start();
        $location.url('/articles/edit/'+id);
    };

    function updateItem() {
        articleService.total({ conditions:{type: 'information'}}, function (data) {
            $scope.total = data.count;
        });
        $scope.articles = articleService.pageQuery({
            conditions:{type: 'information'},
            options: {skip:$scope.pageSize* ($scope.currentPage-1), limit: $scope.pageSize, sort:{createTime:-1}}});
    }

}]);

//添加文章
zhudelabControllers.controller('ArticleAddCtrl',['$scope', '$location', '$upload', 'articleService', 'cfpLoadingBar', function ($scope, $location, $upload, articleService, cfpLoadingBar) {
    var editor = UE.getEditor('content');
    $scope.article = {
        type: 'information',
        cover: '',
        titleCover: []
    };
    $scope.operate = '添加';

    $scope.upload = function (files, array) {
        if (array) {
            $scope.article.titleCover.length = 0;
        }
        if (files && files.length) {
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                $upload.upload({
                    url: 'api/upload/articleImage',
                    file: file,
                    method: 'post'
                }).success(function (data, status, headers, config) {
                    if (array) {
                        $scope.article.titleCover.push(data.url);
                    } else {
                        $scope.article.cover = data.url;
                    }
                }).error(function (data) {
                    alert(data.message);
                });
            }
        }
    };

    $scope.submit = function (invalid) {
        if (invalid) {
            return;
        }
        $scope.article.content = editor.getContent();
        if (!$scope.article.content) {
            return alert('内容为空你添加毛啊。')
        }
        articleService.save($scope.article, function (data) {
            editor.destroy();
            $location.url('/articles');
        });

    };

}]);

//修改文章
zhudelabControllers.controller('ArticleEditCtrl',['$scope', 'articleService', '$routeParams', '$location', '$upload', function ($scope, articleService, $routeParams, $location, $upload) {
    var editor = UE.getEditor('content');
    $scope.operate = '修改';

    $scope.upload = function (files, array) {
        if (array) {
            $scope.article.titleCover.length = 0;
        }
        if (files && files.length) {
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                $upload.upload({
                    url: 'api/upload/articleImage',
                    file: file,
                    method: 'post'
                }).success(function (data, status, headers, config) {
                    if (array) {
                        $scope.article.titleCover.push(data.url);
                    } else {
                        $scope.article.cover = data.url;
                    }
                }).error(function (data) {
                    alert(data.message);
                });
            }
        }
    };

    $scope.article = articleService.get({id: $routeParams.id}, function (data) {
        data.publishTime = new Date(data.publishTime);
        editor.ready(function() {
            editor.setContent(data.content);
        });
    });
    $scope.submit = function (invalid) {
        if (invalid) {
            return;
        }
        $scope.article.content = editor.getContent();
        if (!$scope.article.content) {
            return alert('内容为空你添加毛啊。')
        }
        if ($scope.article.title && $scope.article.content && $scope.article.summary && $scope.article.cover){
            $scope.article.id = $scope.article._id;
            $scope.article._id = undefined;
            articleService.update($scope.article, function (data) {
                editor.destroy();
                $location.url('/articles');
            });
        }
    };
}]);

//经纪人管理控制器
//经纪人列表
zhudelabControllers.controller('AgentsCtrl',['$scope', '$location', 'agentService', 'authService', function ($scope, $location, agentService, authService) {
    $scope.pageSize = zhudelabControllers.pageSize;
    $scope.currentPage = 1;
    updateItem();
    $scope.pageClick = function (page) {
        $scope.agents = agentService.pageQuery({ options: {skip:$scope.pageSize* (page-1), limit: $scope.pageSize, sort:{"createTime":-1}}});
    };
    $scope.del = function (id) {
        if (window.confirm('确认删除？')){
            agentService.delete({id: id}, function () {
                updateItem();
            });
        }
    };

    function updateItem() {
        agentService.total(function (data) {
            $scope.total = data.count;
        });
        $scope.agents = agentService.pageQuery({ options: {skip:$scope.pageSize* ($scope.currentPage-1), limit: $scope.pageSize, sort:{"createTime":-1}}});
    }

}]);

//添加经纪人
zhudelabControllers.controller('AgentAddCtrl',['$scope', '$location', 'agentService', '$upload', function ($scope, $location, agentService, $upload) {
    $scope.operate = '添加';
    $scope.user = {};
    $scope.agent = {
        isVip: false
    };
    $scope.submit = function (invalid) {
        if (invalid) {
            return;
        }
        $scope.user.isVip = $scope.agent.isVip;
        agentService.save($scope.user, function (data) {
            $location.url('/agents');
        });
    };

    $scope.upload = function (file) {

        if (file) {

            $upload.upload({
                url: '/api/user/uploadAvatar',
                file: file,
                method: 'post'
            }).success(function (data, status, headers, config) {

                $scope.user.avatar = data.url;

            }).error(function (data) {
                alert(data);
            });
        }

    };

}]);

//修改经纪人
zhudelabControllers.controller('AgentEditCtrl',['$scope', 'agentService', '$routeParams', '$location','$upload', function ($scope, agentService, $routeParams, $location, $upload) {
    $scope.operate = '修改';
    $scope.agent = agentService.get({id: $routeParams.id}, function (data) {
        $scope.user = data.user;
        delete $scope.user.password ;
    });
    $scope.submit = function (invalid) {
        if (invalid) {
            return;
        }
            $scope.agent.id = $scope.agent._id;
            $scope.agent._id = undefined;
            $scope.agent.userObj = $scope.user;
            $scope.agent.user = $scope.user._id;
            $scope.agent.userObj._id = undefined;
            agentService.update($scope.agent, function (data) {
                $location.url('/agents');
            });
    };

    $scope.upload = function (file) {

        if (file) {

            $upload.upload({
                url: '/api/user/uploadAvatar',
                file: file,
                method: 'post'
            }).success(function (data, status, headers, config) {

                $scope.user.avatar = data.url;

            }).error(function (data) {
                alert(data);
            });
        }

    };
}]);

//经纪人查看客户列表
zhudelabControllers.controller('AgentCustomersCtrl',['$scope', 'agentService', '$routeParams', '$location', function ($scope, agentService, $routeParams, $location) {
    $scope.agent = agentService.get({id: $routeParams.id});

    $scope.pageSize = zhudelabControllers.pageSize;
    $scope.currentPage = 1;
    updateItem();
    $scope.pageClick = function (page) {
        $scope.customers = agentService.customers({id: $routeParams.id, options: {skip:$scope.pageSize* (page-1), limit: $scope.pageSize, sort:{"createTime":-1}}});
    };

    $scope.del = function (id) {
        if (window.confirm('确认删除？')) {
            agentService.delCustomer({aid: $routeParams.id, cid: id}, function () {
                updateItem();
            });
        }
    };

    function updateItem() {
        agentService.customersTotal({id: $routeParams.id}, function (data) {
            $scope.total = data.count;
        });
        $scope.customers = agentService.customers({id: $routeParams.id, options: {skip:$scope.pageSize* ($scope.currentPage-1), limit: $scope.pageSize, sort:{"createTime":-1}}});
    }

}]);

//修改客户信息
zhudelabControllers.controller('CustomerEditCtrl', ['$scope', 'agentService', '$routeParams', '$location', function ($scope, agentService, $routeParams, $location) {
    $scope.operate = '修改';
    $scope.customer = agentService.getCustomer({id: $routeParams.cid});

    $scope.submit = function (invalid) {
        if (invalid) {
            return;
        }
        $scope.customer.user = $scope.customer.user._id;
        agentService.editCustomer({aid:$routeParams.aid, cid: $routeParams.cid}, $scope.customer, function (data) {
            $location.url('/agents/'+ $routeParams.aid + '/customers');
        });
    };
}]);

//添加客户
zhudelabControllers.controller('CustomerAddCtrl', ['$scope', 'agentService', '$routeParams', '$location', function ($scope, agentService, $routeParams, $location) {
    $scope.operate = '添加';
    $scope.customer = {};

    $scope.submit = function (invalid) {
        if (invalid) {
            return;
        }
        agentService.addCustomer({id: $routeParams.id},$scope.customer, function (data) {
            $location.url('/agents/'+ $routeParams.id + '/customers');
        });
    };

}]);

//修改经纪人信息
zhudelabControllers.controller('AgentEditCtrl',['$scope', 'agentService', '$routeParams', '$location', function ($scope, agentService, $routeParams, $location) {
    $scope.operate = '修改';
    $scope.agent = agentService.get({id: $routeParams.id}, function (data) {
        $scope.user = data.user;
        delete $scope.user.password ;
    });
    $scope.submit = function (invalid) {
        if (invalid) {
            return;
        }
        $scope.agent.id = $scope.agent._id;
        $scope.agent._id = undefined;
        $scope.agent.userObj = $scope.user;
        $scope.agent.user = $scope.user._id;
        $scope.agent.userObj._id = undefined;
        agentService.update($scope.agent, function (data) {
            $location.url('/agents');
        });
    };

}]);

//查看客户订单列表
zhudelabControllers.controller('OrdersCtrl', ['$scope', 'orderService', 'agentService', '$routeParams', function ($scope, orderService, agentService, $routeParams) {

    var customerId = $routeParams.id;
    $scope.customer = agentService.getCustomer({id: customerId});
    updateItem();

    $scope.modify = function (order) {
        order.modifyStatus = true;
    };
    $scope.save = function (order) {

        orderService.update({id: order._id}, {status: order.payStatus});

        order.modifyStatus = false;
    };
    $scope.del = function (id) {
        if (window.confirm('确认删除？')) {
            orderService.delete({id: id}, function () {
                updateItem();
            });
        }
    };

    function updateItem() {
        $scope.orders = orderService.query({
            conditions: {
                createUser: $routeParams.id
            }
        });
    }

}]);

//vip管理经纪人 TODO
zhudelabControllers.controller('AgentAssignCtrl',['$scope', 'agentService', '$routeParams', '$location', function ($scope, agentService, $routeParams, $location) {
    $scope.vip = agentService.get({id: $routeParams.id});

    $scope.pageSize = zhudelabControllers.pageSize;
    $scope.currentPage = 1;
    updateItem();
    $scope.pageClick = function (page) {
        updateItem();
    };

    $scope.del = function (id) {
        if (window.confirm('确认删除？')){
            agentService.delete({id: id}, function () {
                updateItem();
            });
        }
    };

    $scope.assign = function () {
        agentService.assignAgents({id: $scope.vip._id}, {agents: $scope.agents}, function () {
            updateItem();
        });
    };
    function updateItem() {
        agentService.total(function (data) {
            $scope.total = data.count;
        });
        agentService.pageQuery({
            conditions:{isVip: false},
            options: {skip:$scope.pageSize* ($scope.currentPage-1), limit: $scope.pageSize, sort:{"createTime":-1}}
        }, function (list) {
            list.data.forEach(function (agent) {
                if (agent.agent && agent.agent._id == $routeParams.id) {
                    agent.isAssign = true;
                } else {
                    agent.isAssign = false;
                }
            });
            $scope.agents = list.data;
        });
    }
}]);

//vip查看经纪人
zhudelabControllers.controller('AgentAgentsCtrl',['$scope', 'agentService', '$routeParams', '$location', function ($scope, agentService, $routeParams, $location) {
    $scope.vip = agentService.get({id: $routeParams.id});

    $scope.view = true;

    $scope.pageSize = zhudelabControllers.pageSize;
    $scope.currentPage = 1;
    updateItem();
    $scope.pageClick = function (page) {
        $scope.agents = agentService.agents({id: $routeParams.id, options: {skip:$scope.pageSize* (page-1), limit: $scope.pageSize, sort:{"createTime":-1}}});
    };


    function updateItem() {
        agentService.agentsTotal({id: $routeParams.id}, function (data) {
            $scope.total = data.count;
        });
        $scope.agents = agentService.agents({id: $routeParams.id, options: {skip:$scope.pageSize* ($scope.currentPage-1), limit: $scope.pageSize, sort:{"createTime":-1}}});
    }
}]);

//用户管理控制器
//用户列表
zhudelabControllers.controller('UsersCtrl',['$scope', '$location', 'userService', 'authService', function ($scope, $location, userService, authService) {
    $scope.pageSize = zhudelabControllers.pageSize;
    $scope.currentPage = 1;
    updateItem();
    $scope.pageClick = function (page) {
        $scope.users = userService.pageQuery({ options: {skip:$scope.pageSize* (page-1), limit: $scope.pageSize, sort:{"createTime":-1}}});
    };
    $scope.del = function (id) {
        if (window.confirm('确认删除？')){
            userService.delete({id: id}, function () {
                updateItem();
            });
        }
    };

    function updateItem() {
        userService.total(function (data) {
            $scope.total = data.count;
        });
        $scope.users = userService.pageQuery({ options: {skip:$scope.pageSize* ($scope.currentPage-1), limit: $scope.pageSize, sort:{"createTime":-1}}});
    }

}]);

//添加用户
zhudelabControllers.controller('UserAddCtrl',['$scope', '$location', 'userService', '$upload', function ($scope, $location, userService, $upload) {
    $scope.operate = '添加';
    $scope.user = {};

    $scope.submit = function (invalid) {
        if (invalid) {
            return;
        }
        userService.save($scope.user, function (data) {
            $location.url('/users');
        });
    };

    $scope.upload = function (file) {

        if (file) {

            $upload.upload({
                url: '/api/user/uploadAvatar',
                file: file,
                method: 'post'
            }).success(function (data, status, headers, config) {

                $scope.user.avatar = data.url;

            }).error(function (data) {
                alert(data);
            });
        }

    };

}]);

//修改用户
zhudelabControllers.controller('UserEditCtrl',['$scope', 'userService', '$routeParams', '$location', '$upload', function ($scope, userService, $routeParams, $location, $upload) {
    $scope.operate = '修改';

    userService.get({id: $routeParams.id}, function (data) {
        $scope.user = data.user;
        delete $scope.user.password;
    });
    $scope.upload = function (file) {
        if (file) {
            $upload.upload({
                url: '/api/user/uploadAvatar',
                file: file,
                method: 'post'
            }).success(function (data, status, headers, config) {

                $scope.user.avatar = data.url;

            }).error(function (data) {
                alert(data);
            });
        }
    };

    $scope.submit = function (invalid) {
        if (invalid) {
            return;
        }
        $scope.user.id = $scope.user._id;
        $scope.user._id = undefined;
        userService.update($scope.user, function (data) {
            $location.url('/users');
        });
    };
}]);


//房产管理控制器
//获取房产
zhudelabControllers.controller('HousesCtrl',['$scope', '$location', 'articleService', function ($scope, $location, articleService) {
    $scope.pageSize = zhudelabControllers.pageSize;
    $scope.currentPage = 1;
    updateItem();

    $scope.pageClick = function (page) {
        $scope.articles = articleService.pageQuery({conditions:{type: 'house'}, options: {skip:$scope.pageSize* (page-1), limit: $scope.pageSize, sort:{createTime:-1}}});
    };
    $scope.del = function (id) {
        if (window.confirm('确认删除？')){
            articleService.delete({id: id}, function () {
                updateItem();
            });
        }
    };

    function updateItem() {
        articleService.total({ conditions:{type: 'house'}}, function (data) {
            $scope.total = data.count;
        });
        $scope.articles = articleService.pageQuery({ conditions:{type: 'house'}, options: {skip:$scope.pageSize* ($scope.currentPage-1), limit: $scope.pageSize, sort:{createTime:-1}}});
    }

}]);

//添加房产
zhudelabControllers.controller('HouseAddCtrl',['$scope', '$location', 'articleService', '$upload', function ($scope, $location, articleService ,$upload) {
    var editor = UE.getEditor('content');
    $scope.article = {
        type: 'house',
        cover: '',
        titleCover: []
    };
    $scope.operate = '添加';
    $scope.submit = function (invalid) {
        if (invalid) {
            return;
        }
        $scope.article.content = editor.getContent();
        if (!$scope.article.content) {
            return alert('内容为空你添加毛啊。')
        }
        articleService.save($scope.article, function (data) {
            editor.destroy();
            $location.url('/houses');
        });
    };

    $scope.upload = function (files, array) {
        if (array) {
            $scope.article.titleCover.length = 0;
        }
        if (files && files.length) {
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                $upload.upload({
                    url: 'api/upload/articleImage',
                    file: file,
                    method: 'post'
                }).success(function (data, status, headers, config) {
                    console.log('done');
                    if (array) {
                        $scope.article.titleCover.push(data.url);
                    } else {
                        $scope.article.cover = data.url;
                    }
                }).error(function (data) {
                    alert(data.message);
                });
            }
        }
    };

}]);

//修改房产
zhudelabControllers.controller('HouseEditCtrl',['$scope', 'articleService', '$routeParams', '$location', '$upload', function ($scope, articleService, $routeParams, $location, $upload) {
    var editor = UE.getEditor('content');
    $scope.operate = '修改';
    $scope.article = articleService.get({id: $routeParams.id}, function (data) {
        data.publishTime = new Date(data.publishTime);
        editor.ready(function() {
            editor.setContent(data.content);
        });
    });
    $scope.submit = function (invalid) {
        if (invalid) {
            return;
        }
        $scope.article.content = editor.getContent();
        if (!$scope.article.content) {
            return alert('内容为空你添加毛啊。')
        }
        if ($scope.article.title && $scope.article.content && $scope.article.summary && $scope.article.cover){
            $scope.article.id = $scope.article._id;
            $scope.article._id = undefined;
            articleService.update($scope.article, function (data) {
                editor.destroy();
                $location.url('/houses');
            });
        }
    };

    $scope.upload = function (files, array) {
        if (array) {
            $scope.article.titleCover.length = 0;
        }
        if (files && files.length) {
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                $upload.upload({
                    url: 'api/upload/articleImage',
                    file: file,
                    method: 'post'
                }).success(function (data, status, headers, config) {
                    if (array) {
                        $scope.article.titleCover.push(data.url);
                    } else {
                        $scope.article.cover = data.url;
                    }
                }).error(function (data) {
                    alert(data.message);
                });
            }
        }
    };
}]);

//商品管理控制器
//获取商品列表
zhudelabControllers.controller('GoodsCtrl',['$scope', '$location', 'goodService', function ($scope, $location, goodService) {
    $scope.pageSize = zhudelabControllers.pageSize;
    $scope.currentPage = 1;
    updateItem();

    $scope.pageClick = function (page) {
        $scope.goods = goodService.pageQuery({ options: {skip:$scope.pageSize* (page-1), limit: $scope.pageSize, sort:{createTime:-1}}});
    };
    $scope.del = function (id) {
        if (window.confirm('确认删除？')){
            goodService.delete({id: id}, function () {
                updateItem();
            });
        }
    };


    function updateItem() {
        //TODO
        goodService.total({ id: 2342}, function (data) {
            $scope.total = data.count;
        });
        $scope.goods = goodService.pageQuery({
            options: {skip:$scope.pageSize* ($scope.currentPage-1), limit: $scope.pageSize, sort:{createTime:-1}}
        });
    }

}]);

//添加商品
zhudelabControllers.controller('GoodAddCtrl',['$scope', '$location', '$upload', 'goodService', function ($scope, $location, $upload, goodService) {

    $scope.good = {};
    $scope.operate = '添加';

    $scope.upload = function (files, array) {

        if (files && files.length) {
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                $upload.upload({
                    url: 'api/upload/goodImage',
                    file: file,
                    method: 'post'
                }).success(function (data, status, headers, config) {

                        $scope.good.typeImage = data.url;

                }).error(function (data) {
                    alert(data.message);
                });
            }
        }
    };

    $scope.submit = function (invalid) {
        if (invalid) {
            return;
        }

        goodService.save($scope.good, function (data) {
            $location.url('/goods');
        });

    };

}]);

//修改商品
zhudelabControllers.controller('GoodEditCtrl',['$scope', 'goodService', '$routeParams', '$location', '$upload', function ($scope, goodService, $routeParams, $location, $upload) {

    $scope.operate = '修改';

    $scope.upload = function (files, array) {

        if (files && files.length) {
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                $upload.upload({
                    url: 'api/upload/goodImage',
                    file: file,
                    method: 'post'
                }).success(function (data, status, headers, config) {

                    $scope.good.typeImage = data.url;

                }).error(function (data) {
                    alert(data.message);
                });
            }
        }
    };

    $scope.good = goodService.get({id: $routeParams.id});
    $scope.submit = function (invalid) {
        if (invalid) {
            return;
        }

            $scope.good.id = $scope.good._id;
            $scope.good._id = undefined;
            goodService.update($scope.good, function (data) {
                $location.url('/goods');
            });
    };
}]);