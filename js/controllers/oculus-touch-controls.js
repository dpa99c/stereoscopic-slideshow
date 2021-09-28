(function(){
    var OculusTouchControls = {};

    /*********************
     * Internal properties
     *********************/
    let listeners = {};
    let previousThumbstickDirection = null;

    /*********************
     * Public properties
     *********************/
    OculusTouchControls.webXrControllerEventName = "webxr-controller";

    OculusTouchControls.CONTROL_NAME = "oculus-touch-controls";

    OculusTouchControls.THUMBSTICK_DIRECTION_THRESHOLD = 0.95;

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

    OculusTouchControls.actions = {
        down: "down",
        up: "up",
        touchstart: "touchstart",
        touchend: "touchend",
        changed: "changed",
        moved: "moved",
        directionchanged: "directionchanged"
    };

    OculusTouchControls.hands = {
        left: "left",
        right: "right"
    };

    OculusTouchControls.thumbstick = {
        axis: {
            x: "x",
            y: "y"
        },
        direction:{
            left: "left",
            right: "right",
            up: "up",
            down: "down"
        }
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
        instance.el.addEventListener(control + OculusTouchControls.actions.down, listeners.onDown.bind(instance, HAND, control));
        instance.el.addEventListener(control + OculusTouchControls.actions.up, listeners.onUp.bind(instance, HAND, control));
        instance.el.addEventListener(control + OculusTouchControls.actions.touchstart, listeners.onTouchStart.bind(instance, HAND, control));
        instance.el.addEventListener(control + OculusTouchControls.actions.touchend, listeners.onTouchEnd.bind(instance, HAND, control));
        instance.el.addEventListener(control + OculusTouchControls.actions.changed, listeners.onChanged.bind(instance, HAND, control));
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
        instance.el.addEventListener(OculusTouchControls.controls.thumbstick+OculusTouchControls.actions.moved, onThumbstickMoved.bind(instance, HAND));
    };
    
    var _construct = function(){
        AFRAME.registerComponent(OculusTouchControls.CONTROL_NAME+"-"+OculusTouchControls.hands.left, (function(){
            var OculusTouchControlsLeft = {};
            var HAND = OculusTouchControls.hands.left;
            OculusTouchControlsLeft.init = function(){
                addCommonToHandListeners(this, HAND);
                addCommonToControlListeners(this, OculusTouchControls.controls.xbutton, HAND)
                addCommonToControlListeners(this, OculusTouchControls.controls.ybutton, HAND)
            };
            return OculusTouchControlsLeft;
        })());

        AFRAME.registerComponent(OculusTouchControls.CONTROL_NAME+"-"+OculusTouchControls.hands.right, (function(){
            var OculusTouchControlsRight = {};
            var HAND = OculusTouchControls.hands.right;
            OculusTouchControlsRight.init = function(){
                addCommonToHandListeners(this, HAND);
                addCommonToControlListeners(this, OculusTouchControls.controls.abutton, HAND)
                addCommonToControlListeners(this, OculusTouchControls.controls.bbutton, HAND)
            };
            return OculusTouchControlsRight;
        })());
    };

    listeners.onEvent = function(action, hand, control, event){
        let detail = event.detail || {};
        detail.hand = hand;
        detail.action = action;
        detail.control = control;
        detail.controllerType = OculusTouchControls.CONTROL_NAME;
        // console.log(hand+" on"+control+action); console.dir(event);
        document.dispatchEvent(new CustomEvent(OculusTouchControls.webXrControllerEventName, {detail: detail}));
    };
    
    listeners.onDown = function(hand, control, event){
        listeners.onEvent(OculusTouchControls.actions.down, hand, control, event)
    };

    listeners.onUp = function(hand, control, event){
        listeners.onEvent(OculusTouchControls.actions.up, hand, control, event)
    };

    listeners.onTouchStart = function(hand, control, event){
        listeners.onEvent(OculusTouchControls.actions.touchstart, hand, control, event)
    };

    listeners.onTouchEnd = function(hand, control, event){
        listeners.onEvent(OculusTouchControls.actions.touchend, hand, control, event)
    };

    listeners.onChanged = function(hand, control, event){
        listeners.onEvent(OculusTouchControls.actions.changed, hand, control, event)
    };

    //Thumbstick
    var onThumbstickMoved = function(hand, event){
        let direction = null;
        if (event.detail.y > OculusTouchControls.THUMBSTICK_DIRECTION_THRESHOLD) direction = setDirection(direction,  OculusTouchControls.thumbstick.direction.down, OculusTouchControls.thumbstick.axis.y);
        if (event.detail.y < -(OculusTouchControls.THUMBSTICK_DIRECTION_THRESHOLD)) direction = setDirection(direction, OculusTouchControls.thumbstick.direction.up, OculusTouchControls.thumbstick.axis.y);
        if (event.detail.x < -(OculusTouchControls.THUMBSTICK_DIRECTION_THRESHOLD)) direction = setDirection(direction, OculusTouchControls.thumbstick.direction.left, OculusTouchControls.thumbstick.axis.x);
        if (event.detail.x > OculusTouchControls.THUMBSTICK_DIRECTION_THRESHOLD) direction = setDirection(direction, OculusTouchControls.thumbstick.direction.right, OculusTouchControls.thumbstick.axis.x);
        event.detail.direction = direction;
        listeners.onEvent(OculusTouchControls.actions.moved, hand, OculusTouchControls.controls.thumbstick, event);
        if(direction && (
            !previousThumbstickDirection
            || direction.x !== previousThumbstickDirection.x
            || direction.y !== previousThumbstickDirection.y
        )){
            listeners.onEvent(OculusTouchControls.actions.directionchanged, hand, OculusTouchControls.controls.thumbstick, event);
            // console.log(hand+" ondirectionchanged"); console.dir(event);
        }
        previousThumbstickDirection = direction;
    };

    var setDirection = function(dirObj, direction, axis){
        dirObj = dirObj || {};
        dirObj[axis] = direction;
        return dirObj;
    };

    _construct();
    window.OculusTouchControls = OculusTouchControls;
    return OculusTouchControls;
})();
