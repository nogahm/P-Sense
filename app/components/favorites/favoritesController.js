

// angular.module("pointsOfInterest")
// .controller('favoritesController', ['$scope', '$http', 'localStorageService', '$rootScope', 'ngDialog', 'favoritesService',
//     function ($scope, $http, localStorageService, $rootScope, ngDialog, favoritesService) {
//         let self = this;
//         self.selectedPoint = null;

//         let html = '<img ng-src="{{ngDialogData.Pic}}" class="modalImg"/> <br/> '
//             + ' <label class="modalHeader">Name:</label> <label class="modalText">{{ngDialogData.PointName}}</label>  <br/>  '
//             + ' <label class="modalHeader">Rank (1-5): </label> <label class="modalText"> {{ngDialogData.Rank}}% </label>  <br/>'
//             + ' <label class="modalHeader">Num of views: </label> <label class="modalText">{{ngDialogData.NumOfView}}</label> <br/>'
//             + ' <label class="modalHeader">Description: </label> <label class="modalText"> {{ngDialogData.Description}}</label> <br/>'
//             + ' <label class="modalHeader">Review-1: </label> <label class="modalText"> "{{ngDialogData.Review}}"</label> <br/>'
//             + ' <label class="modalHeader">Review-2: </label> <label class="modalText"> "{{ngDialogData.Review2}}"</label> <br/>';

//         let htmlReview = '<div ng-controller="pointsController  as pointCtrl">'
//             + '<img ng-src="{{ngDialogData.Pic}}" class="modalImg"/> <br/> '
//             + ' <label class="modalHeader">Name:</label> <label class="modalText">{{ngDialogData.PointName}}</label> <br/> <br/>  '
//             + ' <label class="modalHeader">Rank: </label> <input type="number" class="form-control logInput" name="rankInput" ng-model="ngDialogData.rankInput" placeholder="Enter your Rank" min="1" max="5"> <br/> <br/> '
//             + ' <label class="modalHeader">Review: </label> <input type="text" class="form-control logInput" name="reviewInput" ng-model="ngDialogData.reviewInput" placeholder="Enter your Review"> <br/> <br/> '
//             + ' <button class="description_button" ng-click="pointCtrl.saveRank(ngDialogData)"> Add </button> <br/> </div>';

//         self.categoryHeader = "All points";
//         self.showAll = true;
//         self.sortedOptions = [{ name: 'point name', label: 'PointName', reverse: false },
//         { name: 'Rank - low to high', label: 'Rank', reverse: false },
//         { name: 'Rank - high to low', label: 'Rank', reverse: true }];
//         self.filterBy = "";
//         self.orderBy = "";
//         self.reverseSort = false;

//         self.enterOrder = function () {
//             let favToRem = localStorageService.get($rootScope.UserName + 'Removed');
//             if (favToRem != null) {
//                 for (let i = 0; i < favToRem.length; i++) {
//                     let p = favToRem[i];
//                     $http({
//                         url: 'reg/user/deleteFromFavorite',
//                         dataType: "json",
//                         method: "DELETE",
//                         data: {
//                             UserName: $rootScope.UserName, PointID: p.PointID
//                         },
//                         headers: {
//                             "Content-Type": "application/json"
//                         }
//                     });
//                 }
//             }


//             let favToAdd = localStorageService.get($rootScope.UserName + 'Points');
//             if (favToAdd != null) {
//                 for (let i = 0; i < favToAdd.length; i++) {
//                     for (let j = 0; j < self.points.length; j++) {
//                         if (favToAdd[i].PointID === self.points[j].PointID) {
//                             let p = self.points[j];
//                             $http.post('reg/user/addToFavorite', { UserName: $rootScope.UserName, PointID: p.PointID, OrderNum: p.OrderNum }).catch(function (e) {
//                                 return Promise.reject(e);
//                             });
//                         }
//                     }

//                 }
//             }
//             let pointAndOrders = "";
//             for (let i = 0; i < self.points.length; i++) {
//                 pointAndOrders = pointAndOrders + self.points[i].PointID + ',' + self.points[i].OrderNum + ',';
//             }
//             $http.put('reg/user/updateFavOrder', { UserName: $rootScope.UserName, pointsOrder: pointAndOrders }).then(function (res) {

