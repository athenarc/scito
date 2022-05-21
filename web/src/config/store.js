import {applyMiddleware, createStore} from "redux";
import rootReducer from "../redux";
import promiseMiddleware from "redux-promise-middleware";
import thunk from "redux-thunk";

export const store = createStore(rootReducer,applyMiddleware(thunk, promiseMiddleware));