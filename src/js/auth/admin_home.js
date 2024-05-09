import { supabase } from "../main";
import * as bootstrap from "bootstrap";

const itemsImageUrl =
  "https://fprynlwueelbysitqaii.supabase.co/storage/v1/object/public/profilePicture/";
const userId = localStorage.getItem("user_id");
console.log(userId);

getDatas();

async function getDatas() {
  let { data: post, error } = await supabase
    .from("post")
    .select("*,user_information(*)");

  post.sort(() => Math.random() - 0.5);
  let container = "";

  post.forEach((data) => {
    const imagepath = data.user_information.image_path;
    const codename = data.user_information.code_name;

    let deleteButton = `<button data-id="${data.id}" id="delete_btn" type="button" class="btn btn-outline-light">Delete</button>`;

    container += `
    <div class="m-3 p-3" style="border-radius: 10px; background: rgba(0, 0, 0, 0.5);" data-id="${data.id}">
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
              <cite class="text-light card-subtitle mb-2">
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
              <button type="button" class="btn btn-outline-light comment-btn" data-postId="${data.id}">Comment</button>
              ${deleteButton}
              <!-- Comments Modal -->
              <div class="modal fade" id="commentModal_${data.id}" tabindex="-1" aria-labelledby="commentModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="commentModalLabel">Comments</h5>
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
          <input type="text" class="form-control" placeholder="Write a comment...">
          <button type="button" class="btn btn-primary">Add Comment</button>
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
    const filePath = `postPicture/public/${file.name}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("postPicture")
      .upload(filePath, file);
    if (uploadError) {
      alert("Error uploading file. Please try again.");
      console.error(uploadError);
      return;
    }
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

async function addComment(postId, commentText) {
  try {
    const userId = localStorage.getItem("user_id");
    const { data, error } = await supabase
      .from("comments")
      .insert([
        {
          comment: commentText,
          post_id: postId,
          user_id: userId,
        },
      ])
      .select();

    if (error) {
      throw error;
    }

    alert("Comment added successfully!");
    // Optionally, you can update the UI to display the new comment without reloading the page
    // For example, you can fetch the updated comments for the post and display them dynamically
  } catch (error) {
    console.error("Error adding comment:", error);
    alert("Something went wrong. Please try again.");
  }
}


document.body.addEventListener("click", function (event) {
  if (event.target.classList.contains("comment-btn")) {
    const postId = event.target.dataset.postId;
    const modalId = `commentModal_${postId}`;
    const modal = document.getElementById(modalId);
    if (modal) {
      const modalInstance = new bootstrap.Modal(modal, {
        backdrop: 'static', // Set the backdrop property to 'static'
        keyboard: false
      });
      modalInstance.show();
    } else {
      console.error(`Modal with ID ${modalId} not found.`);
    }
  }
});

