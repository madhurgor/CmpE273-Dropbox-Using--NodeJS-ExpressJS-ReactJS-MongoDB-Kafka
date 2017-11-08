import React, {Component} from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import * as API from '../api/API';
import './HomePage.css';
import {connect} from "react-redux";
import axios from 'axios';

var data=[];

class About extends Component {

  constructor (props) {
    super(props)
    this.state = {
      firstname: '',
      lastname:'',
      phone_no:'',
      hobbies:'',
      education:'',
      work:'',
      le:'',
      interest:''
    }
  }

  componentWillMount(){
    var token = localStorage.getItem('jwtToken');
    if(!token)
    {
      this.props.history.push('/');
    }
    else
    {
      var status;
      if(this.props.select.username!=="")
      {
        API.about(this.props.select.username)
            .then((res) => {
              status = res.status;
              try{
                return res.json();
              }
              catch(err){window.alert(`Some Error: ${err}`);}
            }).then((json) => {
              if (status === 201) {
                  this.setState({
                      isLoggedIn: true,
                      message: "Welcome to my App..!!"
                  });
                  //this.props.loginChange(json.firstname,json.lastname);
                  this.setState({
                    firstname:json.firstname,
                    lastname:json.lastname,
                    work:json.work,
                    education:json.education,
                    hobbies:json.hobbies,
                    phone_no:json.phone_no,
                    le:json.le,
                    interest:json.interest
                  })
                  data=[json.firstname,
                        json.lastname,
                        json.work,
                        json.education,
                        json.hobbies,
                        json.phone_no,
                        json.le,
                        json.interest];
              this.props.setInfo(data);
            } else {
                  this.setState({
                    message: "Something went Wrong..!!"
              });
                  //this.login1();
          }
        });
      }
    }
  }

  updateInfo = () => {
    this.props.history.push('/change_info');
  }

  onSignOut = () => {
   localStorage.removeItem('jwtToken');
   axios.post(`http://localhost:3001/users/logout`,{credentials:'include',params:{username:this.props.select.username}})
      .then((res) => {
        console.log('Signed Out Successfully..!!');
      }).catch((err) => {
        console.log('Some error in Sign Out..!!');
   })
   this.props.clear();
   window.location.replace('/');
  }

  render(){
    return(
      <div>
        <div className="container-fluid">
          <div className="col-md-2 d1">
            <div className="row">
              <div className="center-block">
                <img src="/logo_blue.jpg" height="50" width="50" className="img1" alt="logo_blue"/>
              </div>
              <hr/>
            </div>
            <div className="row">
              <div className="center-block">
                <Link to={`/homepage/`} className='l1'>Home</Link>
              </div>
              <hr/>
            </div>
            <div className="row">
              <div className="center-block">
                <Link to={`/files/`} className='l2'>Files</Link>
              </div>
              <hr/>
            </div>
            <div className="row">
              <div className="center-block">
                <Link to={`/group/`} className='l2'>Groups</Link>
              </div>
              <hr/>
            </div>
            <div className="row">
              <div className="center-block">
                <Link to={`/about/`} className='l2'>About</Link>
              </div>
              <hr/>
            </div>
            <div className="row">
              <div className="center-block">
              </div>
              <hr/>
            </div>
          </div>
          <div className="col-md-7 d2">
            <div className="row">
              <div className="center-block">
              <br/><br/>
              </div>
            </div>
            <div className="row">
              <div className="center-block">
              <h1>About</h1>
              </div>
              <hr/>
            </div>
            <div className="row about1">
              <div className="center-block">
              <pre>
              Email Address           : {this.props.select.username}
              <br/>
              First Name              : {this.props.select.data[0]}
              <br/>
              Last Name               : {this.props.select.data[1]}
              <br/>
              Work Information        : {this.props.select.data[2]}
              <br/>
              Education               : {this.props.select.data[3]}
              <br/>
              Phone Number            : {this.props.select.data[5]}
              <br/>
              Hobbies                 : {this.props.select.data[4]}
              <br/>
              Life Events             : {this.props.select.data[6]}
              <br/>
              Interest                : {this.props.select.data[7]}
              </pre>
              <button className='update-info' onClick={this.updateInfo}>Change Information</button>
              </div>
            </div>
          </div>
          <div className="col-md-3 d2">
            <div className="row">
              <div className="center-block">
                <button onClick={() => this.onSignOut()} className="w3-button w3-xlarge w3-circle w3-teal b1">Sign Out</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return{
    select: state.reducerUsers
  };
};

const mapDispatchToProps = (dispatch) => {
  return{
    setInfo: (data) => {
          dispatch({
        type: "SETINFO",
        payload :{data:data}
      });
    },
    clear: () => {
        dispatch({
        type: "CLEAR",
      });
    },
  };
};

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(About));
