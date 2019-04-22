angular.module("pointsOfInterest")
    .controller('testController', ['$scope', '$http', 'localStorageModel', '$rootScope', 'ngDialog', '$location', '$window','localStorageService','$timeout',
        function ($scope, $http, localStorageModel, $rootScope, ngDialog, $location, $window,localStorageService,$timeout) {
            let self = this;
            let itSend=false;
            self.toDisable = false;
            self.toDisableReport=false;
            self.toDisableSend=false;
            self.httpReq = 'https://psense.herokuapp.com/';
            // self.httpReq = 'localhost:3000/';
            // -----NotRegInfo-----
            self.isReg = false; //TODO - find if user is registed or not
            if (self.isReg) {
                $location.path('/report');
                $location.replace();
            }

         
            $(document).ready(function(){  
                 $("#submit").submit(function() {
                        $(this).submit(function() {
                            return false;
                        });
                        return true;
                    }); 
             });

            self.notRegUser = { age: null, gender: '', email: '', hand: '' };
            self.notRegId = null;
            //save not reg info and continue to report-not working
            self.saveInfo = function (valid) {
                if (valid) {
                    self.toDisable = true;

                    //save info and get userId
                    $http.post(self.httpReq + "Users/NotRegUser", self.notRegUser).then(function (res) {
                        itSend=true;
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
            self.stress=((localStorageService.get('userId')%2!=0)&&(localStorageService.get('testTime')<2)) || ((localStorageService.get('userId')%2==0)&&(localStorageService.get('testTime')==2));
            self.videoURL="assets\\video\\relaxVideo.mp4";
            if(self.stress)
            {
                if((localStorageService.get('userId')%2!=0)&&(localStorageService.get('testTime')==0) || (localStorageService.get('userId')%2==0)&&(localStorageService.get('testTime')==1))
                {
                    self.videoURL="assets\\video\\stressVideo.mp4";
                }
                else
                {
                    self.videoURL="assets\\video\\stress2.mp4"
                }
                
            }
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
                self.toDisableReport=true;
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
                        if(reportTime>=2)
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
            self.WordAnswers=[];
            self.currQ = 0;
            self.finishTest=false;
            self.testStartTime;
            self.testEndTime;
            self.questions=[];
            self.allIds=[];
            self.ids=[];
            self.stress1TestID=[]; //15 q
            self.stress1Test=[];
            self.stress2TestID=[]; //15 q
            self.stress2Test=[];
            self.calmTestID=[]; //30 q
            self.calmTest=[];


            self.findTest = function () {

                let picturesIDS=[25,27,2,30,44,85,55,1,50,40,81,39,20,43,32,3,71,49,91,28];
                let facesIDS=[31,30,1,29,2,28,3,27,4,25,20,16,6,17,7,18,19,21,9,23];
                let wordsIDS=[1,4,42,41,6,49,7,44,8,45,44,11,55,46,25,47,48,28,49,50];
                //get pictures info
                let counter=0;
                for (let i = 0; i < picturesIDS.length; i++) {
                    let picId = picturesIDS[i];
                    $http.get(self.httpReq + "Questions/Pictures/" + picturesIDS[i]).then(function (res) {
                        counter++;
                        //first 5 - stress1
                        if(i<5)
                        {
                            self.stress1Test[i] = res.data[0].pictureUrl;
                            self.stress1TestID[i]=picId;    
                        }
                        else if(i<10) //second 5 - stress2
                        {
                            self.stress2Test[i-5] = res.data[0].pictureUrl;
                            self.stress2TestID[i-5]=picId;
                        } else //last 10 - calm
                        {
                            self.calmTest[i-10] = res.data[0].pictureUrl;
                            self.calmTestID[i-10]=picId;
                        }
                        // self.answers[i]=null;
                        if(counter>=60)
                        {
                            self.saveTestsInLocalStorage();
                        }
                    },
                        function (error) {
                            //alert('failed to get picture from DB');
                        }
                    );
                }

                //get face info
                for (let i = 0; i < facesIDS.length; i++) {
                    let picId = facesIDS[i];
                    $http.get(self.httpReq + "Questions/FacesPictures/" + facesIDS[i]).then(function (res) {
                        counter++;
                        //first 5 - stress1
                        if(i<5)
                        {
                            self.stress1Test[i+5] = res.data[0].PICURL;
                            self.stress1TestID[i+5]=picId;    
                        }
                        else if(i<10) //second 5 - stress2
                        {
                            self.stress2Test[i] = res.data[0].PICURL;
                            self.stress2TestID[i]=picId;
                        } else //last 10 - calm
                        {
                            self.calmTest[i] = res.data[0].PICURL;
                            self.calmTestID[i]=picId;
                        }
                        // self.FaceAnswers[i]=null;
                        if(counter>=60)
                        {
                            self.saveTestsInLocalStorage();
                        }
                    },
                        function (error) {
                            //alert('failed to get picture from DB');
                        }
                    );
                }

                // get word info
                for (let i = 0; i < wordsIDS.length; i++) {
                    let wordId = wordsIDS[i];
                    $http.get(self.httpReq + "Questions/WordQuestion/" + wordsIDS[i]).then(function (res) {
                        counter++;
                        //first 5 - stress1
                        if(i<5)
                        {
                            self.stress1Test[i+10] = res.data[0].Word;
                            self.stress1TestID[i+10]=wordId;    
                        }
                        else if(i<10) //second 5 - stress2
                        {
                            self.stress2Test[i+5] = res.data[0].Word;
                            self.stress2TestID[i+5]=wordId;
                        } else //last 10 - calm
                        {
                            self.calmTest[i+10] = res.data[0].Word;
                            self.calmTestID[i+10]=wordId;
                        }
                        // self.FaceAnswers[i]=null;
                        if(counter>=60)
                        {
                            self.saveTestsInLocalStorage();

                        }
                    },
                        function (error) {
                            //alert('failed to get picture from DB');
                        }
                    );
                }
                // /WordQuestion/:wordId
            }

            self.saveTestsInLocalStorage=function()
            {
                localStorageService.set('stress1Test', self.stress1Test);
                localStorageService.set('stress1TestID', self.stress1TestID);
                localStorageService.set('stress2Test', self.stress2Test);
                localStorageService.set('stress2TestID', self.stress2TestID);
                localStorageService.set('calmTest', self.calmTest);
                localStorageService.set('calmTestID', self.calmTestID);
            }

            self.startTest=function()
            {
                
                //save start time
                self.testStartTime=(new Date()).toISOString();
                //check what time of test
                let testTime=localStorageService.get('testTime');
                let userId=localStorageService.get('userId');
                self.length=15;
                //calm
                if((testTime===0 && userId%2===0) || (testTime===2 && userId%2===1))
                {
                    // index=35;
                    self.allQuestions = localStorageService.get('calmTest');
                    self.allIds = localStorageService.get('calmTestID');
                    self.length=30;
                }
                //stress1
                if((testTime===1 && userId%2===0) || (testTime===0 && userId%2===1))
                {
                    // index=35;
                    self.allQuestions = localStorageService.get('stress1Test');
                    self.allIds = localStorageService.get('stress1TestID');
                }
                //stress2
                if((testTime===2 && userId%2===0) || (testTime===1 && userId%2===1))
                {
                    // index=35;
                    self.allQuestions = localStorageService.get('stress2Test');
                    self.allIds = localStorageService.get('stress2TestID');
                }
                // self.allQuestions = localStorageService.get('allQuestions');
                // self.allIds = localStorageService.get('allIds');
                self.ids=self.allIds;
                self.questions=self.allQuestions;

                for(let i=0;i<self.length;i++)
                {
                    // self.ids[i]=self.allIds[i+index];
                    // self.questions[i]=self.allQuestions[i+index];
                    self.answers[i]=null;
                    self.FaceAnswers[i]=null;
                    self.WordAnswers[i]=null;
                }
            }

            
            self.prevQ = function () {
                if(self.currQ>0)
                    self.currQ--;
            }

            self.nextQWord=function(ans)
            {
                self.WordAnswers[self.currQ]=ans;
                self.nextQ();
            }

            self.nextQ = function () {
                if(self.currQ<self.questions.length-1)
                    self.currQ++;
                else
                    // alert("If you answered all questions, please press 'Send Test'")
                if(self.currQ==self.questions.length-1)
                    self.finishTest=true;   
                // set word time to 10 seconds
                self.x = document.getElementById("word");
                if(self.x!=undefined && ((self.currQ>19 && self.length==30) || (self.currQ>9 && self.length==15)) && !self.finishTest)
                {
                    self.x.hidden=false;
                    $timeout(function(){ self.x.hidden=true },200);
                }
                                     
            }


            self.SendAnsNotReg=function(){
                self.toDisableSend=true;
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
                    let type="pic";
                    if((self.length==15 && i<5) || (self.length==30 && i<10))
                    {
                        ans=self.answers[i];
                    }
                    else if((self.length==15 && i<10) || (self.length==30 && i<20))
                    {
                         ans=self.FaceAnswers[i];
                         type="face";
                    }
                    else
                    {
                        ans=self.WordAnswers[i];
                        type="word";
                    }
                    if(ans ==undefined)
                    {
                        ans="";
                    }
                    
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
                    else if(testTime==1)
                    {
                        // alert("Thank you for your answers!");
                        $location.path('/video');
                        $location.replace();
                    }
                    else
                    {
                        $location.path('/ReportPANAS');
                        $location.replace();
                    }
                },
                    function (error) {
                        alert('failed, please try again' + error);
                    }
                );
            }
 
        }]);
