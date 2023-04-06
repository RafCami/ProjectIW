function validateForm() {
    //Get form data and create FormData (dictionary) object for easy data access;
    //https://developer.mozilla.org/en-US/docs/Web/API/FormData
    let registerForm = new FormData(document.getElementById('RegisterForm'));
    let errors = [];

    //iterate over form entries
    for (var pair of registerForm) {
        let checkResult = checkEmptyField(pair);
        //check which field gets checked
        switch (pair[0]) {
            case 'postcode':
                if (!checkResult) { 
                    checkResult = checkPC(pair[1]); 
                }
                break;
            case 'e-mail':
                if (!checkResult) {
                    if (!validateEmail(pair[1])) checkResult = 'E-mailadres is niet correct';
                }
                break;
            case 'wachtwoord':
                if (!checkResult && pair[1].length <= 7) checkResult = 'Het wachtwoord moet minstens 8 karakters lang zijn'; //check for too short password
                break;
            case 'herhaal wachtwoord':
                //password is long enough AND fields not equal
                if (!checkResult && registerForm.get('wachtwoord').length >= 8 && pair[1] != registerForm.get('wachtwoord')) checkResult = 'Beide wachtwoord velden moeten gelijk zijn';
                break;
        }
        
        //check if empty field
        if (checkResult) errors.push(checkResult);
    }

    //handle checkboxes
    if (!registerForm.has('agree')) errors.push('Je moet de algemene voorwaarden accepteren');

    //handle radio buttons
    //check if payment method is chosen
    if (registerForm.has('payment'))  validatePayment(registerForm.get('payment')); //set payment div
    else errors.push('Je moet een betalingswijze kiezen');

    //construct alert div
    let content = '';
    let classes = ['alert'];
    if (errors.length > 0) {
        //alert content on errors
        content += '<h4>Yikes errors...</h4><p>';
        errors.forEach(e => content += `${e}<br>`);                
        content += '</p>';
        //alert classes on errors
        classes.push('alert-danger');
        document.getElementById('responsePayment').classList.add('invisible'); //hide payment div
    } else {
        content += '<h4>Goed gedaan!</h4><p>';
        content += 'Aww yeah, je werd geregistreerd.</p>';
        classes.push('alert-success');
        document.getElementById('responsePayment').classList.remove('invisible'); //show payment div
    }
    //set alert div classes and content
    let response = document.querySelector('#response');
    response.className = ''; //Clear classes
    classes.forEach(c => response.classList.add(c)); //Add every class
    response.innerHTML = content; //Set content
}

function checkEmptyField(field, message) {
    let reg = /^ *$/;
    if (reg.test(field[1])) return (message) ? message : `Het veld ${field[0]} is vereist`; //check if field is empty or only contains spaces
    else return '';
}

function validateEmail(email) {
    const reg = /^[a-zA-Z0-9_][a-zA-Z0-9_\-\.]*@[a-zA-Z0-9][a-zA-Z0-9\-\.]*\.[a-zA-Z0-9\-\.]+/; //email regex
    //const reg = /.+@.+\..+/; //email must contain any number of characters, an '@', any number of characters, a '.', any number of characters 
    return reg.test(email); //return if email matches
}

function validatePayment(payment) {
    //construct alert text
    let alertText;
    if (payment) {
        alertText = `Je betalingswijze is ${payment}`;
    }
    else {
        alertText = 'Je hebt geen betalingswijze gekozen';
    }
    //set payment div content
    document.getElementById('responsePayment').getElementsByTagName('p')[0].innerHTML = alertText;
}

function checkPC(postalcode) {
    //check if postalcode is valid
    const reg = /^[1-9][0-9]{3}$/; //postal code regex
    if (!reg.test(postalcode)) return 'De waarde van postcode moet tussen 1000 en 9999 liggen';
}