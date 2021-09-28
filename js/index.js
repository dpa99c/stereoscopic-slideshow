(function (){

    /*********************
     * Internal properties
     *********************/
    const ASSETS_PATH = './assets/';
    const IMG_LIST_URL = ASSETS_PATH + 'image_list.json';

    let $imageContainer, $images, maxImgIndex, currentIndex;

    /*********************
     * Internal functions
     *********************/
    let _constructor = function(){
        $(document).ready(onDocumentReady);
    };

    let onDocumentReady = function(){
        document.addEventListener("webxr-controller", onWebXrController);
        $imageContainer = $('#ui .images');
        $.getJSON(IMG_LIST_URL, onLoadImgList);
    };

    let onLoadImgList = function(imgList){
        imgList.forEach(function(img, i){
            const url = (img.url.match('://') ? img.url : ASSETS_PATH+img.url),
                description = img.description;
            $imageContainer.append(`<span class="image"><img data-index="${i}" src="${url}" alt="${description}"/></span>`
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
        window.galleryController.showImg($img.attr('src'), $img.attr('alt'));
    };

    let onWebXrController = function(event){
        // console.log("onWebXrController");
        // console.dir(event);

        const detail = event.detail,
            controllerType = detail.controllerType,
            control = detail.control,
            hand = detail.hand,
            action = detail.action;


        // Button presses
        if(action === OculusTouchControls.actions.down){

            // Exit VR
            if(controllerType === OculusTouchControls.CONTROL_NAME && (
                control === OculusTouchControls.controls.abutton
                || control === OculusTouchControls.controls.bbutton
                || control === OculusTouchControls.controls.xbutton
                || control === OculusTouchControls.controls.ybutton
            )){
                exitVR();
            }
        }

        // Gallery scroll
        if(controllerType === OculusTouchControls.CONTROL_NAME && control === OculusTouchControls.controls.thumbstick && action === OculusTouchControls.actions.directionchanged){
            if(detail.direction.x === OculusTouchControls.thumbstick.direction.left){
                showPrevImage();
            }else if(detail.direction.x === OculusTouchControls.thumbstick.direction.right){
                showNextImage();
            }
        }
    };

    let exitVR = function(){
        galleryController.exitVR();
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
