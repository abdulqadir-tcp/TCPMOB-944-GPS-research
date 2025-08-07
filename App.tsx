import React, {useState} from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Button,
  ActivityIndicator,
  ScrollView,
} from 'react-native';

import GetLocation, {
  Location as GetLocationType,
  LocationErrorCode,
  isLocationError,
} from 'react-native-get-location';

import Geolocation, {
  GeoPosition,
  GeoError,
} from 'react-native-geolocation-service';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 60,
    backgroundColor: '#F5FCFF',
  },
  section: {
    marginBottom: 24,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  jsonBlock: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    backgroundColor: '#eee',
    padding: 10,
    borderRadius: 8,
    marginTop: 8,
  },
  button: {
    marginVertical: 8,
  },
  error: {
    color: 'red',
    marginTop: 8,
  },
});

const App = (): JSX.Element => {
  const [loadingGetLocation, setLoadingGetLocation] = useState(false);
  const [locationGetLocation, setLocationGetLocation] =
      useState<GetLocationType | null>(null);
  const [errorGetLocation, setErrorGetLocation] =
      useState<LocationErrorCode | null>(null);

  const [loadingGeoService, setLoadingGeoService] = useState(false);
  const [locationGeoService, setLocationGeoService] =
      useState<GeoPosition['coords'] | null>(null);
  const [errorGeoService, setErrorGeoService] = useState<string | null>(null);

  const getLocationFromGetLocation = () => {
    setLoadingGetLocation(true);
    setLocationGetLocation(null);
    setErrorGetLocation(null);

    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 30000,
      rationale: {
        title: 'Location permission',
        message: 'The app needs the permission to request your location.',
        buttonPositive: 'Ok',
      },
    })
        .then(loc => {
          setLoadingGetLocation(false);
          setLocationGetLocation(loc);
        })
        .catch(ex => {
          if (isLocationError(ex)) {
            setErrorGetLocation(ex.code);
          } else {
            setErrorGetLocation('UNKNOWN');
          }
          setLoadingGetLocation(false);
        });
  };

  const getLocationFromGeoService = () => {
    setLoadingGeoService(true);
    setLocationGeoService(null);
    setErrorGeoService(null);

    Geolocation.getCurrentPosition(
        position => {
          setLoadingGeoService(false);
          setLocationGeoService(position.coords);
        },
        (error: GeoError) => {
          setLoadingGeoService(false);
          setErrorGeoService(error.message);
        },
        {
          enableHighAccuracy: true,
          timeout: 30000,
          maximumAge: 10000,
          forceRequestLocation: true,
          showLocationDialog: true,
        },
    );
  };

  return (
      <ScrollView style={styles.container}>
        <View style={styles.section}>
          <Text style={styles.title}>📍react-native-get-location</Text>
          <Button
              title="Get Location (get-location)"
              onPress={getLocationFromGetLocation}
              disabled={loadingGetLocation}
          />
          {loadingGetLocation && <ActivityIndicator />}
          {locationGetLocation && (
              <Text style={styles.jsonBlock}>
                {JSON.stringify(locationGetLocation, null, 2)}
              </Text>
          )}
          {errorGetLocation && (
              <Text style={styles.error}>Error: {errorGetLocation}</Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.title}>📍 react-native-geolocation-service</Text>
          <Button
              title="Get Location (geolocation-service)"
              onPress={getLocationFromGeoService}
              disabled={loadingGeoService}
          />
          {loadingGeoService && <ActivityIndicator />}
          {locationGeoService && (
              <Text style={styles.jsonBlock}>
                {JSON.stringify(locationGeoService, null, 2)}
              </Text>
          )}
          {errorGeoService && (
              <Text style={styles.error}>Error: {errorGeoService}</Text>
          )}
        </View>

        <View style={styles.section}>
          <Button
              title="Open App Settings"
              onPress={() => {
                GetLocation.openSettings();
              }}
          />
        </View>
      </ScrollView>
  );
};

export default App;
