import { supabase } from "../main";
import * as bootstrap from "bootstrap";

const itemsImageUrl =
  "https://fprynlwueelbysitqaii.supabase.co/storage/v1/object/public/profilePicture/";
const userId = localStorage.getItem("user_id");
const postImageUrl =
  "https://fprynlwueelbysitqaii.supabase.co/storage/v1/object/public/postPicture/";
const imagePostPath = "./postPicture/";
const imageUrl = itemsImageUrl + imagePostPath;
console.log(imageUrl);
console.log(userId);
getDatas();
sessionStorage.setItem("user_program", "user_program");
sessionStorage.setItem("code_name", "code_name");

document.addEventListener("DOMContentLoaded", function () {
  const userProgram = sessionStorage.getItem("user_program");
  const codeName = sessionStorage.getItem("code_name");
  document.getElementById("programContainer").innerText = userProgram;
  document.getElementById("codenameContainer").innerText = codeName;

  document
    .getElementById("information_btn")
    .addEventListener("click", function () {
      const newProgram = document.getElementById("user_program").value;
      const newCodename = document.getElementById("codename").value;
      document.getElementById("programContainer").innerText = newProgram;
      document.getElementById("codenameContainer").innerText = newCodename;
      sessionStorage.setItem("user_program", newProgram);
      sessionStorage.setItem("code_name", newCodename);
    });

  getDatas();
});

document.body.addEventListener("click", function (event) {
  if (event.target.id === "saveImage") {
    saveImage(event);
  } else if (event.target.id === "delete_btn") {
    deletePost(event);
  } else if (event.target.id === "information_btn") {
    editProfile(event);
  }
});

