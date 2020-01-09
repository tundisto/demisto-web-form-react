import { Component } from 'react';
import './App.scss';
import { FetcherService } from './fetcher-service';
import { DemistoProperties } from './types/demisto-properties';
import { User } from './types/user';
import { ApiStatus } from './types/api-status';
import { ClientOptions } from './types/client-options';
import { SelectItem } from 'primereact/api';
import { DemistoCaseParams } from './types/demisto-case-params';
import renderFunc from './App-html';

interface AppState {
  adGroups: SelectItem[];
  clientOptions: ClientOptions|undefined;
  computerTypes: any;
  countries: any[];
  demistoProperties: DemistoProperties;
  employeeForm: DemistoCaseParams;
  initialised: boolean;
  loggedInUser: User|undefined;
  serverApiInit: boolean;
  workLocations: any[];
}

class App extends Component<{}, AppState> {

  constructor(props: any) {
    super(props);
    this.state = {
      demistoProperties: {
        url: '',
        apiKey: '',
        trustAny: true
      },
      employeeForm: JSON.parse(JSON.stringify(this.defaultEmployeeForm)),
      countries: [],
      workLocations: [],
      computerTypes: {},
      loggedInUser: undefined,
      serverApiInit: false,
      clientOptions: undefined,
      adGroups: [],
      initialised: false
    };
  }

  public render = renderFunc(this); // render function stored in separate file for maintainability
  
  private fetcherService: FetcherService = new FetcherService(); // import our URL fetcher

  // default properties
  private defaultComputerType = 'mac';
  private defaultComputerFormFactor = 'laptops';
  private defaultComputerModel = 'MacBook Pro 15"';
  private defaultEmployeeForm: DemistoCaseParams = {
    firstName: '',
    lastName: '',
    hireDate: '',
    workLocation: '',
    computer: {
      type: '',
      formFactor: '',
      model: ''
    },
    homeAddress: {
      street1: '',
      street2: '',
      city: '',
      state: '',
      zip: '',
      country: ''
    },
    phone: {
      home: '',
      mobile: ''
    },
    adGroups: []
  };

  private messages: any; // holds ref to prime Messages component



  resetForm() {
    let employeeForm = JSON.parse(JSON.stringify(this.defaultEmployeeForm));
    employeeForm.computer.type = this.defaultComputerType;
    employeeForm.computer.formFactor = this.defaultComputerFormFactor;
    employeeForm.computer.model = this.defaultComputerModel;
    
    this.state.computerTypes[this.defaultComputerType][this.defaultComputerFormFactor].forEach( (model: any) => {
      if (model.name === this.defaultComputerModel) {
        employeeForm.computer.model = model;
      }
    } );

    this.state.countries.forEach(
      (country: any) => {
        if (country.name === this.state.clientOptions.defaultCountry) {
          employeeForm.homeAddress.country = country;
        }
      });
    employeeForm.homeAddress.state = this.state.clientOptions.countries[this.state.clientOptions.defaultCountry].states[0];
    employeeForm.workLocation = this.state.workLocations[0];

    this.setState({employeeForm});
  }



  async componentDidMount() {
    // Get Logged In User
    try {
      let loggedInUser = await this.fetcherService.getLoggedInUser();
      this.setState({loggedInUser});
      console.log('LoggedInUser:', this.state.loggedInUser);
    }
    catch (err) {
      console.log('Caught error fetching logged in user:', err);
    }

    // API Init
    try {
      let res: ApiStatus = await this.fetcherService.getApiStatus();
      // this.serverApiInit = res.initialised;
      this.setState( { serverApiInit: res.initialised } );
      if (this.state.serverApiInit) {
        this.messages.replace({ severity: 'success', summary: 'Success', detail: 'Demisto API communication is initialised', life: 5000});
      }
      else {
        this.messages.replace({ severity: 'error', summary: 'Failure', detail: 'Demisto API communication is not initialised!', life: 5000});
      }

      if (this.state.serverApiInit) {
        this.setState( { 
          demistoProperties: {
            url: res.url,
            apiKey: '',
            trustAny: res.trust
          }
        } );
      }
      console.log('Demisto Server API:', res);
    }
    catch (err) {
      console.log('Caught error fetching Demisto server API status:', err);
    }

    // Client Options
    try {
      let clientOptions = await this.fetcherService.getClientOptions();
      console.log('Client Options:', clientOptions);
      this.setState({clientOptions});

      // AD Groups
      let adGroups = clientOptions.activeDirectoryGroups.map( group => {return {label: group, value: group}});
      this.setState({adGroups});
      console.log('adGroups:', this.state.adGroups);

      // Countries
      let countries = Object.keys(clientOptions.countries).map( country => {return {name: country}});
      this.setState({countries});
      console.log('countries:', this.state.countries);

      // Work Locations
      let workLocations = clientOptions.workLocations.map( location => {return {name: location} });
      this.setState({workLocations});
      console.log('workLocations:', workLocations);

      // Computer Models
      let computerTypes: any = {};
      Object.keys(clientOptions.computerTypes).forEach( type => {
        computerTypes[type] = {
          desktops: clientOptions.computerTypes[type].desktops.map( (model: string) => {return {name: model}}),
          laptops: clientOptions.computerTypes[type].laptops.map( (model: string) => {return {name: model}})
        };
      });
      this.setState({computerTypes});
      console.log('computerTypes:', this.state.computerTypes);
    }
    catch (err) {
      console.log('Caught error fetching client options:', err);
    }

    this.resetForm();

    this.setState({initialised: true});
  }



