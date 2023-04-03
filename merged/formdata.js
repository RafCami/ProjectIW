function validateForm() {
    //Get form data and create FormData (dictionary) object for easy data access;
    //https://developer.mozilla.org/en-US/docs/Web/API/FormData
    let registerForm = new FormData(document.getElementById('RegisterForm'));
    let errors = [];

    //iterate over form entries
    for (var pair of registerForm) {
        let emptyMessage = '';
        //check which field gets checked
        switch (pair[0]) {
            case 'firstname':
                emptyMessage = 'voornaam';
                break;
            case 'lastname':
                emptyMessage = 'naam';
                break;
            case 'username':
                emptyMessage = 'gebruikersnaam';
                break;
            case 'address':
                emptyMessage = 'adres';
                break;
            case 'country':
                emptyMessage = 'land';
                break;
            case 'province':
                emptyMessage = 'provincie';
                break;
            case 'postalcode':
                if (pair[1]) { 
                    let pcError = checkPC(pair[1]); 
                    if (pcError) errors.push(pcError);
                }
                else emptyMessage = 'postcode';
                break;
            case 'email':
                if (pair[1].length > 0) {
                    if (!validateEmail(pair[1])) errors.push('E-mailadres is niet correct');
                } else emptyMessage = 'e-mail';
                break;
            case 'password':
                if (pair[1].length == 0) emptyMessage = 'wachtwoord'; //check for empty password
                else if (pair[1].length <= 7) errors.push('Het wachtwoord moet minstens 8 karakters lang zijn'); //check for too short password
                break;
            case 'passwordvalidate':
                if (pair[1].length == 0) emptyMessage = 'herhaal wachtwoord'; //check for empty password validation
                else if (registerForm.get('password').length >= 8 && pair[1] != registerForm.get('password')) errors.push('Beide wachtwoord velden moeten gelijk zijn'); //password is long enough AND fields not equal
                break;
        }
        
        let checkResult = '';
        //check if empty field
        if (emptyMessage != '') checkResult = checkEmptyField(pair[1], emptyMessage); 
        if (checkResult != '') errors.push(checkResult);
    }

    //handle checkboxes
    //if checked set value to 1 else 0
    registerForm.set('newsletter', registerForm.has('newsletter') ? 1 : 0);
    registerForm.set('agree', registerForm.has('agree') ? 1 : 0);
    if (registerForm.get('agree') == '0') errors.push('Je moet de algemene voorwaarden accepteren'); //check if agreements are accepted

    //handle radio buttons
    //check if payment method is chosen
    if (registerForm.get('payment'))  validatePayment(registerForm.get('payment')); //set payment div
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
    let response = document.getElementById('response');
    response.className = ''; //Clear classes
    classes.forEach(c => response.classList.add(c)); //Add every class
    response.innerHTML = content; //Set content
}

function checkEmptyField(field, message) {
    if (field.match(/^ *$/)) return `Het veld ${message} is vereist`; //check if field is empty or only contains spaces
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
    if (!postalcode.match(reg)) return 'De waarde van postcode moet tussen 1000 en 9999 liggen';
}