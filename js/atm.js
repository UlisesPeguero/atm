// control the application UI and data management
function Atm() {
    // constants
    // localStorage data name
    const DATA_ATM = 'data_atm';
    // balance actions
    const NONE = 0;
    const SHOW = 1;
    const DEPOSIT = 2;
    const WITHDRAW = 3;
    // private properties
    let accounts = [];
    // current values being used
    let current = {        
        view: null,
        account: null,
        action: NONE
    };
    // previous values, using an object for consistency with current
    let previous = {
        view: null
    };

    // Alert controller
    const Alert = {
        template: document.getElementById('alertTemplate'),
        delay: 3 * 1000,    // 3 seconds
        error(message, label = '', view = undefined , delay = undefined) {  // shortcut to show an error alert
            if(typeof message !== 'string') {  // if message is not a string it needs to be processed by ERROR
                message = ERROR.message(message, label);
            }
            this.show(message, 'alert-danger', view, delay);
        },
        success(message, view, delay) {  // shortcut to show a success alert 
            this.show(message, 'alert-success', view, delay);
        },  
        /*
            creates alert and sets the timeout
            @param  message     {string}        -> Message that will be displayed in the alert
            @param  className   {string}        -> Classes used by bootstrap to set the style
            @param  view        {ViewContainer} default current.view -> View container where the alert will be shown            
            @param  delay       {number}  default this.delay -> Delay before the alert disappears, 
        */
        show(message, className, view = current.view,  delay = this.delay) {
            // check if there is an open alert
            let alert = view.get('#message.alert');
            if(alert) { // if already exists we removed before adding a new one
                alert.remove();
            }
            // create a clone from the <template>
            let template = this.template.content.cloneNode(true);
            alert = template.querySelector('#message'); // get div#message to add our message and class
            alert.innerText = message;  
            alert.classList.add(className); 
            // add alert message DOM to the view's form or main container
            view.get('form,.main').prepend(alert);
            setTimeout(() => {  // prepare the removal with a delay
                if(alert) alert.remove();  // only remove if the DOM exists                
            }, delay);
        }
    };
    // errors map
    const ERROR = {
        ACCOUNT_NOT_FOUND: {
            code: '',
            message(){ // not code for the login error
                return 'Account was not found.';
            }
        },
        INVALID_NUMBER: {
            code: '01',
            message(label) {
                return `${this.code}. ${label} must be a valid number.`;
            }
        },
        NEGATIVE_NUMBER: {
            code: '02',
            message(label) {
                return `${this.code}. ${label} must not be less than 0.`;
            }
        },
        NEGATIVE_0_NUMBER: {
            code: '03',
            message(label) {
                return `${this.code}. ${label} must not be less or equal than 0.`;
            }
        },
        INVALID_OPERATION: {
            code: '04',
            message(label) {
                return `${this.code}. Couldn\'t execute ${label}.`;
            }
        },
        INCORRECT_PIN: {
            code: '05',
            message() {
                return `${this.code}. The current PIN is incorrect.`;
            }
        },
        NEWPIN_NOT_MATCH: {
            code: '06',
            message() {
                return `${this.code}. The new PIN doesn't match.`;
            }
        }, 
        INVALID_PIN: {
            code: '07',
            message(label = '') {
                return `${this.code}. The ${label} PIN is invalid, choose a different one.`; // PIN is totally not used by another account
            }
        },
        /*  Prepare message to be send
            @param  error   {Object}    -> Takes one of the ERROR objects to determine the message sent
            @param  label   {string}    -> Depending on the type of error message it might need an extra argument 
            @return         {string}    -> Prepared error message, containes the code and processed message text
        */
        message(error, label = '') {
            let message;
            if(typeof error.message === 'function') {
                message = error.message(label); // if message is a function, execute it with param label
            } else {
                message = error.message; // if not pass it as is
            }
            return message;
        }
    };
    // View will hold all the DOM for the UI views
    const View = {
        login: new ViewContainer('loginView'), // home screen
        new: new ViewContainer('newAccountView'), // new account creation 
        account: new ViewContainer('accountView'), // account menu
        balance: new ViewContainer('balanceView'), // perform any action related to the balance (get, deposit, withdraw)
        changePIN: new ViewContainer('changePinView') // change current pin
    };

    // controls
    const Button = {
        login: document.getElementById('loginButton'),
        new: document.getElementById('newAccountButton'),
        balance: document.getElementById('balanceButton'),
        changePIN: document.getElementById('changePinButton'),
        deposit: document.getElementById('depositButton'),
        withdraw: document.getElementById('withdrawButton'),
        logout: document.getElementById('logoutButton')        
    };  

    // initializes application and UI
    function init() {        
        accounts = [];
        // prepare related controls
        prepareControls();
        // load accounts from localStorage into accounts:Array
        loadData();
        // initializes the UI to show the login view
        View.login.clearForm();
        openView(View.login);
    }

    // assigns control DOM elements and attaches events
    function prepareControls() {
        // login view
        Button.login.onclick = login;
        Button.new.onclick = openNewAccount;
        // new account view
        View.new.setButtons({
            accept: createAccount,
            cancel: goBack
        });
        // account menu view
        Button.changePIN.onclick = openChangePIN;
        Button.balance.onclick = () => openBalance(SHOW);
        Button.deposit.onclick = () => openBalance(DEPOSIT);
        Button.withdraw.onclick = () => openBalance(WITHDRAW);
        Button.logout.onclick = logout;
        // balance form view
        View.balance.setButtons({
            accept: updateBalance,
            cancel: goBack
        });
        // change pin view
        View.changePIN.setButtons({
            accept: updatePIN,
            cancel: goBack
        });
    }

    // attemps to login by looking for the PIN provided
    function login() {
        // check for validity
        if(!View.login.validateForm()) {
            return; // if the input is not valid we return the method, and HTML5 will handle the error message
        }
        let pin = View.login.getValues().pin;
        // find in accounts for account.pin == pin
        let validAccount = accounts.find(account => account.getPin() == pin); // pin is private in account, we use a getter
        if(validAccount) {  // if found
            openAccountSession(validAccount);
        } else { // if not validAccount is undefined therefore falsy
            Alert.error(ERROR.ACCOUNT_NOT_FOUND);
        }
    }

    /*
        Sets current account in use and opens the account menu
        @param  account {Account}   -> sets the current account for the session
    */
    function openAccountSession(account) {
        current.account = account;
        View.account.setText('#nameAccount', account.getName());
        openView(View.account);
    }

    // closes current session and returns to login screen
    function logout() {
        View.login.clearForm();
        current.account = null; // removes the currently open account 
        openView(View.login);
    }

    // open view to create new account
    function openNewAccount() {
        View.new.clearForm(); // clear form inputs
        openView(View.new);
    }

    // validates the form an adds an account
    function createAccount() {
        // check for validity on the View.new's {ViewContainer} form
        if(!View.new.validateForm()) {
            return; // stop method if anything in the form is invalid, HTML5 will handle error messages
        }
        let errorMessage = null;
        let values = View.new.getValues();  // get form values
        if(doesPINExist(values.pin)) { // if PIN is already used by another account
            errorMessage = ERROR.message(ERROR.INVALID_PIN); // sent error message 
        } else if(isNaN(values.balance)) { // if balance is not a valid number different than blank
            errorMessage = ERROR.message(ERROR.INVALID_NUMBER, 'Balance');// sent error message and specified input                          
        } else if(parseFloat(values.balance) < 0) { // if balance is < than 0
            errorMessage = ERROR.message(ERROR.NEGATIVE_NUMBER, 'Balance');                         
        }         
        // check for errors to show
         if(errorMessage !== null) {
            Alert.error(errorMessage);
            return; // stop
        } else {
            values.balance = parseFloat(values.balance);
        }
        // if balance is blank, the account will have a starting balance of 0
        let account = new Account(values);  
        updateData(account);
        // open session
        openAccountSession(account);
    }

    /*
        Displays balance view for showing, deposit or withdraw
        @param action   {number} default SHOW -> Identify the action we will be providing on the view
    */
    function openBalance(action = SHOW) {
        current.action = action;
        let title = ''; // will let us change the title of the view accordingly
        let readOnly = false; // for deposit and withdraw we change the input to writable                            
        switch(current.action) {
            case SHOW:      title = 'Balance'; 
                            View.balance.setValue('ammount', current.account.getBalance().toFixed(2));
                            // for show we change the input to readonly
                            readOnly = true;
                            break;
            case DEPOSIT:   title = 'Deposit';
                            View.balance.clearForm();
                            break;
            case WITHDRAW:  title = 'Withdraw';
                            View.balance.clearForm();
                            break;
        }
        // set title of the view
        View.balance.get('[name=ammount]').readOnly = readOnly;
        View.balance.setText('#title', title);
        openView(View.balance);
    }

    // Validates values given and attempts to do Deposit and Withdrawal
    // @param   operation {function}    -> Account method to execute for the ammount
    // @return  {boolean}               -> Determines if the operation was executed
    function balanceOperation(operation) {
        // check for validity on the View.balances's {ViewContainer} form
        if(!View.balance.validateForm()) {
            return false;// return that form is not valid, HTML5 will handle error messages
        }
        let ammount = View.balance.getValues().ammount;  // get ammount value
        let errorMessage = null;
        if(isNaN(ammount)) { // if ammount is not a valid number different than blank
            errorMessage = ERROR.message(ERROR.INVALID_NUMBER, 'Ammount');
        } else if(parseFloat(ammount) <= 0) { // if ammount is <= than 0
            errorMessage = ERROR.message(ERROR.NEGATIVE_0_NUMBER, 'Ammount');            
        } else if(!operation(ammount)){// attempt to deposit, if works continue
            // if doesnt work
            errorMessage = ERROR.message(ERROR.INVALID_OPERATION, 'operation');            
        }
        // check for errors to show
        if(errorMessage !== null) {
            // sent error message about not being a number and set invalid
            Alert.error(errorMessage);
            return false;
        }        
        // if function ends normally all data is valid
        return true;
    }
    
    // update balance of the current account 
    function updateBalance() {        
        // determine the action
        let operation;
        switch(current.action) {                    
            case SHOW:      break; // do nothing
            case DEPOSIT:   operation = current.account.deposit; // operation will be deposit
            case WITHDRAW:  if(!operation) operation = current.account.withdraw; // if operation wasn't defined on deposit, is now withdraw
                            if(!balanceOperation(operation)) return; // if there was an error we stop execution
                            // show new balance on Account menu view for 4 seconds    
                            Alert.success('Current balance: ' + current.account.getBalance().toFixed(2), View.account, 4 * 1000);
                            // update data
                            updateData();
                            break;
        }        
        current.action = NONE;
        goBack();
    }

    function openChangePIN() {        
        View.changePIN.clearForm();
        openView(View.changePIN);
    }

    function updatePIN() {
        // check for validity on the View.changePin's {ViewContainer} form
        // TODO: Think of a reusable more efficient way to do this
        if(!View.changePIN.validateForm()) {
            return;// stop execution, HTML5 will handle error messages
        }
        let errorMessage = null;
        let values = View.changePIN.getValues(); // get values from changePin Form
        console.log(values);
        if(values.pin !== current.account.getPin()) { // validate the current pin before performing a change
            errorMessage = ERROR.message(ERROR.INCORRECT_PIN);
        } else if(doesPINExist(values.newPin)) { // checks if new PIN is already used by another account
                errorMessage = ERROR.message(ERROR.INVALID_PIN, 'new'); 
        } else if(values.newPin !== values.confirmNewPin) {// validate the newPin matches the confirmation
            errorMessage = ERROR.message(ERROR.NEWPIN_NOT_MATCH);
        } 
        // check for errors to show
        if(errorMessage !== null) {
            // sent error message about not being a number and set invalid
            Alert.error(errorMessage);
            return;
        }      
        // procede with the change
        current.account.setPin(values.newPin);
        // show message of success on account menu    
        Alert.success('PIN changed succesfully.', View.account, 4 * 1000);                            
        // udpate data
        updateData();
        goBack();
    }

    /*
        Searchs and determinates if the pin given already exists in the Account's list
        @parameter  pin {string}    -> PIN to be searched
        #return {boolean}           -> Flag to determinate if the value was found
    */
    function doesPINExist(pin) {
        let exist = accounts.find(account => account.getPin() == pin); // find the first account that satisfies account.getPin() == pin
        return Boolean(exist); // gives a return in strict boolean value
    }

    /*
        Updates the array that contains the accounts and the localStorage 
        @param  account {Account}   -> new account to be added to the array and storage
    */
    function updateData(account) {
        if(account) accounts.push(account); 
        // TODO: find a more efficient way of storing the information on localStorage
        // Maps accounts into a JSON Array to storage as a string in the localStorage data_atm        
        localStorage.setItem(DATA_ATM, JSON.stringify(accounts.map(item => item.getJSON())));
    }

    // Initial load of the data from localStorage data_atm
    function loadData() {
        // initialize data from localStorage if there is not data sets an empty array
        let data = JSON.parse(localStorage.getItem(DATA_ATM)) || [];
        if(data.length > 0){ // if there is data we need to map into an array of {Account}
            data = data.map(item => new Account(item));
        }
        // data loaded
        accounts = data;
    }

    // hides current view and goes back to the previous View
    function goBack() {
        if(previous.view !== null) {
           openView(previous.view);
        }
    }

    /*
        Hides the view containers that is currently visible and displays the specified one
        @param  container   {ViewContainer} -> Object that holds the container to be shown
    */
    function openView(view) {
        if(current.view !== null) {
            previous.view = current.view;
            current.view.close(); // closes current view
        }
        current.view = view;
        current.view.open(); // display requested view
    }

    init();
    console.log('ATM Ready.');    
}