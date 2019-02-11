

angular.module("pointsOfInterest")
    .controller('testController', ['$scope', '$http', 'localStorageService', '$rootScope', 'ngDialog', '$location', '$window',
        function ($scope, $http, localStorageService, $rootScope, ngDialog, $location, $window) {
            let self = this;
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
                        // $location.path('/report');
                        // $location.replace();
                        $location.path('/report').replace().reload(false)

                    },
                        function (error) {
                            alert('failed, please try again' + error);
                        }
                    );
                }
            };

            // -----Report-----
            self.hasSmartBracelate = false;
            self.sadnessLevel;
            self.stressLevel;
            self.sys;
            self.dia;
            self.pulse;
            
            
            self.reportAndStart=function(){
                physicalIndices=true;
                if(self.hasSmartBracelate&&(self.sys==0 || self.dia==0 || self.pulse==0)){
                    physicalIndices=false;
                }
                if(self.sadnessLevel>0 && self.stressLevel>0 && physicalIndices){
                    //save localy the reported info and start test
                    $location.path('/startTest').replace().reload(false)
                }

            }

            //-----Test-----
            self.numberOfQuestions = 5;
            self.questions=[];
            self.answers=[];
            self.currQ = 0;
            self.finishTest=false;
            self.testStartTime;
            self.testEndTime;
            

            // self.ids=[];

            self.findTest = function () {
                //save start time
                self.testStartTime=new Date().getTime();
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

            self.SendAnsNotReg=function(){
                self.testEndTime=new Date().getTime();
                testAnswer={
                    userId: self.userId,
                    startTime: self.testStartTime,
                    endTime: self.testEndTime,
                    answers: self.answers,
                    happyLevel: self.happyLevel,
                    calmLevel: self.calmLevel,
                    bpSYS: self.sys,
                    bpDIA: self.dia,
                    pulse: self.pulse
                }
                $http.post(self.httpReq + "Tests/NotReg/AddAnswers", testAnswer).then(function (res) {
                    alert("Thank you for your answers!")
                    $location.path('/home');
                    $location.replace();
                },
                    function (error) {
                        alert('failed, please try again' + error);
                    }
                );
            }

        }]);
