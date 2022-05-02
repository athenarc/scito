import {ActionType} from "redux-promise-middleware";

export const PENDING = action => `${action}_${ActionType.Pending}`
export const FULFILLED = action => `${action}_${ActionType.Fulfilled}`
export const REJECTED = action => `${action}_${ActionType.Rejected}`