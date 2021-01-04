/*
    Control the view container and the buttons associated with it
    +constructor
    @param domId    {string} -> id for the DOM element of the view container
    @param buttons  {object} -> functions for confirmation buttons(accept, cancel) if the view has them
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
        if(visible) {
            // get input that will be given the focus
            let input = DOM.querySelector('[autofocus]');
            if(input) { // if exists                
                input.focus();  // focus the input
                input.scrollIntoView(); // scroll the window to the make the input viewed
            }
        }
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
        Allows to set a value for elements with name attribute
        @param  name    {string}        -> Name attribute to search for
        @param  value   {string|number} -> Value to be assign to the element
    */
    this.setValue = (name, value) => { this.get('[name=' + name + ']').value = value; };

    /*
        Allows to set a value for elements with name attribute
        @param  name    {string}    -> Name attribute to search for        
        @return {string}            -> Value from the element found
    */
    this.getValue = (name) =>  this.get('[name=' + name + ']').value;

    /*
        Allows to get any children DOM of the container
        @param selector {string} -> Uses querySelector rules for DOM search        
        @return         {DOM} -> Returns the DOM element selected
    */
    this.get = (selector) => {
        return DOM.querySelector(selector);
    };

    // Shortcut to get the form from the view
    this.getForm = (selector = 'form') => {
        return this.get(selector);
    };

    // Set all named elements to ""
    this.clearForm = () => {
        this.getForm().querySelectorAll('[name]').forEach(element => {
            element.value = '';
        });
    };

    /*
        Checks the form in the view for validity according to HTML5
        @return {boolean}   -> Determines if the form has validation issues, true:valid | false:invalid
    */
    this.validateForm = () => {
        let form = this.getForm();
        if(!form)  {    // null return if there is no Form in the view    
            return null;
        }
        // returns validity according to HTML5
        return form.checkValidity();
    };

    /*  
        Gets all the named values into an object literal
        @return {object}    -> All named elements values contained int he Form
    */
    this.getValues = () => {
        let values = {};
        this.getForm().querySelectorAll('[name]').forEach(element => { // search and add to the values object
            values[element.name] = element.value;
        });
        return values;
    };

    // intialize buttons
    this.setButtons(buttonsView);
}