function setRouter(){
    const path = window.location.pathname;
    const isLoggedIn = localStorage.getItem("access_token") !== null;
    const userRole = localStorage.getItem("role");

    switch(path){
        case "/":
        case "/index.html":
        case "/login.html":
            if (isLoggedIn){
                window.location.pathname = "/home.html";
            }
            break;
        
        case "/home.html":
        case "/profile.html":
        case "/menu.html":
            if (!isLoggedIn){
                window.location.pathname = "/login.html";
            }
            break;

        default:
            break;
    }
}
export {setRouter};