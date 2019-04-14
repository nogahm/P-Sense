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
            self.stress=((localStorageService.get('userId')%2!=0)&&(localStorageService.get('testTime')==0)) || ((localStorageService.get('userId')%2==0)&&(localStorageService.get('testTime')>0));
            self.videoURL="assets\\video\\relaxVideo.mp4";
            if(self.stress)
            {
                self.videoURL="assets\\video\\stressVideo.mp4";
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
            self.WordAnswers=[];
            self.currQ = 0;
            self.finishTest=false;
            self.testStartTime;
            self.testEndTime;
            self.questions=[];
            self.allIds=[];
            self.ids=[];

            self.findTest = function () {
                
                //test1
                //0-14: pictures
                //15-19: faces
                //20-34: words
                //test2
                //35-49: pictures
                //50-54: faces
                //55-69: words    
                let ids1=[]; /// 35 question for each test
                
                //get random numbers for pictures
                while(ids1.length < 30){
                    var r = Math.floor(Math.random()*95) + 1;
                    if(ids1.indexOf(r) === -1 && ![25,2,37,44,26,92,89,87].includes(r))
                        ids1.push(r);
                }
                //28-84 - nothing
                //pictured in order to see if user is reliable
                ids1[1]=25;
                ids1[5]=2;
                ids1[20]=37;
                ids1[22]=44;
                //add for each test 2 real pictures
                ids1[0]=26;
                ids1[10]=92;
                ids1[15]=89;
                ids1[25]=87;

                //get 10 random faces
                let faceIds=[];
                while(faceIds.length < 10){
                    var r = Math.floor(Math.random()*31) + 1;//for faceId
                    if(faceIds.indexOf(r) === -1)
                        faceIds.push(r);
                }

                //30 wordIds
                let wordIds=[];
                while(wordIds.length < 30){
                    var r = Math.floor(Math.random()*31) + 1;//for faceId
                    if(wordIds.indexOf(r) === -1)
                        wordIds.push(r);
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
                            self.allQuestions[i+20] = res.data[0].pictureUrl;
                            self.allIds[i+20]=picId;
                        }
                        // self.answers[i]=null;
                        if(counter>=70)
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
                            self.allQuestions[i+45]=(res.data[0].PICURL);
                            self.allIds[i+45]=(picId);
                        }
                        
                        // self.FaceAnswers[i]=null;
                        if(counter>=70)
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

                // get word info
                for (let i = 0; i < wordIds.length; i++) {
                    let wordId = wordIds[i];
                    $http.get(self.httpReq + "Questions/WordQuestion/" + wordIds[i]).then(function (res) {
                        counter++;
                        //first 15 words
                        if(i<15)
                        {
                            self.allQuestions[i+20]=(res.data[0].Word);
                            self.allIds[i+20]=(wordId);
                        }
                        else
                        {
                            self.allQuestions[i+40]=(res.data[0].Word);
                            self.allIds[i+40]=(wordId);
                        }
                        
                        // self.FaceAnswers[i]=null;
                        if(counter>=70)
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
                // /WordQuestion/:wordId
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
                    index=35;
                }
                self.allQuestions = localStorageService.get('allQuestions');
                self.allIds = localStorageService.get('allIds');

                for(let i=0;i<35;i++)
                {
                    self.ids[i]=self.allIds[i+index];
                    self.questions[i]=self.allQuestions[i+index];
                    self.answers[i]=null;
                    self.FaceAnswers[i]=null;
                    self.WordAnswers[i]=null;
                }
            }

            
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
                // set word time to 10 seconds
                self.x = document.getElementById("word");
                if(self.x!=undefined && self.currQ>19)
                {
                    self.x.hidden=false;
                    $timeout(function(){ self.x.hidden=true },5000);
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
                    if(i<15)
                        ans=self.answers[i];
                    else if(i<19)
                        ans=self.FaceAnswers[i];
                    else
                        ans=self.WordAnswers[i];
                    if(ans ==undefined)
                    {
                        ans="";
                    }
                    let type="pic";
                    if(i>14 && i<19)
                        type="face";
                    else if(i>19)
                        type="word";
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
                        // alert("Thank you for your answers!");
                        $location.path('/thankYou');
                        $location.replace();
                    }
                },
                    function (error) {
                        alert('failed, please try again' + error);
                    }
                );
            }
 
        }]);
