

angular.module("pointsOfInterest")
    .controller('testController', ['$scope', '$http', 'localStorageService', '$rootScope', 'ngDialog', '$location', '$window',
        function ($scope, $http, localStorageService, $rootScope, ngDialog, $location, $window) {
            let self = this;
            self.hasSmartBracelate = false;
            self.httpReq = 'http://localhost:3000/';
            // -----NotRegInfo-----
            self.isReg = false; //TODO - find if user is registed or not
            if (self.isReg) {
                $location.path('/report');
                $location.replace();
            }
            self.notRegUser = { firstName: '', lastName: '', age: null, gender: '', email: '' };
            self.notRegId = null;
            //save not reg info and continue to report-not working
            self.saveInfo = function (valid) {
                if (valid) {
                    //save info and get userId
                    $http.post(self.httpReq + "Users/NotRegUser", self.notRegUser).then(function (res) {
                        self.notRegId = res.data;
                        $location.path('/report');
                        $location.replace();
                    },
                        function (error) {
                            alert('failed, please try again' + error);
                        }
                    );
                }
            };

            //-----Test-----
            self.numberOfQuestions = 3;
            self.questions = [];
            self.answers = [];
            self.currQ = 0;
            self.finishTest=false;
            // self.ids=[];

            self.findTest = function () {
                //get from server
                $http.get(self.httpReq + "Questions/getRandomQuestions/" + self.numberOfQuestions).then(function (res) {
                    let ids = res.data;
                    //TODO--check if picture or sentence
                    for (let i = 0; i < ids.length; i++) {
                        // let picId = ids[i].picSentenceId;
                        $http.get(self.httpReq + "Questions/Pictures/" + ids[i].picSentenceId).then(function (res) {
                            self.questions[i] = res.data[0].pictureUrl;
                        },
                            function (error) {
                                alert('failed to get picture from DB');
                            }
                        );
                    }
                },
                    function (error) {
                        alert('failed to load questions');
                    }
                );

            }
            self.findTest();


            self.prevQ = function () {
                if(self.currQ>0)
                    self.currQ--;
            }

            self.nextQ = function () {
                if(self.currQ<self.questions.length-1)
                    self.currQ++;
                else
                    self.finishTest=true;
            }

            // self.UserAns={userId:'1', startTime:'1900-01-01T00:00:00.0000000', endTime:'1900-01-01T00:00:00.0000000', answers: self.answers, happyLevel:1, calmLevel:1, bpSYS:100, bpDIA:150, pulse:100};
            // self.SendAns=function(){

            //     $http.post(self.httpReq + "/Tests/NotReg/AddAnswers", self.UserAns).then(function (res) {
            //         self.notRegId = res.data;
            //         $location.path('/report');
            //         $location.replace();
            //     },
            //         function (error) {
            //             alert('failed, please try again' + error);
            //         }
            //     );
            // }
        }]);