  async testAPI(): Promise<any> {

    let testResult;
    try {
      let result = await this.fetcherService.testDemisto(this.state.demistoProperties);
      console.log('testCredentials() result:', result);
      
      if ( 'success' in result && result.success ) {
        // successful
        testResult = 'Test successful';
        this.setState( { serverApiInit: true } );
        this.messages.replace({
          severity: 'success',
          summary: 'Success',
          detail: 'Demisto API communication is initialised',
          life: 5000
        });
      }
      else if ( 'success' in result && !result.success ) {
        // unsuccessful
        let err = 'statusMessage' in result ? result.statusMessage : result.error;
        if ('statusCode' in result) {
          testResult = `Test failed with code ${result.statusCode}: "${err}"`;
          this.messages.replace({
            severity: 'error',
            summary: 'Failure',
            detail: `Demisto API communication is not initialised. ${testResult}`,
            sticky: true
          });
        }
        else {
          testResult = `Test failed with error: "${err}"`;
          this.messages.replace({
            severity: 'error',
            summary: 'Failure',
            detail: `Demisto API communication is not initialised. ${testResult}`,
            sticky: true
          });
        }
        this.setState( { serverApiInit: false } );
      }
    }
    catch (error) {
      testResult = `Test failed with error: ${error.message || error}`;
      this.messages.replace({
        severity: 'error',
        summary: 'Failure',
        detail: `Demisto API communication is not initialised. ${testResult}`,
        sticky: true
      });
      this.setState( { serverApiInit: false } );
    }
  }



  onCountryChanged(country: any) {
    let s = {...this.state.employeeForm};
    s.homeAddress.country = country;
    s.homeAddress.state = this.state.clientOptions.countries[country.name].states[0] as any;
    this.setState({employeeForm: s});
  }



  onComputerTypeChanged(computerType: string) {
    let s = {...this.state.employeeForm};
    s.computer.type = computerType;
    s.computer.model = this.state.computerTypes[computerType][this.state.employeeForm.computer.formFactor][0];
    this.setState({employeeForm: s});
  }



  onComputerFormFactorChanged(formFactor: string) {
    let s = {...this.state.employeeForm};
    s.computer.formFactor = formFactor;
    s.computer.model = this.state.computerTypes[this.state.employeeForm.computer.type][formFactor][0];
    this.setState({employeeForm: s});
  }


  buildDemistoIncident() {
    let incident: any = {
      firstName: this.state.employeeForm.firstName,
      lastName: this.state.employeeForm.lastName,
      hireDate: (this.state.employeeForm as any).hireDate.toISOString(),
      homeAddressStreet: this.state.employeeForm.homeAddress.street1,
      homeAddressCountry: (this.state.employeeForm.homeAddress.country as any).name,
      homeAddressCity: this.state.employeeForm.homeAddress.city,
      homeAddressState: (this.state.employeeForm.homeAddress.state as any).name,
      homeAddressZip: this.state.employeeForm.homeAddress.zip,
      workLocation: (this.state.employeeForm.workLocation as any).name,
      computerType: this.state.employeeForm.computer.type,
      formFactor: this.state.employeeForm.computer.formFactor,
      computerModel: (this.state.employeeForm.computer.model as any).name,
      adGroups: this.state.employeeForm.adGroups
    }
    if (this.state.employeeForm.homeAddress.street2 !== '') {
      incident['homeAddressStreet2'] = this.state.employeeForm.homeAddress.street2;
    }
    if (this.state.employeeForm.phone.home !== '') {
      incident['homePhone'] = this.state.employeeForm.phone.home;
    }
    if (this.state.employeeForm.phone.mobile !== '') {
      incident['mobilePhone'] = this.state.employeeForm.phone.mobile;
      return incident;
    }
  }



  async onNewEmployeeFormSubmit() {
    console.log('onNewEmployeeFormSubmit() employeeForm:', this.state.employeeForm);
    
    let incident = this.buildDemistoIncident();
    console.log('incident:', incident);

    let res = await this.fetcherService.createDemistoIncident(incident);
    // console.log('res:', res);
    if (!res.success) {
      let resultMessage = `Incident creation failed with Demisto status code ${res.statusCode}: "${res.statusMessage}"`;
      this.messages.replace({
        severity: 'error',
        summary: 'Failure',
        detail: resultMessage,
        sticky: true
      });
    }
    else {
      let resultMessage = `Demisto incident created with id ${res.id}`;
      this.messages.replace({
        severity: 'success',
        summary: 'Success',
        detail: resultMessage,
        sticky: true
      });
      this.resetForm();
    }
  }
  


}

export default App;
