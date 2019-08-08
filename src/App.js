import React, { Component } from 'react';
import './App.css';
import { Container, Row, Col, ListGroup, Form, Card, Button } from 'react-bootstrap';

class App extends Component {
  constructor() {
    super();
    this.state = {
      data: null,
      singleData: null,
      breweryList: null,
      favorites: [],
      isResultsVisible: false,
      inputValue: '',
      id: '',
      name: '',
      type: '',
      street: '',
      city: '',
      state: '',
      postal: '',
      country: '',
      address: ''
    };

    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    if (localStorage.getItem('favorites') !== null) {
      let localStorageFavs = JSON.parse(localStorage.getItem('favorites'));
      this.setState({favorites: localStorageFavs});
    }
  }

  handleChange(e) {
    this.setState({inputValue: e.target.value});
    if(e.target.value) {
      this.callBreweryAPI('/autocomplete/', e.target.value)
      .then(res => {
          this.setState({data: JSON.parse(res.data)});
          if(this.state.data !== null) {
            let names = this.state.data.map(brewery => 
              <ListGroup.Item
                action
                onClick={() => this.handleClick(brewery.id)} 
                key={brewery.id}
              >
                {brewery.name}
              </ListGroup.Item>);
            this.setState({breweryList: names});
          }
        }
      )
      .catch(err => console.log(err));
    }
  }

  handleClick = id => {
    let singleData = null;
    
    this.callBreweryAPI('/singlesearch/', id)
    .then(res => {
      singleData = JSON.parse(res.data);
      this.setState({id: singleData.id});
      this.setState({name: singleData.name});
      this.setState({type: singleData.brewery_type});
      this.setState({street: singleData.street});
      this.setState({city: singleData.city});
      this.setState({state: singleData.state});
      this.setState({postal: singleData.postal_code});
      this.setState({country: singleData.country});
      this.setState({address: encodeURIComponent(`${singleData.name}, ${singleData.street}, ${singleData.city}, ${singleData.state}`)});

      this.setState({isResultsVisible: true});
    })
    .catch(err => console.log(err));
  }

  addToFavorites(id, name) {
    let obj = {};
    obj['id'] = id;
    obj['name'] = name;
    let favs = this.state.favorites;
    favs.push(obj);
    this.setState({favorites: favs});
    localStorage.setItem('favorites', JSON.stringify(this.state.favorites));
  }

  clearFavorites() {
    this.setState({favorites: []});
    localStorage.clear();
  }

  callBreweryAPI = async (urlString, param) => {
    const response = await fetch(`${urlString}${param}`);
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body.message) 
    }
    return body;
  }

  render() {
    return (
      <Container>
        <Row>
          <Col>
            <h1>Find A Brewery</h1>
            <hr />
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Control 
              type='text' 
              value={this.state.inputValue} 
              onChange={this.handleChange}
              placeholder="Search for a brewery..."
            >
            </Form.Control><br />
            <div className="dropdown">
              {this.state.inputValue && <ListGroup>
                {this.state.breweryList}
              </ListGroup>}
            </div>
          </Col>
          <Col>
            {this.state.isResultsVisible && <Card className="info">
              <Card.Body>
                <Card.Title>{this.state.name}</Card.Title> <Card.Subtitle className="mb-2 text-muted">({this.state.type})</Card.Subtitle>
                <Card.Text>
                  
                    {this.state.street}<br />
                  
                  
                    {this.state.city},&nbsp;
                    {this.state.state}&nbsp;
                    {this.state.postal}&nbsp;
                    {this.state.country}
                  
                </Card.Text>
                <Card.Link
                  href={`https://www.google.com/maps/search/?api=1&query=${this.state.address}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Google Map
                </Card.Link><br /><br />
                <Button onClick={() => this.addToFavorites(this.state.id, this.state.name)}>Save as Favorite</Button>
              </Card.Body>
            </Card>}
          </Col>
          <Col>
            <h2>Favorites:</h2>
            <ListGroup variant="flush">
              {this.state.favorites.map((fav, index) => <ListGroup.Item action onClick={() => this.handleClick(fav.id)} key={index}>{fav.name}</ListGroup.Item>)}
            </ListGroup><br />
            <Button onClick={() => this.clearFavorites()} variant="info">Clear All Favorites</Button>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default App;
