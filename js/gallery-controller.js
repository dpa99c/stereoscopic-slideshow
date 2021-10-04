/* global AFRAME */
AFRAME.registerComponent("gallery-controller", (function(){
    const Controller = {};

    /*********************
     * Internal properties
     *********************/
    const vrHeadsetImgYOffset = 1.2;
    const vrHeadsetImgZOffset = -0.45;
    const minUiZDistance = -0.5;
    const maxUiZDistance = -2;
    const uiZDistanceStep = 0.5
    const stereoImageId = 'fullsize-image'
    const _stereoImage = '#'+stereoImageId;
    
    let galleryController, sceneEl, leye, reye, $descriptionText, descriptionText,
        $body, $scene, $sceneEntities, $assets, $imageLoading, $imageLoadError;

    /*********************
     * Public properties
     *********************/
    Controller.shouldEnterVR = false;
    Controller.isInVR = false;
    Controller.isImmersiveVRSupported = false;
    Controller.isLoadingStereoImage = false;
    Controller.el;

    /*********************
     * Internal functions
     *********************/
    const init = function(){
        Controller.el = galleryController.el;
        sceneEl = Controller.el.sceneEl;
        leye = $('#left-image')[0];
        reye = $('#right-image')[0];
        $descriptionText = $('#description-text');
        descriptionText = $descriptionText[0];
        $scene = $('#scene');
        $assets = $('#assets');
        $imageLoading = $('#image-loading');
        $imageLoadError = $('#image-load-error');
        $body = $('body');

        if(Controller.isImmersiveVRSupported){
            $body.addClass('vr-supported');
            $sceneEntities = $(Controller.el).find('> *');
            $sceneEntities.each((i, entity) => {
                let position = entity.getAttribute('position');
                position.y += vrHeadsetImgYOffset;
                position.z += vrHeadsetImgZOffset;
                entity.setAttribute('position', position);
            });
            Utils.setAttributeOnEntityNodelist($('#exit-button a-entity[text]'), 'text', 'value', 'Exit VR');
        }else{
            $body.addClass('vr-unsupported');
            Utils.setAttributeOnEntityNodelist($('.vr-only'), 'visible', false);
        }
        $body.addClass('vr-support-resolved');

        sceneEl.addEventListener('enter-vr', Controller.onEnterVR.bind(this), false);
        sceneEl.addEventListener('exit-vr', Controller.onExitVR.bind(this), false);
    };

    const onIsSessionSupported = function(isSupported){
        Controller.isImmersiveVRSupported = isSupported;
        onNamespacesLoaded([
            'Components.Utils'
        ], function(){
            Utils = Components.Utils;
            init();
        });
    };

    const removeStereoImage = function(){
        let $stereoImage = $(_stereoImage);
        if($stereoImage.length){
            let stereoImage = $stereoImage[0];
            stereoImage.onload = stereoImage.onerror = null;
            $stereoImage.attr('src', '').remove();
            $stereoImage = stereoImage = null;
        }
        Controller.isLoadingStereoImage = false;
    };

    const unloadStereoImage = function(){
        removeStereoImage();
        leye.setAttribute("material", "src", '');
        reye.setAttribute("material", "src", '');
        setStereoImageVisibility(false);
    };

    const setStereoImageVisibility = function(visible){
        leye.setAttribute("visible", visible)
        reye.setAttribute("visible", visible)
    };

    /*********************
     * Public functions
     *********************/

    /**
     * Called once when component is attached.
     * Generally for initial setup.
     * @override
     */
    Controller.init = function() {
        galleryController = this;
        navigator.xr.isSessionSupported('immersive-vr').then(onIsSessionSupported);
    }

    /**
     * Called when a component is removed (e.g., via removeAttribute).
     * Generally undoes all modifications to the entity.
     * @override
     */
    Controller.remove = function () {
        sceneEl.removeEventListener('enter-vr', Controller.onEnterVR, false);
        sceneEl.removeEventListener('exit-vr', Controller.onExitVR, false);
    };

    /*
     * Called when entering VR mode
     */
    Controller.onEnterVR = function(event){
        Controller.isInVR = true;
        $scene.removeClass('hidden');
    };

    /*
     * Called when exiting VR mode
     */
    Controller.onExitVR = function (event) {
        Controller.isInVR = false;
        unloadStereoImage();
        $scene.addClass('hidden');
    };


    Controller.showImg = function(url, description){
        function onImgLoaded(){
            leye.setAttribute("material", "src", _stereoImage);
            reye.setAttribute("material", "src", _stereoImage);
            setStereoImageVisibility(true);
            descriptionText.setAttribute("text", "value", description);
            Utils.setVisibleOnEntityNodelist($descriptionText, true);
            Utils.setVisibleOnEntityNodelist($imageLoading, false);
            Utils.setVisibleOnEntityNodelist($imageLoadError, false);
            Controller.isLoadingStereoImage = false;

            if(!Controller.isInVR && Controller.shouldEnterVR) Controller.enterVR();
        }

        function onImageLoadError(){
            unloadStereoImage();
            Utils.setVisibleOnEntityNodelist($descriptionText, false);
            Utils.setVisibleOnEntityNodelist($imageLoading, false);
            Utils.setVisibleOnEntityNodelist($imageLoadError, true);

            if(!Controller.isInVR && Controller.shouldEnterVR) Controller.enterVR();
        }

        setStereoImageVisibility(false);
        Utils.setVisibleOnEntityNodelist($descriptionText, false);
        Utils.setVisibleOnEntityNodelist($imageLoading, true);
        Utils.setVisibleOnEntityNodelist($imageLoadError, false);
        if(!Controller.isInVR) Controller.enterVR();

        unloadStereoImage();

        let stereoImage = document.createElement('img');
        stereoImage.setAttribute('id', stereoImageId);
        stereoImage.setAttribute('crossorigin', "anonymous");
        stereoImage.setAttribute('src', url);
        stereoImage.onload = onImgLoaded;
        stereoImage.onerror = onImageLoadError;
        $(stereoImage).appendTo($assets);
        Controller.isLoadingStereoImage = true;
    };

    Controller.enterVR = function(){
        Controller.shouldEnterVR = true;
        sceneEl.enterVR();
    };

    Controller.exitVR = function(){
        Controller.shouldEnterVR = false;
        sceneEl.exitVR();
    };

    Controller.moveUiFurtherAway = function(){
        $sceneEntities.each((i, entity) => {
            let position = entity.getAttribute('position');
            if(position.z <= maxUiZDistance) return;
            position.z -= uiZDistanceStep;
            entity.setAttribute('position', position);
        });
    };

    Controller.moveUiCloser = function(){
        $sceneEntities.each((i, entity) => {
            let position = entity.getAttribute('position');
            if(position.z >= minUiZDistance) return;
            position.z += uiZDistanceStep;
            entity.setAttribute('position', position);
        });
    };

    namespace('Components.GalleryController', Controller);
    return Controller;
})());
