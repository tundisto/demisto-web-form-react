import React, { Fragment } from 'react';
// PrimeReact
import { Card } from 'primereact/card';
import { ListBox } from 'primereact/listbox';
import { Button } from 'primereact/button';
import { Messages } from 'primereact/messages';
import { Message } from 'primereact/message';
import { InputSwitch } from 'primereact/inputswitch';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { RadioButton } from 'primereact/radiobutton';


function renderFunc(self: any) {
  
  return () => {
    let showForm = false;
    if (self.state.loggedInUser && self.state.clientOptions && self.state.employeeForm.homeAddress.country && self.state.adGroups) {
      showForm = true;
    }
    let disableSubmit;
    if (showForm) {
      disableSubmit = !self.state.serverApiInit || !self.state.employeeForm.firstName || !self.state.employeeForm.lastName || !self.state.employeeForm.hireDate || !self.state.employeeForm.homeAddress.street1 || !self.state.employeeForm.homeAddress.city || !self.state.employeeForm.homeAddress.state || !self.state.employeeForm.homeAddress.zip || !(self.state.employeeForm.phone.home || self.state.employeeForm.phone.mobile) || self.state.employeeForm.adGroups.length === 0;
    }
    let disableTestApi = self.state.demistoProperties.url === '' || self.state.demistoProperties.apiKey === '';
  
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
              <InputText type="url" name="url" id="url" size={50} value={self.state.demistoProperties.url} onChange={(e: any) => {let s = {...self.state.demistoProperties}; s.url = e.target.value; self.setState({demistoProperties: s}); } } />
              <label htmlFor="url">Demisto Base URL</label>
            </span>
          </div>
          
          {/* Demisto API Key */}
          <div>
            <span className="p-float-label">
              <InputText type="password" id="apiKey" name="apiKey" size={50} value={self.state.demistoProperties.apiKey} onChange={(e: any) => {let s = {...self.state.demistoProperties}; s.apiKey = e.target.value; self.setState({demistoProperties: s}); } } autoComplete="off" />
              <label htmlFor="apiKey">API Key</label>
            </span>
          </div>
          
          {/* Trust Any Certificate */}
          <div>
            <span className="formLabel">Trust Any Certificate&nbsp;&nbsp;</span>
            <InputSwitch checked={self.state.demistoProperties.trustAny} onChange={(e: any) => {let s = {...self.state.demistoProperties}; s.trustAny = e.value; self.setState({demistoProperties: s}); } } style={{verticalAlign: 'middle'}} />
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

    

    { /* (ngSubmit)="onNewEmployeeFormSubmit(newUserForm)" */ }
    { /* novalidate */ }
    <form>

      {/* Employee Details */}

      <Card title="New Employee Detail" subTitle="This section will create a new Demisto incident with the intent of running a playbook for creating a new employee.  This playbook might seek the approval of HR, then create the new user's account in Active Directory, and finally it might then issue them a new laptop.  The workflow can be customised extensively.">
        
        <div className="demistoForm">

          {/* First Name */}
          <div>
            <span className="p-float-label">
              <InputText type="text" name="firstName" id="firstName" value={self.state.employeeForm.firstName} onChange={ (e: any) => {let s = {...self.state.employeeForm}; s.firstName = e.target.value; self.setState({employeeForm: s});}} size={50} autoComplete="off" required />
              <label htmlFor="firstName">First / Middle Name</label>
            </span>
          </div>

          {/* Last Name */}
          <div>
            <span className="p-float-label">
              <InputText name="lastName" id="lastName" value={self.state.employeeForm.lastName} onChange={ (e: any) => {let s = {...self.state.employeeForm}; s.lastName = e.target.value; self.setState({employeeForm: s});}} size={50} autoComplete="off" required />
              <label htmlFor="lastName">Last Name</label>
            </span>
          </div>

          {/* Hire Date */}
          <div>
            <Calendar name="hireDate" value={self.state.employeeForm.hireDate} onChange={ (e: any) => {let s = {...self.state.employeeForm}; s.hireDate = e.value; self.setState({employeeForm: s});}} showIcon={true} required></Calendar>
          </div>

          {/* Home 1 */}
          <div>
            <span className="p-float-label">
              <InputText type="text" name="homeAddressStreet" id="homeAddressStreet" value={self.state.employeeForm.homeAddress.street1} onChange={ (e: any) => {let s = {...self.state.employeeForm}; s.homeAddress.street1 = e.target.value; self.setState({employeeForm: s});}} size={50} required />
              <label htmlFor="homeAddressStreet">Street</label>
            </span>
          </div>
          
          {/* Home 2 */}
          <div>
            <span className="p-float-label">
              <InputText type="text" name="homeAddressStreet2" id="homeAddressStreet2" value={self.state.employeeForm.homeAddress.street2} onChange={ (e: any) => {let s = {...self.state.employeeForm}; s.homeAddress.street2 = e.target.value; self.setState({employeeForm: s});}} size={50} /><br />
              <label htmlFor="homeAddressStreet2">Street 2</label>
            </span>
          </div>

          {/* Country */}
          <div>
            <Dropdown options={self.state.countries} name="homeAddressCountry" value={self.state.employeeForm.homeAddress.country} onChange={ (e: any) => {self.onCountryChanged(e.value)}} optionLabel="name" />
          </div>
          
          {/* City */}
          <div>
            <span className="p-float-label">
              <InputText type="text" name="homeAddressCity" id="homeAddressCity" value={self.state.employeeForm.homeAddress.city} onChange={ (e: any) => {let s = {...self.state.employeeForm}; s.homeAddress.city = e.target.value; self.setState({employeeForm: s});}} size={50} required /><br />
              <label htmlFor="homeAddressCity">City</label>
            </span>
          </div>
              
          {/* State */}
          <div>
            <Dropdown name="homeAddressState" options={self.state.clientOptions.countries[self.state.employeeForm.homeAddress.country.name].states} value={self.state.employeeForm.homeAddress.state} onChange={ (e: any) => {let s = {...self.state.employeeForm}; s.homeAddress.state = e.value; self.setState({employeeForm: s});}} optionLabel="display" dataKey="name" />
          </div>

          {/* ZIP / Postcode */}
          <div>
            <span className="p-float-label">
              <InputText type="text" name="homeAddressZip" id="homeAddressZip" value={self.state.employeeForm.homeAddress.zip} onChange={ (e: any) => {let s = {...self.state.employeeForm}; s.homeAddress.zip = e.target.value; self.setState({employeeForm: s});}} size={50} required />
              <label htmlFor="homeAddressZip">{self.state.clientOptions.countries[self.state.employeeForm.homeAddress.country.name].zipLabel}</label>
            </span>
          </div>

          {/* Home Phone */}
          <div>
            <span className="p-float-label">
              <InputText type="text" name="homePhone" id="homePhone" value={self.state.employeeForm.phone.home} onChange={ (e: any) => {let s = {...self.state.employeeForm}; s.phone.home = e.target.value; self.setState({employeeForm: s});}} size={50} />
              <label htmlFor="homePhone">Home Phone</label>
            </span>
          </div>
      
          {/* Mobile Phone */}
          <div>
            <span className="p-float-label">
              <InputText type="text" name="mobilePhone" id="mobilePhone" value={self.state.employeeForm.phone.mobile} onChange={ (e: any) => {let s = {...self.state.employeeForm}; s.phone.mobile = e.target.value; self.setState({employeeForm: s});}} size={50} />
              <label htmlFor="mobilePhone">Mobile Phone</label>
            </span>
          </div>

        </div>

      </Card>




      { /* Work Location Card */ }
      <Card title="Work Location">
        <Dropdown options={self.state.workLocations} name="workLocation" value={self.state.employeeForm.workLocation} onChange={ (e: any) => {let s = {...self.state.employeeForm}; s.workLocation = e.value; self.setState({employeeForm: s});}} optionLabel="name" />
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
                <RadioButton name="computerType" id={value.name} value={value.name} checked={self.state.employeeForm.computer.type === value.name} onChange={ (e: any) => {self.onComputerTypeChanged(e.value)}} />
                <label htmlFor={value.name} className="p-radiobutton-label">{value.friendlyName}</label>&nbsp;&nbsp;
                &nbsp;&nbsp;
              </span> )
            }

          </div>
          
          {/* Computer Form Factor */}
          <div>
            <span className="formLabel">Form Factor:&nbsp;&nbsp;</span>

            {self.state.clientOptions.computerTypes[self.state.employeeForm.computer.type].laptops &&
              <span>
                <RadioButton name="formFactor" id="laptops" value="laptops" checked={self.state.employeeForm.computer.formFactor === 'laptops'} onChange={ (e: any) => {self.onComputerFormFactorChanged(e.value)}} />
                <label htmlFor="laptops" className="p-radiobutton-label">Laptop</label>&nbsp;&nbsp;
              </span>
            }

            {self.state.clientOptions.computerTypes[self.state.employeeForm.computer.type].desktops &&
              <span>
                <RadioButton name="formFactor" id="desktops" value="desktops" checked={self.state.employeeForm.computer.formFactor === 'desktops'} onChange={ (e: any) => {self.onComputerFormFactorChanged(e.value)}} />
                <label htmlFor="desktops" className="p-radiobutton-label">Desktop</label>&nbsp;&nbsp;
              </span>
            }
            
          </div>

          {/* Computer Model */}
          <div>
            <Dropdown name="computerModel" options={self.state.computerTypes[self.state.employeeForm.computer.type][self.state.employeeForm.computer.formFactor]} value={self.state.employeeForm.computer.model} onChange={ (e: any) => {let s = {...self.state.employeeForm}; s.computer.model = e.value; self.setState({employeeForm: s});}} optionLabel="name" />
          </div>

        </div>

      </Card>




      {/*  AD Groups Card */}
      <Card title="Active Directory Groups">
        <span className="formLabel">Selected Groups: </span>
        {
          self.state.employeeForm.adGroups.map( (group: string) => { return <span key={`adGroup-${group}`} style={{marginRight: '1em', color: 'white'}} >{group}</span> } )
        }
        <ListBox options={self.state.adGroups} value={self.state.employeeForm.adGroups} onChange={ (e: any) => {let s = {...self.state.employeeForm}; s.adGroups = e.value; self.setState({employeeForm: s});}}  multiple={true} metaKeySelection={false} filter={false}></ListBox>
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