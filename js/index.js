/* global AFRAME, Components */
(function (){

    /*********************
     * Internal properties
     *********************/
    const THUMBNAIL_WIDTH_PX = 450;
    const IMG_SERVER = "https://www.iwalkcornwall.co.uk";
    const THUMBNAIL_URL_TEMPLATE = IMG_SERVER+"/images/photos/stereoscopic/{name}.jps/width/"+THUMBNAIL_WIDTH_PX;
    const FULLSIZE_URL_TEMPLATE = IMG_SERVER+"/images/photos/stereoscopic/{name}.jps";

    const ASSETS_PATH = './assets/';
    const IMG_LIST_URL = ASSETS_PATH + 'image_list.json';

    const buttonHoverZoomScale = 0.5;
    
    const requiredNamespaces = [
        'Components.Utils',
        'Components.GalleryController',
        'Components.Controls'
    ];
    
    const supportedControllers = [
        "OculusTouch",
        "Daydream", 
        "GearVr", 
        "MagicLeap", 
        "OculusGo", 
        "Vive", 
        "ViveFocus", 
        "WindowsMotion"
    ];

    let $imageContainer, $images, maxImgIndex, currentIndex,
        Utils, GalleryController, Controls,
        Controllers = {};
    
    /*********************
     * Internal functions
     *********************/
    let _constructor = function(){
        $(document).ready(onDocumentReady);
    };

    let onDocumentReady = function(){
        let namespaces = requiredNamespaces;
        supportedControllers.forEach((controllerName) => {
            namespaces.push(controllerName+'Controls');
        });
        
        onNamespacesLoaded([
            'Components.Utils',
            'Components.GalleryController',
            'Components.Controls'
        ], function(){
            Utils = Components.Utils;
            GalleryController = Components.GalleryController;
            Controls = Components.Controls;

            supportedControllers.forEach((controllerName) => {
                Controllers[controllerName] = Components[controllerName+'Controls'];
            });
            
            onLoadedNamespaces();
        });
    }

    let onLoadedNamespaces = function(){
        document.addEventListener(Controls.webXrControllerEventName, onWebXrController);
        $imageContainer = $('#ui .images');

        tinykeys(window, {
            "Space": () => {if(GalleryController.isInVR) showNextImage()},
            "ArrowLeft": () => {if(GalleryController.isInVR) showNextImage()},
            "ArrowRight": () => {if(GalleryController.isInVR) showPrevImage()},
        })

        const $clickableButtons = $('[data-clickable][data-button]');
        Utils.addEventListenerToEntityNodeList($clickableButtons, 'mouseenter', (evt) => {
            const entity = evt.target;
            let scale = entity.getAttribute('scale');
            scale.x += buttonHoverZoomScale;
            scale.y += buttonHoverZoomScale;
            scale.z += buttonHoverZoomScale;
            entity.setAttribute('scale', scale);
        });

        Utils.addEventListenerToEntityNodeList($clickableButtons, 'mouseleave', (evt) => {
            const entity = evt.target;
            let scale = entity.getAttribute('scale');
            scale.x -= buttonHoverZoomScale;
            scale.y -= buttonHoverZoomScale;
            scale.z -= buttonHoverZoomScale;
            entity.setAttribute('scale', scale);
        });

        Utils.addEventListenerToEntityNodeList($('#previous-button'), 'click', showPrevImage);
        Utils.addEventListenerToEntityNodeList($('#next-button'), 'click', showNextImage);
        Utils.addEventListenerToEntityNodeList($('#exit-button'), 'click', exitVR);
        Utils.addEventListenerToEntityNodeList($('#increase-distance-button'), 'click', GalleryController.moveUiFurtherAway);
        Utils.addEventListenerToEntityNodeList($('#decrease-distance-button'), 'click', GalleryController.moveUiCloser);

        $.getJSON(IMG_LIST_URL, onLoadImgList);
    };

    let onLoadImgList = function(imgList){
        imgList.forEach(function(img, i){
            const src = THUMBNAIL_URL_TEMPLATE.replace('{name}', img.name),
                description = img.description;
            $imageContainer.append(
                `<span class="image">
                            <img data-index="${i}" data-name="${img.name}" src="${src}" alt="${description}"/>
                        </span>`
            );
            maxImgIndex = i;
        });
        $images = $('img', $imageContainer);
        $images.on('click', onClickImg);
    };

    let onClickImg = function(e){
        const $img = $(e.target);
        showImg($img);
    }

    let showImg = function($img){
        currentIndex = $img.data('index');
        const src = FULLSIZE_URL_TEMPLATE.replace('{name}', $img.data('name')),
            description = $img.attr('alt');
        GalleryController.showImg(currentIndex, src, description);
    };

    let onWebXrController = function(event){
        // console.log("onWebXrController");
        // console.dir(event);

        const detail = event.detail,
            controllerType = detail.controllerType,
            control = detail.control,
            hand = detail.hand,
            action = detail.action;


        // Control presses
        if(action === Controls.actions.down){

            // Exit VR mode
            if(
                (controllerType === Controllers.OculusTouch.CONTROL_NAME && (
                control === Controllers.OculusTouch.controls.abutton
                || control === Controllers.OculusTouch.controls.bbutton
                || control === Controllers.OculusTouch.controls.xbutton
                || control === Controllers.OculusTouch.controls.ybutton)
                )
                || (controllerType === Controllers.MagicLeap.CONTROL_NAME &&
                    control === Controllers.OculusTouch.controls.menu
                )
                || (controllerType === Controllers.Vive.CONTROL_NAME &&
                    (control === Controllers.Vive.controls.menu || control === Controllers.Vive.controls.system)
                )
                || (controllerType === Controllers.WindowsMotion.CONTROL_NAME &&
                    control === Controllers.WindowsMotion.controls.menu
                )
            ){
                exitVR();
            }

            // Next/prev slide
            if((controllerType === Controllers.Daydream.CONTROL_NAME && control === Controllers.Daydream.controls.trackpad)
                || (controllerType === Controllers.GearVr.CONTROL_NAME && control === Controllers.GearVr.controls.trackpad)
                || (controllerType === Controllers.Vive.CONTROL_NAME && control === Controllers.Vive.controls.trackpad)
            ){
                if(hand === Controls.hand.left){
                    showPrevImage();
                }else if(hand === Controls.hand.left){
                    showNextImage();
                }
            }
        }

        // Cursor direction controls
        if(action === Controls.actions.directionchanged &&
            (controllerType === Controllers.OculusTouch.CONTROL_NAME && control === Controllers.OculusTouch.controls.thumbstick)
            ||(controllerType === Controllers.MagicLeap.CONTROL_NAME && control === Controllers.MagicLeap.controls.touchpad)
            ||(controllerType === Controllers.OculusGo.CONTROL_NAME && control === Controllers.OculusGo.controls.touchpad)
            ||(controllerType === Controllers.ViveFocus.CONTROL_NAME && control === Controllers.ViveFocus.controls.trackpad)
            ||(controllerType === Controllers.WindowsMotion.CONTROL_NAME && (
                control === Controllers.WindowsMotion.controls.trackpad || control === Controllers.WindowsMotion.controls.thumbstick
            ))
        ){
            if(detail.direction.x === Controls.direction.left){
                showPrevImage();
            }else if(detail.direction.x === Controls.direction.right){
                showNextImage();
            }else if(detail.direction.y === Controls.direction.up){
                GalleryController.moveUiFurtherAway();
            }else if(detail.direction.y === Controls.direction.down){
                GalleryController.moveUiCloser();
            }
        }
    };

    let exitVR = function(){
        GalleryController.exitVR();
    };

    let showImageAtIndex = function(index){
        const $img = $imageContainer.find('[data-index="'+index+'"]');
        showImg($img);
    };

    let showNextImage = function(){
        const nextIndex = (currentIndex === maxImgIndex ? 0 : currentIndex+1);
        showImageAtIndex(nextIndex);
    };

    let showPrevImage = function(){
        const prevIndex = (currentIndex === 0 ? maxImgIndex : currentIndex-1);
        showImageAtIndex(prevIndex);
    };

    _constructor();
})();
