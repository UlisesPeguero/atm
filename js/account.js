/*
    Holds and controls the balance actions
    +constructor
    @param  intialData  {object}    -> starting values for the account
*/
function Account(initialData) {
    // private attributes
    let pin, name, balance;

    /*
        Initializes Account instance and set the starting values for pin, name and balance
        @param  data   {Object}     -> {pin, name, balance} starting values for the Account
    */
    function init(data) {
        pin = data.pin;
        name = data.name;
        balance = data.balance || 0.00; // if not balance is provided we intialize on 0.00
    }

    /*
        Check if the deposit is a valid ammount and deposits it, returns true if so or false if is not
        @param deposit  {number}    -> Ammount to be deposited in the balance
        @return         {boolean}   -> flag that indicates if the deposit happened
    */
    this.deposit = deposit => {
        if(deposit < 0) {
            return false;
        }
        balance += deposit;
        return true;
    };

    /*
        Check if the withdraw is a valid ammount(no overdraft) and withdraws it,returns true if so or false if is not
        @param deposit  {number}    -> Ammount to be withdrawn from the balance
        @return         {boolean}   -> flag that indicates if the withdrawal happened
    */
    this.withdraw = withdrawal => {
        if(balance - withdrawal < 0) {
            return false;
        }
        balance += withdrawal;
        return true;
    };

    //  @return     {number}    -> Returns the current balance in the account
    this.getBalance = () => balance;
    
    //  @return     {object}    -> Returns the data in the account in JSON format
    this.getJSON = () => ({
        pin: pin,
        name: name,
        balance: balance.toFixed(2) // set the decimal precision to 2 
    });

    init(initialData);
}   