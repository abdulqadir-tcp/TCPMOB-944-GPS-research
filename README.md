https://timeclockplus.atlassian.net/wiki/x/I4CsHQM


Objective:
Explore and evaluate GPS-based location libraries for React Native that can work without internet connectivity, provide accurate and precise data, and are suitable for both mobile and tablet devices. Assess their reliability and provide a recommended implementation approach.

Acceptance Criteria:

Making sure the existing library we have is able to retrieve location data via GPS.
If not, document a summary of potential libraries that can be used for GPS data retrieval.
A high-level overview of the proposed technical implementation approach.
Documentation outlining the expected accuracy and precision of GPS location data using the chosen method, including any known limitations or influencing factors (e.g., device type, connectivity, environment).
Verify if all the required data associated with restriction configuration is available for the fallback mode from the server.


Possible Solutions:
1. @react-native-community/geolocation
⚠️ Deprecated; officially marked as not maintained.
Minimal configuration but limited access to advanced accuracy settings.
Not recommended for new projects.

2. react-native-get-location
✅ Actively maintained
Retrieves GPS location with high accuracy, even without internet
Simple API: GetLocation.getCurrentPosition({ enableHighAccuracy: true })
Good documentation and community support.


How to use?

1. Install dependency package
yarn add react-native-get-location

Android post install
   For Android you need to define the location permissions on AndroidManifest.xml.
   <!-- Define ACCESS_FINE_LOCATION if you will use enableHighAccuracy=true  -->
   <uses-permission android:name="android.permission.ACCESS_FINE_LOCATION"/>
   <!-- Define ACCESS_COARSE_LOCATION if you will use enableHighAccuracy=false  -->
   <uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION"/


iOS post install
  You need to define the permission NSLocationWhenInUseUsageDescription on Info.plist.
   <key>NSLocationWhenInUseUsageDescription</key>
   <string>This app needs to get your location...</string>
 

Usage:
There is only one function that you need to use to get the user's current location.

import GetLocation from 'react-native-get-location'
GetLocation.getCurrentPosition({
    enableHighAccuracy: true,
    timeout: 60000,
})
.then(location => {
    console.log(location);
})
.catch(error => {
    const { code, message } = error;
    console.warn(code, message);
})
