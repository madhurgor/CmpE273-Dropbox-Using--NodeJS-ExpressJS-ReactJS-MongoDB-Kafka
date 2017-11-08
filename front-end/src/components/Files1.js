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

class Files1 extends Component {
  constructor (props) {
    super(props)
    this.state = {
      files: [],
      //files1:[],
      message:'',
      childVisible:false,
      modalIsOpen:false,
      modalIsOpen1:false
    }
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);

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
        API.files({username:this.props.select.username,path:this.props.select.path})
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
                  this.props.folderChange(json.folders);
                  this.props.fileChange(json.files);
              } else {
                  this.setState({
                    message: "Something went Wrong..!!"
              });
            }
        });
      }
    }
  }

  openModal() {
    this.setState({modalIsOpen: true});
  }

  closeModal() {
    this.setState({modalIsOpen: false});
  }

  openModal1() {
    this.setState({modalIsOpen1: true});
  }

  closeModal1() {
    this.setState({modalIsOpen1: false});
  }

  onDownload = (item) => {
      axios.get(`http://localhost:3001/users/download`,{params:{file:item,username:this.props.select.username,path:this.props.select.path}})
         .then((res) => {
           console.log(res);
           console.log('downloaded..');
           FileDownload(res.data.data,item);
         }).catch((err) => {
           window.alert(`${item} cannot be downloaded!! Please try again later..`)
      })
  }

  onShare = (item) => {
      fileShare=item;
      this.openModal1();
  }

  onShareFile = () => {
      axios.get(`http://localhost:3001/users/share`,{params:{file:fileShare,username:this.props.select.username,path:this.props.select.path,member:[document.getElementById('s1').value,document.getElementById('s2').value,document.getElementById('s3').value,document.getElementById('s4').value,document.getElementById('s5').value,]}})
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

  onDelete = (item) => {
    if(window.confirm('Delete File?')){
      axios.get(`http://localhost:3001/users/delete`,{params:{file:item,username:this.props.select.username,path:this.props.select.path}})
         .then((res) => {
           console.log('deleted..');
           window.alert(`Deleted '${item}' Successfully..!!`)
           this.props.fileChange(this.props.select.file.filter((item1)=>{return item1!==item}));
           //this.props.history.push('/homepage');
           //this.props.history.push('/files');
         }).catch((err) => {
           window.alert(`${item} cannot be deleted!! Please try again later..`)
      })
    }
  }

  onStar = (item) => {
      axios.get(`http://localhost:3001/users/star`,{params:{file:item,username:this.props.select.username,path:this.props.select.path}})
         .then((res) => {
           console.log('starred..');
           window.alert(`${item} Starred Successfully..!!`)
           this.props.history.push('/homepage');
         }).catch((err) => {
           window.alert(`${item} cannot be starred!! Please try again later..`)
         })
  }

  onOpen = (item) => {
    this.props.changePath(this.props.select.path+`/${item}`)
    setTimeout(() => {
      axios.get(`http://localhost:3001/users/open_folder`,{params:{path:this.props.select.path,username:this.props.select.username}})
         .then((res) => {
           //console.log(res);
           this.props.fileChange(res.data.files);
           this.props.folderChange(res.data.folders);
         }).catch((err) => {
           window.alert(`${item} folder cannot be opened!! Please try again later..`)
         })
       },10)
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
      axios.post(`http://localhost:3001/users/filesF`, formData, {params:{'username':`${this.props.select.username}`,path:this.props.select.path}})
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

  onFolderCreate = () => {
    if(document.getElementById('foldername1').value !==''){
      axios.get(`http://localhost:3001/users/createfolder`,{params:{path:this.props.select.path,username:this.props.select.username,foldername:document.getElementById('foldername1').value}})
         .then((res) => {
           console.log('Folder created!!');
           var ft1=this.props.select.folder;
           //ft1.push(document.getElementById('foldername1').value);
           if(!ft1.includes(document.getElementById('foldername1').value)){
             ft1.push(document.getElementById('foldername1').value);
           } else {
             var n1=1;
             while(true){
               var oname=document.getElementById('foldername1').value;
               oname=oname+' ('+n1+')';
               if(!ft1.includes(oname)){
                 ft1.push(oname);
                 break;
               }else{
                 n1+=1;
               }
             }
           }
           this.props.folderChange(ft1);
           document.getElementById('foldername1').value="";
         }).catch((err) => {
           console.log('Some error in folder creation..!! And error is: '+err);
           window.alert(`Some error in Folder Creation!! Please try again later..`)
           document.getElementById('foldername1').value="";
      })
    }else{
      window.alert(`Please Enter Name of the Folder in the TextBox and then Click on "Create" Button!!`)
    }
  }

  onBack = () => {
    if(this.props.select.path!=='/'){
      this.props.changePath(this.props.select.path.substring(0,this.props.select.path.lastIndexOf("/")))
      setTimeout(() => {
        axios.get(`http://localhost:3001/users/open_folder`,{params:{path:this.props.select.path,username:this.props.select.username}})
           .then((res) => {
             //console.log(res);
             this.props.fileChange(res.data.files);
             this.props.folderChange(res.data.folders);
           }).catch((err) => {
             window.alert(`Cannot goback from here!! Please try again later..`)
           })
         },10)
     }else{
       window.alert(`You are in the root folder!! Cannot goback from here..`)
     }
  }

  onFolderDelete = (item) => {
    if(window.confirm('Delete Folder?')){
      axios.get(`http://localhost:3001/users/delete_folder`,{params:{folder:item,path:this.props.select.path,username:this.props.select.username}})
         .then((res) => {
           //console.log(res);
           this.props.folderChange(this.props.select.folder.filter((item1)=>{return item1!==item}));
           window.alert(`Folder ${item} deleted succesfully!!`)
         }).catch((err) => {
           window.alert(`Cannot delete '${item}' folder!! Please try again later..`)
      })
    }
  }

  onGroupCreate = () => {
    if(document.getElementById('grp').value!==''){
      if(document.getElementById('m1').value!=='' || document.getElementById('m2').value!=='' || document.getElementById('m3').value!=='' || document.getElementById('m4').value!=='' || document.getElementById('m5').value!==''){
        if(!(this.props.select.username===document.getElementById('m1').value || this.props.select.username===document.getElementById('m2').value || this.props.select.username===document.getElementById('m3').value || this.props.select.username===document.getElementById('m4').value || this.props.select.username===document.getElementById('m5').value)){
          axios.get(`http://localhost:3001/users/group_create`,{params:{grp_name:document.getElementById('grp').value,group:[document.getElementById('m1').value,document.getElementById('m2').value,document.getElementById('m3').value,document.getElementById('m4').value,document.getElementById('m5').value],username:this.props.select.username}})
             .then((res) => {
               console.log(res);
               if(res.status===201){
                 if(res.data.notMember.length===0){
                   window.alert(`Group created succesfully!!`)
                   this.closeModal();
                 }else{
                   /*this.setState({
                       message: `${res.data.notMember} is/are not of member Dropbox!! Folder can be shared between Dropbox members..`;
                   });
                   document.getElementById('error1').style.display="block";*/
                   window.alert(`${res.data.notMember} is/are not member of Dropbox!! Folder can only be shared between Dropbox members..`)
                 }
               }else{
                 window.alert(`You have already created "${document.getElementById('grp').value}" Group!! Please create group with another name..`)
               }
             }).catch((err) => {
               window.alert(`Cannot create group!! Please try again later..`)
               this.closeModal();
          })
        }else{
          this.setState({
              message: `You will be automatically member of "${document.getElementById('grp').value}" group!! No need to add your name in Textbox..`
          });
          document.getElementById('error1').style.display="block";
        }
      }else{
        this.setState({
            message: `Please add atleast one member in "${document.getElementById('grp').value}" group!!`
        });
        document.getElementById('error1').style.display="block";
      }
    }
    else{
      this.setState({
          message: "Please enter name of the Group!!"
      });
      document.getElementById('error1').style.display="block";
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
    var files1 = this.props.select.file.map(function(item,index){
      return(
        <div key={index}>
          <button className="btn btn-primary" id='dwn' type="button" onClick = {() => this.onDownload(item)}>Download</button>
          <button className="btn btn-primary" id='shr' type="button" onClick = {() => this.onShare(item)}>Share</button>
          <button className="btn btn-primary" id='del' type="button" onClick = {() => this.onDelete(item)}>Delete</button>
          <button className="btn btn-primary" id='str' type="button" onClick = {() => this.onStar(item)}>Star</button>
          {item}
          <hr/>
        </div>
      );
    }.bind(this));

    var folders1 = this.props.select.folder.map(function(item,index){
      return(
        <div key={index}>
          <button className="btn btn-primary" type="button" onClick={() => {this.onOpen(item);}}>Open</button>
          <button className="btn btn-primary" type="button" onClick={() => {this.onFolderDelete(item);}}>Delete</button>
          {item}
          <hr/>
        </div>
      );
    }.bind(this));

    var NoFiles;
    if(this.props.select.file.length===0){NoFiles=true;}
    else {NoFiles=false;}

    var NoFolders;
    if(this.props.select.folder.length===0){NoFolders=true;}
    else {NoFolders=false;}

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
              isOpen={this.state.modalIsOpen}
              onRequestClose={this.closeModal}
              style={customStyles}
              contentLabel="Example Modal"
            >
              <h4>Name of Group:</h4>
              <input id='grp' placeholder="Name of the Group"/><br/>
              <h4>Member of the Group:</h4>
              <input id="m1" placeholder="Member1"/><br/>
              <input id="m2" placeholder="Member2"/><br/>
              <input id="m3" placeholder="Member3"/><br/>
              <input id="m4" placeholder="Member4"/><br/>
              <input id="m5" placeholder="Member5"/><br/><br/>
              <div className="form-group">
                <div className="col-md-12">
                  <div id='error1' className="c-card--error">{this.state.message}</div>
                </div>
              </div>
              <div>
                <button onClick={()=>{this.onGroupCreate()}} className="create-shared-folder-button">Create Group</button><br/><br/>
                <button className="close-shared-folder-button" onClick={this.closeModal}>Close</button><br/>
              </div>
            </Modal>
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
              <h1>Dropbox</h1>
              </div>
              <hr/>
            </div>
            <div className="row">
              <div className="center-block">
              <h4 className="header-folder">Folders:</h4>
              <button className="button-back" onClick={()=>{this.onBack()}}>Back</button>
              <h6>{this.props.select.path}</h6>{NoFolders?<h6>No Folder in this Directory</h6>:null}
              </div>
              <hr/>
            </div>
            <div className="row">
              <div className="center-block">
              {folders1}
              </div>
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
            <div className="row">
              <div className="center-block">
                <br/>
                <button className='shared-folder-button' onClick={()=>{this.openModal()}}>New Shared Folder</button>
              </div>
            </div>
            <div className="row">
              <div className="center-block">
                <br/>
                <button className='folder-button' onClick={()=>{this.setState({childVisible:!this.state.childVisible})}}>New Folder</button>
              </div>
            </div>
            {
              this.state.childVisible
              ?
              <div className="row">
                <div className="center-block">
                  <br/>
                  <input type='text' id='foldername1' className="folder-name-text" placeholder="New Folder's Name"/>
                  <button className='folder-button' onClick={this.onFolderCreate}>Create</button>
                </div>
              </div>
              :
              null
            }
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
    fileChange: (file) => {
        dispatch({
        type: "CHANGEFILE",
        payload : {file:file}
      });
    },
    folderChange: (folder) => {
        dispatch({
        type: "CHANGEFOLDER",
        payload : {folder:folder}
      });
    },
    changePath: (path) => {
        dispatch({
        type: "CHANGEPATH",
        payload : {path:path}
      });
    },
    clear: () => {
        dispatch({
        type: "CLEAR",
      });
    },
  };
};

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(Files1));
