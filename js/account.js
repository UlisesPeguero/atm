function Account(initialData) {
    // private attributes
    let pin, name, balance;

    /*
        Initializes Account instance and set the starting values for pin, name and balance
        @param  data   {Object} -> {pin, name, balance} starting values for the Account
    */
    function init(data) {
        pin = data.pin;
        name = data.name;
        balance = data.balance || 0.00; // if not balance is provided we intialize on 0.00
    }

    init(initialData);
}   