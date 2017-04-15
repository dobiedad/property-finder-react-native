'use strict';
import React from 'react'
import ReactNative from 'react-native'

import SearchPage from './SearchPage'

const customStyle = {
  text: {
    color: 'black',
    backgroundColor: 'white',
    fontSize: 30,
    margin: 80
  },
  container: {
    flex: 1
  }
}

const styles = ReactNative.StyleSheet.create(customStyle)

class HelloWorld extends React.Component {
  render() {
    return <ReactNative.Text style={styles.text}>Hello World </ReactNative.Text>
  }
}

class PropertyFinderApp extends React.Component {
  render() {
    return (
      <ReactNative.NavigatorIOS
        style={styles.container}
        initialRoute={{
          title: 'Property Finder',
          component: SearchPage,
        }}/>
    );
  }
}

ReactNative.AppRegistry.registerComponent('PropertyFinder', function() { return PropertyFinderApp });
