// Create closure
$(function ($) {

    $.fn.tutorial = function (options) {

        var opts = $.extend({}, $.fn.tutorial.defaults, options || {});

        var api = this;

        // generating the same tutorial on multiple elements does not make much sense, might just return this instead and always only expect one element.


        //return this.each(function () {
        //    // Do something to each element here.

        //});

        api.stepStart = function () {

            var data = api.data("tutorial");

            if (data.steps.length <= data.state.currentStepIndex) {
                console.log("Tutorial completed");
                api.html("Tutorial finished");
                return api;
            }

            // acquire action from current step, wire up a callback / event to listen for its completion
            var currentStep = data.steps[data.state.currentStepIndex];
            

            api.html("Started: " + currentStep.text + " (" + data.state.currentStepIndex + ")"); // TODO: need a "proper" template / way to render the tutorial description


            //if ($.isPlainObject(stepAction)) {
            //    console.log("stepAction is a plain object");
            //}

            //if ($.isFunction(stepAction)) {
            //    // runtime validation, perhaps prevalidate options?
            //    throw new TypeError("Functions are not yet supported as a stepaction");
            //}
            
            // We find the actions on the step so we can initialize them.
            var stepAction = currentStep.action;
            
            for (var action in stepAction) {

                var actionOptions = stepAction[action];
                var defaultAction = $.fn.tutorial.actions[action];

                // only initialize actions we know, 
                // TODO: what if you register multiple actions? is all actions required to be finished before the step is finished?
                if (defaultAction) {
                    defaultAction.init(actionOptions, api);
                }
            }
            
            // hightlight
            var stepHightlight = currentStep.highlight;
            
            for (var highlight in stepHightlight) {

                var highlightOptions = stepHightlight[highlight];
                var defaultHighlight = $.fn.tutorial.highlighters[highlight];

                // only initialize actions we know, 
                if (defaultHighlight) {
                    defaultHighlight.init(highlightOptions, api);
                }
            }

            return api;
        };

        api.stepComplete = function () {

            // Raise step-complete

            // initialize new step

            var data = api.data("tutorial");

            var currentStep = data.steps[data.state.currentStepIndex];
            var stepAction = currentStep.action;

            data.state.currentStepIndex++;

            api.data("tutorial", data);
            
            // We need to clean up highlighters
            var stepHightlight = currentStep.highlight;

            for (var highlight in stepHightlight) {

                var highlightOptions = stepHightlight[highlight];
                var defaultHighlight = $.fn.tutorial.highlighters[highlight];

                // only initialize actions we know, 
                if (defaultHighlight) {
                    defaultHighlight.cleanup(highlightOptions, api);
                }
            }

            api.stepStart();
        };

        api.start = function() {

            console.log("Starting tutorial");
            
            // initialize tutorial data
            api.addClass("tutorial");

            api.data("tutorial", {
                steps: opts.steps, // will this be the same reference? should this infact be cloned / extended?
                state: {
                    currentStepIndex: 0
                }
            });
            
            api.stepStart();

            return api;
        };

        

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
        
        return api;
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
        css: {
            init: function (options, api) {

                // TODO: differantiate functionality based on options type. (string,object,function)

                var optionsStyleType = $.type(options.style);

                if (optionsStyleType === "string") { // TODO: what if it is a number or bool?
                    $(options.target).addClass(options.style);

                } else if (optionsStyleType === "function") {
                    options.style(options);

                    if ($.type(options.cleanup) !== "function") {
                        throw new TypeError("options.cleanup should be a function that can clean up the highlighter");
                    }
                }
            },
            cleanup: function (options, api) {
                
                var optionsStyleType = $.type(options.style);

                if (optionsStyleType === "string") { // TODO: what if it is a number or bool?
                    $(options.target).removeClass(options.style);

                } else if (optionsStyleType === "function") {
                    options.cleanup(options);
                }
            }
        },
        glow: {
            init: function (options, api) {

                // TODO: differantiate functionality based on options type. (string,object,function)
                
                // options is a string, assume it is a css selector
                $(options).addClass("glow");
            },
            cleanup: function (options, api) {
                
                // options is a string, assume it is a css selector
                $(options).removeClass("glow");
            }
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
            init: function (options, api) {

                // TODO: differantiate functionality based on options type. (string,object,function)
                
                // options is a string, assume it is a css selector
                $(options).click(function (event) {
                    console.log(this.id);
                    console.log(this);
                    console.log(event);
                    
                    $(this).unbind(event);
                    
                    // inform tutorial that the button has been clicked
                    api.stepComplete(this, event);
                });
            }
        },
        change: {
            init: function (options, api) {

                // options is a string, assume it is a css selector, find this element and register a click handler
                $(options.target).change(function (event) {
                    //console.log(this.id);

                    //console.log(event);

                    // inform tutorial that the button has been clicked

                    // TODO: handle a plain object as verify options where you can specify length, exact text?, partial text?

                    if ($.isFunction(options.verify)) {

                        if (options.verify.call($(this), event)) {
                            
                            $(this).unbind(event);
                            
                            api.stepComplete();
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
