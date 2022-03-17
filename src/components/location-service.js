import Geocoder from 'react-native-geocoding';
export const Google_Place_API_Key = "AIzaSyAEc9Ghm7un49YahV1EkZA4L3fVJUzDOkk";

export const getLocation = () => {
    return new Promise(
        (resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
                (data) => resolve(data.coords),
                (err) => reject(err)
            );
        }
    );
}

export const geocodeLocationByName = (locationName) => {
    Geocoder.init(Google_Place_API_Key);
    return new Promise(
        (resolve, reject) => {
            Geocoder.from(locationName)
                .then(json => {
                    const addressComponent = json.results[0].address_components[0];
                    resolve(addressComponent);
                })
                .catch(error => reject(error));
        }
    );
}

export const geocodeLocationByCoords = (lat, long) => {
    Geocoder.init(Google_Place_API_Key);
    return new Promise(
        (resolve, reject) => {
            Geocoder.from(lat, long)
                .then(json => {
                    const addressComponent = json.results[0].address_components;
                    resolve(addressComponent);
                })
                .catch(error => reject(error));
        }
    );
}

