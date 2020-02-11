import React, { Fragment } from 'react';
import App from './App';
// PrimeReact
import { Card } from 'primereact/card';
import { ListBox } from 'primereact/listbox';
import { Button } from 'primereact/button';
import { Messages } from 'primereact/messages';
import { Message } from 'primereact/message';
import { InputSwitch } from 'primereact/inputswitch';
import { InputText } from 'primereact/inputtext';
import { Dropdown, DropdownProps } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { RadioButton } from 'primereact/radiobutton';


function renderFunc(self: App) {

  return () => {
    let showForm = false;
    if (self.state.loggedInUser && self.state.clientOptions && self.state.countries && self.state.adGroups) {
      showForm = true;
    }
    let disableSubmit;
    if (showForm) {
      disableSubmit = !self.state.serverApiInit || !self.state.employeeFirstName || !self.state.employeeLastName || !self.state.hireDate || !self.state.homeStreet1 || !self.state.homeCity || !self.state.homeState || !self.state.homeZip || !(self.state.homePhone || self.state.mobilePhone) || self.state.selectedAdGroups.length === 0;
    }
    let disableTestApi = self.state.serverApiInit ? self.state.demistoUrl === '' : self.state.demistoUrl === '' || self.state.demistoApiKey === '';

    return (

<Fragment>

  {self.state.initialised && showForm &&

  <div className="formContainer">
    <img src="/demisto-logo-1.png" style={{marginTop: '1em'}} alt="Demisto Logo"></img>

    <div className="loggedIn">Logged in as: <span style={{fontWeight: 'bold'}}> {self.state.loggedInUser.username}</span></div>

    <h1 className="bodyHeader">
      Create a New Employee
    </h1>

    <h3 style={{marginTop: 0}}>This sample React app creates a Demisto incident through use of a web-based form.  Its purpose is to trigger a playbook which would perform some automated actions associated with hiring a new employee behind the scenes.</h3>

    <p><span style={{fontWeight: 'bold'}}>PLEASE NOTE:</span> This is a simplistic, sample implementation, for reference purposes only.  It is <u><b>NOT</b></u> intended for use in production.</p>

    <h1 className="bodyHeader" style={{color: 'red'}}>CONSIDER THIS APP TO BE INSECURE!!!</h1>





    {/* Demisto API Config */}
    <Card title="Demisto Parameters" subTitle="Use this section to initialise the server's connection to the Demisto API.  The configuration will be saved by the server.">
      <form>

        <div className="demistoForm">

          {/* Demisto Base URL */}
          <div>
            <span className="p-float-label">
              <InputText type="url" name="url" id="url" size={50} value={self.state.demistoUrl} onChange={(e: any) => self.setState({demistoUrl: e.target.value}) } />
              <label htmlFor="url">Demisto Base URL</label>
            </span>
          </div>

          {/* Demisto API Key */}
          <div>
            <span className="p-float-label">
              <InputText type="password" id="apiKey" name="apiKey" size={50} value={self.state.demistoApiKey} onChange={(e: any) => self.setState({demistoApiKey: e.target.value})} autoComplete="off" />
              <label htmlFor="apiKey">API Key</label>
            </span>
          </div>

          {/* Trust Any Certificate */}
          <div>
            <span className="formLabel">Trust Any Certificate&nbsp;&nbsp;</span>
            <InputSwitch checked={self.state.demistoTrustAny} onChange={(e: any) => self.setState({demistoTrustAny: e.value})} style={{verticalAlign: 'middle'}} />
          </div>

        </div>

        {/* Test Button */}
        <div style={{marginTop: '.5em'}}>
          <span>
            <Button type="button" onClick={() => self.testAPI()} label="Test" disabled={disableTestApi}/>&nbsp;&nbsp;
          </span>
          {self.state.serverApiInit && <Message severity="success" text="API Initialised"></Message>}
          {!self.state.serverApiInit && <Message severity="error" text="API Not Initialised"></Message> }
        </div>
      </form>
    </Card>



    <form noValidate>

      {/* Employee Details */}

      <Card title="New Employee Detail" subTitle="This section will create a new Demisto incident with the intent of running a playbook for creating a new employee.  This playbook might seek the approval of HR, then create the new user's account in Active Directory, and finally it might then issue them a new laptop.  The workflow can be customised extensively.">

        <div className="demistoForm">

          {/* First Name */}
          <div>
            <span className="p-float-label">
              <InputText type="text" name="firstName" id="firstName" value={self.state.employeeFirstName} onChange={ (e: any) => self.setState({employeeFirstName: e.target.value})} size={50} autoComplete="off" required />
              <label htmlFor="firstName">First / Middle Name</label>
            </span>
          </div>

          {/* Last Name */}
          <div>
            <span className="p-float-label">
              <InputText name="lastName" id="lastName" value={self.state.employeeLastName} onChange={ (e: any) => self.setState({employeeLastName: e.target.value})} size={50} autoComplete="off" required />
              <label htmlFor="lastName">Last Name</label>
            </span>
          </div>

          {/* Hire Date */}
          <div>
            <Calendar name="hireDate" value={self.state.hireDate} onChange={ (e: any) => self.setState({hireDate: e.value})} showIcon={true} required></Calendar>
          </div>

          {/* Home 1 */}
          <div>
            <span className="p-float-label">
              <InputText type="text" name="homeAddressStreet" id="homeAddressStreet" value={self.state.homeStreet1} onChange={ (e: any) => self.setState({homeStreet1: e.target.value})} size={50} required />
              <label htmlFor="homeAddressStreet">Street</label>
            </span>
          </div>

          {/* Home 2 */}
          <div>
            <span className="p-float-label">
              <InputText type="text" name="homeAddressStreet2" id="homeAddressStreet2" value={self.state.homeStreet2} onChange={ (e: any) => self.setState({homeStreet2: e.target.value})} size={50} /><br />
              <label htmlFor="homeAddressStreet2">Street 2</label>
            </span>
          </div>

          {/* Country */}
          <div>
            <Dropdown options={self.state.countries} name="homeAddressCountry" value={self.state.homeCountry} onChange={ (e: any) => {self.onCountryChanged(e.value)}} />
          </div>

          {/* City */}
          <div>
            <span className="p-float-label">
              <InputText type="text" name="homeAddressCity" id="homeAddressCity" value={self.state.homeCity} onChange={ (e: any) => self.setState({homeCity: e.target.value})} size={50} required /><br />
              <label htmlFor="homeAddressCity">City</label>
            </span>
          </div>

          {/* State */}
          <div>
            <Dropdown name="homeAddressState" options={self.state.clientOptions.countries[self.state.homeCountry].states} value={self.state.homeState} onChange={ (e: any) => self.setState({homeState: e.value})} />
          </div>

          {/* ZIP / Postcode */}
          <div>
            <span className="p-float-label">
              <InputText type="text" name="homeAddressZip" id="homeAddressZip" value={self.state.homeZip} onChange={ (e: any) => self.setState({homeZip: e.target.value})} size={50} required />
              <label htmlFor="homeAddressZip">{self.state.clientOptions.countries[self.state.homeCountry].zipLabel}</label>
            </span>
          </div>

          {/* Home Phone */}
          <div>
            <span className="p-float-label">
              <InputText type="text" name="homePhone" id="homePhone" value={self.state.homePhone} onChange={ (e: any) => self.setState({homePhone: e.target.value})} size={50} />
              <label htmlFor="homePhone">Home Phone</label>
            </span>
          </div>

          {/* Mobile Phone */}
          <div>
            <span className="p-float-label">
              <InputText type="text" name="mobilePhone" id="mobilePhone" value={self.state.mobilePhone} onChange={ (e: any) => self.setState({mobilePhone: e.target.value})} size={50} />
              <label htmlFor="mobilePhone">Mobile Phone</label>
            </span>
          </div>

        </div>

      </Card>




      { /* Work Location Card */ }
      <Card title="Work Location">
        <Dropdown options={self.state.workLocations} name="workLocation" value={self.state.workLocation} onChange={ (e: any) => self.setState({workLocation: e.value})} />
      </Card>




      {/* Computer Information Card */}
      <Card title="Computer Information">

        <div className="demistoForm">

          {/* Computer Type */}
          <div>
            <span className="formLabel">Type:&nbsp;&nbsp;</span>

            {
              Object.values(self.state.clientOptions.computerTypes).map( (value: any) =>
              <span key={`computerType-${value.name}`}>
                <RadioButton name="computerType" id={value.name} value={value.name} checked={self.state.computerType === value.name} onChange={ (e: any) => {self.onComputerTypeChanged(e.value)}} />
                <label htmlFor={value.name} className="p-radiobutton-label">{value.friendlyName}</label>&nbsp;&nbsp;
                &nbsp;&nbsp;
              </span> )
            }

          </div>

          {/* Computer Form Factor */}
          <div>
            <span className="formLabel">Form Factor:&nbsp;&nbsp;</span>

            {self.state.clientOptions.computerTypes[self.state.computerType].laptops &&
              <span>
                <RadioButton name="formFactor" id="laptops" value="laptops" checked={self.state.computerFormFactor === 'laptops'} onChange={ (e: any) => {self.onComputerFormFactorChanged(e.value)}} />
                <label htmlFor="laptops" className="p-radiobutton-label">Laptop</label>&nbsp;&nbsp;
              </span>
            }

            {self.state.clientOptions.computerTypes[self.state.computerType].desktops &&
              <span>
                <RadioButton name="formFactor" id="desktops" value="desktops" checked={self.state.computerFormFactor === 'desktops'} onChange={ (e: any) => {self.onComputerFormFactorChanged(e.value)}} />
                <label htmlFor="desktops" className="p-radiobutton-label">Desktop</label>&nbsp;&nbsp;
              </span>
            }

          </div>

          {/* Computer Model */}
          <div>
            <Dropdown name="computerModel" options={self.state.computerTypes[self.state.computerType][self.state.computerFormFactor] as DropdownProps[]} value={self.state.computerModel} onChange={ (e: any) => self.setState({computerModel: e.value})} />
          </div>

        </div>

      </Card>




      {/*  AD Groups Card */}
      <Card title="Active Directory Groups">
        <span className="formLabel">Selected Groups: </span>
        {
          self.state.selectedAdGroups.map( (group: string) => { return <span key={`adGroup-${group}`} style={{marginRight: '1em', color: 'white'}} >{group}</span> } )
        }
        <ListBox options={self.state.adGroups} value={self.state.selectedAdGroups} onChange={ (e: any) => self.setState({selectedAdGroups: e.value})}  multiple={true} metaKeySelection={false} filter={false}></ListBox>
      </Card>


      {/* Submit / Reset Buttons */}
      <div style={{marginTop: '1em'}}>&nbsp;&nbsp;
        <Button type="button" label="Submit" onClick={() => self.onNewEmployeeFormSubmit()} disabled={disableSubmit} />
        <Button type="button" onClick={() => self.resetForm()} label="Reset Form" />
      </div>

    </form>


    <div>&nbsp;</div>

  </div> }


  <div className="messagesContainer">
    <Messages ref={(el) => self.messages = el}></Messages>
  </div>


  {self.state.initialised && !showForm &&
  <div>
    Could not obtain logged in user from API
  </div>
  }

</Fragment>
    );
  }
}

export default renderFunc;
