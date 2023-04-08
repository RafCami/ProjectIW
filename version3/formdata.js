function validateForm() {
    //Get form data and create FormData (dictionary) object for easy data access;
    //https://developer.mozilla.org/en-US/docs/Web/API/FormData
    let registerForm = new FormData(document.getElementById('RegisterForm'));
    let errors = [];

    //iterate over form entries
    for (var pair of registerForm) {
        //check if field is empty
        //checkboxes and radio buttons will be checked aswell, but they will only exists when not empty. So no need to catch them
        let checkResult = checkEmptyField(pair);
        //check if field needs more validation, only needed if field is not empty
        if (!checkResult) {
            switch (pair[0]) {
                case 'postcode':
                    checkResult = checkPC(pair[1]);
                    break;
                case 'e-mail':
                    if (!validateEmail(pair[1])) checkResult = 'E-mailadres is niet correct';
                    break;
                case 'wachtwoord':
                    if (pair[1].length <= 7) checkResult = 'Het wachtwoord moet minstens 8 karakters lang zijn'; //check for too short password
                    break;
                case 'herhaal wachtwoord':
                    //password is long enough AND fields not equal
                    if (registerForm.get('wachtwoord').length >= 8 && pair[1] != registerForm.get('wachtwoord')) checkResult = 'Beide wachtwoord velden moeten gelijk zijn';
                    break;
            }                   
        }
        //add error, if there is one, to errors array
        if (checkResult) errors.push(checkResult);
    }

    //handle checkboxes
    if (!registerForm.has('agree')) errors.push('Je moet de algemene voorwaarden accepteren');

    //handle radio buttons
    //check if payment method is chosen
    //set payment div
    if (!validatePayment(registerForm.get('payment'))) errors.push('Je moet een betalingswijze kiezen');

    //construct alert div
    let response = document.querySelector('#response');
    response.classList.remove('invisible'); //show alert div
    response.classList.toggle('alert-danger', errors.length > 0);
    response.classList.toggle('alert-success', errors.length == 0);
    response.innerHTML = (errors.length > 0) ? `<h4>Yikes errors...</h4><p>${errors.join('<br>')}</p>` : '<h4>Goed gedaan!</h4><p>Aww yeah, je werd geregistreerd.</p>';
    document.querySelector('#responsePayment').classList.toggle('invisible', errors.length > 0); //hide payment div if there are errors else show it
}

function checkEmptyField(field, message) {
    let reg = /^ *$/;
    if (reg.test(field[1])) return (message) ? message : `Het veld ${field[0]} is vereist`; //check if field is empty or only contains spaces
    else return '';
}

function validateEmail(email) {
    const reg = /^[a-zA-Z0-9_][a-zA-Z0-9_\-\.]*@[a-zA-Z0-9][a-zA-Z0-9\-\.]*(\.[a-zA-Z0-9\-]*[a-zA-Z0-9]+)+$/; //email regex
    return reg.test(email); //return if email matches
}

function validatePayment(payment) {
    //set payment div content
    document.getElementById('responsePayment').getElementsByTagName('p')[0].innerHTML = (payment) ? `Je betalingswijze is ${payment}` : 'Je hebt geen betalingswijze gekozen';
    return payment;
}

function checkPC(postalcode) {
    //check if postalcode is valid
    const reg = /^[1-9][0-9]{3}$/; //postal code regex
    if (!reg.test(postalcode)) return 'De waarde van postcode moet tussen 1000 en 9999 liggen';
}