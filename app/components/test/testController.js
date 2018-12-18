

angular.module("pointsOfInterest")
    .controller('testController', ['$scope', '$http', 'localStorageService', '$rootScope', 'ngDialog',
        function ($scope, $http, localStorageService, UserService, pointsService, $rootScope, favoritesService, ngDialog) {
            let self = this;
            self.hasSmartBracelate=false;
            // self.categoryHeader = "Test";
            // self.showAll = true;
            // self.sortedOptions = [{ name: 'point name', label: 'PointName', reverse: false },
            // { name: 'Rank - low to high', label: 'Rank', reverse: false },
            // { name: 'Rank - high to low', label: 'Rank', reverse: true }];
            // self.filterBy = "";
            // self.orderBy = "";
            // self.reverseSort = false;

            // self.selectedPoint = null;
            // self.currentFavorites = null;
            // self.points = null;


            // let html = '<img ng-src="{{ngDialogData.Pic}}" class="modalImg"/> <br/> '
            //     + ' <label class="modalHeader">Name:</label> <label class="modalText">{{ngDialogData.PointName}}</label> <br/>  '
            //     + ' <label class="modalHeader">Rank (1-5): </label> <label class="modalText"> {{ngDialogData.Rank}}% </label> <br/>'
            //     + ' <label class="modalHeader">Num of views: </label> <label class="modalText">{{ngDialogData.NumOfView}}</label> <br/>'
            //     + ' <label class="modalHeader">Description: </label> <label class="modalText"> {{ngDialogData.Description}}</label> <br/>'
            //     + ' <label class="modalHeader">Review-1: </label> <label class="modalText"> "{{ngDialogData.Review}}"</label> <br/>'
            //     + ' <label class="modalHeader">Review-2: </label> <label class="modalText"> "{{ngDialogData.Review2}}"</label> <br/>';

            // let htmlReview = '<div ng-controller="pointsController  as pointCtrl">'
            //     + '<img ng-src="{{ngDialogData.Pic}}" class="modalImg"/> <br/> '
            //     + ' <label class="modalHeader">Name:</label> <label class="modalText">{{ngDialogData.PointName}}</label> <br/> <br/>  '
            //     + ' <label class="modalHeader">Rank: </label> <input type="number" class="form-control logInput" name="rankInput" ng-model="ngDialogData.rankInput" placeholder="Enter your Rank" min="1" max="5"> <br/> <br/> '
            //     + ' <label class="modalHeader">Review: </label> <input type="text" class="form-control logInput" name="reviewInput" ng-model="ngDialogData.reviewInput" placeholder="Enter your Review"> <br/> <br/> '
            //     + ' <button class="description_button" ng-click="pointCtrl.saveRank(ngDialogData)"> Add </button> <br/> </div>';

            // pointsService.allpoints()
            //     .then(function () {
            //         self.points = pointsService.points; // now all the points are save in pointservice.points !
            //         favoritesService.allpoints()
            //             .then(function () {
            //                 if (!$rootScope.guest) {
            //                     self.currentFavorites = favoritesService.points;
            //                     for (let i = 0; i < self.points.length; i++) {
            //                         for (let j = 0; j < self.currentFavorites.length; j++) {
            //                             if (self.points[i].PointID === self.currentFavorites[j].PointID) {
            //                                 self.points[i].inFav = true;
            //                                 break;
            //                             }
            //                             else {
            //                                 self.points[i].inFav = false;
            //                             }
            //                         }
            //                     }
            //                 }
            //                 else {
            //                     for (let i = 0; i < self.points.length; i++) {
            //                         self.points[i].inFav = false;
            //                     }
            //                 }

            //             })
            //     });



            // $http.get('point/allCategories') // get categories
            //     .then(function (res) {
            //         self.categories = res.data;

            //     }).catch(function (e) {
            //         return Promise.reject(e);
            //     });

            // self.selectCategory = function (CategoryID) {
            //     self.showAll = false;
            //     self.categoryHeader = CategoryID;
            //     self.pointsByCategory = [];
            //     $http.get('point/' + CategoryID).then(function (res) {
            //         for (var i = 0; i < res.data.length; i++) {
            //             for (var j = 0; j < pointsService.points.length; j++) {
            //                 if (res.data[i].PointID === pointsService.points[j].PointID) {
            //                     self.pointsByCategory.push(pointsService.points[j]);
            //                 }
            //             }
            //         }
            //         self.points = self.pointsByCategory;
            //     });
            //     self.orderBy = "";
            // };

            // self.selectAll = function () {
            //     self.showAll = true;
            //     self.categoryHeader = "All points";
            //     self.points = pointsService.points;
            //     self.orderBy = "";
            // };

            // self.favorites = function (point) {
            //     if (!$rootScope.guest) {
            //         if (point.inFav === true) {
            //             point.inFav = false;
            //             favoritesService.removeFromfavorites(point);
            //         }
            //         else {
            //             point.inFav = true;
            //             favoritesService.addTofavorites(point);
            //         }
            //     }
            //     else {
            //         alert('If you want to add a point please log in first!');
            //     }
            // }


            // self.open = function (point) {
            //     self.selectedPoint = point;
            //     $http.put('point/upViews/' + self.selectedPoint.PointID)
            //         .then(function () {
            //             $http.get('point/details/' + point.PointID)
            //                 .then(function (res) {
            //                     for (let i = 0; i < self.points.length; i++) {
            //                         if (self.points[i].PointID === res.data[0].PointID) {
            //                             self.points[i].NumOfView = res.data[0].NumOfView;
            //                             self.points[i].Rank = res.data[0].Rank * 20;
            //                             self.points[i].Review = res.data[0].Review;
            //                             if (res.data.length >= 2) {
            //                                 self.points[i].Review2 = res.data[1].Review;
            //                             }
            //                             break;
            //                         }
            //                     }
            //                 })
            //                 .catch(function (e) {
            //                     return Promise.reject(e);
            //                 });
            //         })
            //         .catch(function (e) {
            //             return Promise.reject(e);
            //         });
            //     ngDialog.open({
            //         template: html,
            //         className: 'ngdialog-theme-default',
            //         data: self.selectedPoint,
            //         showClose: true,
            //         width: 640
            //     });
            // };

            // self.openRank = function (point) {
            //     ngDialog.open({
            //         template: htmlReview,
            //         className: 'ngdialog-theme-default',
            //         data: point,
            //         showClose: true,
            //         width: 640
            //     })
            // };

            // self.saveRank = function (point) {
            //     if (!(point.rankInput === null && point.reviewInput === '')) {
            //         if (point.rankInput > 0 && point.rankInput <= 5) {
            //             $http.post('reg/user/addRankToPoint', { PointID: point.PointID, Rank: point.rankInput, UserName: $rootScope.UserName })
            //                 .catch(function (e) {
            //                     return Promise.reject(e);
            //                 });
            //             $http.post('reg/user/addReviewToPoint', { PointID: point.PointID, Review: point.reviewInput, UserName: $rootScope.UserName })
            //                 .catch(function (e) {
            //                     return Promise.reject(e);
            //                 });
            //             point.rankInput = null;
            //             point.reviewInput = '';
            //             alert('Rank & Review Saved Succesfuly!');
            //         } else {
            //             alert('Error: Rank should be between 1 to 5');
            //         }
            //     }
            //     else {
            //         alert('Please enter Rank / Review');
            //     }

            // };


        }]);
