// Create closure
$(function ($) {
    /*
     * Future Features
     * Skip Tutorial
     * Store state across page loads?
     * 
     */


    $.fn.tutorial = function (options) {

        var opts = $.extend({}, $.fn.tutorial.defaults, options || {});

        var self = this;

        // generating the same tutorial on multiple elements does not make much sense, might just return this instead and always only expect one element.

        
        //return this.each(function () {
        //    // Do something to each element here.

        //});

        self.stepStart = function() {

            var data = self.data("tutorial");

            // acquire action from current step, wire up a callback / event to listen for its completion
            var currentStep = data.steps[data.state.currentStepIndex];
            var stepAction = currentStep.action;

            self.html("Started: " + currentStep.text + " (" + data.state.currentStepIndex + ")"); // TODO: need a "proper" template / way to render the tutorial description


            if ($.isPlainObject(stepAction)) {
                console.log("stepAction is a plain object");
            }

            if ($.isFunction(stepAction)) {
                // runtime validation, perhaps prevalidate options?
                throw new TypeError("Functions are not yet supported as a stepaction");
            }
            
            for (var action in stepAction) {

                var actionOptions = stepAction[action];
                var defaultAction = $.fn.tutorial.actions[action];

                // only initialize actions we know, 
                // TODO: what if you register multiple actions? is all actions required to be finished before the step is finished?
                if (defaultAction) {
                    defaultAction.init(this, actionOptions, currentStep, self.stepComplete);
                }
            }
        };

        self.stepComplete = function (sender, event) {
            
            $(sender).unbind(event);
            
            // Raise step-complete

            // initialize new step

            var data = self.data("tutorial");

            var currentStep = data.steps[data.state.currentStepIndex];
            var stepAction = currentStep.action;

            data.state.currentStepIndex++;

            self.data("tutorial", data);

            self.stepStart();
        };
        
        // initialize tutorial data
        this.addClass("tutorial");

        self.data("tutorial", {
            steps: opts.steps, // will this be the same reference? should this infact be cloned / extended?
            state: {
                currentStepIndex: 0
            }
        });

        self.stepStart();
            
        return this;

        // events / callbacks:
        // step-complete
        // step-started
        // tutorial-started
        // tutorial-stopped

        // Method 
        // add steps

        // store some sort of internal state for this instance of tutorial
        // how many total steps
        // what step are we currently at

    };

    $.fn.tutorial.defaults = {
        name: "Awesome Tutorial!",
        steps: []
    };

    // Allow others to extend possible highlighters
    $.fn.tutorial.highlighters = {

        // ...
        // Glow
        // Arrow
        // None??
        // ??
        glow: {

        }

    };

    // Allow others to extend possible actions for continueing a step
    $.fn.tutorial.actions = {

        // ...
        // Click
        // Drag
        // Write ... does this make sense?
        // ???
        click: {
            init: function (element, options, currentStep, callback) {

                // options is a string, assume it is a css selector, find this element and register a click handler
                $(options).click(function (event) {
                    console.log(this.id);
                    console.log(this);
                    console.log(event);
                    // inform tutorial that the button has been clicked
                    callback(this, event);
                });
            }
        },
        change: {
            init: function (element, options, currentStep, callback) {

                // options is a string, assume it is a css selector, find this element and register a click handler
                $(options.target).change(function (event) {
                    //console.log(this.id);

                    //console.log(event);

                    // inform tutorial that the button has been clicked

                    // TODO: handle a plain object as verify options where you can specify length, exact text?, partial text?

                    if ($.isFunction(options.verify)) {
                        
                        if (options.verify.call($(this), event)) {
                            callback(this, event);
                        }
                    }
                    
                    
                    
                });
            }
        }
    };

    //TODO? create an object / class to store states and  options on the element`, or jsut store options & state on the element



    // automatically find and run tutorials
    ////$(document).ready(function () {
    ////    $($.fn.cycle.defaults.autoSelector).cycle();
    ////});
    ////autoSelector:     '.cycle-slideshow[data-cycle-auto-init!=false]',

}(jQuery));
