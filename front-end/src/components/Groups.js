import React, {Component} from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import * as API from '../api/API';
import axios from 'axios';
import FormData from 'form-data';
import './HomePage.css';
import {connect} from 'react-redux';

class Groups extends Component {
  constructor (props) {
    super(props)
    this.state = {
      files: [],
      //files1:[],
      message:'',
      childVisible:false,
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
        API.groups({username:this.props.select.username})
            .then((res) => {
              status = res.status;
              try{
                return res.json();
              }
              catch(err){window.alert(`Some Error: ${err}`);}
            }).then((json) => {
              if (status === 201) {
                  //this.setState({
                  //  files1:json.files
                  //});
                  this.props.ownFolderChange(json.ownfolders);
              } else {
                  this.setState({
                    message: "Something went Wrong..!!"
              });
            }
        });
        API.groups_s({username:this.props.select.username})
            .then((res) => {
              status = res.status;
              try{
                return res.json();
              }
              catch(err){window.alert(`Some Error: ${err}`);}
            }).then((json) => {
              if (status === 201) {
                  //this.setState({
                  //  files1:json.files
                  //});
                  this.props.groupFolderChange(json.groupfolders);
              } else {
                  this.setState({
                    message: "Something went Wrong..!!"
              });
            }
        });
      }
    }
  }

  onOwnDelete = (item) => {
    if(window.confirm('Delete Shared Folder?')){
      axios.get(`http://localhost:3001/users/delete_own`,{params:{ownfolder:item,username:this.props.select.username,}})
         .then((res) => {
           console.log('deleted..');
           window.alert(`Deleted '${item}' Successfully..!!`)
           this.props.ownFolderChange(this.props.select.ownfolders.filter((item1)=>{return item1!==item}));
           //this.props.history.push('/homepage');
           //this.props.history.push('/files');
         }).catch((err) => {
           window.alert(`${item} cannot be deleted!! Please try again later..`)
      })
    }
  }

  onOwnOpen = (item) => {
    this.props.changeGroup(item);
    this.props.history.push('/group_shared');
  }

  onSharedOpen = (item) => {
    this.props.changeShared(item);
    this.props.history.push('/other_shared');
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

  onFilesChange = (files) => {
    this.setState({
      files
    }, () => {
    })
  }

  onFilesError = (error, file) => {
    console.log('error code ' + error.code + ': ' + error.message)
  }

  onFilesUpload = () => {
    if(this.state.files.length>0){
      var formData = new FormData()
      Object.keys(this.state.files).forEach((key) => {
        const file = this.state.files[key]
        formData.append(key, file, file.name || 'file')
        //formData.append(key, new Blob([file], { type: file.type }), file.name || 'file')
      })
      axios.post(`http://localhost:3001/users/filesF`, formData, {params:{'username':`${this.props.select.username}`,}})
      .then(response => {
        window.alert(`${this.state.files.length} files uploaded succesfully!`);
        Object.keys(this.state.files).forEach((key) => {
          const file = this.state.files[key]
          var ft1=this.props.select.file;
          if(!ft1.includes(file.name)){
            ft1.push(file.name);
          } else {
            var n1=1;
            while(true){
              var ext,name,oname=file.name,n;
              n=oname.lastIndexOf(".");
              ext=oname.substring(n);
              name=oname.substring(0,n);
              oname=name+' ('+n1+')'+ext;
              if(!ft1.includes(oname)){
                ft1.push(oname);
                break;
              }else{
                n1+=1;
              }
            }
          }
          this.props.fileChange(ft1);
        })
        this.refs.files.removeFiles();
        //this.props.history.push('/homepage');
        //this.props.history.push('/files');
      })
      .catch(err => {
        window.alert('Error uploading files :(');
        this.refs.files.removeFiles();
      })
    }else{
      window.alert(`Please select file first by clicking on "Select File" button!!`);
    }
  }

  render(){
    /*var status;
    API.files(this.props.select.username)
        .then((res) => {
          status = res.status;
          return res.json();
        }).then((json) => {
          if (status === 201) {
              this.setState({
              files1:json.files
              });
          } else {
              this.setState({
              message: "Something went Wrong..!!"
              });
          }
        });*/
    //var files1 = this.props.select.file.map(function(item,index){
    var ownfolders = this.props.select.ownfolders.map(function(item,index){
      return(
        <div key={index}>
          <button className="btn btn-primary" id='dwn' type="button" onClick = {() => this.onOwnOpen(item)}>Open</button>
          <button className="btn btn-primary" id='del' type="button" onClick = {() => this.onOwnDelete(item)}>Delete</button>
          {item}
          <hr/>
        </div>
      );
    }.bind(this));

    var groupfolders = this.props.select.groupfolders.map(function(item,index){
      return(
        <div key={index}>
          <button className="btn btn-primary" type="button" onClick={() => {this.onSharedOpen(item);}}>Open</button>
          {item.folders}
          <label style={{float: 'right'}}>created by {item.creator}</label>
          <hr/>
        </div>
      );
    }.bind(this));

    var NoOwnFolders;
    if(this.props.select.ownfolders.length===0){NoOwnFolders=true;}
    else {NoOwnFolders=false;}

    var NoGroupFolders;
    if(this.props.select.groupfolders.length===0){NoGroupFolders=true;}
    else {NoGroupFolders=false;}

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
              <h1>Groups</h1>
              </div>
              <hr/>
            </div>
            <div className="row">
              <div className="center-block">
              <h4>Created by you:</h4>
              {NoOwnFolders?<h6>You have not created any shared folder!!</h6>:null}
              </div>
              <hr/>
            </div>
            <div className="row">
              <div className="center-block">
              {ownfolders}
              </div>
            </div>
            <div className="row">
              <div className="center-block">
              <h4>Created by Others:</h4>{NoGroupFolders?<h6>No one has created shared folder with you!!</h6>:null}
              </div>
              <hr/>
            </div>
            <div className="row">
              <div className="center-block">
              {groupfolders}
              </div>
            </div>
          </div>
          <div className="col-md-3 d3">
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
    groupFolderChange: (groupfolders) => {
        dispatch({
        type: "CHANGEGROUPFOLDER",
        payload : {groupfolders:groupfolders}
      });
    },
    ownFolderChange: (ownfolders) => {
        dispatch({
        type: "CHANGEOWNFOLDER",
        payload : {ownfolders:ownfolders}
      });
    },
    changeGroup: (group) => {
        dispatch({
        type: "CHANGEGROUP",
        payload : {group:group}
      });
    },
    changeShared: (sgroup) => {
        dispatch({
        type: "CHANGESHAREDGROUP",
        payload : {sgroup:sgroup}
      });
    },
    clear: () => {
        dispatch({
        type: "CLEAR",
      });
    },
  };
};

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(Groups));
