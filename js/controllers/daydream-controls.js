onNamespacesLoaded([
    'Components.Controls',
],function(){
    var DaydreamControls = {};

    /*********************
     * Internal properties
     *********************/
    const Controls = Components.Controls;

    /*********************
     * Public properties
     *********************/
    DaydreamControls.CONTROL_NAME = "daydream-controls";

    DaydreamControls.controls = {
        trackpad: "trackpad"
    };

    DaydreamControls.connected = {
        left: false,
        right: false
    };


    /*********************
     * Internal functions
     *********************/

    /**
     * Adds listeners common to all controls
     * @param instance - control instance
     * @param control - control name e.g. "trigger"
     * @param HAND - which controller hand: "left" or "right"
     */
    var addCommonToControlListeners = function(instance, control, HAND){
        instance.el.addEventListener(control + Controls.actions.down, Controls.onDown.bind(instance, DaydreamControls.CONTROL_NAME, HAND, control));
        instance.el.addEventListener(control + Controls.actions.up, Controls.onUp.bind(instance, DaydreamControls.CONTROL_NAME, HAND, control));
        instance.el.addEventListener(control + Controls.actions.touchstart, Controls.onTouchStart.bind(instance, DaydreamControls.CONTROL_NAME, HAND, control));
        instance.el.addEventListener(control + Controls.actions.touchend, Controls.onTouchEnd.bind(instance, DaydreamControls.CONTROL_NAME, HAND, control));
        instance.el.addEventListener(control + Controls.actions.changed, Controls.onChanged.bind(instance, DaydreamControls.CONTROL_NAME, HAND, control));
    };


    /**
     * Add listeners for controls common to both hands
     * @param instance - control instance
     * @param HAND - which controller hand: "left" or "right"
     */
    var addCommonToHandListeners = function(instance, HAND){
        addCommonToControlListeners(instance, DaydreamControls.controls.trackpad, HAND)
    };

    var _construct = function(){
        AFRAME.registerComponent(DaydreamControls.CONTROL_NAME+"-"+Controls.hands.left, (function(){
            var DaydreamControlsLeft = {};
            var HAND = Controls.hands.left;
            DaydreamControlsLeft.init = function(){
                addCommonToHandListeners(this, HAND);
                Controls.addConnectionListeners(this, DaydreamControls, HAND);
            };
            return DaydreamControlsLeft;
        })());

        AFRAME.registerComponent(DaydreamControls.CONTROL_NAME+"-"+Controls.hands.right, (function(){
            var DaydreamControlsRight = {};
            var HAND = Controls.hands.right;
            DaydreamControlsRight.init = function(){
                addCommonToHandListeners(this, HAND);
                Controls.addConnectionListeners(this, DaydreamControls, HAND);
            };
            return DaydreamControlsRight;
        })());
    };

    _construct();
    namespace('Components.DaydreamControls', DaydreamControls);
});
