import { doLogout, supabase } from "../main";
import * as bootstrap from "bootstrap";

const itemsImageUrl =
  "https://fprynlwueelbysitqaii.supabase.co/storage/v1/object/public/profilePicture/";
const userId = localStorage.getItem("user_id");
console.log(userId);

getDatas();

async function getDatas() {
  let { data: user_information, error: userError } = await supabase
    .from("user_information")
    .select("*, user_program, code_name")
    .eq("id", userId);
  let { data: post, error: postError } = await supabase
    .from("post")
    .select("*,user_information(*)");

  let { data: announcements, error: announcementError } = await supabase
    .from("notice")
    .select("*");

  // Check for errors
  if (userError || postError || announcementError) {
    throw userError || postError || announcementError;
  }

  sessionStorage.setItem("user_program", user_information[0].user_program);
  sessionStorage.setItem("code_name", user_information[0].code_name);

  localStorage.setItem("posts", JSON.stringify(post));

  post.sort(() => Math.random() - 0.5);
  let container = "";

  announcements.forEach((data) => {
    document.getElementById("announcementTitle1").innerText =
      data.announcement_title;
    document.getElementById("announcementBody1").innerText = data.announcement;
    document.getElementById("profilePicture").src =
      itemsImageUrl + user_information[0].image_path;
  });

  post.forEach((data) => {
    const imagepath = data.user_information.image_path;
    const codename = data.user_information.code_name;

    let deleteButton = `<button data-id="${data.id}" id="delete_btn" type="button" class="btn btn-outline-light">Delete</button>`;

    container += `
      <div class="m-3 p-3" style="border-radius: 10px; background: rgba(0, 0, 0, 0.5);" data-id="${
        data.id
      }">
        <div class="card d-flex align-items-center flex-row w-100" style="border-radius: 10px; background: rgba(255, 255, 255, 0.5);">
          <img
            src="${itemsImageUrl + imagepath}"
            class="block mx-2 my-2 border border-black border-2 rounded-circle me-2"
            style="border-radius: 50%; width: 50px; height: 50px"
            alt=""
          />
          <h5 class="card-title px-1">${data.title}</h5>
          <div class="row"></div>
        </div>
        <div class="card-body">
          <p class="text-light card-text d-grid  mt-3 ">
            <cite class="text-light card-subtitle mb-2" >
              By: ${codename}
            </cite>
            ${data.body}
          </p>
          <div class="row d-flex justify-content-center">
            <img
            src="${itemsImageUrl + data.image_path}"
              style="width: 400px; height: 200px"
            />
          </div>
          <div class="mt-2">
            <!-- Button trigger modal -->
            <button type="button" class="btn btn-outline-light" data-bs-toggle="modal" data-bs-target="#comment1">
              Comment
            </button>
            ${deleteButton}
            <!-- Modal -->
            <div class="modal fade" id="comment1" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="commentLabel1" aria-hidden="true">
              <div class="modal-dialog">
                <div class="modal-content">
                  <div class="modal-header">
                    <h1 class="modal-title fs-5" id="commentLabel1">Comments</h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div class="modal-body">
                    <div class="card card-body">
                      <p class="card-text ">
                        <img
                          src="assets/face.jpg"
                          class="card-img-top"
                          style="border-radius: 50%; width: 20px; height: 20px"
                          alt=""
                        />
                        <h6 class="card-subtitle text-body-secondary" style="overflow-y: auto">
                          By Admin
                        </h6>
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et 
                      </p>
                    </div>
                    <div class="card card-body">
                      <p class="card-text ">
                        <img
                          src="assets/face.jpg"
                          class="card-img-top"
                          style="border-radius: 50%; width: 20px; height: 20px"
                          alt=""
                        />
                        <h6 class="card-subtitle text-body-secondary" style="overflow-y: auto">
                          By Admin
                        </h6>
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et
                      </p>
                    </div>
                  </div>
                  <div class="modal-footer"> 
                    <input
                            type="text"
                            name="text"
                            value=""
                            class="w-100 p-3"
                            placeholder="Write a comment..."
                            style="height: 50px; border: 2px solid #ccc; border-radius: 10px;"
                          />
                    <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-outline-secondary">Add Comment</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  });
  document.getElementById("container").innerHTML = container;
}

async function addData() {
  const formData = new FormData(form_post);
  const fileInput = document.getElementById("uploadPhotoBtn");
  const file = fileInput.files[0];

  if (file) {
    const filePath = `postPicture/${file.name}`;
    await supabase.storage.from("public").upload(filePath, file);
    formData.set("image_path", filePath);
  }

  const { data, error } = await supabase
    .from("post")
    .insert([
      {
        title: formData.get("title"),
        body: formData.get("body"),
        user_id: userId,
        image_path: formData.get("image_path"),
      },
    ])
    .select();

  if (error) {
    alert("Something wrong happened. Cannot add item.");
    console.log(error);
  } else {
    alert("Post Successfully Added!");
    getDatas();
    window.location.reload();
  }
}

const post_btn = document.getElementById("post_btn");
if (post_btn) {
  post_btn.onclick = () => {
    // Disable the button and show loading spinner
    post_btn.disabled = true;
    post_btn.innerHTML = `<div class="spinner-grow spinner-grow-sm" role="status">
    <span class="visually-hidden">Loading...</span>
  </div><div class="spinner-grow spinner-grow-sm" role="status">
  <span class="visually-hidden">Loading...</span>
</div><div class="spinner-grow spinner-grow-sm" role="status">
<span class="visually-hidden">Loading...</span>
</div>`;

    addData()
      .then(() => {
        // Re-enable the button and change the text
        post_btn.disabled = false;
        post_btn.innerHTML = "Submit";
      })
      .catch((error) => {
        console.error("Add post failed:", error);
        // Re-enable the button in case of error
        post_btn.disabled = false;
        post_btn.innerHTML = "Submit";
      });
  };
}

document.body.addEventListener("click", function (event) {
  if (event.target.id === "post_btn") {
    addData(event);
  } else if (event.target.id === "delete_btn") {
    const dataId = event.target.dataset.id;
    deletePost(event, dataId);
  }
});

async function deletePost(event, id) {
  const isConfirmed = window.confirm("Are you sure you want to delete Post?");

  if (!isConfirmed) {
    return;
  }

  try {
    const { error } = await supabase.from("post").delete().eq("id", id);
    if (error) {
      throw error;
    }
    alert("Post Successfully Deleted!");
    window.location.reload();
  } catch (error) {
    alert("Error Something's Wrong!");
    console.error(error);
    window.location.reload();
  }
}

const sidebarToggle = document.querySelector("#sidebar-toggle");
sidebarToggle.addEventListener("click", function () {
  document.querySelector("#sidebar").classList.toggle("collapsed");
});

function editAnnouncement(announcementId, newTitle, newBody) {
  // Update the announcement in the 'notice' table
  supabase
    .from("notice")
    .update({ announcement: newBody, announcement_title: newTitle })
    .eq("id", announcementId)
    .then((response) => {
      console.log("Announcement updated successfully:", response);
      // You may want to close the modal or update the UI here
      // Update the announcement in the accordion
      document.getElementById("announcementTitle1").innerText = newTitle;
      document.getElementById("announcementBody1").innerText = newBody;

      // Close the modal
      const modal = document.getElementById("editAnnouncementModal");
      const modalBackdrop = document.querySelector(".modal-backdrop");
      modal.classList.remove("show");
      modalBackdrop.remove();
    })
    .catch((error) => {
      console.error("Error updating announcement:", error.message);
    });
}

// Example usage: Assuming you have a button to trigger the edit modal
document
  .querySelector(".edit-announcement")
  .addEventListener("click", function () {
    const announcementId = this.getAttribute("data-announcement-id");
    const currentTitle =
      document.getElementById("announcementTitle1").innerText;
    const currentBody = document.getElementById("announcementBody1").innerText;

    // Populate the modal with the current announcement data
    document.getElementById("newTitle").value = currentTitle;
    document.getElementById("newBody").value = currentBody;

    // When the user clicks "Save changes", update the announcement
    document
      .getElementById("saveChangesBtn")
      .addEventListener("click", function () {
        const newTitle = document.getElementById("newTitle").value;
        const newBody = document.getElementById("newBody").value;

        editAnnouncement(announcementId, newTitle, newBody);
      });
  });

  const btnLogout = document.getElementById("btn_logout");
  if (btnLogout) {
    btnLogout.onclick = () => {
      // Disable the button and show loading spinner
      btnLogout.disabled = true;
      btnLogout.innerHTML = `<div class="spinner-border text-light-sm me-2" role="status" style="color: white"></div>`;
  
      doLogout()
        .then(() => {
          // Re-enable the button and change the text
          btnLogout.disabled = false;
          btnLogout.innerHTML = "Log-in";
        })
        .catch((error) => {
          console.error("Logout failed:", error);
          // Re-enable the button in case of error
          btnLogout.disabled = false;
          btnLogout.innerHTML = "Log-in";
        });
    };
  }
  