async function getDatas(searchTerm = "") {
  try {
    let { data: user_information, error: userError } = await supabase
      .from("user_information")
      .select("*, user_program, code_name")
      .eq("id", userId);
    let { data: post, error: postError } = await supabase
      .from("post")
      .select("*,user_information(*)")
      .eq("user_id", userId);

    let { data: announcements, error: announcementError } = await supabase
      .from("notice")
      .select("*");

    if (userError || postError || announcementError) {
      throw userError || postError || announcementError;
    }

    sessionStorage.setItem("user_program", user_information[0].user_program);
    sessionStorage.setItem("code_name", user_information[0].code_name);
    localStorage.setItem("posts", JSON.stringify(post));

    let imageContainer = "";
    let nameContainer = "";
    let idContainer = "";
    let container = "";

    user_information.forEach((data) => {
      imageContainer += `<div data-id="${data.image_path}"><img src="${
        itemsImageUrl + data.image_path
      }" class="block my-2 border border-dark border-2 rounded-circle" alt="image profile" style="border-radius: 50%; width: 125px; height: 125px"/></div>`;
      nameContainer += `<h1>${data.firstname}</h1>`;
      idContainer += `<p>${data.student_id_no}</p>`;

      // Check if the element exists before assigning text
      if (programContainer) programContainer.innerText = data.user_program;
      if (codenameContainer) codenameContainer.innerText = data.code_name;
    });

    announcements.forEach((data) => {
      document.getElementById("announcementTitle1").innerText =
        data.announcement_title;
      document.getElementById("announcementBody1").innerText =
        data.announcement;
    });

    if (searchTerm) {
      post = post.filter((p) =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    post.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    post.forEach((data) => {
      const imagepath = data.user_information.image_path;
      const codename = data.user_information.code_name;
      const imagepost = data.image_post;
      const postId = data.id;
      let postImage = "";
      if (imagepost) {
        postImage = `<img src="${
          postImageUrl + imagepost
        }" style="width: 400px; height: 200px"/>`;
      }
      let deleteButton = "";
      if (userId == data.user_information.id) {
        deleteButton = `<button data-id="${postId}" id="delete_btn" type="button" class="btn btn-outline-light">Delete</button>`;
      }

      container += `
        <div class="m-3 p-3" style="border-radius: 10px; background: rgba(0, 0, 0, 0.5);" data-id="${postId}">
          <div class="card d-flex align-items-center flex-row w-100" style="border-radius: 10px; background: rgba(255, 255, 255, 0.5);">
            <img src="${
              itemsImageUrl + imagepath
            }" class="block mx-2 my-2 border border-black border-2 rounded-circle me-2" style="border-radius: 50%; width: 50px; height: 50px" alt=""/>
            <h5 class="card-title px-1">${data.title}</h5>
            <div class="row"></div>
          </div>
          <div class="card-body">
            <p class="text-light card-text d-grid mt-3">
              <cite class="text-light card-subtitle mb-2">By: ${codename}</cite>
              ${data.body}
            </p>
            <div class="row d-flex justify-content-center">
              ${postImage}
            </div>
            <div class="mt-2">
              <button type="button" class="btn btn-outline-light" data-bs-toggle="modal" data-bs-target="#comments${postId}">Comment</button>
              ${deleteButton}
              <div class="modal fade" id="comments${postId}" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="commentLabel${postId}" aria-hidden="true">
                <div class="modal-dialog">
                  <div class="modal-content">
                    <div class="modal-header">
                      <h1 class="modal-title fs-5" id="commentLabel${postId}">Comments</h1>
                      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                      <div id="comments-container-${postId}"></div>
                    </div>
                    <div class="modal-footer">
                      <input type="text" id="comment-input-${postId}" class="w-100 p-3" placeholder="Write a comment..." style="height: 50px; border: 2px solid #ccc; border-radius: 10px;" />
                      <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Close</button>
                      <button type="button" class="btn btn-outline-secondary" id="add-comment-btn-${postId}">Add Comment</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    });

    document.getElementById("imageContainer").innerHTML = imageContainer;
    document.getElementById("nameContainer").innerHTML = nameContainer;
    document.getElementById("idContainer").innerHTML = idContainer;
    document.getElementById("container").innerHTML = container;

    attachEventListeners();
  } catch (error) {
    console.error("Error fetching data:", error);
    alert("Something went wrong. Please try again later.");
  }
}

document.getElementById("searchInput").addEventListener("input", function () {
  const searchTerm = this.value.trim();
  getDatas(searchTerm);
});

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

async function deletePost(event) {
  const isConfirmed = window.confirm("Are you sure you want to delete Post?");
  const postId = event.target.getAttribute("data-id");

  if (!isConfirmed) {
    return;
  }

  try {
    const { error } = await supabase.from("post").delete().eq("id", postId);
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

// Function to fetch comments
async function fetchComments(post_id, user_id) {
  if (!post_id || !user_id) {
    console.error("post_id or user_id is not defined");
    return;
  }

  const { data: comments, error } = await supabase
    .from("comments")
    .select("*, user_information(*)")
    .eq("post_id", post_id)
    .eq("user_id", user_id);

  if (error) {
    console.error(error);
    return;
  }

  const commentsContainer = document.getElementById(
    `comments-container-${post_id}`
  );
  commentsContainer.innerHTML = "";

  comments.forEach((comment) => {
    const userImage = itemsImageUrl + comment.user_information.image_path;
    const username = comment.user_information.code_name;

    const commentCard = document.createElement("div");
    commentCard.className = "card card-body";
    commentCard.innerHTML = `
      <p class="card-text">
        <img src="${userImage}" class="card-img-top" style="border-radius: 50%; width: 20px; height: 20px" alt=""/>
        <h6 class="card-subtitle text-body-secondary" style="overflow-y: auto">By ${username}</h6>
        ${comment.comment}
      </p>
    `;
    commentsContainer.appendChild(commentCard);
  });
}

// Function to add comment
async function addComment(post_id, user_id) {
  const commentInput = document.getElementById(`comment-input-${post_id}`);
  const commentText = commentInput.value;

  if (!commentText) return;

  const { error } = await supabase
    .from("comments")
    .insert([{ comment: commentText, post_id, user_id }]);

  if (error) {
    console.error(error);
    return;
  }

  // Fetch and display comments again
  fetchComments(post_id, user_id);
  commentInput.value = ""; // Clear input field
}

// Attach event listeners to dynamically added elements
function attachEventListeners() {
  document.querySelectorAll("[id^=comments]").forEach((modal) => {
    const postId = modal.id.replace("comments", "");
    modal.addEventListener("show.bs.modal", () => {
      fetchComments(postId, userId);
    });
  });

  document.querySelectorAll("[id^=add-comment-btn]").forEach((button) => {
    const postId = button.id.replace("add-comment-btn-", "");
    button.addEventListener("click", () => {
      addComment(postId, userId);
    });
  });
}

async function editProfile(event) {
  event.preventDefault(); // Prevent the form from submitting normally

  // Get the values from the input fields
  const codename = document.getElementById("codename").value;
  const firstname = document.getElementById("firstname").value;
  const lastname = document.getElementById("lastname").value;
  const studentIdNo = document.getElementById("student_id_no").value;
  const userProgram = document.getElementById("user_program").value;

  // Make an API call to update the user information
  try {
    const { data, error } = await supabase
      .from("user_information")
      .update({
        code_name: codename,
        firstname,
        lastname,
        student_id_no: studentIdNo,
        user_program: userProgram,
      })
      .eq("id", userId);

    if (error) {
      throw error;
    }

    // Update the UI to reflect the changes
    document.getElementById(
      "nameContainer"
    ).innerHTML = `<h1>${firstname} ${lastname}</h1>`;
    document.getElementById("idContainer").innerHTML = `<p>${studentIdNo}</p>`;

    // Close the modal
    const modal = document.getElementById("editProfile");
    const modalInstance = bootstrap.Modal.getInstance(modal);
    modalInstance.hide();

    alert("Profile updated successfully!");
  } catch (error) {
    console.error("Error updating user information:", error);
    alert("Failed to update profile. Please try again later.");
  }
}

async function saveImage(event) {
  event.preventDefault(); // Prevent the form from submitting normally

  // Get the file input element
  const imageUpload = document.getElementById("imageUpload");
  const file = imageUpload.files[0];

  if (!file) {
    alert("Please select an image file.");
    return;
  }

  // Read the file as a data URL
  const reader = new FileReader();
  reader.onload = async function (e) {
    const imageDataUrl = e.target.result;

    // Make an API call to update the user's profile picture
    try {
      // Upload the image to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("profilePicture")
        .upload("profilePicture/" + file.name, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data, error } = await supabase
        .from("user_information")
        .update({
          image_path: "profilePicture/" + file.name, // Use the original file name as the image path
          image_data: imageDataUrl.split(",")[1], // Use the base64 data after the comma
        })
        .eq("id", userId);

      if (error) {
        throw error;
      }

      // Update the UI to reflect the changes (you need to have an <img> tag with id="imageContainer")
      document.getElementById(
        "imageContainer"
      ).innerHTML = `<img src="${imageDataUrl}" class="img-fluid" alt="Profile Picture">`;

      // Close the modal
      const modal = document.getElementById("editPicture");
      const modalInstance = bootstrap.Modal.getInstance(modal);
      modalInstance.hide();

      alert("Profile picture updated successfully!");
    } catch (error) {
      console.error("Error updating profile picture:", error);
      alert("Failed to update profile picture. Please try again later.");
    }
  };
  reader.readAsDataURL(file);
}
