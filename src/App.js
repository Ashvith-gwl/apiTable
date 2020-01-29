import React, { Component } from "react";
import MaterialTable from "material-table";
import axios from 'axios'

class MaterialTableDemo extends Component {
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
              "locale" : this.state.newData.locale,
              "tenantId" : "pb",
              "messages" : [{
                "code" : this.state.newData.code,
                "message" : this.state.newData.message, 
                "module" : this.state.newData.module,
                "locale" : this.state.newData.locale
              }]
           }
            )
            .then(response => {
      console.log("response API",response)
              this.setState({
                message:''
              })              
            })
            .catch(err => console.log(err));
        }
        


    onUpdate = (id) => {
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
          "locale" : this.state.datas.locale,
          "module" : this.state.datas.module,
          "tenantId" : "pb",
          "messages" : [{
            "code" : this.state.datas.code,
            "message" : this.state.datas.message, 
            "module" : this.state.datas.module,
            "locale" : this.state.datas.locale
          }]
       }
        )
        .then(response => {
  console.log("response API",response)
          this.setState({
            message:''
          })
        })
        .catch(err => console.log(err));
    }


    onDelete = (id) => {
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
        "locale" : this.state.datas.locale,
        "tenantId" : "default",
        "messages" : [{
          "code" : this.state.newData.code,
          "message" : this.state.newData.message, 
          "module" : this.state.newData.module,
          "locale" : this.state.newData.locale
        }]
     }
        )
        .then(response => {
  console.log("response API",response)
          this.setState({
            message:''
          })
        })
        .catch(err => console.log(err));
    }


    render() {
      const {message=[]}=this.state;
      console.log("messages length:",this.state.message.length)
      console.log("state:",this.state)
      localStorage.setItem("auth","ccbedced-1822-4e20-bf62-54b1f86e1208");
    
      const columns = [
        { title: "Code", field: "code" },
        { title: "Message", field: "message" },
        { title: "Module", field: "module" },
        { title: "Locale", field: "locale"}

      ];

    return (
      <MaterialTable
        title="Crud Table"
        editable={{
          onRowAdd: newData =>
            new Promise(resolve => {
              setTimeout(() => {
                resolve();

                this.setState(prevState => {
                  const data = [...prevState.message];
                  console.log(newData , "newData","data:",data)
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
                  console.log(oldData,"oldData")
                  this.setState(prevState => {
                    const data = [...prevState.message];
                    const id=data.indexOf(oldData);
                    data[data.indexOf(oldData)] = newData;                   
                    return { ...prevState,data ,id:id,datas:newData};
                  });
                  console.log("data",newData)
                  this.onUpdate(this.state.id)
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
                this.onDelete(this.state.id)
              }, 600);
            })
        }}
        columns={columns}
        data={this.state.message}
      />
    );
  }
}

export default MaterialTableDemo;

