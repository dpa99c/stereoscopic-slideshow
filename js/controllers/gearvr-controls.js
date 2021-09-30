onNamespacesLoaded([
    'Components.Controls',
],function(){
    var GearVrControls = {};

    /*********************
     * Internal properties
     *********************/
    const Controls = Components.Controls;

    /*********************
     * Public properties
     *********************/
    GearVrControls.CONTROL_NAME = "gearvr-controls";

    GearVrControls.controls = {
        trackpad: "trackpad",
        trigger: "trigger"
    };

    GearVrControls.connected = {
        left: false,
        right: false
    };

    /*********************
     * Internal functions
     *********************/

    /**
     * Add listeners for controls common to both hands
     * @param instance - control instance
     * @param HAND - which controller hand: "left" or "right"
     */
    var addCommonToHandListeners = function(instance, HAND){
        instance.el.addEventListener(GearVrControls.controls.trackpad + Controls.actions.down, Controls.onDown.bind(instance, GearVrControls.CONTROL_NAME, HAND, GearVrControls.controls.trackpad));
        instance.el.addEventListener(GearVrControls.controls.trackpad + Controls.actions.up, Controls.onUp.bind(instance, GearVrControls.CONTROL_NAME, HAND, GearVrControls.controls.trackpad));
        instance.el.addEventListener(GearVrControls.controls.trackpad + Controls.actions.touchstart, Controls.onTouchStart.bind(instance, GearVrControls.CONTROL_NAME, HAND, GearVrControls.controls.trackpad));
        instance.el.addEventListener(GearVrControls.controls.trackpad + Controls.actions.touchend, Controls.onTouchEnd.bind(instance, GearVrControls.CONTROL_NAME, HAND, GearVrControls.controls.trackpad));
        instance.el.addEventListener(GearVrControls.controls.trackpad + Controls.actions.changed, Controls.onChanged.bind(instance, GearVrControls.CONTROL_NAME, HAND, GearVrControls.controls.trackpad));

        instance.el.addEventListener(GearVrControls.controls.trigger + Controls.actions.down, Controls.onDown.bind(instance, GearVrControls.CONTROL_NAME, HAND, GearVrControls.controls.trigger));
        instance.el.addEventListener(GearVrControls.controls.trigger + Controls.actions.up, Controls.onUp.bind(instance, GearVrControls.CONTROL_NAME, HAND, GearVrControls.controls.trigger));
        instance.el.addEventListener(GearVrControls.controls.trigger + Controls.actions.changed, Controls.onChanged.bind(instance, GearVrControls.CONTROL_NAME, HAND, GearVrControls.controls.trigger));
    };

    var _construct = function(){
        AFRAME.registerComponent(GearVrControls.CONTROL_NAME+"-"+Controls.hands.left, (function(){
            var GearVrControlsLeft = {};
            var HAND = Controls.hands.left;
            GearVrControlsLeft.init = function(){
                addCommonToHandListeners(this, HAND);
                Controls.addConnectionListeners(this, GearVrControls, HAND);
            };
            return GearVrControlsLeft;
        })());

        AFRAME.registerComponent(GearVrControls.CONTROL_NAME+"-"+Controls.hands.right, (function(){
            var GearVrControlsRight = {};
            var HAND = Controls.hands.right;
            GearVrControlsRight.init = function(){
                addCommonToHandListeners(this, HAND);
                Controls.addConnectionListeners(this, GearVrControls, HAND);
            };
            return GearVrControlsRight;
        })());
    };

    _construct();
    namespace('Components.GearVrControls', GearVrControls);
});
