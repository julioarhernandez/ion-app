// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'firebase', 'starter.configs','luegg.directives'])

.run(function($ionicPlatform, CONFIG) {
    $ionicPlatform.ready(function() {
        if (window.cordova && window.cordova.plugins.Keyboard) {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            // Don't remove this line unless you know what you are doing. It stops the viewport
            // from snapping when text inputs are focused. Ionic handles this internally for
            // a much nicer keyboard experience.
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);


        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }

        firebase.initializeApp({
            apiKey: "AIzaSyBNpWCdPs0XUyBIcv38OXE2-bXb9JcLol4",
            authDomain: "dev-auth-98fd7.firebaseapp.com",
            databaseURL: "https://dev-auth-98fd7.firebaseio.com",
            storageBucket: "dev-auth-98fd7.appspot.com",
            messagingSenderId: "1023928958601"

        });


    });
})

.config(['$stateProvider', '$urlRouterProvider', '$ionicConfigProvider', '$sceDelegateProvider', function($stateProvider, $urlRouterProvider, $ionicConfigProvider, $sceDelegateProvider) {

    $sceDelegateProvider.resourceUrlWhitelist(['self', new RegExp('^(http[s]?):\/\/(w{3}.)?youtube\.com/.+$')]);
    $ionicConfigProvider.navBar.alignTitle('center');
    $stateProvider
        .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'appController'
    })
    .state('login', {
        url: '/login',
        templateUrl: "templates/login.html",
        controller: "loginController"
    })

    .state('signup', {
        url: '/signup',
        templateUrl: "templates/signup.html",
        controller: "signupController"
    })

    .state('chat', {
        url: '/chat',
        templateUrl: "templates/chat.html",
        controller: "chatController"
    })

    .state('reset', {
        url: '/reset',
        templateUrl: "templates/resetemail.html",
        controller: "resetController"
    })

    .state('intro', {
        url: '/intro',
        views: {
            'menuContent': {
                templateUrl: "templates/intro.html",
                controller: "introController"
            }
        }
    })

    .state('app.dashboard', {
        url: '/app/dashboard',
        views: {
            'menuContent': {
                templateUrl: "templates/dashboard.html",
                controller: "dashboardController"
            }
        }
    })

    $urlRouterProvider.otherwise('/login');

}])

.controller('loginController', ['$rootScope','$scope', '$firebaseArray', 'CONFIG', '$document', '$state', function( $rootScope, $scope, $firebaseArray, CONFIG, $document, $state) {

    //TO-DO: add block where username and password are read from localstorage
    $scope.userLogin = { username: 'julioarhernandez@gmail.com', password: '3edcvfr4qQ' };

    // Perform the login action when the user submits the login form
    $scope.doLogin = function(userLogin) {

        if (($document[0].getElementById("user_name").value != "" && $document[0].getElementById("user_pass").value != "")) {

            firebase.auth().signInWithEmailAndPassword(userLogin.username, userLogin.password).then(function() {
            // Sign-In successful.

              var user = firebase.auth().currentUser;
              var name, email, photoUrl, uid;

              if (user.emailVerified) { //check for verification email confirmed by user from the inbox

                console.log("email verified");
                $state.go("app.dashboard");
                $rootScope.user = user;
                $rootScope.name = user.displayName;
                $rootScope.email = user.email;
                $rootScope.photoUrl = user.photoURL;
                $rootScope.uid = user.uid;

                //Save to localstorage email, password, and phot url
                localStorage.setItem("photo", photoUrl);

                } else {

                    alert("Email not verified, please check your inbox or spam messages")
                    return false;

                } // end check verification email


            }, function(error) {
                // An error happened.
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode);
                if (errorCode === 'auth/invalid-email') {
                    alert('Enter a valid email.');
                    return false;
                } else if (errorCode === 'auth/wrong-password') {
                    alert('Incorrect password.');
                    return false;
                } else if (errorCode === 'auth/argument-error') {
                    alert('Password must be string.');
                    return false;
                } else if (errorCode === 'auth/user-not-found') {
                    alert('No such user found.');
                    return false;
                } else if (errorCode === 'auth/too-many-requests') {
                    alert('Too many failed login attempts, please try after sometime.');
                    return false;
                } else if (errorCode === 'auth/network-request-failed') {
                    alert('Request timed out, please try again.');
                    return false;
                } else {
                    alert(errorMessage);
                    return false;
                }
            });



        } else {

            alert('Please enter email and password');
            return false;

        } //end check client username password


    }; // end $scope.doLogin()

}])

.controller('appController', ['$rootScope','$scope', '$firebaseArray', 'CONFIG', '$document', '$state', function( $rootScope, $scope, $firebaseArray, CONFIG, $document, $state) {

    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            $document[0].getElementById("photo_user").src = localStorage.getItem("photo");
             $rootScope.user = user;
             $rootScope.name = user.displayName;
             $rootScope.email = user.email;
             $rootScope.photoUrl = user.photoURL;
             $rootScope.uid = user.uid;
        } else {
            // No user is signed in.
            $state.go("login");
        }
    });

    $scope.doLogout = function() {

            firebase.auth().signOut().then(function() {
                // Sign-out successful.
                //console.log("Logout successful");
                $state.go("login");
            }, function(error) {
                // An error happened.
                console.log(error);
            });

        } // end dologout()

}])

