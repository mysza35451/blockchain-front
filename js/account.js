
function  createAccount(){
    let email = document.getElementById("signup-email").value;
    let username = document.getElementById("signup-username").value;
    let password = document.getElementById("signup-password").value;
    let addAccount = false;
    let accountData = {email: email, username: username, password: password};
    var modal = document.getElementById("myModal");

    const optionsPOST = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(accountData)
      
      };
      console.log(accountData)
      fetch("/account/users", optionsPOST).then((response) => response.json())
      .then((responseJSON) => {
        console.log("Success:", responseJSON);
        if(responseJSON == true){
  modal.style.display = "none";
          
          displaySuccess();
        }
      });
      
}

function displaySuccess(){
  alert("success");
}