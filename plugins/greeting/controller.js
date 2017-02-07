function Greeting($rootScope, $scope, $http, $interval) {

    var greetingUpdater = function () {
        if (config.greeting.option == 'time') {
            var hour = moment().hour();
            var greetingTime = "midday"; //11am - 3pm MIDDAY

            //5am - 11am MORNING
            if (hour >= 5 && hour < 11) {
              greetingTime = "morning";
              //3pm - 6pm AFTERNOON
            } else if (hour >= 15 && hour < 18) {
              greetingTime = "afternoon";
              //6pm - 10pm
            } else if (hour >= 18 && hour < 22) {
              greetingTime = "evening";
              //10pm - 5am
            } else if (hour >= 22 || hour < 5) {
              greetingTime = "night";
            }

            console.log("Current greeting time is: " + greetingTime);
            var nextIndex = Math.floor(Math.random() * config.greeting[greetingTime].length);
            var nextGreeting = config.greeting[greetingTime][nextIndex]
            $scope.greeting = nextGreeting;
        } else if (config.greeting.allDay) {
            $scope.greeting = config.greeting.allDay[Math.floor(Math.random() * config.greeting.allDay.length)];
        }
    };

    if (typeof config.greeting !== 'undefined') {
        greetingUpdater();
        //Update every 5 minutes
        $interval(greetingUpdater, config.greeting.refreshInterval * 5000 || 300000)
    }
}

angular.module('Apollo')
    .controller('Greeting', Greeting);
