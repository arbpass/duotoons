// For Add Item to Cart
export const addCart = (product) =>{
    return {
        type:"ADDITEM",
        payload:product
    }
}

// For Delete Item to Cart
export const delCart = (product) =>{
    return {
        type:"DELITEM",
        payload:product
    }
}

// For Reset Items to Cart
export const newCart = (product) =>{
    return {
        type:"NEWCART",
        payload:product
    }
}

//Cart reset only once
export const cartDone = (num) => {
    return {
        type: 'CARTDONE',
    }
}

export const loggedIn = (num) => {
    return {
        type: 'LOGGEDIN',
    }
}

export const loggedOut = (num) => {
    return {
        type: 'LOGGEDOUT',
    }
}