.controller('resetController', ['$rootScope','$scope', '$state', '$document', '$firebaseArray', 'CONFIG', function( $rootScope, $scope, $state, $document, $firebaseArray, CONFIG) {

    $scope.doResetemail = function(userReset) {

        if ($document[0].getElementById("ruser_name").value != "") {

            firebase.auth().sendPasswordResetEmail(userReset.rusername).then(function() {
                // Sign-In successful.
                //console.log("Reset email sent successful");
                $state.go("login");
            }, function(error) {
                // An error happened.
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode);


                if (errorCode === 'auth/user-not-found') {
                    alert('No user found with provided email.');
                    return false;
                } else if (errorCode === 'auth/invalid-email') {
                    alert('Email you entered is not complete or invalid.');
                    return false;
                }

            });



        } else {

            alert('Please enter registered email to send reset link');
            return false;

        } //end check client username password


    }; // end $scope.doSignup()



}])



.controller('signupController', ['$rootScope','$scope', '$state', '$document', '$firebaseArray', 'CONFIG', function( $rootScope, $scope, $state, $document, $firebaseArray, CONFIG) {

    $scope.doSignup = function(userSignup) {



        //console.log(userSignup);

        if ($document[0].getElementById("cuser_name").value != "" && $document[0].getElementById("cuser_pass").value != "") {


            firebase.auth().createUserWithEmailAndPassword(userSignup.cusername, userSignup.cpassword).then(function() {
                // Sign-In successful.
                //console.log("Signup successful");

                var user = firebase.auth().currentUser;

                user.sendEmailVerification().then(function(result) { console.log(result) }, function(error) { console.log(error) });

                user.updateProfile({
                    displayName: userSignup.displayname,
                    photoURL: userSignup.photoprofile
                }).then(function() {
                    // Update successful.
                    $state.go("login");
                }, function(error) {
                    // An error happened.
                    console.log(error);
                });




            }, function(error) {
                // An error happened.
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode);

                if (errorCode === 'auth/weak-password') {
                    alert('Password is weak, choose a strong password.');
                    return false;
                } else if (errorCode === 'auth/email-already-in-use') {
                    alert('Email you entered is already in use.');
                    return false;
                }




            });



        } else {

            alert('Please enter email and password');
            return false;

        } //end check client username password


    }; // end $scope.doSignup()



}])


.controller('dashboardController', ['$rootScope','$scope', '$firebaseArray', 'CONFIG', function( $rootScope, $scope, $firebaseArray, CONFIG) {
    // TODO: Show profile data


}])

.controller('chatController', ['$rootScope','$scope', '$firebaseArray', '$firebaseAuth', 'CONFIG', '$ionicPopup', '$document', function( $rootScope, $scope, $firebaseArray, $firebaseAuth, CONFIG, $ionicPopup, $document) {

    $scope.data = { todos: [] };
    
    $scope.search = function() {
      var message = $document[0].getElementById("message").value;
      alert('text' + message);


    };
    
    $scope.init = function() {
      var uid = firebase.auth().currentUser.uid;
      fbAuth = firebase.auth();
      var user = fbAuth.currentUser;

      // if($scope.data.hasOwnProperty("todos") !== true) {
      //     $scope.data.todos = [];
      // }
      //$scope.data.todos.push({title: result});
       var fb = firebase.database().ref("messages/" + uid);

      fb.once("value")
  .then(function(snapshot) {

    snapshot.forEach(function(childSnapshot) {
     
      // key will be "ada" the first time and "alan" the second time
      var key = childSnapshot.key;
      // childData will be the actual contents of the child
      var childData_messages = childSnapshot.val().message;
      var childData_status = childSnapshot.val().status;
      var childData_date = childSnapshot.val().date;

      $scope.data.todos.push({msg: childData_messages, date: childData_date, status: childData_status});
if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
    $scope.$apply();
}



  });
});



    }

    $scope.create = function() {

      var uid = firebase.auth().currentUser.uid;
      fbAuth = firebase.auth();
      var user = fbAuth.currentUser;
      var messages = $document[0].getElementById("message").value;

      // if($scope.data.hasOwnProperty("todos") !== true) {
      //     $scope.data.todos = [];
      // }
      //$scope.data.todos.push({title: result});
      var ndate = new Date().getTime();
      var fb = firebase.database().ref("messages/" + uid);

      fb.push({ message: messages, status: 'unread', date: ndate });

      //ONly update view
      $scope.data.todos.push({msg: messages, date: ndate, status: 'unread'});
if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
    $scope.$apply();
}





          //           firebase.database().ref('users/' + userId).set({
          //   username: name,
          //   email: email,
          //   profile_picture : imageUrl
          // });

          //var syncObject = firebase.database().ref("users/" + fbAuth.uid);
          //syncObject.$bindTo($scope, "data");


            

    }

    $scope.init();

}]);
