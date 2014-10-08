jquery.tutorial.js
==================
Work in progress :)

The idea of this jquery plugin is to allow you to create an interactive tutorial on your page someting like this:  

```javascript
$("#tutorialContainer").tutorial({
    steps: [
        {
            action: { click: "#Button1" },
            text: "You should click Button1",
            highlight: 'glow'
        },
        {
            action: { click: "#Button2" },
            text: "You should click Button2",
            highlight: 'glow'
        },
        {
            action: {
                change: {
                    target: "#textfield",
                    verify: function (event) {
                        var length = this.val().length;
                        console.log(length);
                        return length > 50;
                    }
                }
            },
            text: "You should write at least 50 characters",
            highlight: 'glow'
        }
    ]
});
```