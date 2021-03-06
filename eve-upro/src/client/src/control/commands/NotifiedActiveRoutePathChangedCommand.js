upro.ctrl.cmd.NotifiedActiveRoutePathChangedCommand = Class.create(SimpleCommand,
{
   execute: function(notification)
   {
      var activeRouteProxy = this.facade().retrieveProxy(upro.model.proxies.ActiveRouteProxy.NAME);
      var activeRouteListMediator = this.facade().retrieveMediator(
            upro.view.mediators.ActiveRouteListPanelMediator.NAME);
      var route = activeRouteProxy.getRoute();

      activeRouteListMediator.setRoute(route);
      if (!upro.sys.isRunningInInGameBrowser())
      {
         this.updateGraphics(route);
      }
   },

   updateGraphics: function(route)
   {
      var sceneMediator = this.facade().retrieveMediator(upro.view.mediators.SceneMediator.NAME);
      var highlightMediator = this.facade().retrieveMediator(upro.view.mediators.SolarSystemHighlightMediator.NAME);
      var lastRouteEntry = null;
      var waypointCounter = 1;
      var okColor = [ 0.2, 1.0, 0.5, 4.0 ];
      var nokColor = [ 1.0, 0.0, 0.0, 2.0 ];
      var that = this;

      sceneMediator.clearRoute('ActiveRoute');
      highlightMediator.removeHighlights(/RouteOverlay:.*/);

      route.forEach(function(routeEntry)
      {
         var solarSystem = routeEntry.getSolarSystem();
         var isReachable = !lastRouteEntry || (lastRouteEntry.getJumpType() != upro.nav.JumpType.None);
         var color = isReachable ? okColor : nokColor;

         if (lastRouteEntry)
         {
            sceneMediator.addRouteEdge('ActiveRoute', lastRouteEntry.getSolarSystem(), solarSystem, color);
         }
         if (routeEntry.getEntryType() != upro.nav.SystemRouteEntry.EntryType.Transit)
         {
            that.setSystemOverlay(highlightMediator, solarSystem, waypointCounter, isReachable);
            waypointCounter++;
         }
         lastRouteEntry = routeEntry;
      });
   },

   /**
    * Key creation helper for the projection tracker
    * 
    * @param solarSystem for which the key shall be created
    */
   createKey: function(solarSystem)
   {
      return "RouteOverlay:" + solarSystem.id;
   },

   /**
    * Sets the overlay for a given system and given index
    * 
    * @param highlightMediator the mediator to use
    * @param solarSystem the system to add an overlay for
    * @param index route index
    * @param isReachable whether the waypoint is valid in the route
    */
   setSystemOverlay: function(highlightMediator, solarSystem, index, isReachable)
   {
      var key = this.createKey(solarSystem);
      var entry = highlightMediator.getHighlight(key);

      if (!entry)
      {
         var textColor = isReachable ? "#00FFC0" : "#FF0000";
         var bracketColor = isReachable ? "#008040" : "800000";

         var textOptions =
         {
            value: "" + index + ": " + solarSystem.name,
            color: textColor,
            height: upro.ctrl.cmd.NotifiedActiveRoutePathChangedCommand.TEXT_HEIGHT,
            bracketSide: 2,
            bracketPadding: upro.hud.Button.Scale * -1
         };
         var bracketOptions =
         {
            size: 5,
            fillColor: bracketColor,
            fillOpacity: 0.1,
            strokeColor: bracketColor,
            strokeOpacity: 0.8
         };

         entry = highlightMediator.addHighlight(key, textOptions, bracketOptions);
         entry.setSolarSystem(solarSystem);
         entry.show();
      }
      else
      {
         var textOptions =
         {
            value: entry.getTextOption("value") + "\r\n" + index + ": " + solarSystem.name
         };

         entry.setTextOptions(textOptions);
      }
   }

});

upro.ctrl.cmd.NotifiedActiveRoutePathChangedCommand.TEXT_HEIGHT = 15;
