import { supabase } from '../main'

const form_login = document.getElementById("form_login");

document.body.addEventListener("click", function (event) {
    if (event.target.id === "btn_create") {
      register(event);
    }
  });

form_login.onsubmit = async (e) => {
  e.preventDefault();

  const formData = new FormData(form_login);

  let { data, error } = await supabase.auth.signInWithPassword({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  let session = data.session;
  let user = data.user;

  console.log(user);

  if (session != null) {
   
    localStorage.setItem("access_token", session.access_token);
    localStorage.setItem("refresh_token", session.refresh_token);

    let{data:user_information, error} = await supabase
    .from("user_information")
    .select("*")

    localStorage.setItem("user_id", user_information[0].id);
    console.log(user_information[0].id);

    /* role system if implemented */
    if (session != null) {
        /* const userRole = user_information[0].Role;
        const userId = user.id; */
        alert("Greetings!");
        window.location.href = 'home.html';
    }
    else {
        alert("Error Please Try again or check your password");
        console.log(error);
    }
  }
  form_login.reset();
};


const register = async (e) => {
    e.preventDefault();
   
    const formData = new FormData(form_register);
    const password = formData.get("password_reg");
    const confirmPassword = formData.get("password_confirm");

    if (formData.get("password_reg") == formData.get("password_confirm")){

        //supabase log-in
        const { data, error } = await supabase.auth.signUp({
            email: formData.get("email_reg"),
            password: formData.get("password_reg"),
        });

        let user_id = data?.user?.id;
        if (user_id != null) {

            //getting the info
            const { data, error } = await supabase
                .from('user_information')
                .insert([
                    {
                       firstname: formData.get("firstname"),lastname: formData.get("lastname"),school_id: formData.get("school_id"),
                        user_id:user_id, 
                    }
                ])
                .select()

                alert("You have been Registered!");

            //if success registration condition
            if (error == null) {
                alert("Register Successfully please verify your email");
                console.log(data);
                window.location.reload();
            }
            else {
                 console.log(error);
                alert("error");
                console.log(error);
            }
            form_register.reset();
            //button loading after succes registration
            document.querySelector("#form_register button").disabled = false;
            document.querySelector("#form_register button").innerHTML = "Register";
        }
    }else {
        //button loading after password dont match
        errorNotification("Password not match", 10);
        document.querySelector("#form_register button").disabled = false;
        document.querySelector("#form_register button").innerHTML = "Register";
    }
}

//modal Toggler
$(".message a").click(function () {
    $("form").animate({ height: "toggle", opacity: "toggle" }, "slow");
  });