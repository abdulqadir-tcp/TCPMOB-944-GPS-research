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
    button: {
        marginVertical: 8,
    },
    jsonBlock: {
        fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
        backgroundColor: '#eee',
        padding: 10,
        borderRadius: 8,
        marginTop: 8,
    },
    error: {
        color: 'red',
        marginTop: 8,
    },
    tableHeader: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: '#333',
        paddingBottom: 6,
        marginBottom: 4,
    },
    tableRow: {
        flexDirection: 'row',
        marginBottom: 4,
    },
    cellLabel: {
        flex: 1,
        fontWeight: 'bold',
        color: '#555',
    },
    cellValue: {
        flex: 1,
        color: '#222',
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

    const renderComparisonTable = () => {
        const rows = [
            {
                label: 'Latitude',
                getLocationValue: locationGetLocation?.latitude?.toFixed(6) ?? '—',
                geoServiceValue: locationGeoService?.latitude?.toFixed(6) ?? '—',
            },
            {
                label: 'Longitude',
                getLocationValue: locationGetLocation?.longitude?.toFixed(6) ?? '—',
                geoServiceValue: locationGeoService?.longitude?.toFixed(6) ?? '—',
            },
            {
                label: 'Accuracy (m)',
                getLocationValue: locationGetLocation?.accuracy?.toFixed(2) ?? '—',
                geoServiceValue: locationGeoService?.accuracy?.toFixed(2) ?? '—',
            },
        ];

        return (
            <View>
                <View style={styles.tableHeader}>
                    <Text style={styles.cellLabel}></Text>
                    <Text style={styles.cellLabel}>GetLocation</Text>
                    <Text style={styles.cellLabel}>GeoService</Text>
                </View>
                {rows.map((row, idx) => (
                    <View key={idx} style={styles.tableRow}>
                        <Text style={styles.cellLabel}>{row.label}</Text>
                        <Text style={styles.cellValue}>{row.getLocationValue}</Text>
                        <Text style={styles.cellValue}>{row.geoServiceValue}</Text>
                    </View>
                ))}
            </View>
        );
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.section}>
                <Text style={styles.title}>📍 react-native-get-location</Text>
                <Button
                    title="Get Location (get-location)"
                    onPress={getLocationFromGetLocation}
                    disabled={loadingGetLocation}
                />
                {loadingGetLocation && <ActivityIndicator />}
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
                {errorGeoService && (
                    <Text style={styles.error}>Error: {errorGeoService}</Text>
                )}
            </View>

            {(locationGetLocation || locationGeoService) && (
                <View style={styles.section}>
                    <Text style={styles.title}>🧪 Comparison Table</Text>
                    {renderComparisonTable()}
                </View>
            )}

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
