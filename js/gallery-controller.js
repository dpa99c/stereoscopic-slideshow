AFRAME.registerComponent("gallery-controller", (function(){
    var Controller = {};

    /*********************
     * Internal properties
     *********************/
    const vrHeadsetImgYOffset = 1.2;
    const vrHeadsetImgZOffset = -0.45;
    
    let galleryController, galleryEl, sceneEl, leye, reye, descriptionText,
        isHeadsetConnected,
        $scene;

    /*********************
     * Public properties
     *********************/
    Controller.isInVR = false;
    Controller.isImmersiveVRSupported = false;

    /*********************
     * Internal functions
     *********************/
    var init = function(){
        galleryEl = galleryController.el;
        sceneEl = galleryEl.sceneEl;
        leye = galleryEl.children[0];
        reye = galleryEl.children[1];
        descriptionText = galleryEl.children[2];
        isHeadsetConnected = AFRAME.utils.device.checkHeadsetConnected();
        $scene = $('#scene');

        if(Controller.isImmersiveVRSupported){
            let imgPosition = leye.getAttribute('position');
            imgPosition.y += vrHeadsetImgYOffset;
            imgPosition.z += vrHeadsetImgZOffset;
            leye.setAttribute('position', imgPosition);
            reye.setAttribute('position', imgPosition);

            let descriptionTextPosition =  descriptionText.getAttribute('position');
            descriptionTextPosition.y += vrHeadsetImgYOffset;
            descriptionTextPosition.z += vrHeadsetImgZOffset;
            descriptionText.setAttribute('position', descriptionTextPosition);
        }

        sceneEl.addEventListener('enter-vr', Controller.onEnterVR.bind(this), false);
        sceneEl.addEventListener('exit-vr', Controller.onExitVR.bind(this), false);
    };

    var onIsSessionSupported = function(isSupported){
        Controller.isImmersiveVRSupported = isSupported;
        init();
    };

    /*********************
     * Public functions
     *********************/

    /**
     * Called once when component is attached. Generally for initial setup.
     */
    Controller.init = function() {
        window.galleryController = galleryController = this;
        navigator.xr.isSessionSupported('immersive-vr').then(onIsSessionSupported);
    }

    /**
     * Called when a component is removed (e.g., via removeAttribute).
     * Generally undoes all modifications to the entity.
     */
    Controller.remove = function () {
        sceneEl.removeEventListener('enter-vr', Controller.onEnterVR, false);
        sceneEl.removeEventListener('exit-vr', Controller.onExitVR, false);
    };

    /*
     * Called when entering VR mode
     */
    Controller.onEnterVR = function(event){
        $scene.removeClass('hidden');
    };

    /*
     * Called when exiting VR mode
     */
    Controller.onExitVR = function (event) {
        $scene.addClass('hidden');
    };


    Controller.showImg = function(url, description){
        leye.setAttribute("material", "src", url);
        reye.setAttribute("material", "src", url);

        descriptionText.setAttribute("text", "value", description);

        if(!Controller.isInVR) Controller.enterVR();
    };

    Controller.enterVR = function(){
        sceneEl.enterVR();
        Controller.isInVR = true;
    };

    Controller.exitVR = function(){
        sceneEl.exitVR();
        Controller.isInVR = false;
    };

    return Controller;
})());
