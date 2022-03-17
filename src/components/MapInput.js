import React from 'react';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';

function MapInput(props){
    return (

        <GooglePlacesAutocomplete
            ref={(instance) => { this.GooglePlacesRef = instance }}
            placeholder='Enter location, zip code or city'
            minLength={2} // minimum length of text to search
            autoFocus={false}
            returnKeyType={'search'} // Can be left out for default return key 
            listViewDisplayed={false}    // true/false/undefined
            fetchDetails={true}
            suppressDefaultStyles={true}
            enablePoweredByContainer={false}
            onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
                props.notifyChange(details.geometry.location);
            }}            
            renderLeftButton={() => <View style={{width: 31, height: 21, paddingLeft: 10, alignSelf: "center"}}><Image
                style={{width: 21, height: 21, alignSelf: "center", justifyContent: "center"}}
                source={require('../../assets/images/category/search.png')}
              /></View>}
            renderRightButton={() => 
                <TouchableOpacity 
                    style={{width: 28, height: 18, paddingRight: 10, alignSelf: "center"}} 
                    onPress={() => this.GooglePlacesRef.setAddressText("") }>

                    <Image
                        style={{width: 18, height: 18}}
                        source={require('../../assets/images/category/icn_close_circle.png')}/>

                </TouchableOpacity>}
            styles={{
                textInputContainer: {
                    backgroundColor: '#00000000',
                    flexDirection: 'row',
                    width: '100%'
                },
                textInput: {
                    backgroundColor: '#FFFFFF',
                    flex: 1,
                },
                container: {
                    width: '100%',
                    backgroundColor: '#FFFFFF',
                    borderRadius: 8,                    
                },
                row: {
                    padding: 13,
                    height: 44,
                    flexDirection: 'row',
                },
                separator: {
                    height: 0.5,
                    backgroundColor: '#c8c7cc',
                },
            }}
            query={{
                key: 'AIzaSyAEc9Ghm7un49YahV1EkZA4L3fVJUzDOkk',
                language: 'en'
            }}
            nearbyPlacesAPI='GooglePlacesSearch'
            debounce={300}
        />
    );
}
export default MapInput;
