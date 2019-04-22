angular.module("pointsOfInterest")
    .controller('testControllerPANAS', ['$scope', '$http', 'localStorageModel', '$rootScope', 'ngDialog', '$location', '$window','localStorageService','$timeout',
        function ($scope, $http, localStorageModel, $rootScope, ngDialog, $location, $window,localStorageService,$timeout) {
            let self = this;
            let itSend=false;
            self.toDisable = false;
            self.toDisableReport=false;
            self.toDisableSend=false;
            self.httpReq = 'https://psense.herokuapp.com/';
         
         

         
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
      

            // -----Report-----

            self.active;
            self.determined;
            self.attentive;
            self.inspired;
            self.alert;
            self.afraid;
            self.nervous;
            self.upset;
            self.hostile;
            self.ashamed;
            

            self.reportAndStart=function(){
                self.toDisableReport=true;
                let reportTime=localStorageService.get('reportTime')

                

              
                if(self.active>0 && self.determined>0&& self.attentive>0&& self.inspired>0&& self.alert>0&& self.afraid>0&& self.nervous>0&& self.upset>0&& self.hostile>0&& self.ashamed>0){
                  
                    //save report info
                    report={userId:localStorageService.get('userId'), activeLevel:self.active, determinedLevel:self.determined,attentiveLevel:self.attentive ,inspiredLevel:self.inspired, alertLevel:self.alert,afraidLevel:self.afraidLevel  ,upsetLevel:self.upset ,nervousLevel:self.nervous,hostileLevel:self.hostile ,ashamedLevel:self.ashamed  }
                    $http.post(self.httpReq + "Tests/NotReg/ReportPANAS", report).then(function (res) {
                

                      
                            $location.path('/thankYou');
                            $location.replace();

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

   
        }]);
