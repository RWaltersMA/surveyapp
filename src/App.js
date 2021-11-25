import logo from './MongoDB_Logo.svg';
import './App.css';
import games from './data.json'
import React, { useState, useMemo, useEffect} from 'react';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Carousel } from 'react-bootstrap';
import Select from 'react-select'
import countryList from 'react-select-country-list'
import * as Realm from "realm-web";
import assert from 'assert';
import spinner from './loading.gif'

function DisplayReports() {

return (<div>Live charts will go here...<br/><Carousel>
<Carousel.Item>
  <img width={900} height={500} alt="900x500" src="/carousel.png" />
  <Carousel.Caption>
    <h3>First slide label</h3>
    <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
  </Carousel.Caption>
</Carousel.Item>
<Carousel.Item>
  <img width={900} height={500} alt="900x500" src="/carousel.png" />
  <Carousel.Caption>
    <h3>Second slide label</h3>
    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
  </Carousel.Caption>
</Carousel.Item>
<Carousel.Item>
  <img width={900} height={500} alt="900x500" src="/carousel.png" />
  <Carousel.Caption>
    <h3>Third slide label</h3>
    <p>Praesent commodo cursus magna, vel scelerisque nisl consectetur.</p>
  </Carousel.Caption>
</Carousel.Item>
</Carousel>
</div>)}

function App() {
  const [country_value, setCountryValue] = useState('')
  const [game_value, setGameValue] = useState('')
  const [name_value, setName]=useState('')
  const [hideSubmit, setHideSubmit] = useState(false);
  const [beforeSubmit, setBeforeSubmit] = useState(true); // when true user hasn't submitted yet
  const country_options = useMemo(() => countryList().getData(), [])
  const CountryChangeHandler = country_value => {
    //console.log(country_value);
    setCountryValue(country_value)
  }
  const GameChangeHandler = game_value => {
    setGameValue(game_value)
  }
 
  //pre-select United States
  useEffect(()=>{
    setCountryValue({value: 'US', label: 'United States'});
    setGameValue({value:"AnyTable",label: "--Any Table Game--"});
  
  },[])

  //Give the menu drop downs a custom look
  const customStyles = {
    menu: (provided, state) => ({
      ...provided,
      borderBottom: '1px dotted black',
      color: state.selectProps.menuColor,
      padding: 20,
    }),
    option: (provided, state) => ({
      ...provided,
      color: state.isSelected ? 'white' : '#136b50',
      padding: 20,
    }),
    singleValue: (provided, state) => {
      const opacity = state.isDisabled ? 0.5 : 1;
      const transition = 'opacity 300ms';
  
      return { ...provided, opacity, transition };
    }

  }
    async function SubmitToRealm() {
      setHideSubmit(true);
      const app = new Realm.App({ id: "surveyapp-jchvd" });

      const credentials = Realm.Credentials.anonymous();
      try {
        // Authenticate the user
        const user = await app.logIn(credentials);
        // `App.currentUser` updates to match the logged in user
        assert(user.id === app.currentUser.id);
        const payload={name:name_value,location:country_value.label, game:game_value.value}
      const WTC = await user.functions.WriteToCluster(payload);
      console.log(JSON.stringify(payload));

        //return user
      } catch(err) {
        setHideSubmit(false);
        console.error("Failed to log in", err);
      }
     

      console.log("done!");
      setBeforeSubmit(false);
      setHideSubmit(false);

    }

  return (

    <div className="App">
      <header className="App-header">
      <Container className="p-1 mb-2 bg-light border-dark">
      <div className="d-flex flex-column bd-highlight mb-3">
      <div className="p-2 bd-highlight"><img src={logo} className="M-logo" alt="logo" /></div>
      <div className="p-2 bd-highlight text-dark"><h1>Data movement with MongoDB Atlas and the Confluent Cloud</h1></div>
      <div className="p-2 bd-highlight"><img src='confluent-logo.png' alt="logo2" className="C-logo"/></div>
      </div>
   </Container>

   <Container className="p-3 mb-2 border-dark FormGrid">
      <Form>
      <Form.Group className="p-1 mb-3 text-light">
        <Form.Label>First Name</Form.Label>
        <Form.Control type="text" className="NameCss"  value={name_value} onChange={e => setName(e.target.value)} placeholder="Your first name" />
      </Form.Group>
      <Form.Group className="p-1 mb-3 text-light">
        <Form.Label>Where are you from?</Form.Label>
        <Select options={country_options} value={country_value} styles={customStyles} onChange={CountryChangeHandler} className="w-50" />
      </Form.Group>
      <Form.Group className="p-1 mb-3 text-light">
        <Form.Label>Favorte casino game?</Form.Label>
        <Select options={games} value={game_value} styles={customStyles} onChange={GameChangeHandler} className="w-50" />
      </Form.Group>
      </Form>
   </Container>
   <Container className="p-1 mb-2 border-dark">
   <p className="InstructionsCss">What happens now?<br/><br/>As soon as you click the submit button, this information will be written MongoDB Atlas collection via a MongoDB Realm function.  Once the data is written to the cluster, the Confluent Cloud Atlas Source will pick up the new data and send it to a topic in the Confluent Cloud.  Traditionally, in a more complex event driven applications, data integration from other sources manipulate and transform the data within the Confluent Cloud.  In this example, the Confluent Atlas Sink will read data from the topic and write it out to another collection in the MongoDB Atlas cluster.  Once in MongoDB Atlas, you can create charts, search, archive and query data as needed.<br/><br/>Click on the submit button to add your data to the MongoDB Atlas source collection!</p>
   <p className="InstructionsCss">---TODO: insert picture of the data flow here--</p>
   </Container>
   <Container className="p-1 mb-2 border-dark">
   { hideSubmit ? <div><img src={spinner} className="spinnerCss" alt="loading..." />&nbsp;Writing to MongoDB Atlas</div> : <div> { beforeSubmit ? <Button  variant="primary" size="lg" className="btn-lg btn-block" onClick={SubmitToRealm}>&nbsp;&nbsp;&nbsp;&nbsp;Submit my entry!&nbsp;&nbsp;&nbsp;&nbsp;</Button>:<DisplayReports/>  } </div> } 

   </Container>
   </header>

    </div>

  );
}

export default App;
