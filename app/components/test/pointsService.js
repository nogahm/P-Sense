
angular.module("pointsOfInterest")
    .service('pointsService', ['$http', 'localStorageService', '$filter', '$rootScope',
        function ($http, localStorageService, $filter, $rootScope) {
            let service = {};
            service.points = [];

            // service.allpoints = function () {
            //     return $http.get('/test/')
            //         .then(function (res) {
            //             Promise.resolve(res.data);
            //             service.points = res.data;

            //             for (let i = 0; i < service.points.length; i++) { //look for this point using lookup table
            //                 $http.get('point/details/' + service.points[i].PointID)
            //                     .then(function (res) {
            //                         service.points[i].Rank = res.data[0].Rank * 20;
            //                         service.points[i].NumOfView = res.data[0].NumOfView;
            //                         service.points[i].Description = res.data[0].Description;
            //                         service.points[i].Review = res.data[0].Review;
            //                         if (res.data.length >= 2) {
            //                             service.points[i].Review2 = res.data[1].Review;
            //                         }
            //                     })
            //                     .catch(function (e) {
            //                         return Promise.reject(e);
            //                     });
            //             }
            //         })

            //         .catch(function (e) {
            //             return Promise.reject(e);
            //         });
            // };

            return service;
        }]);