// var btn = document.getElementById("SubmitBtn");

// btn.addEventListener("click", HandelClick);

// function HandelClick(){
//     let nameInput = document.getElementById("name");
//     let ageInput = document.getElementById("age");

//     console.log(nameInput.value, ageInput.value);
// }


function SendData(){
    let nameInput = document.getElementById("name").value
    let ageInput = document.getElementById("age").value

    fetch('/addName', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({name : nameInput, age : ageInput})
    });
}