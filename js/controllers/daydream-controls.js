(function(){
    var DaydreamControls = {};

    /*********************
     * Internal properties
     *********************/
    let listeners = {};

    /*********************
     * Public properties
     *********************/
    DaydreamControls.webXrControllerEventName = "webxr-controller";

    DaydreamControls.CONTROL_NAME = "daydream-controls";

    DaydreamControls.controls = {
        trackpad: "trackpad"
    };

    DaydreamControls.actions = {
        down: "down",
        up: "up",
        touchstart: "touchstart",
        touchend: "touchend",
        changed: "changed"
    };

    DaydreamControls.hands = {
        left: "left",
        right: "right"
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
        instance.el.addEventListener(control + DaydreamControls.actions.down, listeners.onDown.bind(instance, HAND, control));
        instance.el.addEventListener(control + DaydreamControls.actions.up, listeners.onUp.bind(instance, HAND, control));
        instance.el.addEventListener(control + DaydreamControls.actions.touchstart, listeners.onTouchStart.bind(instance, HAND, control));
        instance.el.addEventListener(control + DaydreamControls.actions.touchend, listeners.onTouchEnd.bind(instance, HAND, control));
        instance.el.addEventListener(control + DaydreamControls.actions.changed, listeners.onChanged.bind(instance, HAND, control));
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
        AFRAME.registerComponent(DaydreamControls.CONTROL_NAME+"-"+DaydreamControls.hands.left, (function(){
            var DaydreamControlsLeft = {};
            var HAND = DaydreamControls.hands.left;
            DaydreamControlsLeft.init = function(){
                addCommonToHandListeners(this, HAND);
                addCommonToControlListeners(this, DaydreamControls.controls.xbutton, HAND)
                addCommonToControlListeners(this, DaydreamControls.controls.ybutton, HAND)
            };
            return DaydreamControlsLeft;
        })());

        AFRAME.registerComponent(DaydreamControls.CONTROL_NAME+"-"+DaydreamControls.hands.right, (function(){
            var DaydreamControlsRight = {};
            var HAND = DaydreamControls.hands.right;
            DaydreamControlsRight.init = function(){
                addCommonToHandListeners(this, HAND);
                addCommonToControlListeners(this, DaydreamControls.controls.abutton, HAND)
                addCommonToControlListeners(this, DaydreamControls.controls.bbutton, HAND)
            };
            return DaydreamControlsRight;
        })());
    };

    listeners.onEvent = function(action, hand, control, event){
        let detail = event.detail || {};
        detail.hand = hand;
        detail.action = action;
        detail.control = control;
        detail.controllerType = DaydreamControls.CONTROL_NAME;
        // console.log(hand+" on"+control+action); console.dir(event);
        document.dispatchEvent(new CustomEvent(DaydreamControls.webXrControllerEventName, {detail: detail}));
    };

    listeners.onDown = function(hand, control, event){
        listeners.onEvent(DaydreamControls.actions.down, hand, control, event)
    };

    listeners.onUp = function(hand, control, event){
        listeners.onEvent(DaydreamControls.actions.up, hand, control, event)
    };

    listeners.onTouchStart = function(hand, control, event){
        listeners.onEvent(DaydreamControls.actions.touchstart, hand, control, event)
    };

    listeners.onTouchEnd = function(hand, control, event){
        listeners.onEvent(DaydreamControls.actions.touchend, hand, control, event)
    };

    listeners.onChanged = function(hand, control, event){
        listeners.onEvent(DaydreamControls.actions.changed, hand, control, event)
    };

    _construct();
    window.DaydreamControls = DaydreamControls;
    return DaydreamControls;
})();
