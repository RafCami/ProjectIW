function validateForm() {
    let errors = [];
    let formFields = document.querySelectorAll('input, select'); //array of all html input fields
    
    //iterate over all form fields
    for (var input of formFields) {
        let error = '';
        //check for empty fields
        let message = ''; //variable for fieldname
        switch (input.id) {
            case 'firstname':
                message = 'voornaam';
                break;
            case 'lastname':
                message = 'naam';
                break;
            case 'username':
                message = 'gebruikersnaam';
                break;
            case 'email':
                message = 'email';
                break;
            case 'password':
                message = 'wachtwoord';
                break;
            case 'passwordvalidate':
                message = 'herhaal wachtwoord';
                break;
            case 'address':
                message = 'adres';
                break;
            case 'country':
                message = 'land';
                break;
            case 'province':
                message = 'provincie';
                break;
            case 'postalcode':
                message = 'postcode';
                break;
            default:
                break;
        }
        //if message is filled, field has to be checked if empty
        if (message) { error = checkEmptyField(input, message); }
        if (error) {
            errors.push(error);
            continue; //skip to next field if field is empty
        }

        //value validation
        switch (input.id) {
            case 'email':
                if (!validateEmail(input.value)) errors.push('E-mailaders is niet correct.');
                break;
            case 'password':
                if (input.value.length < 8) errors.push('Wachtwoord moet minstens 8 karakters lang zijn.');
                break;
            case 'passwordvalidate':
                if (document.querySelector('#password').value.length >= 8 && input.value != document.querySelector('#password').value) errors.push('Wachtwoorden komen niet overeen.');
                break;
            case 'agree':
                if (!input.checked) errors.push('Je moet akkoord gaan met de algemene voorwaarden.');
                break;
            case 'postalcode':
                let pcError = checkPC(input); 
                if (pcError) errors.push(pcError);
            case 'bankingapp':
            case 'wire':
            case 'visa':
            case 'paypal':
                if (input.checked) { validatePayment(input); }
                break;
            default:
                break;
        }
        
    }

    //construct alert div
    let response = document.querySelector('#response');
    response.querySelector('p').textContent = ''; //Clear old errors
    response.className = ''; //Clear classes
    let classes = ['alert'];
    //set alert div content
    if (errors.length > 0) {
        //alert content on errors
        response.querySelector('h4').textContent = 'Yikes errors...';
        errors.forEach(e => response.querySelector('p').textContent += `${e}\r\n`);
        //alert classes on errors
        classes.push('alert-danger');
        document.querySelector('#responsePayment').classList.add('invisible'); //hide payment div
    } else {
        response.querySelector('h4').textContent = 'Goed gedaan!';
        response.querySelector('p').textContent = 'Aww yeah, je werd geregistreerd.';
        classes.push('alert-success');
        document.getElementById('responsePayment').classList.remove('invisible'); //show payment div
    }
    //set alert div classes
    classes.forEach(c => response.classList.add(c)); //Add every class
    
}

function checkEmptyField(field, message) {
    if (field.value.match(/^ *$/)) return `Het veld ${message} is vereist`; //check if field is empty or only contains spaces
    else return '';
}

function validateEmail(email) {
    const reg = /^[a-zA-Z0-9_][a-zA-Z0-9_\-\.]*@[a-zA-Z0-9][a-zA-Z0-9\-\.]*\.[a-zA-Z0-9\-\.]+/; //email regex
    //const reg = /.+@.+\..+/; //email must contain any number of characters, an '@', any number of characters, a '.', any number of characters 
    return reg.test(email); //return if email matches bool
}

function validatePayment(payment) {
    //construct alert text
    let alertText;
    if (payment.value) {
        alertText = `Je betalingswijze is ${payment.value}`;
    }
    else {
        alertText = 'Je hebt geen betalingswijze gekozen';
    }
    //set payment div content
    document.querySelector('#responsePayment').querySelector('p').textContent = alertText;
}

function checkPC(postalcode) {
    //check if postalcode is valid
    const reg = /^[1-9][0-9]{3}$/; //postal code regex
    if (!reg.test(postalcode)) return 'De waarde van postcode moet tussen 1000 en 9999 liggen';
}