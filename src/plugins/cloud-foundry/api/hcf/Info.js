/* DO NOT EDIT: This code has been generated by the cf-dotnet-sdk-builder */

(function () {
  'use strict';

  angular
    .module('cloud-foundry.api')
    .run(registerApi);

  registerApi.$inject = [
    '$http',
    'app.api.apiManager'
  ];

  function registerApi($http, apiManager) {
    apiManager.register('cloud-foundry.api.Info', new InfoApi($http));
  }

  function InfoApi($http) {
    this.$http = $http;
  }

  /* eslint-disable camelcase */
  angular.extend(InfoApi.prototype, {

   /*
    * Get Info
    * For detailed information, see online documentation at: http://apidocs.cloudfoundry.org/237/info/get_info.html
    */
    GetInfo: function (params, httpConfigOptions) {
      var config = {};
      config.params = params;
      config.url = '/pp/v1/proxy/v2/info';
      config.method = 'GET';

      for (var option in httpConfigOptions) {
        if (!httpConfigOptions.hasOwnProperty(option)) { continue; }
        config[option] = httpConfigOptions[option];
      }
      return this.$http(config);
    }

  });
  /* eslint-enable camelcase */

})();
