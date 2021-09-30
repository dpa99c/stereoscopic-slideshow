/* global AFRAME */
onNamespacesLoaded([
    'Components.Controls',
], function(){
    var ViveFocusControls = {};

    /*********************
     * Internal properties
     *********************/
    const Controls = Components.Controls;
    let previousTrackpadDirection = null;

    /*********************
     * Public properties
     *********************/
    ViveFocusControls.CONTROL_NAME = "vive-focus-controls";

    ViveFocusControls.TRACKPAD_DIRECTION_THRESHOLD = 0.95;

    ViveFocusControls.controls = {
        trigger: "trigger",
        trackpad: "trackpad"
    };

    ViveFocusControls.connected = {
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
        instance.el.addEventListener(control + Controls.actions.down, Controls.onDown.bind(instance, ViveFocusControls.CONTROL_NAME, HAND, control));
        instance.el.addEventListener(control + Controls.actions.up, Controls.onUp.bind(instance, ViveFocusControls.CONTROL_NAME, HAND, control));
        instance.el.addEventListener(control + Controls.actions.changed, Controls.onChanged.bind(instance, ViveFocusControls.CONTROL_NAME, HAND, control));
    };

    /**
     * Add listeners for controls common to both hands
     * @param instance - control instance
     * @param HAND - which controller hand: "left" or "right"
     */
    var addCommonToHandListeners = function(instance, HAND){
        addCommonToControlListeners(instance, ViveFocusControls.controls.trigger, HAND)
        addCommonToControlListeners(instance, ViveFocusControls.controls.trackpad, HAND)
        instance.el.addEventListener(ViveFocusControls.controls.trackpad + Controls.actions.touchstart, Controls.onTouchStart.bind(instance, ViveFocusControls.CONTROL_NAME, HAND, ViveFocusControls.controls.trackpad));
        instance.el.addEventListener(ViveFocusControls.controls.trackpad + Controls.actions.touchend, Controls.onTouchEnd.bind(instance, ViveFocusControls.CONTROL_NAME, HAND, ViveFocusControls.controls.trackpad));
        instance.el.addEventListener(ViveFocusControls.controls.trackpad+Controls.actions.moved, onTrackpadMoved.bind(instance, HAND));
    };
    
    var _construct = function(){
        AFRAME.registerComponent(ViveFocusControls.CONTROL_NAME+"-"+Controls.hands.left, (function(){
            var ViveFocusControlsLeft = {};
            var HAND = Controls.hands.left;
            ViveFocusControlsLeft.init = function(){
                addCommonToHandListeners(this, HAND);
                Controls.addConnectionListeners(this, ViveFocusControls, HAND);
            };
            return ViveFocusControlsLeft;
        })());

        AFRAME.registerComponent(ViveFocusControls.CONTROL_NAME+"-"+Controls.hands.right, (function(){
            var ViveFocusControlsRight = {};
            var HAND = Controls.hands.right;
            ViveFocusControlsRight.init = function(){
                addCommonToHandListeners(this, HAND);
                Controls.addConnectionListeners(this, ViveFocusControls, HAND);
            };
            return ViveFocusControlsRight;
        })());
    };

    var onTrackpadMoved = function(hand, event){
        previousTrackpadDirection = Controls.onAnalogControlMoved(
            ViveFocusControls.TRACKPAD_DIRECTION_THRESHOLD,
            previousTrackpadDirection,
            ViveFocusControls.CONTROL_NAME,
            hand,
            ViveFocusControls.controls.trackpad,
            event
        );
    };

    _construct();
    namespace('Components.ViveFocusControls', ViveFocusControls);
});
