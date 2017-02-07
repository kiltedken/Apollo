function Apps($scope, SpeechService, Focus) {

  //Open Applications
  SpeechService.addCommand('open_app', function(query) {
    Focus.change(query);
    var non_active_app = angular.element(document.getElementsByClassName('app_icon'));
    non_active_app.removeClass('active_app');

    var active_app = angular.element(document.getElementsByClassName(query + '_app'));
    active_app.addClass('active_app');
  });

  //Close applications
  SpeechService.addCommand('close_app', function(query) {
    Focus.change('default');
    //Adjust background color
    var non_active_app = angular.element(document.getElementsByClassName('app_icon'));
    non_active_app.removeClass('active_app');
  });

}
angular.module('Apollo')
    .controller('Apps', Apps);
