import { supabase } from "../main";

const itemsImageUrl =
  "https://fprynlwueelbysitqaii.supabase.co/storage/v1/object/public/profilePicture/";
const userId = localStorage.getItem("user_id");
console.log(userId);
const postImageUrl =
  "https://fprynlwueelbysitqaii.supabase.co/storage/v1/object/public/postPicture/";
const imagePostPath = "./postPicture/";
const imageUrl = itemsImageUrl + imagePostPath;
console.log(imageUrl);
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

  post.sort(() => Math.random() - 0.5);
  let container = "";

  post.forEach((data) => {
    const imagepath = data.user_information.image_path;
    const codename = data.user_information.code_name;
    const imagepost = data.image_post;
    let deleteButton = `<button data-id="${data.id}" id="delete_btn" type="button" class="btn btn-outline-light">Delete</button>`;
    let postImage = "";
    if (imagepost) {
      postImage = `<img src="${
        postImageUrl + imagepost
      }" style="width: 400px; height: 200px" />`;
    }
    container += `
        <div class="m-3 p-3" style="border-radius: 10px; background: rgba(0, 0, 0, 0.5);" data-id="${
          data.id
        }">
            <div class="card d-flex align-items-center flex-row w-100" style="border-radius: 10px; background: rgba(255, 255, 255, 0.5);">
                <img src="${
                  itemsImageUrl + imagepath
                }" class="block mx-2 my-2 border border-black border-2 rounded-circle me-2" style="border-radius: 50%; width: 50px; height: 50px" alt="" />
                <h5 class="card-title px-1">${data.title}</h5>
                <div class="row"></div>
            </div>
            <div class="card-body">
                <p class="text-light card-text d-grid mt-3 ">
                    <cite class="text-light card-subtitle mb-2" >
                        By: ${codename}
                    </cite>
                    ${data.body}
                </p>
                <div class="row d-flex justify-content-center ">
                    ${postImage}
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
  let imagePath = ""; // Define imagePath variable

  if (file) {
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("postPicture")
      .upload("postPicture/" + file.name, file);

    if (uploadError) {
      alert("Error uploading post picture.");
      console.error("Upload error:", uploadError.message);
      return;
    }

    // Get the file path after uploading
    imagePath = "postPicture/" + file.name;

    // Update the 'post' table with the image data
    const { data: updateData, updateError } = await supabase
      .from("post")
      .update({ image_post: imagePath })
      .eq("id", userId);

    if (updateError) {
      alert("Error updating post with image data.");
      console.error("Update error:", updateError.message);
      return;
    }
  }

  // Insert the post data with the image path
  const { data: postData, insertError } = await supabase
    .from("post")
    .insert([
      {
        title: formData.get("title"),
        body: formData.get("body"),
        image_post: imagePath, // Use the image path here
        user_id: userId,
      },
    ])
    .select();

  if (insertError) {
    alert("Error adding post.");
    console.error("Insert error:", insertError.message);
    return;
  }

  alert("Post Successfully Added!");
  getDatas();
  window.location.reload();
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
