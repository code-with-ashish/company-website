function handleForm() {
    var f = document.getElementById("contact-f");
    var serviceOpt = document.getElementById("serviceOption").value;
    var data = {
        name: f.fname.value,
        email: f.email.value,
        phone: f.fstd.value+"-"+f.fphone.value,
        interest: serviceOpt
    };
    if (!(data.name && data.email != '')) {
        document.getElementById('name').style.borderColor = 'red';
        document.getElementById('EmailAdd').style.borderColor = 'red';
        document.getElementById('PhoneAdd').style.borderColor = 'red';
    }
    else {
        document.getElementById('fCard').style.display = 'none';
        document.getElementById('afterSub').style.display = 'block';
        axios.post('https://us-central1-iequation-techlabs.cloudfunctions.net/lead', data).catch(function (error) {
        });
    }
}