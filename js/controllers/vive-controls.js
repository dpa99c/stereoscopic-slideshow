/* global AFRAME */
onNamespacesLoaded([
    'Components.Controls',
], function(){
    var ViveControls = {};

    /*********************
     * Internal properties
     *********************/
    const Controls = Components.Controls;

    /*********************
     * Public properties
     *********************/
    ViveControls.CONTROL_NAME = "vive-controls";

    ViveControls.controls = {
        trigger: "trigger",
        grip: "grip",
        trackpad: "trackpad",
        menu: "menu",
        system: "system"
    };

    ViveControls.connected = {
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
        instance.el.addEventListener(control + Controls.actions.down, Controls.onDown.bind(instance, ViveControls.CONTROL_NAME, HAND, control));
        instance.el.addEventListener(control + Controls.actions.up, Controls.onUp.bind(instance, ViveControls.CONTROL_NAME, HAND, control));
        instance.el.addEventListener(control + Controls.actions.changed, Controls.onChanged.bind(instance, ViveControls.CONTROL_NAME, HAND, control));
    };

    /**
     * Add listeners for controls common to both hands
     * @param instance - control instance
     * @param HAND - which controller hand: "left" or "right"
     */
    var addCommonToHandListeners = function(instance, HAND){
        addCommonToControlListeners(instance, ViveControls.controls.trigger, HAND)
        addCommonToControlListeners(instance, ViveControls.controls.grip, HAND)
        addCommonToControlListeners(instance, ViveControls.controls.trackpad, HAND)
        addCommonToControlListeners(instance, ViveControls.controls.menu, HAND)
        addCommonToControlListeners(instance, ViveControls.controls.system, HAND)
    };
    
    var _construct = function(){
        AFRAME.registerComponent(ViveControls.CONTROL_NAME+"-"+Controls.hands.left, (function(){
            var ViveControlsLeft = {};
            var HAND = Controls.hands.left;
            ViveControlsLeft.init = function(){
                addCommonToHandListeners(this, HAND);
                Controls.addConnectionListeners(this, ViveControls, HAND);
            };
            return ViveControlsLeft;
        })());

        AFRAME.registerComponent(ViveControls.CONTROL_NAME+"-"+Controls.hands.right, (function(){
            var ViveControlsRight = {};
            var HAND = Controls.hands.right;
            ViveControlsRight.init = function(){
                addCommonToHandListeners(this, HAND);
                Controls.addConnectionListeners(this, ViveControls, HAND);
            };
            return ViveControlsRight;
        })());
    };

    _construct();
    namespace('Components.ViveControls', ViveControls);
});
