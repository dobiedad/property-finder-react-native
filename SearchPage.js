'use strict';
import React, { Component } from 'react'

import SearchResults from './SearchResults'

import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableHighlight,
  ActivityIndicator,
  Image
} from 'react-native';

let styles = StyleSheet.create({
  description: {
    marginBottom: 20,
    fontSize: 18,
    textAlign: 'center',
    color: '#656565'
  },
  container: {
    padding: 30,
    marginTop: 65,
    alignItems: 'center'
  },
    flowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch'
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    alignSelf: 'center'
  },
  button: {
    height: 36,
    flex: 0,
    minWidth:36,
    flexDirection: 'row',
    backgroundColor: '#48BBEC',
    borderColor: '#48BBEC',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
  searchInput: {
    height: 36,
    padding: 4,
    marginRight: 5,
    flex: 4,
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#48BBEC',
    borderRadius: 8,
    color: '#48BBEC'
  },
    image: {
    width: 217,
    height: 138
  }
});


class SearchPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      searchString: '',
      loading:false,
      message:'',
      currentPage:1
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.description}>
          Search for houses to buy!
        </Text>
        <Text style={styles.description}>
          Search by place-name, postcode or search near your location.
        </Text>
        <View style={styles.flowRight}>
          <TextInput
            style={styles.searchInput}
            value={this.state.searchString}
            onChange={this.onSearchTextChanged.bind(this)}
            placeholder='Search via name or postcode'/>
          <TouchableHighlight style={styles.button}
              underlayColor='#99d9f4'>
            <Text style={styles.buttonText} onPress={this.onSearchPressed.bind(this)}>Go</Text>
          </TouchableHighlight>
        </View>
        <TouchableHighlight style={styles.button} underlayColor='#99d9f4'>
          <Text style={styles.buttonText} onPress={this.onLocationPressed.bind(this)}>Location</Text>
        </TouchableHighlight>
        <Image source={require('./Resources/house.png')} style={styles.image}/>
        {this.spinner()}
        <Text style={styles.description}>{this.state.message}</Text>
      </View>
    );
  }

  urlForQueryAndPage() {
    var data = {
        country: 'uk',
        pretty: '1',
        encoding: 'json',
        listing_type: 'buy',
        action: 'search_listings',
        page: this.state.currentPage
    };
    this.state.searchType ? data[this.state.searchType] = this.state.searchString : undefined
    console.log(data)


    var querystring = Object.keys(data)
      .map(key => key + '=' + encodeURIComponent(data[key]))
      .join('&');
    return 'https://api.nestoria.co.uk/api?' + querystring;
  };

  onSearchTextChanged(event) {
    console.log('onSearchTextChanged');
    this.setState({ searchString: event.nativeEvent.text });
    console.log(this.state.searchString);
  }

  spinner(){
    let spinner = this.state.loading ?
      (<ActivityIndicator size='large'/> )
    : (<View/>);
    return spinner
  }

  onLocationPressed() {
  navigator.geolocation.getCurrentPosition(
    location => {
      var search = location.coords.latitude + ',' + location.coords.longitude;
      this.setState({ searchString: search ,searchType:'centre_point'});
      var query = this.urlForQueryAndPage.bind(this);
      this._executeQuery(query());
    },
    error => {
      this.setState({
        message: 'There was a problem with obtaining your location: ' + error
      });
    });
  }

  _executeQuery(query) {
    console.log(query);
    this.setState({ loading: true });
    fetch(query)
      .then(response => response.json())
      .then(json => this._handleResponse(json.response))
      .catch(error =>
         this.setState({
          isLoading: false,
          message: 'Something bad happened ' + error
       }));
  }

  nextPage() {
    this.setState({ currentPage: this.state.currentPage + 1 })
    var query = this.urlForQueryAndPage.bind(this);
    this._executeQuery(query());
  }

  _handleResponse(response) {
    const refreshOnBack = () => { Actions.pop(); Actions.refresh(); }
    this.setState({ loading: false , message: '' });
    if (response.application_response_code.substr(0, 1) === '1') {
      console.log('yo')
      this.props.navigator.push({
        title: 'Results',
        component: SearchResults,
        onBack:refreshOnBack,
        passProps: {listings: response.listings}
      });
    } else {
      this.setState({ message: 'Location not recognized; please try again.'});
    }
  }

  onSearchPressed() {
    var query =     this.urlForQueryAndPage.bind(this);
    this.setState({ searchType: 'place_name'});
    this._executeQuery(query());
  }
}

export {SearchPage as default}
