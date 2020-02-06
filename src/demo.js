import React, { PureComponent } from "react";
import MaterialTable from "material-table";
import axios from 'axios'
import { Grid, InputLabel, MenuItem, FormControl, Select, Card, Button, Input, ListItemText, Checkbox, Typography, Hidden } from '@material-ui/core';


class ApiTable extends PureComponent {
  state = {
    datas: {},
    id: 0,
    newData: {},
    data: [],

    selectedState: '',
    name: [],
    multiSelect: [],
    locale: [],

    newSearch: [],

    apidata: [],
    statelocale:[],
    statemultiSelect:[]
  }

  componentDidMount() {
// var c = new URL(window.location.href).searchParams.get("module");
var mod= new URL(window.location.href).searchParams.get("module");
var module=mod?mod.split(','):[];
var loc= new URL(window.location.href).searchParams.get("locale");
var locale= loc?loc.split(','):[];
console.log(module,"module")
    
console.log(this.state,"state")
    if (locale.length >= 1 && module.length >= 1) {
      var statemultiSelect=[];
      statemultiSelect=module.map(m=>{return{"label":m, "value":m}})
    


      console.log("not axios");
      this.setState({ ...this.state,
        statemultiSelect,
        selectedState: new URL(window.location.href).searchParams.get("tenantID"),
        multiSelect: module,
        statelocale:locale.map(m=>{return{"label":m, "value":m}}),
        locale:locale
      })

    } else {
      console.log("axios");
      
      axios
        .post(`${document.location.origin}/egov-mdms-service/v1/_search?tenantId=${this.state.selectedState}`,
          {
            "RequestInfo": {
              "apiId": "Rainmaker",
              "ver": ".01",
              "ts": "",
              "action": "_search",
              "did": "1",
              "key": "",
              "msgId": "20170310130900|en_IN",
              "authToken": "a969d202-0b39-4fb2-8334-2f0c4d281bf6"
            },
            "MdmsCriteria": {
              "tenantId": "uk",
              "moduleDetails": [
                {
                  "moduleName": "common-masters",
                  "masterDetails": [

                    {
                      "name": "StateInfo"
                    }
                  ]
                }
              ]
            }
          }
        ).then(response => {
          this.setState({ ...this.state, apidata: response.data.MdmsRes["common-masters"],
          selectedState: new URL(window.location.href).searchParams.get("tenantID"),
          statelocale:response.data.MdmsRes["common-masters"].StateInfo[0].languages,
          statemultiSelect:response.data.MdmsRes["common-masters"].StateInfo[0].localizationModules
        })
        })
        .catch(err => console.log(err));

    }
  }

  // saveData = data => {
  //   this.setState({ ...this.state, data: data })
  // };

  onCreate = () => {
    const { newData } = this.state;
    const { onSearch } = this;
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
    onSearch();
  }


