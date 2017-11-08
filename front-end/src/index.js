import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter,Route} from 'react-router-dom';
import Login from './components/Login';
import HomePage from './components/HomePage';
import SignUp from './components/SignUp';
import About from './components/About';
import AboutChange from './components/AboutChange';
import Files1 from './components/Files1';
import Groups from './components/Groups';
import OwnShared from './components/OwnShared';
import OtherShared from './components/OtherShared';
import {Provider} from "react-redux";
import store from "./actions/store";

class App extends React.Component {
    render() {
        return (
            <div className="App">
                <BrowserRouter>
                  <div>
                    <Route exact path="/" component={Login}/>
                    <Route exact path="/homepage" component={HomePage}/>
                    <Route exact path="/signup" component={SignUp}/>
                    <Route exact path="/about" component={About}/>
                    <Route exact path="/change_info" component={AboutChange}/>
                    <Route exact path="/files" component={Files1}/>
                    <Route exact path="/group" component={Groups}/>
                    <Route exact path="/group_shared" component={OwnShared}/>
                    <Route exact path="/other_shared" component={OtherShared}/>
                  </div>
                </BrowserRouter>
            </div>
        );
    }
}

ReactDOM.render(<Provider store={store}><App/></Provider>, document.getElementById('app'));
