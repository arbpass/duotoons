import handleCart from './handleCart'
import handleLog from './handleLog'
import handleRender from './handleRender'
import { combineReducers } from "redux";
const rootReducers = combineReducers({
    handleCart,
    handleLog,
    handleRender
})
export default rootReducers