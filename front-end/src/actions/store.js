import {createStore, compose, combineReducers} from "redux";
import reducerUsers from '../reducers/reducer-users';
import {persistStore, autoRehydrate} from 'redux-persist';

let store = compose(autoRehydrate())(createStore)(combineReducers({reducerUsers}));
persistStore(store);

export default store;
