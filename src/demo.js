import React, { PureComponent } from "react";
// import './Demo.css';
import MaterialTable from "material-table";
import axios from 'axios'
import { Grid, InputLabel, MenuItem, FormControl, Select, Card, Button, Input, ListItemText, Checkbox, Typography,Hidden } from '@material-ui/core';


class ApiTable extends PureComponent {
  state = {
    datas: {},
    id: 0,
    newData: {},
    data: [],

    selectedState: 'pb',
    name: [],
    multiSelect: [],
    locale: [],

    newSearch: []
  }

  componentDidMount() {
    // const { saveData } = this;
    axios
      .post(`${document.location.origin}/localization/messages/v1/_search?module=rainmaker-pgr,rainmaker-pt,rainmaker-tl,finance-erp,rainmaker-common,rainmaker-hr,rainmaker-uc,rainmaker-noc,rainmaker-abg,rainmaker-test&locale=en_IN&tenantId=${this.state.selectedState}`).then(response => {


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
      .post(`${document.location.origin}/localization/messages/v1/_search?module=${this.state.multiSelect.join(',')}&locale=en_IN&tenantId=${this.state.selectedState}`).then(response => {

        this.setState({ ...this.state, newSearch: response.data.messages })
      })
      .catch(err => console.log(err));
  }

  onReset = () => {
    this.setState({
      ...this.state,
      multiSelect: [],
      selectedState: '',
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

    const { data = [], newSearch = [] } = this.state;
    localStorage.setItem("auth", "00167ae7-31af-40ec-b707-e042606c7c25");
    let empty = [];
    let dropData = [];
    let datas = [];
    let locale = [];
    let filterModule = [];
    let filterLocale = [];
  

    dropData = data != [] ? ( data.map((da, key) => {
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

    const enabled =
      this.state.selectedState.length >= 1

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
                    >
                      <MenuItem value={'pb'}>pb</MenuItem>

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
                      // input={<Input id="select-multiple" />}

                      input={<Input />}
                      renderValue={selected => selected.join(", ")}
                    // MenuProps={MenuProps}
                    >
                      {unique.map(name => (
                        // <MenuItem key={name} value={name}>
                        //   {name}
                        // </MenuItem>

                        <MenuItem key={name} value={name}>
                          <Checkbox checked={this.state.multiSelect.indexOf(name) > -1} />
                          <ListItemText primary={name} />
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
                      {localeunique.map(name => (
                        <MenuItem key={name} value={name}>
                          {name}
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
                actionsColumnIndex: -1
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
