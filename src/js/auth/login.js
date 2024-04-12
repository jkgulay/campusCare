import { supabase } from "../main";


document.body.addEventListener("click", function (event) {
    if (event.target.id === "btn_create") {
      register(event);
    }
  });

form_login.onsubmit = async (e) => {
  e.preventDefault();

  const formData = new FormData(form_login);

  let { data, error } = await supabase.auth.signInWithPassword({
    email: formData.get("email_reg"),
    password: formData.get("password_reg"),
  });

  let session = data.session;
  let user = data.user;

  console.log(user);

  if (session != null) {
    localStorage.setItem("user_id", user.id);

    let{data:user_information, error} = await supabase
    .from("user_information")
    .select("*")

    /* role system if implemented */
    if (session != null) {
        const userRole = user_information[0].Role;
        const userId = user.id;
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
                        password: formData.get("password_reg"), firstname: formData.get("firstname"),lastname: formData.get("lastname"),school_id: formData.get("school_id"),
                        id:user_id, email: formData.get("email_reg")
                    }
                ])
                .select()

                alert("Hello!");

            //if succes registration condition
            if (error == null) {
                alert("Register Successfully please verify your email.<a href = './login.html'>Click Here to Log-in!</a>");
                alert("Success!");
                console.log(data);

                console.log(error);
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