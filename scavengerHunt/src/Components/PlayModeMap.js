import React, {Component} from 'react'
import { AppRegistry, StyleSheet, Text, View, Dimensions, Button, Image } from 'react-native'
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'
const geoFire = require('../../database/firebase.js').geoFire

const mapStyle =
[
    {
        "featureType": "road",
        "stylers": [
            {
                "hue": "#5e00ff"
            },
            {
                "saturation": -79
            }
        ]
    },
    {
        "featureType": "poi",
        "stylers": [
            {
                "saturation": -78
            },
            {
                "hue": "#6600ff"
            },
            {
                "lightness": -47
            },
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "road.local",
        "stylers": [
            {
                "lightness": 22
            }
        ]
    },
    {
        "featureType": "landscape",
        "stylers": [
            {
                "hue": "#6600ff"
            },
            {
                "saturation": -11
            }
        ]
    },
    {},
    {},
    {
        "featureType": "water",
        "stylers": [
            {
                "saturation": -65
            },
            {
                "hue": "#1900ff"
            },
            {
                "lightness": 8
            }
        ]
    },
    {
        "featureType": "road.local",
        "stylers": [
            {
                "weight": 1.3
            },
            {
                "lightness": 30
            }
        ]
    },
    {
        "featureType": "transit",
        "stylers": [
            {
                "visibility": "simplified"
            },
            {
                "hue": "#5e00ff"
            },
            {
                "saturation": -16
            }
        ]
    },
    {
        "featureType": "transit.line",
        "stylers": [
            {
                "saturation": -72
            }
        ]
    },
    {}
]

const {height, width} = Dimensions.get('window')

const styles = StyleSheet.create({
  welcome: {
    fontSize: 20,
    textAlign: 'center',
     margin: 10,
  },
  map: {
    width: width,
    height: height,
    alignSelf: 'center',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#BFD8D2'
  },
  marker: {
    height: 100,
    width: 200
  }
})

export default class PlayModeMap extends Component {
  constructor(props) {
    super(props)
    this.updateKeys = this.updateKeys.bind(this)
    this.state = {
      latitutde: null,
      longitude: null,
      error: null,
      keys: {}
    }
  }

  componentDidMount() {
    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
        })
        if (!this.geoQuery) {
          const gq = this.geoQuery = geoFire.query({
            center: [position.coords.latitude, position.coords.longitude],
            radius: 0.5
          })
          this.geoQuery.on('key_entered', (key, location, distance) => {
            console.log('these are keys', this.state.keys)
            const keys = {...this.state.keys, [key]: {location}}
            this.setState({keys: withDirectionAndDistance(keys, position.coords)}, console.log)
          })
          this.geoQuery.on('key_exited', (key, location, distance) => {
            const keys = Object.assign({}, this.state.keys)
            delete keys[key]
            this.setState({keys: withDirectionAndDistance(keys, position.coords)}, console.log)
          })
        } else {
          this.geoQuery.updateCriteria({
            center: [position.coords.latitude, position.coords.longitude],
            radius: 0.5
          })
        }
        this.updateKeys(position)
      },
      (error) => this.setState({ error: error.message }),
      { enableHighAccuracy: true, timeout: 500, maximumAge: 1000, distanceFilter: 10 }
    )
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchId)
  }

  updateKeys(position) {
      if(Object.keys(this.state.keys).length !== 0) {
        console.log('keys !!!!!!', this.state.keys)
        this.setState({keys: withDirectionAndDistance(this.state.keys, position.coords)}, console.log)
      }
  }

  render() {
    return (
      <View style={styles.container}>
        <MapView
          provider={PROVIDER_GOOGLE}
          customMapStyle={mapStyle}
          style={styles.map}
          initialRegion={{
            latitude: this.state.latitude || 40.7050758,
            longitude: this.state.longitude || -74.00916039999998,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005
          }}
          showsBuildings
        >
        { Object.keys(this.state.keys).length > 0 ? Object.keys(this.state.keys).map((key) => {
          console.log('keys in render', this.state.keys[key].location)
          return (
              <MapView.Marker
                coordinate={{latitude: this.state.keys[key].location[0], longitude: this.state.keys[key].location[1]}}
                image={require('../../public/pusheenMarker.png')}
              />
            )
          }) : null
        }
        </MapView>
      </View>
    )
  }

}

function getDistance(lat1, lon1, lat2, lon2) {
  const deg2rad = function(deg) {
    return deg * (Math.PI / 180)
  }
  var radius = 6371
  var dlat = deg2rad(lat2 - lat1)
  var dlon = deg2rad(lon2 - lon1)
  var a = Math.sin(dlat / 2) * Math.sin(dlat / 2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dlon / 2) * Math.sin(dlon / 2)
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  var d = radius * c
  return d
}

function getDirection(lat1, lon1, lat2, lon2) {
  Number.prototype.toRad = function() {
    return this * Math.PI / 180
  }
  var a = Math.sin(lon2.toRad() - lon1.toRad()) * Math.cos(lat2.toRad())
  var b = Math.cos(lat1.toRad()) * Math.sin(lat2.toRad()) - Math.sin(lat1.toRad()) * Math.cos(lat2.toRad()) * Math.cos(lon2.toRad() - lon1.toRad())
  return Math.atan2(a, b) * 180 / Math.PI
}

function withDirectionAndDistance(places, coords) {
  return Object.keys(places)
    .map(key => [key, placeWithDirectionAndDistance(places[key], coords)])
    .reduce((obj, [key, value]) => ({
        ...obj,
        [key]: value
    }), {})
}

function placeWithDirectionAndDistance(place, {latitude, longitude}) {
  const [placeLat, placeLng] = place.location
  return {
    ...place,
    direction: getDirection(latitude, longitude,
                            placeLat, placeLng),
    distance: getDistance(latitude, longitude,
                          placeLat, placeLng),
  }
}
