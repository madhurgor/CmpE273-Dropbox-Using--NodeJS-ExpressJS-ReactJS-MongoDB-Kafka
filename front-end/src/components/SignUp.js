import React, {Component} from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import './Login.css';
import { Redirect } from 'react-router';
import * as API from '../api/API';

export class SignUp extends Component {

  state = {
      firstname: '',
      lastname: '',
      username: '',
      password: '',
      message: '',
      fireRedirect: false
  };

  handleSignUp = (e) => {
    e.preventDefault();
    if(this.state.password.length<6){
      this.setState({
          message: "Password should be of minimum 6 characters!!"
      });
      document.getElementById('error2').style.display="block";
    }else{
      API.doSignUp(this.state)
          .then((status) => {
              if (status === 201) {
                  this.setState({
                      message: "Successfully signed up..!!"
                  });
                  this.setState({ fireRedirect: true })
                  //this.props.router.push("/")
              } else if (status === 200) {
                  this.setState({
                      message: "You have signed up already..!!"
                  });
                  document.getElementById('error2').style.display="block";
                  //this.login1();
              } else {
                    this.setState({
                      message: "Something went wrong in sign up..!!"
                  });
                  //this.login1();
              }
          });
        }
  };

  render(){
    const { from } = this.props.location.state || '/'
    const { fireRedirect } = this.state
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
                        <div className="col-md-9"></div>or &nbsp; <Link to={`/`} className="link">Login</Link>
                    </div>
                    <form className="form-horizontal" onSubmit={this.handleSignUp}>
        							<div className="form-group">
        									<input type="text" className="form-control" name="inputFirstName"
        										id="inputFirstName" placeholder="First Name" required
                            value={this.state.firstname}
                            onChange={(event) => {
                                this.setState({
                                    firstname: event.target.value
                                });
                            }}/>
        							</div>

        							<div className="form-group">
        									<input type="text" className="form-control" name="inputLastName"
        										id="inputLastName" placeholder="Last Name" required
                            value={this.state.lastname}
                            onChange={(event) => {
                                this.setState({
                                    lastname: event.target.value
                                });
                            }}/>
        							</div>

        							<div className="form-group">
        									<input type='email' className="form-control" name="inputUsername"
        										id="inputUsername" placeholder="Email Id" required
                            value={this.state.username}
                            onChange={(event) => {
                                this.setState({
                                    username: event.target.value
                                });
                            }}
                            />
        							</div>

        							<div className="form-group">
        									<input type="password" className="form-control"
        										name="inputPassword" id="inputPassword" placeholder="Password" required
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
                            <div id='error2' className="c-card--error">{this.state.message}</div>
                        </div>
                      </div>

                      <div className="row">
                          <div className="col-sm-12">
                          <div className="col-md-0"></div>
                               <button type="submit" className="btn btn-primary">Create an Account</button>
                           </div>
                      </div>

                      <div className="form-group">
                        <div className="col-md-12">
                            <div className='alert1'>After Successfully Signing up, You will be Redirected to Login Page..!!</div>
                        </div>
                      </div>

        						</form>
                    {fireRedirect &&
                      (
                        <Redirect to={from || '/'}/>
                      )
                    }
                </div>
            </div>
            <div className="row justify-content-md-center">

            </div>
        </div>
      </div>
    );
    /*return(
      <div>
        <div className="container-fluid">
      		<div className="row">
      			<div
      				className="col-sm-offset-4 col-md-offset-4 col-lg-offset-4 col-sm-4 col-md-4 col-lg-4">
      				<div className="panel panel-primary">
      					<div className="panel-heading">Login</div>
      					<div className="panel-body">
      						<form className="form-horizontal" onSubmit={this.handleSignUp}>
      							<div className="form-group">
      								<label className="col-sm-4 col-md-4 col-lg-4">Enter First Name: </label>
      								<div className="col-sm-8 col-md-8 col-lg-8">
      									<input type="text" className="form-control" name="inputFirstName"
      										id="inputUsername" placeholder="First Name" required />
      								</div>
      							</div>

      							<div className="form-group">
      								<label className="col-sm-4 col-md-4 col-lg-4">Enter Last Name: </label>
      								<div className="col-sm-8 col-md-8 col-lg-8">
      									<input type="text" className="form-control" name="inputLastName"
      										id="inputUsername" placeholder="Last Name" required/>
      								</div>
      							</div>

      							<div className="form-group">
      								<label className="col-sm-4 col-md-4 col-lg-4">Enter your Email id*:</label>
      								<div className="col-sm-8 col-md-8 col-lg-8">
      									<input className="form-control" name="inputUsername"
      										id="inputUsername" placeholder="Email Id" required
                          value={this.state.username}
                          onChange={(event) => {
                              this.setState({
                                  username: event.target.value
                              });
                          }}
                          />
      								</div>
      							</div>

      							<div className="form-group">
      								<label className="col-sm-4 col-md-4 col-lg-4">Password:</label>
      								<div className="col-sm-8 col-md-8 col-lg-8">
      									<input type="password" className="form-control"
      										name="inputPassword" id="inputPassword" placeholder="Password" required
                          value={this.state.password}
                          onChange={(event) => {
                              this.setState({
                                  password: event.target.value
                              });
                          }}
                          />
      								</div>
      							</div>

      							<div className="form-group">
      								<label className="col-sm-4 col-md-4 col-lg-4">Confirm Password</label>
      								<div className="col-sm-8 col-md-8 col-lg-8">
      									<input type="password" className="form-control"
      										name="inputConfirmPassword" id="inputConfirmPassword" placeholder="Retype Password"/>
      								</div>
      							</div>

                    <div className="row">
                        <div className="col-sm-12">
                             <button type="submit" className="btn btn-primary">Sign Up</button>
                             <Link to={`/`} className="link">Login page</Link>
                         </div>
                    </div>

      							<div className="form-group">
      								<label className="alert alert-warning" role='alert'>All fields are mandatory here.</label>
                      <br/>
                      <label className="alert alert-warning" role='alert'>message: {this.state.message}</label>
      							</div>

      						</form>
                  {fireRedirect && (
                            <Redirect to={from || '/'}/>
                          )
                        }
      					</div>
      				</div>
      			</div>
      		</div>
      	</div>
      </div>
    )*/
  }
}

export default withRouter(SignUp)
