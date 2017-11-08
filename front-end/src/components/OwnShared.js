import React, {Component} from 'react';
import {
  Link,
  withRouter
} from 'react-router-dom';
import * as API from '../api/API';
import axios from 'axios';
import FormData from 'form-data';
import './HomePage.css';
import Files from 'react-files';
import {connect} from 'react-redux';
import FileDownload from 'js-file-download';
import Modal from 'react-modal';

var fileShare;

const customStyles = {
  content : {
    top                   : '40%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
};

class OwnShared extends Component {
  constructor (props) {
    super(props)
    this.state = {
      files: [],
      //files1:[],
      message:'',
      childVisible:false,
      modalIsOpen1:false,
    }
    this.openModal1 = this.openModal1.bind(this);
    this.closeModal1 = this.closeModal1.bind(this);
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
        API.filesOwnGroup({username:this.props.select.username,folder:this.props.select.group_o})
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
                  this.props.ownfileChange(json.files);
              } else {
                  this.setState({
                    message: "Something went Wrong..!!"
              });
            }
        });
      }
    }
  }

  openModal1() {
    this.setState({modalIsOpen1: true});
  }

  closeModal1() {
    this.setState({modalIsOpen1: false});
  }

  onShare = (item) => {
      fileShare=item;
      this.openModal1();
  }

  onShareFile = () => {
      axios.get(`http://localhost:3001/users/shareO`,{params:{file:fileShare,username:this.props.select.username,folder:this.props.select.group_s.folders,member:[document.getElementById('s1').value,document.getElementById('s2').value,document.getElementById('s3').value,document.getElementById('s4').value,document.getElementById('s5').value,]}})
         .then((res) => {
           //console.log(res);
           console.log('shared..');
           window.alert(`${fileShare} shared succesfully!!`)
           this.closeModal1();
         }).catch((err) => {
           window.alert(`${fileShare} cannot be shared!! Please try again later..`)
           this.closeModal1();
      })
  }

  onDownload = (item) => {
      axios.get(`http://localhost:3001/users/downloadG`,{params:{file:item,username:this.props.select.username,folder:this.props.select.group_o}})
         .then((res) => {
           //console.log(res);
           console.log('downloaded..');
           FileDownload(res.data.data,item);
         }).catch((err) => {
           window.alert(`${item} cannot be downloaded!! Please try again later..`)
         })
    }

  onDelete = (item) => {
    if(window.confirm('Delete File?')){
      axios.get(`http://localhost:3001/users/deleteG`,{params:{file:item,username:this.props.select.username,folder:this.props.select.group_o}})
         .then((res) => {
           console.log('deleted..');
           window.alert(`Deleted '${item}' Successfully..!!`)
           this.props.ownfileChange(this.props.select.ofiles.filter((item1)=>{return item1!==item}));
           //this.props.history.push('/homepage');
           //this.props.history.push('/files');
         }).catch((err) => {
           window.alert(`${item} cannot be deleted!! Please try again later..`)
      })
    }
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
      axios.post(`http://localhost:3001/users/filesO`, formData, {params:{'username':`${this.props.select.username}`,folder:this.props.select.group_o}})
      .then(response => {
        window.alert(`${this.state.files.length} files uploaded succesfully!`);
        Object.keys(this.state.files).forEach((key) => {
          const file = this.state.files[key]
          var ft1=this.props.select.ofiles;
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
          this.props.ownfileChange(ft1);
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

  onBack = () => {
    this.props.changeGroup('');
    this.props.history.push('/group')
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
    var files1 = this.props.select.ofiles.map(function(item,index){
      return(
        <div key={index}>
          <button className="btn btn-primary" id='dwn' type="button" onClick = {() => this.onDownload(item)}>Download</button>
          <button className="btn btn-primary" id='shr' type="button" onClick = {() => this.onShare(item)}>Share</button>
          <button className="btn btn-primary" id='del' type="button" onClick = {() => this.onDelete(item)}>Delete</button>
          {item}
          <hr/>
        </div>
      );
    }.bind(this));

    var NoFiles;
    if(this.props.select.ofiles.length===0){NoFiles=true;}
    else {NoFiles=false;}

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
            <Modal
              isOpen={this.state.modalIsOpen1}
              onRequestClose={this.closeModal1}
              style={customStyles}
              contentLabel="Example Modal"
            >
              <h4>Enter Email Address of the Persons to</h4>
              <h4>&nbsp;&nbsp;&nbsp;&nbsp;Whom You Want to Share Your File:</h4>
              <input id="s1" placeholder="Email Address 1"/><br/>
              <input id="s2" placeholder="Email Address 2"/><br/>
              <input id="s3" placeholder="Email Address 3"/><br/>
              <input id="s4" placeholder="Email Address 4"/><br/>
              <input id="s5" placeholder="Email Address 5"/><br/><br/>
              <div className="form-group">
                <div className="col-md-12">
                  <div id='error1' className="c-card--error">{this.state.message}</div>
                </div>
              </div>
              <div>
                <button onClick={()=>{this.onShareFile()}} className="create-shared-folder-button">Share</button><br/><br/>
                <button className="close-shared-folder-button" onClick={this.closeModal1}>Close</button><br/>
              </div>
            </Modal>
            <div className="row">
              <div className="center-block">
              <br/><br/>
              </div>
            </div>
            <div className="row">
              <div className="center-block">
              <h1>Files of the Group "{this.props.select.group_o}"</h1>
              <button className="button-back" onClick={()=>{this.onBack()}}>Back</button>
              </div>
              <hr/>
            </div>
            <div className="row">
              <div className="center-block">
              <h6>You are viewing the files of "{this.props.select.group_o}" group.. (You have created this group!!)</h6>
              </div>
              <hr/>
            </div>
            <div className="row">
              <div className="center-block">
              <h4>Files:</h4>{NoFiles?<h6>No File</h6>:null}
              </div>
              <hr/>
            </div>
            <div className="row">
              <div className="center-block">
              {files1}
              </div>
            </div>
          </div>
          <div className="col-md-3 d3">
            <div className="row">
              <div className="center-block">
                <button onClick={() => this.onSignOut()} className="w3-button w3-xlarge w3-circle w3-teal b1">Sign Out</button>
              </div>
            </div>
            <button className='upload-button'>
              <Files
                ref='files'
                className='files-dropzone-list'
                onChange={this.onFilesChange}
                onError={this.onFilesError}
                multiple
                maxFiles={10}
                maxFileSize={10000000}
                minFileSize={0}
                clickable
              >
                Select File
              </Files>
            </button>
            {
              this.state.files.length > 0
              ?
              <div className='files-list'>
                <ul>{this.state.files.map((file) =>
                  <li className='files-list-item' key={file.id}>
                    <div className='files-list-item-content'>
                      <div className='files-list-item-content-item files-list-item-content-item-1'>
                        {file.name}
                      </div>
                    </div>
                  </li>
                )}</ul>
              </div>
              : null
            }
            <button className='upload-submit' onClick={this.onFilesUpload}>Upload</button>
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
    ownfileChange: (ofiles) => {
        dispatch({
        type: "CHANGEOWNFILE",
        payload : {ofiles:ofiles}
      });
    },
    changeGroup: (group) => {
        dispatch({
        type: "CHANGEGROUP",
        payload : {group:group}
      });
    },
    clear: () => {
        dispatch({
        type: "CLEAR",
      });
    },
  };
};

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(OwnShared));
