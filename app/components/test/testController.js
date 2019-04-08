angular.module("pointsOfInterest")
    .controller('testController', ['$scope', '$http', 'localStorageModel', '$rootScope', 'ngDialog', '$location', '$window','localStorageService',
        function ($scope, $http, localStorageModel, $rootScope, ngDialog, $location, $window,localStorageService) {
            let self = this;
            self.httpReq = 'https://psense.herokuapp.com/';
            // self.httpReq = 'localhost:3000/';
            // -----NotRegInfo-----
            self.isReg = false; //TODO - find if user is registed or not
            if (self.isReg) {
                $location.path('/report');
                $location.replace();
            }

            
            self.notRegUser = { age: null, gender: '', email: '', hand: '' };
            self.notRegId = null;
            //save not reg info and continue to report-not working
            self.saveInfo = function (valid) {
                if (valid) {
                    //save info and get userId
                    $http.post(self.httpReq + "Users/NotRegUser", self.notRegUser).then(function (res) {
                        self.notRegId = res.data;
                        self.infoSaved=true;
                        // localStorageModel.addLocalStorage('userId', self.notRegId);
                        localStorageService.set('userId', Number(self.notRegId));
                        localStorageService.set('reportTime', 0);
                        localStorageService.set('testTime', 0);
                        self.findTest();

                        $location.path('/report');
                        $location.replace();

                    },
                        function (error) {
                            alert('failed, please try again' + error);
                        }
                    );
                }
            };

            // -----Video-----
            self.videoEnded=false;
            self.stress=((localStorageService.get('userId')%2!=0)&&(localStorageService.get('testTime')==0)) || ((localStorageService.get('userId')%2==0)&&(localStorageService.get('testTime')>0));
            self.nextTophase3=function(){
                $location.path('/report');
                $location.replace();
            }
            self.videoEnded=function(number)
            {
                alert('ended');
                self.videoEnded=(number==0 && !self.stress) || (number==1 && self.stress);
            }

            // -----Report-----
            self.hasSmartBracelate = false;
            self.happyLevel;
            self.calmLevel;
            self.sys=-1;
            self.dia=-1;
            self.pulse=-1;
            

            self.reportAndStart=function(){
                let reportTime=localStorageService.get('reportTime')

                physicalIndices=true;

                if(self.hasSmartBracelate&&(self.sys==undefined || self.dia==undefined || self.pulse==undefined ||self.sys==-1 || self.dia==-1 || self.pulse==-1)){
                    alert('Please report your physical indices');
                    return;
                }
                if(self.happyLevel>0 && self.calmLevel>0){
                    //save localy the reported info and start test
                    // localStorageModel.addLocalStorage('reportInfo', {happyLevel:self.happyLevel, calmLevel:self.calmLevel, sys:self.sys, dia:self.dia, pulse:self.pulse});
                    // localStorageService.set('reportInfo', {happyLevel:self.happyLevel, calmLevel:self.calmLevel, sys:self.sys, dia:self.dia, pulse:self.pulse});
                    //save report info
                    report={userId:localStorageService.get('userId'), happyLevel:self.happyLevel, calmLevel:self.calmLevel, bpSYS:self.sys, bpDIA:self.dia, pulse:self.pulse}
                    $http.post(self.httpReq + "Tests/NotReg/Report", report).then(function (res) {
                        localStorageService.set('reportTime', reportTime+1)
                        reportTime++;

                        //go to next page according to report time
                        if(reportTime==1)
                        {
                            $location.path('/video');
                            $location.replace();
                            
                        }
                        if(reportTime==2 || reportTime==3)
                        {
                            $location.path('/startTest');
                            $location.replace();
                            //self.startTest()
                        }
                    },
                        function (error) {
                            alert('failed, please try again' + error);
                        }
                    );
                    
                    
                }
                else
                {
                    alert('Please report your mood');
                }

            }

            //-----Test-----
            self.numberOfQuestions = 5;
            self.allQuestions=[];
            self.answers=[];
            self.FaceAnswers=[];
            self.currQ = 0;
            self.finishTest=false;
            self.testStartTime;
            self.testEndTime;
            self.questions=[];
            self.allIds=[];
            self.ids=[];

            self.findTest = function () {
                
                // //save start time
                // self.testStartTime=(new Date()).toISOString();
                let ids1=[];
                //get random numbers for pictures
                while(ids1.length < 30){
                    var r = Math.floor(Math.random()*95) + 1;
                    if(ids1.indexOf(r) === -1 && r!=25 && r!=2 && r!=37 && r!=44)
                        ids1.push(r);
                }
                //pictured in order to see if user is reliable
                ids1[1]=25;
                ids1[5]=2;
                ids1[20]=37;
                ids1[22]=44;

                //get 10 random faces
                let faceIds=[];
                while(faceIds.length < 10){
                    var r = Math.floor(Math.random()*31) + 1;//for faceId
                    if(faceIds.indexOf(r) === -1)
                        faceIds.push(r);
                }

                //get pictures info
                let counter=0;
                for (let i = 0; i < ids1.length; i++) {
                    let picId = ids1[i];
                    $http.get(self.httpReq + "Questions/Pictures/" + ids1[i]).then(function (res) {
                        counter++;
                        //first 15
                        if(i<15)
                        {
                            self.allQuestions[i] = res.data[0].pictureUrl;
                            self.allIds[i]=picId;    
                        }
                        else
                        {
                            self.allQuestions[i+5] = res.data[0].pictureUrl;
                            self.allIds[i+5]=picId;
                        }
                        // self.answers[i]=null;
                        if(counter>=40)
                        {
                            localStorageService.set('allIds', self.allIds);
                            localStorageService.set('allQuestions', self.allQuestions);
                        }
                    },
                        function (error) {
                            //alert('failed to get picture from DB');
                        }
                    );
                }

                //get face info
                for (let i = 0; i < faceIds.length; i++) {
                    let picId = faceIds[i];
                    $http.get(self.httpReq + "Questions/FacesPictures/" + faceIds[i]).then(function (res) { //TODO - Change to face
                        counter++;
                        //first 5 faces
                        if(i<5)
                        {
                            self.allQuestions[i+15]=(res.data[0].PICURL);
                            self.allIds[i+15]=(picId);
                        }
                        else
                        {
                            self.allQuestions[i+30]=(res.data[0].PICURL);
                            self.allIds[i+30]=(picId);
                        }
                        
                        // self.FaceAnswers[i]=null;
                        if(counter>=40)
                        {
                            localStorageService.set('allIds', self.allIds);
                            localStorageService.set('allQuestions', self.allQuestions);
                        }
                    },
                        function (error) {
                            //alert('failed to get picture from DB');
                        }
                    );
                }
            }

            self.startTest=function()
            {
                //save start time
                self.testStartTime=(new Date()).toISOString();
                //check what time of test
                let testTime=localStorageService.get('testTime');
                // localStorageService.set('testTime', testTime+1);

                //get first 15 or last 15 pictures according to test time
                let index=0;
                //second time
                if(testTime==1)
                {
                    index=20;
                }
                self.allQuestions = localStorageService.get('allQuestions');
                self.allIds = localStorageService.get('allIds');

                for(let i=0;i<20;i++)
                {
                    self.ids[i]=self.allIds[i+index];
                    self.questions[i]=self.allQuestions[i+index];
                    self.answers[i]=null;
                    self.FaceAnswers[i]=null;
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


            self.prevQ = function () {
                if(self.currQ>0)
                    self.currQ--;
            }

            self.nextQ = function () {
                if(self.currQ<self.questions.length-1)
                    self.currQ++;
                else
                    alert("If you answered all questions, please press 'Send Test'")
                if(self.currQ==self.questions.length-1)
                    self.finishTest=true;                    
            }


            self.SendAnsNotReg=function(){
                if(!self.finishTest)
                {
                    alert("Please answer all questions befor sending the test");
                    return;
                }
                let testTime=localStorageService.get('testTime')

                self.testEndTime=(new Date()).toISOString();
                // reportInfo=localStorageModel.getLocalStorage('reportInfo');
                reportInfo= localStorageService.get('reportInfo')
                let answersArr=[];
                for(i=0;i<self.questions.length;i++){
                    picId=self.ids[i];
                    if(i<15)
                        ans=self.answers[i];
                    else
                        ans=self.FaceAnswers[i];
                    if(ans ==undefined)
                    {
                        ans="";
                    }
                    let type="pic";
                    if(i>14)
                        type="face";
                    answersArr[i]={qId:picId, answer:ans, Qtype:type};
                }
                testAnswer={
                    //userId: localStorageModel.getLocalStorage('userId'),
                    userId:localStorageService.get('userId'),
                    startTime: self.testStartTime,
                    endTime: self.testEndTime,
                    answers: answersArr
                }
                $http.post(self.httpReq + "Tests/NotReg/AddAnswers", testAnswer).then(function (res) {
                    localStorageService.set('testTime', testTime+1)
                    if(testTime==0)
                    {
                        $location.path('/video');
                        $location.replace();    
                    }
                    else
                    {
                        alert("Thank you for your answers!");
                        $location.path('/home');
                        $location.replace();
                    }
                },
                    function (error) {
                        alert('failed, please try again' + error);
                    }
                );
            }

        }]);
