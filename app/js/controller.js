(function (angular) {
    'use strict';

    function ApolloCtrl(
        Focus,
        SpeechService,
        AutoSleepService,
        LightService,
        $rootScope, $scope, $timeout, $interval, tmhDynamicLocale, $translate) {

        // Local Scope Vars
        var _this = this;
        $scope.listening = false;
        $scope.debug = false;
        $scope.commands = [];
        $scope.partialResult = $translate.instant('home.commands');
        $scope.layoutName = 'main';
        $scope.config = config;


        // Set up our Focus
        $rootScope.$on('focus', function(targetScope, newFocus){
            $scope.focus = newFocus;
        })
        Focus.change("default");

        //set lang
        if (config.general.language.substr(0, 2) == 'en') {
            moment.locale(config.general.language,
                {
                    calendar: {
                        lastWeek: '[Last] dddd',
                        lastDay: '[Yesterday]',
                        sameDay: '[Today]',
                        nextDay: '[Tomorrow]',
                        nextWeek: 'dddd',
                        sameElse: 'L'
                    }
                }
            )
        } else {
                moment.locale(config.general.language)
        }
        //Initialize the speech service

        var resetCommandTimeout;
        SpeechService.init({
            listening: function (listening) {
                $scope.listening = listening;
                if (listening && !AutoSleepService.woke) {
                    AutoSleepService.wake()
                    $scope.focus = AutoSleepService.scope;
                }
            },
            partialResult: function (result) {
                $scope.partialResult = result;
                $timeout.cancel(resetCommandTimeout);
            },
            finalResult: function (result) {
                if (typeof result !== 'undefined') {
                    $scope.partialResult = result;
                    resetCommandTimeout = $timeout(restCommand, 5000);
                }
            },
            error: function (error) {
                console.log(error);
                if (error.error == "network") {
                    $scope.speechError = "Google Speech Recognizer: Network Error (Speech quota exceeded?)";
                }
            }
        });

        //Update the time
        function updateTime() {
            $scope.date = new moment();

            // Auto wake at a specific time
            if (typeof config.autoTimer !== 'undefined' && typeof config.autoTimer.autoWake !== 'undefined' && config.autoTimer.autoWake == moment().format('HH:mm:ss')) {
                console.debug('Auto-wake', config.autoTimer.autoWake);
                AutoSleepService.wake()
                $scope.focus = AutoSleepService.scope;
                AutoSleepService.startAutoSleepTimer();
            }
        }

        // Reset the command text
        var restCommand = function () {
            $translate('home.commands').then(function (translation) {
                $scope.partialResult = translation;
            });
        };

        _this.init = function () {
            AutoSleepService.startAutoSleepTimer();

            $interval(updateTime, 1000);
            updateTime();
            restCommand();

            var stopMedia = function() {
              console.log("Stopping all playing media...");
                //Stop Youtube Video
                var iframe = document.getElementsByTagName("iframe")[0].contentWindow;
                iframe.postMessage('{"event":"command","func":"' + 'stopVideo' +   '","args":""}', '*');

                //Stop SoundCloud
                document.getElementById('player').pause();
            }

            var defaultView = function () {
                stopMedia();
                console.debug("Ok, going to default view...");

                //Adjust background color off app icons
                var non_active_app = angular.element(document.getElementsByClassName('app_icon'));
                non_active_app.removeClass('active_app');

                Focus.change("default");

            }

            // List commands
            SpeechService.addCommand('list', function () {
                console.debug("Here is a list of commands...");
                //console.log(SpeechService.commands);
                $scope.commands = SpeechService.getCommands();
                Focus.change("commands");
            });

            // Go back to default view
            SpeechService.addCommand('home', defaultView);

            SpeechService.addCommand('debug', function () {
                console.debug("Boop Boop. Showing debug info...");
                $scope.debug = true;
            });

            // Check the time
            SpeechService.addCommand('time_show', function () {
                console.debug("It is", moment().format('h:mm:ss a'));
            });

            // Control light
            SpeechService.addCommand('light_action', function (state, action) {
                LightService.performUpdate(state + " " + action);
            });
        };
        _this.init();
    }

    angular.module('Apollo')
        .controller('ApolloCtrl', ApolloCtrl);

    function themeController($scope) {
        $scope.layoutName = (typeof config.layout !== 'undefined' && config.layout) ? config.layout : 'main';
    }

    angular.module('Apollo')
        .controller('Theme', themeController);

} (window.angular));
