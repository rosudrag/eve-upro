var path = require('path');

exports.header = "/*\n"
      + " * Copyright (C) 2011-2012 Christian Haas\n"
      + " *\n"
      + " * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated\n"
      + " * documentation files (the \"Software\"), to deal in the Software without restriction, including without limitation the\n"
      + " * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to\n"
      + " * permit persons to whom the Software is furnished to do so, subject to the following conditions:\n"
      + " *\n"
      + " * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the\n"
      + " * Software.\n"
      + " *\n"
      + " * THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE\n"
      + " * WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR\n"
      + " * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR\n"
      + " * OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.\n"
      + " */\n";

exports.sourceFiles = [];

(function()
{
   var shareBase = '../../model/';
   var utilBase = '../../util/';

   var sourceFiles = [ //
   utilBase + 'Functional.js', //

   'upro.js', //
   'Uuid.js', //

   'sys/sys.js', //
   'sys/AnimFrame.js', //
   'sys/ResizableContext.js', //
   'sys/ResizableContextWindow.js', //
   'sys/Time.js', //
   'sys/Timer.js', //
   'sys/KeyboardListener.js', //
   'sys/KeyboardHandler.js', //
   'sys/KeyboardDispatcher.js', //
   'sys/MouseListener.js', //
   'sys/PointerHandler.js', //
   'sys/PointerOperation.js', //
   'sys/PointerOperationRegistry.js', //

   'eve/eve.js', //
   'eve/Util.js', //
   'eve/NullInGameBrowser.js', //
   'eve/RealInGameBrowser.js', //
   'eve/ThrottledInGameBrowser.js', //

   'navigation/navigation.js', //
   'navigation/Constants.js', //
   'navigation/IdentifiedObjectHolder.js', //
   'navigation/Universe.js', //
   'navigation/Galaxy.js', //
   'navigation/Region.js', //
   'navigation/Constellation.js', //
   'navigation/SolarSystem.js', //
   'navigation/JumpType.js', //
   'navigation/JumpCorridor.js', //
   'navigation/JumpPortal.js', //
   'navigation/SystemRouteEntry.js', //

   'navigation/finder/finder.js', //
   'navigation/finder/PathFinder.js', //
   'navigation/finder/PathFinderCapability.js', //
   'navigation/finder/PathFinderCapabilityJumpBridges.js', //
   'navigation/finder/PathFinderCapabilityJumpDrive.js', //
   'navigation/finder/PathFinderCapabilityJumpGates.js', //
   'navigation/finder/PathFinderCapabilityWaypoints.js', //
   'navigation/finder/PathFinderCapabilityWormholes.js', //
   'navigation/finder/PathFinderCost.js', //
   'navigation/finder/PathFinderCostRule.js', //
   'navigation/finder/PathFinderCostRuleJumpFuel.js', //
   'navigation/finder/PathFinderCostRuleJumps.js', //
   'navigation/finder/PathFinderCostRuleMaxSecurity.js', //
   'navigation/finder/PathFinderCostRuleMinSecurity.js', //
   'navigation/finder/PathFinderFilter.js', //
   'navigation/finder/PathFinderFilterSystem.js', //
   'navigation/finder/PathFinderWaypoint.js', //
   'navigation/finder/RouteFinder.js', //
   'navigation/finder/RouteFinderSimple.js', //
   'navigation/finder/RouteFinderAbstractTSP.js', //
   'navigation/finder/RouteFinderBruteForceTSP.js', //
   'navigation/finder/RouteFinderGeneticTSP.js', //

   'scene/scene.js', //
   'scene/SceneSystem.js', //
   'scene/ShaderProgram.js', //
   'scene/RotationBuffer.js', //
   'scene/SceneObject.js', //
   'scene/Camera.js', //
   'scene/SceneRenderObject.js', //
   'scene/PickResult.js', //
   'scene/GalaxyRenderObject.js', //
   'scene/VertexBufferSegment.js', //
   'scene/TrackedProjection.js', //

   'hud/hud.js', //
   'hud/CommandAdapter.js', //
   'hud/SimpleCommandAdapter.js', //
   'hud/SubMenuCommandAdapter.js', //
   'hud/HudSystem.js', //
   'hud/Button.js', //
   'hud/IconCreatorFactory.js', //
   'hud/RadialMenuContext.js', //
   'hud/RadialMenu.js', //
   'hud/MenuEntry.js', //
   'hud/Label.js', //
   'hud/Table.js', //
   'hud/TableModel.js', //
   'hud/SimpleTableModel.js', //
   'hud/TableModelKeyboardHandler.js', //

   'data/data.js', //
   shareBase + 'CommonSchemata.js', //
   shareBase + 'ClientRequests.js', //
   shareBase + 'ClientEvents.js', //
   shareBase + 'ClientBroadcastEvents.js', //
   'data/CommunicationUplink.js', //

   'model/model.js', //
   shareBase + 'PredefinedGroups.js', //
   shareBase + 'navigation/RoutingRules.js', //
   shareBase + 'navigation/RoutingCapabilities.js', //
   'model/LocationTracker.js', //
   'model/LocationStatusGroupInfo.js', //
   'model/UserRoutingRule.js', //
   'model/AbstractBodyName.js', //
   'model/UnknownBodyName.js', //
   'model/ResolvedBodyName.js', //
   'model/InterestChecker.js', //
   'model/AbstractSharedObjectInfo.js', //
   'model/GroupInfo.js', //
   'model/JumpCorridorInfo.js', //
   'model/AbstractActiveRouteSegment.js', //
   'model/ActiveRouteHeadSegment.js', //
   'model/ActiveRouteSegmentTerminator.js', //
   'model/ActiveRouteSegment.js', //
   'model/RouteInfo.js', //

   'model/proxies/proxies.js', //
   'model/proxies/LocalBasedInterestChecker.js', //
   'model/proxies/AbstractProxy.js', //
   'model/proxies/SessionControlProxy.js', //
   'model/proxies/LocationTrackerProxy.js', //
   'model/proxies/UserSessionProxy.js', //
   'model/proxies/UserSettingsProxy.js', //
   'model/proxies/UniverseProxy.js', //
   'model/proxies/UserViewDataProxy.js', //
   'model/proxies/ActiveRouteProxy.js', //
   'model/proxies/AutopilotProxy.js', //
   'model/proxies/GroupProxy.js', //
   'model/proxies/BodyRegisterProxy.js', //
   'model/proxies/JumpCorridorProxy.js', //
   'model/proxies/RouteOptimizerProxy.js', //
   'model/proxies/RouteProxy.js', //

   'control/ctrl.js', //
   'control/commands/cmd.js', //
   'control/commands/NotifiedStartupCommand.js', //
   'control/commands/SetupModelCommand.js', //
   'control/commands/SetupViewCommand.js', //
   'control/commands/InitApplicationCommand.js', //
   'control/commands/NotifiedSetUserInterfaceVisibleCommand.js', //
   'control/commands/NotifiedSetUserInterfaceInvisibleCommand.js', //
   'control/commands/NotifiedActiveInGameBrowserControlChangedCommand.js', //
   'control/commands/NotifiedAutopilotRouteChangedCommand.js', //
   'control/commands/NotifiedAutopilotNextRouteIndexChangedCommand.js', //
   'control/commands/NotifiedClearAutopilotRouteRequestCommand.js', //
   'control/commands/NotifiedCharacterLocationStatusCommand.js', //
   'control/commands/NotifiedCharacterListInSolarSystemChangedCommand.js', //
   'control/commands/NotifiedModifyLocationStatusGroupSettingsCommand.js', //
   'control/commands/NotifiedSessionLoggedInCommand.js', //
   'control/commands/NotifiedSetActiveGalaxyCommand.js', //
   'control/commands/NotifiedSetHighlightedObjectCommand.js', //
   'control/commands/NotifiedHighlightedObjectChangedCommand.js', //
   'control/commands/NotifiedScenePointerActivationCommand.js', //
   'control/commands/NotifiedUserIgnoredSolarSystemsChangedCommand.js', //
   'control/commands/NotifiedUserIgnoredSolarSystemIgnoreToggleCommand.js', //
   'control/commands/NotifiedUserIgnoredSolarSystemsSetIgnoreStateCommand.js', //
   'control/commands/NotifiedActiveRouteResetCommand.js', //
   'control/commands/NotifiedActiveRouteRecalculateCommand.js', //
   'control/commands/NotifiedActiveRouteRemoveEntryCommand.js', //
   'control/commands/NotifiedActiveRouteAddWaypointCommand.js', //
   'control/commands/NotifiedActiveRouteAddCheckpointCommand.js', //
   'control/commands/NotifiedActiveRoutePathChangedCommand.js', //
   'control/commands/NotifiedActiveRouteSetAutopilotCommand.js', //
   'control/commands/NotifiedUserRoutingRulesChangedCommand.js', //
   'control/commands/NotifiedUserRoutingRuleToggleCommand.js', //
   'control/commands/NotifiedUserRoutingRuleMoreCommand.js', //
   'control/commands/NotifiedUserRoutingRuleLessCommand.js', //
   'control/commands/NotifiedUserRoutingRuleUpCommand.js', //
   'control/commands/NotifiedUserRoutingRuleDownCommand.js', //
   'control/commands/NotifiedUserRoutingCapabilitiesChangedCommand.js', //
   'control/commands/NotifiedUserRoutingCapJumpBridgesToggleCommand.js', //
   'control/commands/NotifiedUserRoutingCapJumpGatesToggleCommand.js', //
   'control/commands/NotifiedUserRoutingCapJumpDriveToggleCommand.js', //
   'control/commands/NotifiedUserRoutingCapJumpDriveRangeStepCommand.js', //
   'control/commands/NotifiedUserRoutingCapWormholesToggleCommand.js', //
   'control/commands/NotifiedNewCorridorSetExitCommand.js', //
   'control/commands/NotifiedNewCorridorPrepareStaticWormholeCommand.js', //
   'control/commands/NotifiedNewCorridorPrepareDynamicWormholeCommand.js', //
   'control/commands/NotifiedNewCorridorPrepareJumpBridgeCommand.js', //
   'control/commands/NotifiedGroupSelectionRequestCommand.js', //
   'control/commands/NotifiedGroupCreateRequestCommand.js', //
   'control/commands/NotifiedGroupJoinRequestCommand.js', //
   'control/commands/NotifiedGroupLeaveRequestCommand.js', //
   'control/commands/NotifiedGroupDestroyRequestCommand.js', //
   'control/commands/NotifiedBanGroupMembersRequestCommand.js', //
   'control/commands/NotifiedUnbanGroupMembersRequestCommand.js', //
   'control/commands/NotifiedFindBodyByNameRequestCommand.js', //
   'control/commands/NotifiedGroupAdvertiseRequestCommand.js', //
   'control/commands/NotifiedGroupRemoveAdvertisementRequestCommand.js', //
   'control/commands/NotifiedKnownCharactersChangedCommand.js', //
   'control/commands/NotifiedJumpCorridorSelectionRequestCommand.js', //
   'control/commands/NotifiedJumpCorridorSelectedCommand.js', //
   'control/commands/NotifiedUpdateJumpCorridorRequestCommand.js', //
   'control/commands/NotifiedDestroyJumpCorridorRequestCommand.js', //
   'control/commands/NotifiedSharedObjectAddOwnerRequestCommand.js', //
   'control/commands/NotifiedSharedObjectRemoveOwnerRequestCommand.js', //
   'control/commands/NotifiedSharedObjectAddSharesRequestCommand.js', //
   'control/commands/NotifiedSharedObjectRemoveSharesRequestCommand.js', //
   'control/commands/NotifiedRouteOptimizerFinishedCommand.js', //
   'control/commands/NotifiedActiveRouteCreateNewRouteRequestCommand.js', //
   'control/commands/NotifiedRouteSelectionRequestCommand.js', //
   'control/commands/NotifiedRouteSelectedCommand.js', //
   'control/commands/NotifiedSetActiveRouteRequestCommand.js', //
   'control/commands/NotifiedAddActiveRouteRequestCommand.js', //
   'control/commands/NotifiedSetAutopilotRouteRequestCommand.js', //
   'control/commands/NotifiedDestroyRouteRequestCommand.js', //
   'control/commands/NotifiedActiveRouteUpdateRouteRequestCommand.js', //
   'control/commands/NotifiedRejectSharedObjectRequestCommand.js', //
   'control/commands/NotifiedSelectSolarSystemCommand.js', //

   'view/view.js', //
   'view/SceneObjectRotationOperation.js', //
   'view/OrientedMoveOperation.js', //
   'view/IdlePointerOperation.js', //
   'view/UiTheme.js', //
   'view/UiPanelLayout.js', //
   'view/UiHelper.js', //
   'view/ZoomMoveOperation.js', //

   'view/mediators/mediators.js', //
   'view/mediators/AbstractMediator.js', //
   'view/mediators/AbstractSideButtonMediator.js', //
   'view/mediators/DocumentKeyboardMediator.js', //
   'view/mediators/DocumentMouseMediator.js', //
   'view/mediators/HudMediator.js', //
   'view/mediators/InGameBrowserMediator.js', //
   'view/mediators/SceneMediator.js', //
   'view/mediators/SolarSystemHighlight.js', //
   'view/mediators/SolarSystemHighlightMediator.js', //
   'view/mediators/AbstractContextMenuMediator.js', //
   'view/mediators/SolarSystemContextMenuMediator.js', //
   'view/mediators/MainContextMenuMediator.js', //
   'view/mediators/UiMediator.js', //
   'view/mediators/HideUiSideButtonMediator.js', //
   'view/mediators/ActiveRouteListPanelMediator.js', //
   'view/mediators/AutopilotRoutePanelMediator.js', //
   'view/mediators/DebugPanelMediator.js', //
   'view/mediators/SessionPanelMediator.js', //
   'view/mediators/GroupListPanelMediator.js', //
   'view/mediators/GroupMemberListPanelMediator.js', //
   'view/mediators/GroupBannedListPanelMediator.js', //
   'view/mediators/CurrentLocationPanelMediator.js', //
   'view/mediators/CurrentLocationListPanelMediator.js', //
   'view/mediators/JumpCorridorSceneMediator.js', //
   'view/mediators/JumpCorridorListPanelMediator.js', //
   'view/mediators/JumpCorridorEditPanelMediator.js', //
   'view/mediators/AbstractSharingPanelMediator.js', //
   'view/mediators/SharedObjectInterestPanelMediator.js', //
   'view/mediators/RouteListPanelMediator.js', //
   'view/mediators/GroupInterestPanelMediator.js', //
   'view/mediators/SystemSearchOverlayMediator.js', //
   'view/mediators/RouteListPanelMediator.js', //
   'view/mediators/IgnoredSolarSystemListPanelMediator.js', //
   'view/mediators/RoutingRulesPanelMediator.js', //

   'app/app.js', //
   'app/Notifications.js', //
   'app/ApplicationFacade.js', //

   'res/res.js', //

   'res/text/text.js', //
   'res/text/Util.js', //
   'res/text/Lang.js', //

   'res/eve/eve.js', //
   'res/eve/MapData.js', //
   'res/eve/IconData.js', //

   'res/menu/menu.js', //
   'res/menu/IconData.js', //

   'res/text/templates/templates.js', //
   'res/text/templates/en.js', //

   'res/ImageData.js' //
   ];

   function getFilePath(fileName)
   {
      return path.normalize(__dirname + '/src/' + fileName);
   }

   sourceFiles.forEach(function(sourceFile)
   {
      exports.sourceFiles.push(getFilePath(sourceFile));
   });
})();
