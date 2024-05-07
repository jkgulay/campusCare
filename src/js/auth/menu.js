import {
  doLogout,
  supabase,
} from "../main";

const btn_logout = document.getElementById("btn_logout");
btn_logout.onclick = doLogout;

  const itemsImageUrl =
"https://fprynlwueelbysitqaii.supabase.co/storage/v1/object/public/profilePicture/";
const userId = localStorage.getItem("user_id");

getDatas();

document.body.addEventListener("click", function (event) {
  if (event.target.id === "btn_logout") { 
      // Disable the button and show loading spinner
      document.querySelector("#btn_logout").disabled = true;
      document.querySelector("#btn_logout").innerHTML = `<div class="spinner-border spinner-border-sm me-2" role="status"></div><span>Loading...</span>`;
      
     
      doLogout().then(() => {
          // Re-enable ang button then change sa text
          document.querySelector("#btn_logout").disabled = false;
          document.querySelector("#btn_logout").innerHTML = "Log-in";
      }).catch((error) => {
         
          console.error("Logout failed:", error);
          // in case of error
          document.querySelector("#btn_logout").disabled = false;
        
          document.querySelector("#btn_logout").innerHTML = "Log-in";
      });
  }
});

async function getDatas(){

  let {data:post,error} = await supabase
  .from("user_information")
  .select("*")
  .eq("id",userId)

  let container = "";

 post.forEach((data) => {


    container += `<div
    class="card d-flex align-items-center w-100"
    style="
      height: 135px;
      border-style: none;
      background: rgba(255, 255, 255, 0.5);
      
    "
  >
    <img
      src="${itemsImageUrl + data.image_path}"
      class="block my-2 border border-dark border-2 rounded-circle"
      style="border-radius: 50%; width: 10vh; height: 10vh"
      alt=""
    />
    <h5 style="color: white"; >${data.firstname + " " +data.lastname}</h5>
  </div>`
  })
  document.getElementById("container").innerHTML = container;
}