/* global AFRAME */
onNamespacesLoaded([
    'Components.Controls',
], function(){
    var OculusGoControls = {};

    /*********************
     * Internal properties
     *********************/
    const Controls = Components.Controls;
    let previousTouchpadDirection = null;

    /*********************
     * Public properties
     *********************/
    OculusGoControls.CONTROL_NAME = "oculus-go-controls";

    OculusGoControls.TOUCHPAD_DIRECTION_THRESHOLD = 0.95;

    OculusGoControls.controls = {
        trigger: "trigger",
        touchpad: "touchpad"
    };

    OculusGoControls.connected = {
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
        instance.el.addEventListener(control + Controls.actions.down, Controls.onDown.bind(instance, OculusGoControls.CONTROL_NAME, HAND, control));
        instance.el.addEventListener(control + Controls.actions.up, Controls.onUp.bind(instance, OculusGoControls.CONTROL_NAME, HAND, control));
        instance.el.addEventListener(control + Controls.actions.changed, Controls.onChanged.bind(instance, OculusGoControls.CONTROL_NAME, HAND, control));
    };

    /**
     * Add listeners for controls common to both hands
     * @param instance - control instance
     * @param HAND - which controller hand: "left" or "right"
     */
    var addCommonToHandListeners = function(instance, HAND){
        addCommonToControlListeners(instance, OculusGoControls.controls.trigger, HAND)
        addCommonToControlListeners(instance, OculusGoControls.controls.touchpad, HAND)
        instance.el.addEventListener(OculusGoControls.controls.touchpad + Controls.actions.touchstart, Controls.onTouchStart.bind(instance, OculusGoControls.CONTROL_NAME, HAND, OculusGoControls.controls.touchpad));
        instance.el.addEventListener(OculusGoControls.controls.touchpad + Controls.actions.touchend, Controls.onTouchEnd.bind(instance, OculusGoControls.CONTROL_NAME, HAND, OculusGoControls.controls.touchpad));
        instance.el.addEventListener(OculusGoControls.controls.touchpad+Controls.actions.moved, onTouchpadMoved.bind(instance, HAND));
    };
    
    var _construct = function(){
        AFRAME.registerComponent(OculusGoControls.CONTROL_NAME+"-"+Controls.hands.left, (function(){
            var OculusGoControlsLeft = {};
            var HAND = Controls.hands.left;
            OculusGoControlsLeft.init = function(){
                addCommonToHandListeners(this, HAND);
                Controls.addConnectionListeners(this, OculusGoControls, HAND);
            };
            return OculusGoControlsLeft;
        })());

        AFRAME.registerComponent(OculusGoControls.CONTROL_NAME+"-"+Controls.hands.right, (function(){
            var OculusGoControlsRight = {};
            var HAND = Controls.hands.right;
            OculusGoControlsRight.init = function(){
                addCommonToHandListeners(this, HAND);
                Controls.addConnectionListeners(this, OculusGoControls, HAND);
            };
            return OculusGoControlsRight;
        })());
    };

    var onTouchpadMoved = function(hand, event){
        previousTouchpadDirection = Controls.onAnalogControlMoved(
            OculusGoControls.TOUCHPAD_DIRECTION_THRESHOLD,
            previousTouchpadDirection,
            OculusGoControls.CONTROL_NAME,
            hand,
            OculusGoControls.controls.touchpad,
            event
        );
    };

    _construct();
    namespace('Components.OculusGoControls', OculusGoControls);
});
