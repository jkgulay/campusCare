import {
    supabase,
  } from "../main";

  const itemsImageUrl =
  "https://fprynlwueelbysitqaii.supabase.co/storage/v1/object/public/profilePicture/";
  const userId = localStorage.getItem("user_id");

  getDatas();

  async function getDatas(){

    let {data:post,error} = await supabase
    .from("post")
    .select("*,user_information(*)")
   /*  .eq("user_id",userId) */
    
    post.sort(() => Math.random() - 0.5);
    let container = "";

   post.forEach((data) => {

        const imagepath = data.user_information.image_path;
        const firstname = data.user_information.firstname;
        

      container += `  <div class="m-3 p-3 bg-white" style="border-radius: 10px; data-id="${data.id}">
      <div
        class="card d-flex align-items-center flex-row w-100 shadow"
       
      >
      <img
        src="${itemsImageUrl + imagepath}"
        class="block mx-2 my-2 border border-dark border-2 rounded-circle me-2"
        style="border-radius: 50%; width: 50px; height: 50px"
        alt=""
      />
        <h5 class="card-title px-1">${data.tittle}</h5>
        <div class="row"></div>
      </div>
      <div class="card-body">
        <p class="card-text d-grid  mt-3 ">
          <cite class="card-subtitle mb-2 text-body-secondary" >
           by: ${firstname}
          </cite>
          ${data.body}
        </p>
        <div class="row d-flex justify-content-center">
          <img
            src="assets/awdwa.jpg"
            style="width: 400px; height: 200px"
          />
        </div>
        <div class="mt-2">
          <!-- Button trigger modal -->
          <button type="button" class="btn btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#comment1">
            Comment
          </button>
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
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed
                      do eiusmod tempor incididunt ut labore et 
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
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed
                      do eiusmod tempor incididunt ut labore et
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
`
    })
    document.getElementById("container").innerHTML = container;
  }

async function addData() {
    const formData = new FormData(form_post);

    const {data,error} = await supabase
    .from ('post')
    .insert([
        {
            tittle: formData.get('tittle'),
            body: formData.get('body'),
        }
    ])
    .select();
    if (error) {
       alert("Something wrong happened. Cannot add item.");
        console.log(error);
      } else {
        alert("Item Successfully Added!");
        getDatas();
        window.location.reload();
      }
    
}



  document.body.addEventListener("click", function (event) {
    if (event.target.id === "post_btn") {
    addData(event);
    }
  });

  