let usName = document.getElementById('usName');
let usPassword = document.getElementById('usPassword');
let usEmail = document.getElementById('usEmail');
let age = document.getElementById('age');
let region = document.getElementById('region');

function getVal() {
    var response =  fetch("http://localhost:3000/addName", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: usName.value,
            password: usPassword.value,
            email: usEmail.value,
            age: age.value, 
            region: region.value
        })
    });
}
