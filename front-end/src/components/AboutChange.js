import React, {Component} from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import * as API from '../api/API';
import './HomePage.css';
import {connect} from "react-redux";
import axios from 'axios';

var data;

class AboutChange extends Component {

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
      interest:'',
      message:''
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
                    firstname: json.firstname,
                    lastname:json.lastname,
                    work:json.work,
                    education:json.education,
                    hobbies:json.hobbies,
                    phone_no:json.phone_no,
                    le:json.le,
                    interest:json.interest
                  })
                  //this.props.storeToken(localStorage.getItem('jwtToken'));
                  //this.login();
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
              }
          });
      }
    }
  }

  updateInfo = () => {
    var status
    //console.log("here "+document.getElementById('fn').value);
    API.aboutChange({username:this.props.select.username,firstname:document.getElementById('fn').value,lastname:document.getElementById('ln').value,phone_no:document.getElementById('phone_no').value,education:document.getElementById('education').value,hobbies:document.getElementById('hobbies').value,work:document.getElementById('work').value,le:document.getElementById('le').value,interest:document.getElementById('interest').value})
    .then((res) => {
      status = res.status;
      try{
        return res.json();
      }
      catch(err){window.alert(`Some Error: ${err}`);}
    }).then((json) => {
      if (status === 201) {
          this.props.history.push('/about');
      } else {
          window.alert("Something went wrong while updating your Personal Information!!")
      }
    });
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
              First Name              : <input type='text' id='fn' placeholder={this.props.select.data[0]}/>
              <br/>
              Last Name               : <input type='text' id='ln' placeholder={this.props.select.data[1]}/>
              <br/>
              Work Information        : <input type='text' id='work' placeholder={this.props.select.data[2]}/>
              <br/>
              Education               : <input type='text' id='education' placeholder={this.props.select.data[3]}/>
              <br/>
              Phone Number            : <input type='text' id='phone_no' placeholder={this.props.select.data[5]}/>
              <br/>
              Hobbies                 : <input type='text' id='hobbies' placeholder={this.props.select.data[4]}/>
              <br/>
              Life Events             : <input type='text' id='le' placeholder={this.props.select.data[6]}/>
              <br/>
              Interest                : <input type='text' id='interest' placeholder={this.props.select.data[7]}/>
              </pre>
              <div className='row'>
                <button className='update-info' onClick={this.updateInfo}>Update Information</button>
                <button className='cancel-update-info' onClick={()=>{this.props.history.push('/about');}}>Cancel</button>
              </div>
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

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(AboutChange));
