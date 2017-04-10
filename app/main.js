angular.module('onibusgv', [
  'ionic',

  'filters',

  'home',
  'search',
  'horario',
  'itinerario',
  'linha',

  'services.sql'
])
.run([
  '$ionicPlatform', 'sqlService',
  function($ionicPlatform, sqlService) {

    $ionicPlatform.ready(function() {

      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }

      sqlService.init();
    });
  }
])
.config([
  '$stateProvider', '$urlRouterProvider', '$ionicConfigProvider',
  function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

    $ionicConfigProvider.backButton.text('Voltar');

    $stateProvider
      .state('home', {
        url: '/home',
        cache: true,
        templateUrl: 'views/pages/home/home.html',
        controller: 'HomeCtrl'
      })
      .state('search', {
        url: '/search/:searchQuery',
        cache: true,
        templateUrl: 'views/pages/search/search.html',
        controller: 'SearchCtrl'
      })

      .state('tabs', {
        url: '/tab',
        abstract: true,
        cache: false,
        templateUrl: 'views/pages/linha/linha.html',
        controller: 'LinhaCtrl'
      })
      .state('tabs.horarios', {
        url: '/horarios/:linha/:dia',
        cache: true,
        views: {
          'horario-tab': {
            templateUrl: 'views/pages/horario/horario.html',
            controller: 'HorarioCtrl'
          }
        }
      })
      .state('tabs.itinerario', {
        url: '/itinerarios/:linha',
        cache: true,
        views: {
          'itinerario-tab': {
            templateUrl: 'views/pages/itinerario/itinerario.html',
            controller: 'ItinerarioCtrl'
          }
        }
      });

    $urlRouterProvider.otherwise('/home');
  }
]);
