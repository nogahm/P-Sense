
angular.module("pointsOfInterest")
.controller('homeController', ['$scope', '$http', 'localStorageService', '$rootScope', 'UserService', 'ngDialog','$window','$location',
    function ($scope, $http, localStorageService, $rootScope, UserService, ngDialog,$window,$location) {
        let self = this;
        self.checkbok=false;
        //startTest
        self.startTest=function()
        {
            // $location.path('./components/test/infoNotReg.html');
            // $location.replace();
            $window.location.href = "#/test";
        }
        
        // self.selectedPoint = null;


        // let html = '<img ng-src="{{ngDialogData.Pic}}" class="modalImg"/> <br/> '
        //     + ' <label class="modalHeader">Name:</label> <label class="modalText">{{ngDialogData.PointName}}</label>  <br/>  '
        //     + ' <label class="modalHeader">Rank: </label> <label class="modalText"> {{ngDialogData.Rank}}%</label>  <br/>'
        //     + ' <label class="modalHeader">Num of views: </label> <label class="modalText">{{ngDialogData.NumOfView}}</label> <br/>'
        //     + ' <label class="modalHeader">Description: </label> <label class="modalText"> {{ngDialogData.Description}}</label> <br/>'
        //     + ' <label class="modalHeader">Review-1: </label> <label class="modalText"> "{{ngDialogData.Review}}"</label> <br/>'
        //     + ' <label class="modalHeader">Review-2: </label> <label class="modalText"> "{{ngDialogData.Review2}}"</label> <br/>';

        // UserService.getRandomPoints();

        // self.addTofavorites = function (point) {
        //     favoritesService.addTofavorites(point);
        // }

        // self.open = function (point) {
        //     self.selectedPoint = point;
        //     $http.put('point/upViews/' + self.selectedPoint.PointID)
        //     .catch(function (e) {
        //         return Promise.reject(e);
        //     });
        //     $http.get('point/details/' + self.selectedPoint.PointID)
        //         .then(function (res) {
        //             let pointDetails = res.data[0];
        //             if (res.data.length >= 2) {
        //                 pointDetails.Review2 = res.data[1].Review;
        //             }
        //             pointDetails["Rank"]=pointDetails["Rank"]*20;
        //             ngDialog.open({
        //                 template: html,
        //                 className: 'ngdialog-theme-default',
        //                 data: pointDetails,
        //                 showClose: true,
        //                 width: 640
        //             });
        //         })
        //         .catch(function (e) {
        //             return Promise.reject(e);
        //         });

        // };

    }]);

    

