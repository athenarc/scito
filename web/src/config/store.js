import {applyMiddleware, createStore} from "redux";
import rootReducer from "../redux";
import promiseMiddleware from "redux-promise-middleware";

export const store = createStore(rootReducer,applyMiddleware(promiseMiddleware));