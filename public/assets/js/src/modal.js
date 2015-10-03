(function() {

    // Define our constructor
    this.Modal = function() {

        this.closeButton = null;
        this.modal = null;
        this.overlay = null;

        // Define option defaults
        var defaults = {
            className: 'fade-and-drop',
            closeButton: true,
            content: "",
            maxWidth: 600,
            minWidth: 280,
            overlay: true
        }

        // Create options by extending defaults with the passed in arugments
        // wait, wait... arguments, really?
        // arguments is magical object inside of every function that contains an array of everything passed to it via arguments
        if(arguments[0] && typeof arguments[0] === "object"){
            this.options = extendDefaults(defaults, arguments[0]);
        }

    }

    Modal.prototype.open = function(){

    }

    // Utility method to extend defaults with user options
    function extendDefaults(source, properties){
        var property;
        for(property in properties){
            if(properties.hasOwnProperty(property)){
                source[property] = properties[property];
            }
        }
        return source;
    }

}());