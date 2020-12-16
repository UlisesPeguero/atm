// control the application UI and data management
function Atm() {
    // constants
    // balance actions
    const NONE = 0;
    const SHOW = 1;
    const DEPOSIT = 2;
    const WITHDRAW = 3;
    // Alerts controller
    this.Alert = {
        template: document.getElementById('alertTemplate'),
        delay: 5 * 1000,    // 5 seconds
        error(view, message, delay) {  // shortcut to show an error alert
            this.show(view, message, 'alert-danger', delay);
        },
        success(view, message, delay) {  // shortcut to show a success alert 
            this.show(view, message, 'alert-success', delay);
        },  
        /*
            creates alert and sets the timeout
            @param  view    {ViewContainer} -> View container where the alert will be shown
            @param  message {string}        -> Message that will be displayed in the alert
            @param  className {string}      -> Classes used by bootstrap to set the style
            @param  delay   {number}  default this.delay -> Delay before the alert disappears, 
        */
        show(view, message, className, delay = this.delay) {
            //let alert = this.template.content;
            //view.get('form').appendChild(alert);
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

    // attributes
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

    // initializes application and UI
    function init() {
        // prepare related controls
        prepareControls();
        // initializes the UI to show the login view
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

        openView(View.account);
    }

    // closes current session and returns to login screen
    function logout() {
        current.account = null; // removes the currently open account 
        openView(View.login);
    }

    // open view to create new account
    function openNewAccount() {
        openView(View.new);
    }

    function createAccount() {

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
                            // for show we change the input to readonly
                            readOnly = true;
                            break;
            case DEPOSIT:   title = 'Deposit';
                            break;
            case WITHDRAW:  title = 'Withdraw';
                            break;
        }
        // set title of the view
        View.balance.get('#balance').readOnly = readOnly;
        View.balance.setText('#title', title);
        openView(View.balance);
    }

    // update balance of the current account 
    function updateBalance() {
        let value = View.balance.get('#balance').value;
        switch(current.action) {                    
            case SHOW:      break; // do nothing
            case DEPOSIT:   if(!current.account.deposit(value)) { // attempt to deposit, if works continue
                                // if doesnt work
                                
                            }
                            break;
            case WITHDRAW:      
                            break;
        }        
        current.action = NONE;
        goBack();
    }

    function openChangePIN() {
        openView(View.changePIN);
    }

    function updatePIN() {

    }

    function updateData() {

    }

    function loadData() {

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

    this.views = () => View;

    init();
    console.log('ATM Ready.');    
}