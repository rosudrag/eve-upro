upro.ctrl.cmd.NotifiedUserRoutingCapabilitiesChangedCommand = Class.create(SimpleCommand,
{
   execute: function(notification)
   {
      var routeOptimizerProxy = this.facade().retrieveProxy(upro.model.proxies.RouteOptimizerProxy.NAME);
      var settingsProxy = this.facade().retrieveProxy(upro.model.proxies.UserSettingsProxy.NAME);
      var capabilities = [];

      if (settingsProxy.getRoutingCapJumpBridgesInUse())
      {
         capabilities.push(new upro.nav.finder.PathFinderCapabilityJumpBridges());
      }
      if (settingsProxy.getRoutingCapJumpGatesInUse())
      {
         capabilities.push(new upro.nav.finder.PathFinderCapabilityJumpGates());
      }
      if (settingsProxy.getRoutingCapJumpDriveInUse())
      {
         capabilities.push(new upro.nav.finder.PathFinderCapabilityJumpDrive(settingsProxy
               .getRoutingCapJumpDriveRange()));
      }
      if (settingsProxy.getRoutingCapWormholesInUse())
      {
         capabilities.push(new upro.nav.finder.PathFinderCapabilityWormholes());
      }

      routeOptimizerProxy.setRoutingCapabilities(capabilities);
   }
});
