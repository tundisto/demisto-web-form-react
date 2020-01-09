import { Component } from 'react';
import './App.scss';
import { FetcherService } from './fetcher-service';
import { DemistoProperties } from './types/demisto-properties';
import { User } from './types/user';
import { ApiStatus } from './types/api-status';
import { ClientOptions } from './types/client-options';
import { SelectItem } from 'primereact/api';
import renderFunc from './App-html';

interface AppState {
  adGroups: SelectItem[];
  clientOptions: ClientOptions|undefined;
  computerTypes: any;
  countries: SelectItem[];
  initialised: boolean;
  loggedInUser: User|undefined;
  serverApiInit: boolean;
  workLocations: SelectItem[];
  demistoUrl: string;
  demistoApiKey: string;
  demistoTrustAny: boolean;
  employeeFirstName: string;
  employeeLastName: string;
  hireDate: string;
  workLocation: string;
  computerType: string;
  computerFormFactor: string
  computerModel: string;
  homeStreet1: string;
  homeStreet2: string;
  homeCity: string;
  homeState: string;
  homeZip: string;
  homeCountry: string;
  homePhone: string;
  mobilePhone: string;
  selectedAdGroups: string[];
}

class App extends Component<{}, AppState> {

  constructor(props: any) {
    super(props);
    this.state = this.defaultAppState
  }

  public render = renderFunc(this); // render function stored in separate file for maintainability
  
  private fetcherService: FetcherService = new FetcherService(); // import our URL fetcher

  // default properties
  private defaultComputerType = 'mac';
  private defaultComputerFormFactor = 'laptops';
  private defaultComputerModel = 'MacBook Pro 15"';
  private defaultAppState: AppState = {
    demistoUrl: '',
    demistoApiKey: '',
    demistoTrustAny: true,
    countries: [],
    workLocations: [],
    computerTypes: {},
    loggedInUser: undefined,
    serverApiInit: false,
    clientOptions: undefined,
    adGroups: [],
    initialised: false,
    employeeFirstName: '',
    employeeLastName: '',
    hireDate: '',
    workLocation: '',
    computerType: '',
    computerFormFactor: '',
    computerModel: '',
    homeStreet1: '',
    homeStreet2: '',
    homeCity: '',
    homeState: '',
    homeZip: '',
    homeCountry: '',
    homePhone: '',
    mobilePhone: '',
    selectedAdGroups: []
  };

  private messages: any; // holds ref to prime Messages component



  resetForm() {
    let stateCopy: AppState = JSON.parse(JSON.stringify(this.state));
    stateCopy = {
      ...stateCopy,
      employeeFirstName: '',
      employeeLastName: '',
      hireDate: '',
      workLocation: '',
      computerType: '',
      computerFormFactor: '',
      computerModel: '',
      homeStreet1: '',
      homeStreet2: '',
      homeCity: '',
      homeState: '',
      homeZip: '',
      homeCountry: '',
      homePhone: '',
      mobilePhone: '',
      selectedAdGroups: []
    }

    stateCopy.computerType = this.defaultComputerType;
    stateCopy.computerFormFactor = this.defaultComputerFormFactor;
    stateCopy.computerModel = this.defaultComputerModel;
    
    this.state.computerTypes[this.defaultComputerType][this.defaultComputerFormFactor].forEach( (model: any) => {
      if (model.name === this.defaultComputerModel) {
        stateCopy.computerModel = model;
      }
    } );

    this.state.countries.forEach(
      (country: SelectItem) => {
        if (country.value === this.state.clientOptions.defaultCountry) {
          stateCopy.homeCountry = country.value;
        }
      });
    stateCopy.homeState = this.state.clientOptions.countries[this.state.clientOptions.defaultCountry].states[0].value;
    stateCopy.workLocation = this.state.workLocations[0].value;


    this.setState(stateCopy);
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
      this.setState( { serverApiInit: res.initialised } );
      if (this.state.serverApiInit) {
        this.messages.replace({ severity: 'success', summary: 'Success', detail: 'Demisto API communication is initialised', life: 5000});
      }
      else {
        this.messages.replace({ severity: 'error', summary: 'Failure', detail: 'Demisto API communication is not initialised!', life: 5000});
      }

      if (this.state.serverApiInit) {
        this.setState( { 
            demistoUrl: res.url,
            demistoApiKey: '',
            demistoTrustAny: res.trust
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
      let countries: SelectItem[] = Object.keys(clientOptions.countries).map( country => {return {value: country, label: country}});
      this.setState({countries});
      console.log('countries:', this.state.countries);

      // Work Locations
      let workLocations: SelectItem[] = clientOptions.workLocations.map( location => {return {value: location, label: location} });
      this.setState({workLocations});
      console.log('workLocations:', workLocations);

      // Computer Models
      let computerTypes: any = {};
      Object.keys(clientOptions.computerTypes).forEach( type => {
        computerTypes[type] = {
          desktops: clientOptions.computerTypes[type].desktops.map( (model: SelectItem) => {return {value: model, label: model}}),
          laptops: clientOptions.computerTypes[type].laptops.map( (model: SelectItem) => {return {value: model, label: model}})
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
      let demistoProperties: DemistoProperties = {
        url: this.state.demistoUrl,
        apiKey: this.state.demistoApiKey,
        trustAny: this.state.demistoTrustAny
      }
      let result = await this.fetcherService.testDemisto(demistoProperties);
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
    this.setState({
      homeCountry: country,
      homeState: this.state.clientOptions.countries[country].states[0].value
    });
  }



  onComputerTypeChanged(computerType: string) {
    this.setState({
      computerType,
      computerModel: this.state.computerTypes[computerType][this.state.computerFormFactor][0].value
    });
  }



  onComputerFormFactorChanged(computerFormFactor: string) {
    this.setState({
      computerFormFactor,
      computerModel: this.state.computerTypes[this.state.computerType][computerFormFactor][0].value
    });
  }


  buildDemistoIncident() {
    let incident: any = {
      firstName: this.state.employeeFirstName,
      lastName: this.state.employeeLastName,
      hireDate: (this.state as any).hireDate.toISOString(),
      homeAddressStreet: this.state.homeStreet1,
      homeAddressCountry: this.state.homeCountry,
      homeAddressCity: this.state.homeCity,
      homeAddressState: this.state.homeState,
      homeAddressZip: this.state.homeZip,
      workLocation: this.state.workLocation,
      computerType: this.state.computerType,
      formFactor: this.state.computerFormFactor,
      computerModel: this.state.computerModel,
      adGroups: this.state.selectedAdGroups
    }
    if (this.state.homeStreet2 !== '') {
      incident['homeStreet2'] = this.state.homeStreet2;
    }
    if (this.state.homePhone !== '') {
      incident['homePhone'] = this.state.homePhone;
    }
    if (this.state.mobilePhone !== '') {
      incident['mobilePhone'] = this.state.mobilePhone;
    }
    return incident;
  }



  async onNewEmployeeFormSubmit() {
    console.log('onNewEmployeeFormSubmit() state:', this.state);
    
    let incident = this.buildDemistoIncident();
    console.log('onNewEmployeeFormSubmit(): incident:', incident);

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
