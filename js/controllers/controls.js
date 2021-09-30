(function(){
    var Controls = {};

    /*********************
     * Internal properties
     *********************/

    /*********************
     * Public properties
     *********************/
    Controls.webXrControllerEventName = "webxr-controller";

    Controls.actions = {
        down: "down",
        up: "up",
        touchstart: "touchstart",
        touchend: "touchend",
        changed: "changed",
        moved: "moved",
        directionchanged: "directionchanged"
    };

    Controls.hands = {
        left: "left",
        right: "right"
    };

    Controls.direction = {
        left: "left",
        right: "right",
        up: "up",
        down: "down"
    };

    Controls.axis = {
        x: "x",
        y: "y",
        z: "z"
    };

    /*********************
     * Internal functions
     *********************/

    var setDirection = function(dirObj, direction, axis){
        dirObj = dirObj || {};
        dirObj[axis] = direction;
        return dirObj;
    };

    /*********************
     * Public functions
     *********************/

    Controls.onEvent = function(controllerType, action, hand, control, event){
        let detail = event.detail || {};
        detail.hand = hand;
        detail.action = action;
        detail.control = control;
        detail.controllerType = controllerType;
        // console.log(hand+" on"+control+action); console.dir(event);
        document.dispatchEvent(new CustomEvent(Controls.webXrControllerEventName, {detail: detail}));
    };

    Controls.onDown = function(controllerType, hand, control, event){
        Controls.onEvent(controllerType, Controls.actions.down, hand, control, event)
    };

    Controls.onUp = function(controllerType, hand, control, event){
        Controls.onEvent(controllerType, Controls.actions.up, hand, control, event)
    };

    Controls.onTouchStart = function(controllerType, hand, control, event){
        Controls.onEvent(controllerType, Controls.actions.touchstart, hand, control, event)
    };

    Controls.onTouchEnd = function(controllerType, hand, control, event){
        Controls.onEvent(controllerType, Controls.actions.touchend, hand, control, event)
    };

    Controls.onChanged = function(controllerType, hand, control, event){
        Controls.onEvent(controllerType, Controls.actions.changed, hand, control, event)
    };
    
    Controls.onAnalogControlMoved = function(threshold, previousValue, controllerType, hand, control, event){
        let direction = null;
        if (event.detail.y > threshold) direction = setDirection(direction,  Controls.direction.down, Controls.axis.y);
        if (event.detail.y < -(threshold)) direction = setDirection(direction, Controls.direction.up, Controls.axis.y);
        if (event.detail.x < -(threshold)) direction = setDirection(direction, Controls.direction.left, Controls.axis.x);
        if (event.detail.x > threshold) direction = setDirection(direction, Controls.direction.right, Controls.axis.x);
        event.detail.direction = direction;
        Controls.onEvent(controllerType, Controls.actions.moved, hand, control, event);
        if(direction && (
            !previousValue
            || direction.x !== previousValue.x
            || direction.y !== previousValue.y
        )){
            Controls.onEvent(controllerType, Controls.actions.directionchanged, hand, control, event);
            // console.log(hand+" ondirectionchanged"); console.dir(event);
        }
        return direction
    };

    Controls.addConnectionListeners = function(instance, control, hand){
        instance.el.addEventListener('controllerconnected', function () {
            control.connected[hand] = true;
            let detail = {
                hand: hand,
                controllerType: control.CONTROL_NAME,
                action: "connected"
            };
            document.dispatchEvent(new CustomEvent(Controls.webXrControllerEventName, {detail: detail}));
            console.log(control.CONTROL_NAME + ' ' + hand + ' connected');
        });
        instance.el.addEventListener('controllerdisconnected', function () {
            control.connected[hand] = false;
            let detail = {
                hand: hand,
                controllerType: control.CONTROL_NAME,
                action: "disconnected"
            };
            document.dispatchEvent(new CustomEvent(Controls.webXrControllerEventName, {detail: detail}));
            console.log(control.CONTROL_NAME + ' ' + hand + ' disconnected');
        });
    };

    namespace('Components.Controls', Controls);
})();
