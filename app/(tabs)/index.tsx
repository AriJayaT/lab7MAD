import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native';
import MapView, { Marker, Circle, Polyline, Polygon } from 'react-native-maps';
import * as Location from 'expo-location';

export default function HomeScreen() {
  const [geocodeAddress, setGeocodeAddress] = useState<string>("Loading address...");

  const universityCoord = { latitude: -37.721407, longitude: 145.046530 };
  const coffeeCoord = { latitude: -37.721077, longitude: 145.047977 };

  // Part C: Polyline coordinates
  const pathToUni = [
    { latitude: -37.725, longitude: 145.045 },
    { latitude: -37.723, longitude: 145.046 },
    { latitude: -37.721407, longitude: 145.046530 },
  ];

  // Part C: Polygon coordinates
  const weeklyArea = [
    { latitude: -37.720, longitude: 145.045 },
    { latitude: -37.720, longitude: 145.050 },
    { latitude: -37.725, longitude: 145.050 },
    { latitude: -37.725, longitude: 145.045 },
  ];

  // Part D: GeoCoder Implementation
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setGeocodeAddress("Permission denied");
        return;
      }

      // Reverse Geocoding example: Coord -> Address
      try {
        let result = await Location.reverseGeocodeAsync(universityCoord);
        if (result.length > 0) {
          const address = `${result[0].name}, ${result[0].city}`;
          setGeocodeAddress(address);
        }
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  const handleSearchExample = async () => {
    // Geocoding example: Address -> Coord
    try {
      let result = await Location.geocodeAsync("La Trobe University");
      if (result.length > 0) {
        Alert.alert("Geocode Result", `Lat: ${result[0].latitude}, Lon: ${result[0].longitude}`);
      }
    } catch (e) {
      Alert.alert("Error", "Could not find address");
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: -37.721,
          longitude: 145.046,
          latitudeDelta: 0.015,
          longitudeDelta: 0.015,
        }}
        // Part E: Accessibility for the Map itself
        accessible={true}
        accessibilityLabel="Interactive Map of University"
      >
        <Marker
          coordinate={coffeeCoord}
          title="Agora"
          description="My Coffee"
          // Part E: Accessibility
          accessible={true}
          accessibilityLabel="Coffee Shop Marker"
          accessibilityHint="Shows coffee shop location"
        />
        <Marker
          coordinate={universityCoord}
          title="Beth Gleeson Building"
          description="My Home away from home"
          accessible={true}
          accessibilityLabel="University Building Marker"
        />

        <Circle
          center={universityCoord}
          radius={200}
          strokeColor="rgba(0,0,255,0.5)"
          fillColor="rgba(0,0,255,0.2)"
        />

        <Polyline
          coordinates={pathToUni}
          strokeColor="#FF0000"
          strokeWidth={4}
        />

        <Polygon
          coordinates={weeklyArea}
          strokeColor="#000"
          fillColor="rgba(0, 255, 0, 0.1)"
          strokeWidth={1}
        />
      </MapView>

      {/* Part D UI: Geocoder display */}
      <View style={styles.infoBox}>
        <Text style={styles.infoText}>Uni Address: {geocodeAddress}</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={handleSearchExample}
          // Part E: Button accessibility
          accessible={true}
          accessibilityLabel="Search University Button"
          accessibilityRole="button"
        >
          <Text style={styles.buttonText}>Test Geocoder (Search Uni)</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  infoBox: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    right: 20,
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  infoText: {
    fontSize: 14,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  }
});
