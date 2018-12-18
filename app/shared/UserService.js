
//-------------------------------------------------------------------------------------------------------------------
angular.module("pointsOfInterest")
    .service('UserService', ['$http', 'localStorageService', '$filter', '$rootScope', '$location',
        function ($http, localStorageService, $filter, $rootScope, $location) {
            let service = {};

            service.initUser = function () {
                $rootScope.guest = true;
                $rootScope.UserName = '';
                if (localStorageService.isSupported) {
                    let user = localStorageService.get('user');
                    if (user) {
                        $rootScope.UserName = user.UserName; 

                        $http.defaults.headers.common[ 'x-access-token' ]=user.token;
                        $rootScope.guest = false;                 //update that this is not a guest

                        //update the userObject
                        var userObject = { UserName: user.UserName, token: user.token }
                        localStorageService.set('user', userObject);
                    }
                }
            };


            service.getRandomPoints = function () {
                $http.get('point/RandomPoints/3')
                    .then(function (res) {
                        $rootScope.top3 = res.data;
                    }).catch(function (e) {
                        return Promise.reject(e);
                    });
                if (!$rootScope.guest) {
                        $http.get('reg/user/twoPopularPoints/' + $rootScope.UserName)
                            .then(function (res) {
                                $rootScope.popular2 = res.data;
                            })
                            .catch(function (e) {
                                return Promise.reject(e);
                            });                   
                        $http.get('reg/user/twoLastPoints/' + $rootScope.UserName)
                            .then(function (res) {
                                $rootScope.latest2 = res.data;
                            })
                            .catch(function (e) {
                                return Promise.reject(e);
                            });
                }
            };

            service.getDetails = function () {
                let points = $rootScope.latest2;
                let details = [];
                for (var i = 0; i < points.length; i++) {
                    $http.get('point/details/' + points[i].PointID)
                        .then(function (res) {
                            details.append(res.data);
                        })
                        .catch(function (e) {
                            return Promise.reject(e);
                        });
                }
                $rootScope.pointsDetails = details;
            };

            service.login = function (user) {
                return $http.post('auth/login', user)
                    .then(function (response) {
                        let token = response.data.token;
                        $http.defaults.headers.common = {
                            'token': token,
                            'user': user.UserName
                        };
                        return Promise.resolve(response);
                    })
                    .catch(function (e) {
                        return Promise.reject(e);
                    });
            };

            service.logout = function () {
                localStorageService.remove('user');
                $location.path("/");
                $rootScope.latest2 = null;
                $rootScope.popular2 = null;
                $rootScope.guest = false;
                localStorageService.remove($rootScope.UserName + 'Points');
                localStorageService.remove($rootScope.UserName + 'Removed');

            };
            return service;
        }]);
