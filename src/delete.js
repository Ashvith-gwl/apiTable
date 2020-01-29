import React, { Component } from "react";
import MaterialTable from "material-table";
import axios from 'axios'

class ApiTable extends Component {
  state = {
    datas:{},
    id:0,
    newData:{},
    message:[]
  }

    componentDidMount() {
      const { saveData } = this;
      axios
      .post(`${document.location.origin}/localization/messages/v1/_search?module=rainmaker-pgr,rainmaker-pt,rainmaker-tl,finance-erp,rainmaker-common,rainmaker-hr,rainmaker-uc,rainmaker-noc,rainmaker-abg&locale=en_IN&tenantId=pb`).then(response => {
        saveData(response.data.messages);
      })
      .catch(err => console.log(err));
    }
    
    
    saveData = data => {     
    this.setState({ ...this.state,message: data })
    };

    onCreate = () => {
      const {newData}=this.state;
      axios
        .post(`${document.location.origin}/localization/messages/v1/_create`, 
            {
                "RequestInfo": {
                  "apiId" : "emp",
                  "ver" : "1.0",
                  "ts" : "10-03-2017 00:00:00",
                  "action" : "create",
                  "did" : "1",
                  "key" : "abcdkey",
                  "msgId" : "20170310130900",
                  "requesterId" : "rajesh",
                  "authToken" :  localStorage.getItem('auth'),
                  "userInfo" : {
                    "id" :128
                  }
              },            
              "tenantId" : "pb",
              "messages" : [{
                "code" : newData.code,
                "message" : newData.message, 
                "module" : newData.module,
                "locale" : newData.locale,
               
              }]
           }
            )
            .then(response => {   
              this.setState({
                message:''
              })
              alert('Success')
            })
            .catch(err => console.log(err));
        }
        


    

    onUpdate = (id) => {
      const {datas}=this.state;
      axios
        .post(`${document.location.origin}/localization/messages/v1/_update`, 
          {
            "RequestInfo": {
              "apiId" : "emp",
              "ver" : "1.0",
              "ts" : "10-03-2017 00:00:00",
              "action" : "create",
              "did" : "1",
              "key" : "abcdkey",
              "msgId" : "20170310130900",
              "requesterId" : "rajesh",
              "authToken" :  localStorage.getItem('auth'),
              "userInfo" : {
                "id" :128
              }
          },
          "locale" : datas.locale,
          "module" : datas.module,
          "tenantId" : "pb",
          "messages" : [{
            "code" : datas.code,
            "message" : datas.message, 
            "module" : datas.module,
            "locale" : datas.locale
          }]
       }
        )
        .then(response => {  
          this.setState({
            message:''
          })
          alert('Success')
        })
        .catch(err => console.log(err));
    }


    onDelete = (id) => {
      const {newData}=this.state;
      axios
        .post(`${document.location.origin}/localization/messages/v1/_delete`, 
        {
          "requestInfo": {
            "apiId" : "emp",
            "ver" : "1.0",
            "ts" : "10-03-2017 00:00:00",
            "action" : "create",
            "did" : "1",
            "key" : "abcdkey",
            "msgId" : "20170310130900",
            "requesterId" : "rajesh",
            "authToken" :  localStorage.getItem('auth'),
            "userInfo" : {
              "id" : 1
            }
        },
        "locale" : newData.locale,
        "tenantId" : "default",
        "messages" : [{
          "code" : newData.code,
          "message" : newData.message, 
          "module" : newData.module,
          "locale" : newData.locale
        }]
     }
        )
        .then(response => {
          this.setState({
            message:''
          })
          alert('Success')
        })
        .catch(err => console.log(err));
    }
    render() {
      const {message=[],id}=this.state;     
      localStorage.setItem("auth","ccbedced-1822-4e20-bf62-54b1f86e1208");
      const columns = [
        { title: "Code", field: "code" },
        { title: "Message", field: "message" },
        { title: "Module", field: "module" },
        { title: "Locale", field: "locale"}

      ];

    return (
      <MaterialTable
        title="Api CRUD Table"
        editable={{
          onRowAdd: newData =>
            new Promise(resolve => {
              setTimeout(() => {
                resolve();
                this.setState(prevState => {
                  const data = [...prevState.message];                  
                  return { ...prevState, data,newData:newData};
                });
                this.onCreate();
              }, 600);
            }),
          onRowUpdate: (newData, oldData) =>
            new Promise(resolve => {        
              setTimeout(() => {
                resolve();
                if (oldData) {                                    
                  this.setState(prevState => {
                    const data = [...prevState.message];
                    const id=data.indexOf(oldData);
                    data[data.indexOf(oldData)] = newData;                   
                    return { ...prevState,data ,id:id,datas:newData};
                  });                  
                  this.onUpdate(id)
                }
               
              }, 600);
            }),
          onRowDelete: oldData =>
            new Promise(resolve => {
              setTimeout(() => {
                resolve();
                this.setState(prevState => {
                  const data = [...prevState.message];
                  const id=data.indexOf(oldData);
                  return { ...prevState, data,newData:oldData, id:id };
                });
                this.onDelete(id)
              }, 600);
            })
        }}
        columns={columns}
        data={message}
      />
    );
  }
}

export default ApiTable;

