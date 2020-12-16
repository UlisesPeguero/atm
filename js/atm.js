function Atm() {
    // constants
    // View will hold all the DOM for the UI views
    const View = {
        login: document.getElementById('login'), // home screen
        new: document.getElementById('newAccount'), // new account creation 
        account: document.getElementById('account'), // account menu
        balance: document.getElementById('balance'), // perform any action related to the balance (get, deposit, withdraw)
        changePin: document.getElementById('changePin') // change current pin
    };

    // controls
    const Button = {
        login: document.getElementById('loginButton'),
        new: document.getElementById('newAccountButton'),
        balance: document.getElementById('balanceButton'),
        changePin: document.getElementById('changePinButton'),
        deposit: document.getElementById('depositButton'),
        withdraw: document.getElementById('withdrawButton'),
        logout: document.getElementById('logoutButton')        
    }

    // initializes application and UI
    function init() {
        // prepare related controls
        prepareControls();
        // initializes the UI to show the login view
        showView(View.login);
    }

    // assigns control DOM elements and attaches events
    function prepareControls() {
        Button.login.onclick = login;
        Button.new.onclick = openNewAccount;
        Button.logout.onclick = logout;
    }

    // attemps to login by looking for the PIN provided
    function login() {

        showView(View.account);
    }

    // closes current session and returns to login screen
    function logout() {
        showView(View.login);
    }

    // open view to create new account
    function openNewAccount() {
        showView(View.new);
    }

    /*
        Hides all the the containers that are currently visible and displays the specified one
        @param  container   {DOM} -> DOM that holds the container to be shown
    */
    function showView(view) {

        document.querySelectorAll('.myContainer[visible]').forEach(dom => {
            dom.removeAttribute('visible');
            dom.style.display = 'none';
        });
        view.setAttribute('visible', true);        
        view.style.display = 'block';
    }

    // calls initializing method
    init();
    console.log('ATM Ready.');    
}