/* global AFRAME */
onNamespacesLoaded([
    'Components.Controls',
], function(){
    var OculusTouchControls = {};

    /*********************
     * Internal properties
     *********************/
    const Controls = Components.Controls;
    let previousThumbstickDirection = null;

    /*********************
     * Public properties
     *********************/
    OculusTouchControls.CONTROL_NAME = "oculus-touch-controls";

    OculusTouchControls.THUMBSTICK_DIRECTION_THRESHOLD = 0.95;

    OculusTouchControls.connected = {
        left: false,
        right: false
    };

    OculusTouchControls.controls = {
        trigger: "trigger",
        grip: "grip",
        surface: "surface",
        thumbstick: "thumbstick",
        xbutton: "xbutton",
        ybutton: "ybutton",
        abutton: "abutton",
        bbutton: "bbutton"
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
        instance.el.addEventListener(control + Controls.actions.down, Controls.onDown.bind(instance, OculusTouchControls.CONTROL_NAME, HAND, control));
        instance.el.addEventListener(control + Controls.actions.up, Controls.onUp.bind(instance, OculusTouchControls.CONTROL_NAME, HAND, control));
        instance.el.addEventListener(control + Controls.actions.touchstart, Controls.onTouchStart.bind(instance, OculusTouchControls.CONTROL_NAME, HAND, control));
        instance.el.addEventListener(control + Controls.actions.touchend, Controls.onTouchEnd.bind(instance, OculusTouchControls.CONTROL_NAME, HAND, control));
        instance.el.addEventListener(control + Controls.actions.changed, Controls.onChanged.bind(instance, OculusTouchControls.CONTROL_NAME, HAND, control));
    };

    /**
     * Add listeners for controls common to both hands
     * @param instance - control instance
     * @param HAND - which controller hand: "left" or "right"
     */
    var addCommonToHandListeners = function(instance, HAND){
        addCommonToControlListeners(instance, OculusTouchControls.controls.trigger, HAND)
        addCommonToControlListeners(instance, OculusTouchControls.controls.grip, HAND)
        addCommonToControlListeners(instance, OculusTouchControls.controls.surface, HAND)
        addCommonToControlListeners(instance, OculusTouchControls.controls.thumbstick, HAND)
        instance.el.addEventListener(OculusTouchControls.controls.thumbstick+Controls.actions.moved, onThumbstickMoved.bind(instance, HAND));
    };
    
    var _construct = function(){
        AFRAME.registerComponent(OculusTouchControls.CONTROL_NAME+"-"+Controls.hands.left, (function(){
            var OculusTouchControlsLeft = {};
            var HAND = Controls.hands.left;
            OculusTouchControlsLeft.init = function(){
                Controls.addConnectionListeners(this, OculusTouchControls, HAND);
                addCommonToHandListeners(this, HAND);
                addCommonToControlListeners(this, OculusTouchControls.controls.xbutton, HAND)
                addCommonToControlListeners(this, OculusTouchControls.controls.ybutton, HAND)
            };
            return OculusTouchControlsLeft;
        })());

        AFRAME.registerComponent(OculusTouchControls.CONTROL_NAME+"-"+Controls.hands.right, (function(){
            var OculusTouchControlsRight = {};
            var HAND = Controls.hands.right;
            OculusTouchControlsRight.init = function(){
                Controls.addConnectionListeners(this, OculusTouchControls, HAND);
                addCommonToHandListeners(this, HAND);
                addCommonToControlListeners(this, OculusTouchControls.controls.abutton, HAND)
                addCommonToControlListeners(this, OculusTouchControls.controls.bbutton, HAND)
            };
            return OculusTouchControlsRight;
        })());
    };

    var onThumbstickMoved = function(hand, event){
        previousThumbstickDirection = Controls.onAnalogControlMoved(
            OculusTouchControls.THUMBSTICK_DIRECTION_THRESHOLD,
            previousThumbstickDirection,
            OculusTouchControls.CONTROL_NAME,
            hand,
            OculusTouchControls.controls.thumbstick,
            event
        );
    };

    _construct();
    namespace('Components.OculusTouchControls', OculusTouchControls);
});
