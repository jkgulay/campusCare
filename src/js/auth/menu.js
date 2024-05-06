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
      height: 90px;
      border-style: none;
      
    "
  >
    <img
      src="${itemsImageUrl + data.image_path}"
      class="block my-2 border border-dark border-2 rounded-circle"
      style="border-radius: 50%; width: 10vh; height: 10vh"
      alt=""
    />
    <h5 " >${data.firstname}</h5>
  </div>`
  })
  document.getElementById("container").innerHTML = container;
}