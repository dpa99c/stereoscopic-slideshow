/* global AFRAME */
onNamespacesLoaded([
    'Components.Controls',
], function(){
    var WindowsMotionControls = {};

    /*********************
     * Internal properties
     *********************/
    const Controls = Components.Controls;
    let previousThumbstickDirection = null;
    let previousTrackpadDirection = null;

    /*********************
     * Public properties
     *********************/
    WindowsMotionControls.CONTROL_NAME = "windows-motion-controls";

    WindowsMotionControls.THUMBSTICK_DIRECTION_THRESHOLD = 0.95;
    WindowsMotionControls.TRACKPAD_DIRECTION_THRESHOLD = 0.95;

    WindowsMotionControls.controls = {
        trigger: "trigger",
        grip: "grip",
        menu: "menu",
        thumbstick: "thumbstick",
        trackpad: "trackpad",
    };

    WindowsMotionControls.connected = {
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
        instance.el.addEventListener(control + Controls.actions.down, Controls.onDown.bind(instance, WindowsMotionControls.CONTROL_NAME, HAND, control));
        instance.el.addEventListener(control + Controls.actions.up, Controls.onUp.bind(instance, WindowsMotionControls.CONTROL_NAME, HAND, control));
        instance.el.addEventListener(control + Controls.actions.changed, Controls.onChanged.bind(instance, WindowsMotionControls.CONTROL_NAME, HAND, control));
    };

    /**
     * Add listeners for controls common to both hands
     * @param instance - control instance
     * @param HAND - which controller hand: "left" or "right"
     */
    var addCommonToHandListeners = function(instance, HAND){
        addCommonToControlListeners(instance, WindowsMotionControls.controls.trigger, HAND)
        addCommonToControlListeners(instance, WindowsMotionControls.controls.grip, HAND)
        addCommonToControlListeners(instance, WindowsMotionControls.controls.menu, HAND)
        addCommonToControlListeners(instance, WindowsMotionControls.controls.thumbstick, HAND)
        instance.el.addEventListener(WindowsMotionControls.controls.thumbstick+Controls.actions.moved, onThumbstickMoved.bind(instance, HAND));
        addCommonToControlListeners(instance, WindowsMotionControls.controls.trackpad, HAND)
        instance.el.addEventListener(WindowsMotionControls.controls.trackpad+Controls.actions.moved, onTrackpadMoved.bind(instance, HAND));
    };
    
    var _construct = function(){
        AFRAME.registerComponent(WindowsMotionControls.CONTROL_NAME+"-"+Controls.hands.left, (function(){
            var WindowsMotionControlsLeft = {};
            var HAND = Controls.hands.left;
            WindowsMotionControlsLeft.init = function(){
                addCommonToHandListeners(this, HAND);
                Controls.addConnectionListeners(this, WindowsMotionControls, HAND);
            };
            return WindowsMotionControlsLeft;
        })());

        AFRAME.registerComponent(WindowsMotionControls.CONTROL_NAME+"-"+Controls.hands.right, (function(){
            var WindowsMotionControlsRight = {};
            var HAND = Controls.hands.right;
            WindowsMotionControlsRight.init = function(){
                addCommonToHandListeners(this, HAND);
                Controls.addConnectionListeners(this, WindowsMotionControls, HAND);
            };
            return WindowsMotionControlsRight;
        })());
    };

    var onThumbstickMoved = function(hand, event){
        previousThumbstickDirection = Controls.onAnalogControlMoved(
            WindowsMotionControls.THUMBSTICK_DIRECTION_THRESHOLD,
            previousThumbstickDirection,
            WindowsMotionControls.CONTROL_NAME,
            hand,
            WindowsMotionControls.controls.thumbstick,
            event
        );
    };

    var onTrackpadMoved = function(hand, event){
        previousTrackpadDirection = Controls.onAnalogControlMoved(
            WindowsMotionControls.TRACKPAD_DIRECTION_THRESHOLD,
            previousTrackpadDirection,
            WindowsMotionControls.CONTROL_NAME,
            hand,
            WindowsMotionControls.controls.trackpad,
            event
        );
    };

    _construct();
    namespace('Components.WindowsMotionControls', WindowsMotionControls);
});
