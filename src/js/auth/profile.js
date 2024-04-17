import { doLogout, supabase } from "../main";

const itemsImageUrl =
  "https://fprynlwueelbysitqaii.supabase.co/storage/v1/object/public/profilePicture/";
const userId = localStorage.getItem("user_id");

getDatas();

async function getDatas() {
  try {
    let { data: user_information, error: userError } = await supabase
      .from("user_information")
      .select("*")
      .eq("user_id", userId);


    let imageContainer = "";
    let nameContainer = "";
    let idContainer = "";

    user_information.forEach((data) => {
      imageContainer += `<div  data-id="${data.image_path}"> <img
                      src="${itemsImageUrl + data.image_path}"
                    class="block my-2 border border-dark border-2 rounded-circle"
                    alt="image profile" style="border-radius: 50%; width: 100px; height: 100px"
                  /></div>`;
      nameContainer += `<h1>${data.firstname}</h1>`
      idContainer +=`<p>${data.school_id}</p>`
    });

    document.getElementById("imageContainer").innerHTML = imageContainer;
    document.getElementById("nameContainer").innerHTML = nameContainer;
    document.getElementById("idContainer").innerHTML = idContainer;
  } catch {
   console.log("error");
  }
}

document.body.addEventListener("click", function (event) {
    if (event.target.id === "saveImage") {
     alert("w8 ka muna");
    }
  });
