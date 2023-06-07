const cart = []
const token = localStorage.getItem('_token');

const handleCart = (state = cart, action) => {
    const product = action.payload
    switch (action.type) {
        case "ADDITEM":
            const response = fetch("http://localhost:4000/addToCart", {
                method: 'POST',
                headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', 'x-access-token': token },
                body: JSON.stringify({ product: product._id })
            });

            // Check if product already in cart
            const exist = state.find((x) => x._id === product._id)
            if (exist) {
                // Increase the quantity
                return state.map((x) => x._id === product._id ? { ...x, qty: x.qty + 1 } : x)
            }
            else {
                return [...state, { ...product, qty: 1 }]
            }
            break;

        case "DELITEM":
            const response2 = fetch("removeFromCart", {
                method: 'POST',
                headers: { 'Accept': 'application/json', 'Content-Type': 'application/json', 'x-access-token': token },
                body: JSON.stringify({ product: product._id })
            });
            
            const exist2 = state.find((x) => x._id === product._id)
            if (exist2.qty === 1) {
                return state.filter((x) => x._id !== exist2._id)
            }
            else {
                return state.map((x) => x._id === product._id ? { ...x, qty: x.qty - 1 } : x)
            }
            break;

        case "NEWCART":
            // Check if product already in cart
            const exist3 = state.find((x) => x._id === product._id)
            if (exist3) {
                // Increase the quantity
                return state.map((x) => x._id === product._id ? { ...x, qty: x.qty + 1 } : x)
            }
            else {
                return [...state, { ...product, qty: 1 }]
            }
            break;
            

        default:
            return state
            break;
    }
}

export default handleCart