http://www.smashingmagazine.com/2012/10/09/designing-javascript-apis-usability/  
http://webstandardssherpa.com/reviews/secrets-of-awesome-javascript-api-design/

make a cooking recipe
refer to dom elements by css selectors

preset actions

*   highlight
*   arrow point

render box with help text
render "entire" tutorial
steps
advance tutorial to next step when an action is peformed

- local storage to remember where in the tutorial you are on page loads?
- local storage to disable all tutorials for 
    - this site?
    - this tutorial

API design points
method chaining (fluent)
options object

allow for extensions/plugins
events when actions occur
provide examples of usage

#  Example #
- Tutorial start
- Klik på knap1
- Klik på knap 2
- Skriv tekst i felt (hvordan definere man success criteria?, evt callback support ) 
- Klik på knap 3

> $. Tutorial ({  
>     steps: [
>       {click: "#knap1", text "klik på knap1", glow: "#knap1"},  
>       {click........,}   
>       {action:function (), text: " skriv url i feltet ", arrow:" input.url"}
>     ]  
> } ). Step(click : "knap3") . Start(opts)  

http://jsfiddle.net/a1j5nq3y/