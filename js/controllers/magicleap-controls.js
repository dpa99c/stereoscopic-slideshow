/* global AFRAME */
onNamespacesLoaded([
    'Components.Controls',
], function(){
    var MagicLeapControls = {};

    /*********************
     * Internal properties
     *********************/
    const Controls = Components.Controls;
    let previousTouchpadDirection = null;

    /*********************
     * Public properties
     *********************/
    MagicLeapControls.CONTROL_NAME = "magicleap-controls";

    MagicLeapControls.TOUCHPAD_DIRECTION_THRESHOLD = 0.95;

    MagicLeapControls.controls = {
        trigger: "trigger",
        grip: "grip",
        touchpad: "touchpad",
        menu: "menu"
    };

    MagicLeapControls.connected = {
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
        instance.el.addEventListener(control + Controls.actions.down, Controls.onDown.bind(instance, MagicLeapControls.CONTROL_NAME, HAND, control));
        instance.el.addEventListener(control + Controls.actions.up, Controls.onUp.bind(instance, MagicLeapControls.CONTROL_NAME, HAND, control));
        instance.el.addEventListener(control + Controls.actions.changed, Controls.onChanged.bind(instance, MagicLeapControls.CONTROL_NAME, HAND, control));
    };

    /**
     * Add listeners for controls common to both hands
     * @param instance - control instance
     * @param HAND - which controller hand: "left" or "right"
     */
    var addCommonToHandListeners = function(instance, HAND){
        addCommonToControlListeners(instance, MagicLeapControls.controls.trigger, HAND)
        addCommonToControlListeners(instance, MagicLeapControls.controls.grip, HAND)
        addCommonToControlListeners(instance, MagicLeapControls.controls.menu, HAND)
        addCommonToControlListeners(instance, MagicLeapControls.controls.touchpad, HAND)

        instance.el.addEventListener(MagicLeapControls.controls.touchpad + Controls.actions.touchstart, Controls.onTouchStart.bind(instance, MagicLeapControls.CONTROL_NAME, HAND, MagicLeapControls.controls.touchpad));
        instance.el.addEventListener(MagicLeapControls.controls.touchpad + Controls.actions.touchend, Controls.onTouchEnd.bind(instance, MagicLeapControls.CONTROL_NAME, HAND, MagicLeapControls.controls.touchpad));
        instance.el.addEventListener(MagicLeapControls.controls.touchpad+Controls.actions.moved, onTouchpadMoved.bind(instance, HAND));
    };
    
    var _construct = function(){
        AFRAME.registerComponent(MagicLeapControls.CONTROL_NAME+"-"+Controls.hands.left, (function(){
            var MagicLeapControlsLeft = {};
            var HAND = Controls.hands.left;
            MagicLeapControlsLeft.init = function(){
                addCommonToHandListeners(this, HAND);
                Controls.addConnectionListeners(this, MagicLeapControls, HAND);
            };
            return MagicLeapControlsLeft;
        })());

        AFRAME.registerComponent(MagicLeapControls.CONTROL_NAME+"-"+Controls.hands.right, (function(){
            var MagicLeapControlsRight = {};
            var HAND = Controls.hands.right;
            MagicLeapControlsRight.init = function(){
                addCommonToHandListeners(this, HAND);
                Controls.addConnectionListeners(this, MagicLeapControls, HAND);
            };
            return MagicLeapControlsRight;
        })());
    };

    var onTouchpadMoved = function(hand, event){
        previousTouchpadDirection = Controls.onAnalogControlMoved(
            MagicLeapControls.TOUCHPAD_DIRECTION_THRESHOLD,
            previousTouchpadDirection,
            MagicLeapControls.CONTROL_NAME,
            hand,
            MagicLeapControls.controls.touchpad,
            event
        );
    };

    _construct();
    namespace('Components.MagicLeapControls', MagicLeapControls);
});
