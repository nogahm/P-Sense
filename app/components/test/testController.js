angular.module("pointsOfInterest")
    .controller('testController', ['$scope', '$http', 'localStorageModel', '$rootScope', 'ngDialog', '$location', '$window','localStorageService',
        function ($scope, $http, localStorageModel, $rootScope, ngDialog, $location, $window,localStorageService) {
            let self = this;
            self.httpReq = 'https://psense.herokuapp.com/';
            // -----NotRegInfo-----
            self.isReg = false; //TODO - find if user is registed or not
            if (self.isReg) {
                $location.path('/report');
                $location.replace();
            }
            self.notRegUser = { firstName: '', lastName: '', age: null, gender: '', email: '', hand: '' };
            self.notRegId = null;
            //save not reg info and continue to report-not working
            self.saveInfo = function (valid) {
                if (valid) {
                    //save info and get userId
                    $http.post(self.httpReq + "Users/NotRegUser", self.notRegUser).then(function (res) {
                        self.notRegId = res.data;
                        // localStorageModel.addLocalStorage('userId', self.notRegId);
                        localStorageService.set('userId', self.notRegId)
                        $location.path('/video');
                        $location.replace();

                    },
                        function (error) {
                            alert('failed, please try again' + error);
                        }
                    );
                }
            };

            // -----Video-----
            self.nextTophase3=function(){
                $location.path('/report');
                $location.replace();
            }

            // -----Report-----
            self.hasSmartBracelate = false;
            self.happyLevel;
            self.calmLevel;
            self.sys=-1;
            self.dia=-1;
            self.pulse=-1;
            
            self.reportAndStart=function(){
                physicalIndices=true;
                if(self.hasSmartBracelate&&(self.sys==0 || self.dia==0 || self.pulse==0)){
                    physicalIndices=false;
                }
                if(self.happyLevel>0 && self.calmLevel>0 && physicalIndices){
                    //save localy the reported info and start test
                    // localStorageModel.addLocalStorage('reportInfo', {happyLevel:self.happyLevel, calmLevel:self.calmLevel, sys:self.sys, dia:self.dia, pulse:self.pulse});
                    localStorageService.set('reportInfo', {happyLevel:self.happyLevel, calmLevel:self.calmLevel, sys:self.sys, dia:self.dia, pulse:self.pulse});
                    $location.path('/startTest');
                    $location.replace();
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
            

            self.ids=[];

            self.findTest = function () {
                
                //save start time
                self.testStartTime=(new Date()).toISOString();
                let ids1=[];
                //get random numbers
                for(let i=0;i<5;i++)
                {
                    // console.log('find');
                    ids1[i]=Math.floor(Math.random() *100+3);
                    // console.log(ids1[i]);
                    
                }                   

          
                    //TODO--check if picture or sentence
                    for (let i = 0; i < ids1.length; i++) {
                        let picId = ids1[i];
                        $http.get(self.httpReq + "Questions/Pictures/" + ids1[i]).then(function (res) {
                            self.questions[i] = res.data[0].pictureUrl;
                            self.ids[i]=picId;
                            self.answers[i]=null;
                        },
                            function (error) {
                                //alert('failed to get picture from DB');
                            }
                        );
                    }
                }



            // self.findTest = function () {
            //     //save start time
            //     self.testStartTime=(new Date()).toISOString();
            //     //get from server
            //     $http.get(self.httpReq + "Questions/getRandomQuestions/" + self.numberOfQuestions).then(function (res) {
            //         let ids = res.data;
            //         //TODO--check if picture or sentence
            //         for (let i = 0; i < ids.length; i++) {
            //             let picId = ids[i].picSentenceId;
            //             $http.get(self.httpReq + "Questions/Pictures/" + ids[i].picSentenceId).then(function (res) {
            //                 self.questions[i] = res.data[0].pictureUrl;
            //                 self.ids[i]=picId;
            //             },
            //                 function (error) {
            //                     alert('failed to get picture from DB');
            //                 }
            //             );
            //         }
            //     },
            //         function (error) {
            //             alert('failed to load questions');
            //         }
            //     );

            // }
            self.findTest();


            self.prevQ = function () {
                if(self.currQ>0)
                    self.currQ--;
            }

            self.nextQ = function () {
                if(self.currQ<self.questions.length-1)
                    self.currQ++;
                if(self.currQ==self.questions.length-1)
                    self.finishTest=true;
            }


            self.SendAnsNotReg=function(){
                self.testEndTime=(new Date()).toISOString();
                // reportInfo=localStorageModel.getLocalStorage('reportInfo');
                reportInfo= localStorageService.get('reportInfo')
                let answersArr=[];
                for(i=0;i<self.questions.length;i++){
                    picId=self.ids[i];
                    ans=self.answers[i];
                    if(ans ==undefined)
                    {
                        ans="";
                    }
                    answersArr[i]={qId:picId, answer:ans};
                }
                testAnswer={
                    // userId: localStorageModel.getLocalStorage('userId'),
                    userId:localStorageService.get('userId'),
                    startTime: self.testStartTime,
                    endTime: self.testEndTime,
                    answers: answersArr,
                    happyLevel: reportInfo.happyLevel,
                    calmLevel: reportInfo.calmLevel,
                    bpSYS: reportInfo.sys,
                    bpDIA: reportInfo.dia,
                    pulse: reportInfo.pulse
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
