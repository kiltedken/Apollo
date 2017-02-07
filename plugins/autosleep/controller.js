function AutoSleep($http, $q, SpeechService,AutoSleepService, Focus) {


    // Hide everything and "sleep"
    SpeechService.addCommand('sleep', function () {
        console.debug("Ok, going to sleep...");
        AutoSleepService.sleep();
    });

    SpeechService.addCommand('wake_up', function () {
        console.debug("Waking Up!");
        AutoSleepService.wake();
    });
}

angular.module('Apollo')
    .controller('AutoSleep', AutoSleep);