  onUpdate = (id) => {
    const { datas } = this.state;
    const { onSearch } = this;
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
    onSearch();
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

  onSearch = () => {
    axios
      .post(`${document.location.origin}/localization/messages/v1/_search?module=${this.state.multiSelect.join(',')}&locale=${this.state.locale}&tenantId=${this.state.selectedState}`).then(response => {

        this.setState({ ...this.state, newSearch: response.data.messages })
      })
      .catch(err => console.log(err));
  }

  onReset = () => {
    this.setState({
      ...this.state,
      multiSelect: [],
      locale: []
    })
  }

  handleChange = (event) => {
    this.setState({ selectedState: event.target.value });
  }

  handleChangeLocale = (event) => {
    this.setState({ locale: event.target.value });
  }




  handleChangeMulti = event => {
    console.log(event.target.value, "event");

    this.setState({ multiSelect: event.target.value });
    // multiSelect(event.target.value);
  };

  handleChangeMultiple = event => {
    const { options } = event.target;
    const value = [];
    for (let i = 0, l = options.length; i < l; i += 1) {
      if (options[i].selected) {
        value.push(options[i].value);
      }
    }
    // multiSelect(value);
    this.setState({
      multiSelect: value
    });
  };

  render() {

    const { data = [], newSearch = [], apidata = [] } = this.state;
    localStorage.setItem("auth", "024494f4-239a-41e8-a3c0-0fa4d804a2c8");
    let empty = [];
    let dropData = [];
    let datas = [];
    let locale = [];
    let filterModule = [];
    let filterLocale = [];


    dropData = data != [] ? (data.map((da, key) => {
      return (
        empty.push(da.module)
      )
    })) : [];


    dropData = data != [] ? (data.map((da, key) => {
      return (
        locale.push(da.locale)
      )
    })) : [];

    let looks = {};
    var unique = empty.filter((v, i, a) => a.indexOf(v) === i);
    datas = unique.map((u, i) => {
      return looks[u] = u
    })

    let locales = {};
    var localeunique = locale.filter((v, i, a) => a.indexOf(v) === i);
    datas = localeunique.map((u, i) => {
      return locales[u] = u
    })


    dropData = newSearch !== [] ? (newSearch.map((da, key) => {
      return (
        filterModule.push(da.module)
      )
    })) : [];


    let filtermoduleUnique = {};
    var filterMooduleuniqueSearch = filterModule.filter((v, i, a) => a.indexOf(v) === i);
    datas = filterMooduleuniqueSearch.map((u, i) => {
      return filtermoduleUnique[u] = u
    })


    dropData = newSearch !== [] ? (newSearch.map((da, key) => {
      return (
        filterLocale.push(da.locale)
      )
    })) : [];

    let filterLocaleUnique = {};
    var filterLocaleuniqueSearch = filterLocale.filter((v, i, a) => a.indexOf(v) === i);
    datas = filterLocaleuniqueSearch.map((u, i) => {
      return filterLocaleUnique[u] = u
    })


    const columns = [
      { title: "Code", field: "code" },
      { title: "Message", field: "message" },
      { title: "Module", field: "module", lookup: filtermoduleUnique },
      { title: "Locale", field: "locale", lookup: filterLocaleUnique }
    ];


    const localeApi = this.state.apidata.StateInfo && this.state.apidata.StateInfo.length >= 1 ? this.state.apidata.StateInfo[0].languages : [];

    const ModuleApi = this.state.apidata.StateInfo && this.state.apidata.StateInfo.length >= 1 ? this.state.apidata.StateInfo[0].localizationModules : [];
    

    const enabled =
      this.state.locale.length >= 1

      console.log(this.state);
      

    return (
      < >
        <Grid container justify="center" alignItems="center">
          <Grid item md={11} sm={11} xs={11}>
            <Typography variant="h4" style={{ margin: '1em 0em' }}>
              Localization
          </Typography>
          </Grid>
        </Grid>
        <Grid container justify="center" alignItems="center">
          <Grid item md={11} sm={11} xs={11}>
            <Card style={{ marginBottom: '2rem' }}>

              <Typography variant="h5" style={{ margin: '1em' }}>
                Search for Localization
              </Typography>

              <Grid container style={{ margin: '2rem' }}>
                <Grid item md={4} sm={6} xs={10}>

                  <FormControl style={{ width: '70%' }}>
                    <InputLabel >Tenant Id</InputLabel>
                    <Select
                      open={this.state.open}
                      onClose={this.handleClose}
                      onOpen={this.handleOpen}
                      value={this.state.selectedState}
                      onChange={this.handleChange}
                      disabled
                    >
                      <MenuItem value={this.state.selectedState}>{this.state.selectedState}</MenuItem>

                    </Select>
                  </FormControl>

                </Grid>


                <Grid item md={4} sm={6} xs={10}>
                  <FormControl style={{ width: '70%' }} >
                    <InputLabel htmlFor="select-multiple">Module</InputLabel>
                    <Select
                      multiple
                      value={this.state.multiSelect}
                      onChange={this.handleChangeMulti}
                      id="multiSelect"
                      input={<Input />}
                      renderValue={selected => selected.join(", ")}
                    >
                      {this.state.statemultiSelect.map(name => (
                        <MenuItem key={name.value} value={name.value}>
                          <Checkbox checked={this.state.multiSelect.indexOf(name.label) > -1} />
                          <ListItemText primary={name.label} />
                        </MenuItem>

                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item md={4} sm={6} xs={10}>

                  <FormControl style={{ width: '70%' }}>
                    <InputLabel >Locale</InputLabel>
                    <Select
                      open={this.state.open}
                      onClose={this.handleClose}
                      onOpen={this.handleOpen}
                      value={this.state.locale}
                      onChange={this.handleChangeLocale}
                    >
                      {this.state.statelocale.map(name => (
                        <MenuItem key={name.value} value={name.value}>
                          {name.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  

                </Grid>

                <Hidden mdUp>
                  <Grid item md={4} sm={6} xs={10}></Grid>
                </Hidden>

                <Grid item md={6} sm={6} xs={12}>
                  <Button variant="contained" style={{ width: '60%', marginTop: '2rem', background: '#fff', color: '#333' }} color="secondary" onClick={this.onReset}> reset</Button>
                </Grid>

                <Grid item md={6} sm={6} xs={12}>
                  <Button variant="contained" style={{ width: '60%', marginTop: '2rem', background: '#666666', color: '#fff' }} color="secondary" onClick={this.onSearch} disabled={!enabled}> search</Button>
                </Grid>

              </Grid>
            </Card>
          </Grid>
        </Grid>


        <Grid container justify="center" alignItems="center">
          <Grid item md={11} sm={11} xs={11}>
            <MaterialTable
              title={`Localization Search Results ( ${newSearch.length} )`}
              options={{
                filtering: true,
                sorting: true,
                search: true,
                // exportButton: true,
                actionsColumnIndex: -1,
                pageSize: 10,
                pageSizeOptions: [5, 10, 25, 50, 75, 100],
                addRowPosition: 'first',
                exportButton: true, exportAllData: true
              }}
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
              data={newSearch}
            />
          </Grid>
        </Grid>
      </>
    );
  }
}

export default ApiTable;
