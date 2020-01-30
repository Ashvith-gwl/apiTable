import React, { Component } from "react";
import MaterialTable from "material-table";
import axios from 'axios'
import { Grid, Paper, InputLabel, MenuItem, FormControl, Select } from '@material-ui/core';


class ApiTable extends React.PureComponent {
  state = {
    datas: {},
    id: 0,
    newData: {},
    data: [],
    selectedState:'pb'
  }

  componentDidMount() {
    const { saveData } = this;
    axios
      .post(`${document.location.origin}/localization/messages/v1/_search?module=rainmaker-pgr,rainmaker-pt,rainmaker-tl,finance-erp,rainmaker-common,rainmaker-hr,rainmaker-uc,rainmaker-noc,rainmaker-abg,rainmaker-test&locale=en_IN&tenantId=${this.state.selectedState}`).then(response => {
        console.log(response);

        // saveData(response.data.messages);
        this.setState({ ...this.state, data: response.data.messages })
      })
      .catch(err => console.log(err));
  }

  // saveData = data => {
  //   this.setState({ ...this.state, data: data })
  // };

  onCreate = () => {
    const { newData } = this.state;
    axios
      .post(`${document.location.origin}/localization/messages/v1/_create`,
        {
          "RequestInfo": {
            "apiId": "emp",
            "ver": "1.0",
            "ts": "10-03-2017 00:00:00",
            "action": "create",
            "did": "1",
            "key": "abcdkey",
            "msgId": "20170310130900",
            "requesterId": "rajesh",
            "authToken": localStorage.getItem('auth'),
            "userInfo": {
              "id": 128
            }
          },
          "locale": newData.locale,
          "tenantId": "pb",
          "messages": [{
            "code": newData.code,
            "message": newData.message,
            "module": newData.module,
            "locale": newData.locale
          }]
        }
      )
      .then(response => {
        console.log("response API", response)
        // this.onFetch();
        this.setState({
          data: ''
        })
      })
      .catch(err => console.log(err));
      // window.location.reload();
  }


  onUpdate = (id) => {
    const { datas } = this.state;
    axios
      .post(`${document.location.origin}/localization/messages/v1/_update`,
        {
          "RequestInfo": {
            "apiId": "emp",
            "ver": "1.0",
            "ts": "10-03-2017 00:00:00",
            "action": "create",
            "did": "1",
            "key": "abcdkey",
            "msgId": "20170310130900",
            "requesterId": "rajesh",
            "authToken": localStorage.getItem('auth'),
            "userInfo": {
              "id": 128
            }
          },
          "locale": datas.locale,
          "module": datas.module,
          "tenantId": "pb",
          "messages": [{
            "code": datas.code,
            "message": datas.message,
            "module": datas.module,
            "locale": datas.locale
          }]
        }
      )
      .then(response => {
        console.log("response API", response)
        this.setState({
          data: ''
        })
      })
      .catch(err => console.log(err));
      // window.location.reload();
  }


  onDelete = (id) => {
    const { saveData } = this;
    axios
      .post(`${document.location.origin}/localization/messages/v1/_delete`,
        {
          "requestInfo": {
            "apiId": "emp",
            "ver": "1.0",
            "ts": "10-03-2017 00:00:00",
            "action": "create",
            "did": "1",
            "key": "abcdkey",
            "msgId": "20170310130900",
            "requesterId": "rajesh",
            "authToken": localStorage.getItem('auth'),
            "userInfo": {
              "id": 1
            }
          },
          "locale": this.state.datas.locale,
          "tenantId": "default",
          "messages": [{
            "code": this.state.newData.code,
            "message": this.state.newData.message,
            "module": this.state.newData.module,
            "locale": this.state.newData.locale
          }]
        }
      )
      .then(response => {
        console.log("response API", response)
        saveData(response.data.messages);
        // this.setState({
        //   message: ''
        // })
      })
      .catch(err => console.log(err));
  }
  
  handleChange(value) {
    console.log(value);
    this.setState({ selectedState: value });
  }

  render() {
    console.log(this.state);
    const { data = [] } = this.state;
    localStorage.setItem("auth", "ccbedced-1822-4e20-bf62-54b1f86e1208");
    let empty = [];
    let dropData=[];
    let datas=[];
   dropData = data !=[] ? (data.map((da, key) => {
      return (
        empty.push(da.module)
      )
    })):[];

    let looks={};    
    var unique = empty.filter((v, i, a) => a.indexOf(v) === i);    
     datas=unique.map((u,i)=>{
      return looks[u]=u
    })
console.log("looks:",looks);
    const keys=unique.map((u,k)=>k);
    console.log("keys:",keys);        
    const columns = [
      { title: "Code", field: "code" },
      { title: "Message", field: "message" },
      {
        title: "Module",
        field: "module",
        lookup: {'rainmaker-abg': "rainmaker-abg", 'rainmaker-common': "rainmaker-common" },
        lookup: looks
      },
      { title: "Locale", field: "locale" }
    ];

    return (
      <>

        <Grid container justify="center" alignItems="center">
          <Grid item md={8}>
            <MaterialTable
              title="Api data"
              editable={{
                onRowAdd: newData =>
                  new Promise(resolve => {
                    setTimeout(() => {
                      resolve();
                      this.setState(prevState => {
                        const data = [...prevState.data];
                        console.log(newData, "newData", "data:", data)
                        return { ...prevState, data, newData: newData };
                      });
                      this.onCreate();
                    }, 600);
                  }),
                onRowUpdate: (newData, oldData) =>
                  new Promise(resolve => {
                    setTimeout(() => {
                      resolve();
                      if (oldData) {
                        console.log(oldData, "oldData")
                        this.setState(prevState => {
                          const data = [...prevState.data];
                          const id = data.indexOf(oldData);
                          data[data.indexOf(oldData)] = newData;
                          return { ...prevState, data, id: id, datas: newData };
                        });
                        console.log("data", newData)
                        this.onUpdate(this.state.id)
                      }
                    }, 600);
                  }),
                onRowDelete: oldData =>
                  new Promise(resolve => {
                    setTimeout(() => {
                      resolve();
                      this.setState(prevState => {
                        const data = [...prevState.data];
                        const id = data.indexOf(oldData);
                        return { ...prevState, data, newData: oldData, id: id };
                      });
                      this.onDelete(this.state.id)
                    }, 600);
                  })
              }}
              columns={columns}
              data={data}
            />
          </Grid>
        </Grid>
      </>
    );
  }
}

export default ApiTable;