//             });
//             localStorageService.remove($rootScope.UserName + 'Points');
//             localStorageService.remove($rootScope.UserName + 'Removed');
//             alert('Favorite`s Order Save Succesfuly!');
//         };

//         favoritesService.allpoints()
//             .then(function () {
//                 self.points = favoritesService.points; 

//             });

//         self.favorites = function (point) {
//             if (point.inFav === true) {
//                 point.inFav = false;
//                 favoritesService.removeFromfavorites(point);
//             }
//             else {
//                 point.inFav = true;
//                 favoritesService.addTofavorites(point);
//             }
//             favoritesService.allpoints()
//                 .then(function () {
//                     self.points = favoritesService.points; 
//                 });
//         }

//         $http.get('point/allCategories')
//             .then(function (res) {
//                 self.categories = res.data;

//             }).catch(function (e) {
//                 return Promise.reject(e);
//             });

//         self.selectCategory = function (CategoryID) {
//             self.showAll = false;
//             self.categoryHeader = CategoryID;
//             self.pointsByCategory=[];
//             $http.get('point/' + CategoryID).then(function (res) {
//                 for(var i=0; i<res.data.length;i++){
//                     for(var j=0; j<favoritesService.points.length;j++){
//                         if(res.data[i].PointID===favoritesService.points[j].PointID){
//                             self.pointsByCategory.push(favoritesService.points[j]);
//                         }
//                     }
//                 }
//                 self.points = self.pointsByCategory;
//             });
//             self.orderBy = "";
//         };

//         self.selectAll = function () {
//             self.showAll = true;
//             self.categoryHeader = "All points";
//             self.points = favoritesService.points;
//             self.orderBy = "";
//         };

//         self.open = function (point) {
//             self.selectedPoint = point;
//             $http.put('point/upViews/' + self.selectedPoint.PointID)
//                 .then(function(){
//                     $http.get('point/details/' + point.PointID)
//                     .then(function (res) {
//                         for (let i = 0; i < self.points.length; i++) {
//                             if(self.points[i].PointID===res.data[0].PointID){
//                                 self.points[i].NumOfView = res.data[0].NumOfView;
//                                 self.points[i].Rank = res.data[0].Rank * 20;
//                                 self.points[i].Review = res.data[0].Review;
//                                 if (res.data.length >= 2) {
//                                     self.points[i].Review2 = res.data[1].Review;
//                                 }
//                                 break;
//                             }
//                         }})
//                         .catch(function (e) {
//                             return Promise.reject(e);
//                         });
//                 })
//                 .catch(function (e) {
//                     return Promise.reject(e);
//                 });

//             ngDialog.open({
//                 template: html,
//                 className: 'ngdialog-theme-default',
//                 data: point,
//                 showClose: true,
//                 width: 640
//             });
//         };

//         self.openRank = function (point) {
//             ngDialog.open({
//                 template: htmlReview,
//                 className: 'ngdialog-theme-default',
//                 data: point,
//                 showClose: true,
//                 width: 640
//             })
//         };

//         self.saveRank = function (point) {
//             if (!(point.rankInput === null && point.reviewInput === '')) {
//                 if(point.rankInput>0 && point.rankInput<=5){
//                 $http.post('reg/user/addRankToPoint', { PointID: point.PointID, Rank: point.rankInput, UserName: $rootScope.UserName })
//                     .catch(function (e) {
//                         return Promise.reject(e);
//                     });
//                 $http.post('reg/user/addReviewToPoint', { PointID: point.PointID, Review: point.reviewInput, UserName: $rootScope.UserName })
//                     .catch(function (e) {
//                         return Promise.reject(e);
//                     });

//                 point.rankInput = null;
//                 point.reviewInput = '';
//                 alert('Rank & Review Saved Succesfuly!');
//             }
//             else{
//                 alert('Error: Rank should be between 1 to 5');
//             }
//         }
//             else {
//                 alert('Please enter Rank / Review');
//             }

//         };

//     }]);