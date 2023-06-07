const logStatus = false;

const handleLog = (state=logStatus, action) =>{
    
    switch(action.type){
        case "LOGGEDIN":
            // Check if product already in cart
            state=true;
            return state;
            break;
        case "LOGGEDOUT":
            state=false;
            return state;
            break;

        default:
            return state
            break;
    }
}

export default handleLog