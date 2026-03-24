function load_login()
{
    window.location.href = "login.html";
}
function load_signup()
{
    window.location.href = "signup.html";
}
function load_destinations()
{
    window.location.href = "destinations.html";
}
function validate_input()
{
  if(validate_email() && validate_password())
    alert("Account Created Successfully");
}
function validate_email()
{
    let e = document.getElementById("emailID").value;
    if(e.includes("@") && e.includes(".com"))
        return true;
    else
      {
        alert("Invalid Email ID");
        return false;
      }
}
function validate_password()
{
    let p = document.getElementById("pass").value;
    let num_uppercaseCharacters = 0;
    let num_lowecaseCharacters = 0;
    let num_specialCharacters = 0;
    let num_numbers = 0;
    for(let i = 0;i<p.length;i++)
    {
        if(p[i]>='A' && p[i]<='Z')
            num_uppercaseCharacters++;
        else if(p[i]>='a'&& p[i]<='z')
            num_lowecaseCharacters++;
        else if(p[i]>='0' && p[i]<='9')
            num_numbers++;
        else
            num_specialCharacters++;
    }
if(p.length>= 8 && num_uppercaseCharacters>=1 && num_lowecaseCharacters>=1 && num_numbers>=1 && num_specialCharacters>=1)
    return true;
else{
    if(p.length < 8)
      {
        alert('Password must be minimum of 8 characters');
      }
    if(num_uppercaseCharacters == 0) 
    {
        alert('Password must contain minimum 1 uppercase character');
    }
    if(num_lowecaseCharacters == 0)
    {
        alert('Password must contain minimum 1 lowercase character');
    }
    if(num_specialCharacters == 0)
    {
        alert('Passwordmust contain minimum 1 special character');
    }
    return false;
   }
}
