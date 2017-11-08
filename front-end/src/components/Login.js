import React, {Component} from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import './Login.css';
import * as API from '../api/API';
import {connect} from 'react-redux';

class Login extends Component {
    state = {
        username: '',
        password: '',
        //isLoggedIn: false,
        message: ''
    };

    login() {
      this.props.history.push("/homepage");
    }

    handleSubmit = (userdata) => {
      if(this.state.username==="" || this.state.password===""){
        this.setState({
            //isLoggedIn: false,
            message: "Please enter both username and password!!"
        });
        document.getElementById('error1').style.display="block";
      } else {
        var status;
        API.doLogin(userdata)
            .then((res) => {
              status = res.status;
              try{
                return res.json();
              }
              catch(err){console.log(err);}
            }).then((json) => {
              if (status === 201) {
                  /*this.setState({
                      isLoggedIn: true
                  });*/
                  const token = json.token;
                  localStorage.setItem('jwtToken',token);
                  //this.props.storeToken(localStorage.getItem('jwtToken'));
                  this.login();
              } else if (status === 401) {
                  this.setState({
                      //isLoggedIn: false,
                      message: "Wrong username or password. Try again..!!"
                  });
                  document.getElementById('error1').style.display="block";
                  //this.login1();
              } else {
                      this.setState({
                          //isLoggedIn: false,
                          message: "Something went Wrong..!!"
                        });
                  document.getElementById('error1').style.display="block";
                  //this.login1();
              }
          });
        }
      };

    render() {
        return (
          <div>
            <div className="container">
              <div className="row">
                <div className="center-block">
                  <img src="/dropbox_logo.jpg" height="50" width="300" className="center-block" alt="dropbox_logo"/>
                </div>
                <hr/>
              </div>
                <div className="row justify-content-md-right" >
                <div className="col-md-6">
                <br/>
                <div className="row">
                <br/>
                  <div className="span4"></div>
                  <div className="span4"><img src="/home-page-img.jpg" height="320" width="300" className="center-block" alt="home-page-img"/></div>
                  <div className="span4"></div>
                </div>
                </div>
                    <div className="col-md-4">
                    <br/><br/><br/>
                        <div className="form-group">
                            <h3>Sign in</h3>
                            <div className="col-md-6"></div>or &nbsp; <Link to={`/signup/`} className="link">Create an Account</Link>
                        </div>
                        <form>
                        <div className="form-group">
                            <input
                                className="form-control"
                                type="text"
                                label="Username"
                                placeholder="Enter Username"
                                value={this.state.username}
                                onChange={(event) => {
                                    this.props.changeUsername(event.target.value)
                                    this.setState({
                                      username: event.target.value
                                    });
                                }}
                            />
                        </div>
                        <div className="form-group">
                          <input
                              className="form-control"
                              type="password"
                              label="password"
                              placeholder="Enter Password"
                              value={this.state.password}
                              onChange={(event) => {
                                  this.setState({
                                      password: event.target.value
                                  });
                              }}
                          />
                        </div>
                        <div className="form-group">
                          <div className="col-md-12">
                            <div id='error1' className="c-card--error">{this.state.message}</div>
                          </div>
                        </div>
                        <div className="form-group">
                          <div className="col-md-0"></div>
                            <button id='button1'
                                className="btn btn-primary"
                                type="button"
                                onClick={() => this.handleSubmit(this.state)}>
                                Sign in
                            </button>
                        </div>
                        </form>
                    </div>
                </div>
                <div className="row justify-content-md-center">

                </div>
            </div>
          </div>

        );
    }
}

const mapStateToProps = (state) => {
  return{
    select1: state.reducerUsers
  };
};

const mapDispatchToProps = (dispatch) => {
  return{
    changeUsername: (username) => {
        dispatch({
        type: "CHANGEUSERNAME",
        payload : {username:username}
      });
    },
  };
};

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(Login));
