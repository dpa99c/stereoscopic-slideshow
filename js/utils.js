(function(){
    var Utils = {};

    /*********************
     * Internal properties
     *********************/

    /*********************
     * Public properties
     *********************/


    /*********************
     * Internal functions
     *********************/



    /*********************
     * Public functions
     *********************/
    Utils.addEventListenerToEntityNodeList = function($nodeList, event, listenerFn){
        $nodeList.each((i, entity) => {
            entity.addEventListener(event, listenerFn);
        });
    };

    Utils.setAttributeOnEntityNodelist = function($nodeList, attribute, value, subValue){
        $nodeList.each((i, entity) => {
            if(subValue){
                const o = {};
                o[value] = subValue;
                entity.setAttribute(attribute, o);
            }else{
                entity.setAttribute(attribute, value);
            }
        });
    };

    Utils.setVisibleOnEntityNodelist = function($nodeList, visible){
        $nodeList.each((i, entity) => {
            entity.setAttribute('visible', visible);
        });
    };

    namespace('Components.Utils', Utils);
})();
