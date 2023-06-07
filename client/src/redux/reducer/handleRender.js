const render = false;

const handleRender = (state=render, action) =>{
    
    switch(action.type){
        case "CARTDONE":
            // Check if product already in cart
            state=true;
            return state;
            break;

        default:
            return state
            break;
    }
}

export default handleRender