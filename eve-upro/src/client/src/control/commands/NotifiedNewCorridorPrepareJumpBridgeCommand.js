
upro.ctrl.cmd.NotifiedNewCorridorPrepareJumpBridgeCommand = Class.create(SimpleCommand,
{
   execute: function(notification)
   {
      var sessionProxy = this.facade().retrieveProxy(upro.model.proxies.UserSessionProxy.NAME);
      var solarSystem = notification.getBody();

      sessionProxy.setCorridorPreparation(solarSystem, upro.nav.JumpType.JumpBridge);
   }
});
