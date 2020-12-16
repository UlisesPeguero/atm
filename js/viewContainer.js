/*
    Control the view container and the buttons associated with it
    +constructor
    @param domId    {string} -> id for the DOM element of the view container
    @param buttons  {object} -> 
*/
function ViewContainer(domId, buttonsView) {
    // constansts
    const BUTTON_SELECTORS = ["accept", "cancel"]; // accept and cancel selectors
    // DOM will hold the DOM element of the view
    const DOM = document.getElementById(domId);
    // hold the buttons used at the footer of the views
    this.Button = {};

    this.setButtons = buttons => {
        // if buttons is passed as an object we assign the DOM elements and 
        // and the functions to the onclick event
        if(typeof buttons === 'object') {    
            // create and assign buttons
            console.log(domId, buttons);
            BUTTON_SELECTORS.forEach(name => {
                this.Button[name] = DOM.querySelector('.' + name); // assign DOM to button, we add '.' to make it a class selector
                this.Button[name].onclick = buttons[name]; // get the function from buttons
            });        
        }
    };

    /*
        Sets container visibility
        @param visible  {boolean} default true -> defines if should be visible or not. true:visible | false:not visible
    */
    this.setVisible = (visible = true) => {
        DOM.style.display = visible ? 'block' : 'none';
    };

    // shortcut for setVisible(true)
    this.open = () => {
        this.setVisible();
    };

    // shortcut for setVisible(false)
    this.close = () => {
        this.setVisible(false);
    };
    
    /*
        Allows to set text value to any children DOM of the container
        @param selector {string} -> Uses querySelector rules for DOM search
        @param text    {string} -> String that will be set to the textContent of the DOM element selected
    */
    this.setText = (selector, text) => {
        this.get(selector).textContent = text;
    };

    /*
        Allows to get any children DOM of the container
        @param selector {string} -> Uses querySelector rules for DOM search        
        @return         {DOM} -> Returns the DOM element selected
    */
    this.get = (selector) => {
        return DOM.querySelector(selector);
    };

    // intialize buttons
    this.setButtons(buttonsView);
}