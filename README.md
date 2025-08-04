https://timeclockplus.atlassian.net/wiki/x/I4CsHQM

Objective:
Explore and evaluate GPS-based location libraries for React Native that can work without internet connectivity, provide accurate and precise data, and are suitable for both mobile and tablet devices. Assess their reliability and provide a recommended implementation approach.

Acceptance Criteria:

Making sure the existing library we have is able to retrieve location data via GPS.

If not, document a summary of potential libraries that can be used for GPS data retrieval.

A high-level overview of the proposed technical implementation approach.

Documentation outlining the expected accuracy and precision of GPS location data using the chosen method, including any known limitations or influencing factors (e.g., device type, connectivity, environment).

Verify if all the required data associated with restriction configuration is available for the fallback mode from the server.

 

Current Library “react-native-geolocation”:
Currently we are using react-native-geolocation to get location and GPS related data. There are several reasons why we should move away from it:

No Longer Maintained

The library has not been updated in over 3 years.

Issues and pull requests are not actively addressed, raising long-term maintainability concerns.

React Native and Android/iOS platforms have evolved significantly; this library may break or become incompatible with future versions.

Potential for Future Incompatibility
Upcoming React Native versions or platform-specific location service changes (e.g., Android 14/15 or iOS 18) might break existing functionality.

Without active maintenance, we risk sudden failures in production with no immediate fix.

 

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

 

Library Comparison:
Feature

@react-native-community/geolocation

react-native-get-location

react-native-geolocation-service (existing)

Maintained

❌ (deprecated)

✅

❌

Offline GPS support

✅

✅

✅

Accuracy config

Basic

Fine-grained control

Fine-grained control

iOS CoreLocation

✅

✅

✅

Android FusedLocation / GPS

✅

✅

✅

Typescript support

✅

✅

✅

Last updated

❌ Over 3 years ago

✅ Actively maintained

❌ Over 3 years ago


Accuracy and Limitations of GPS
Factor

Effect

Device Type

Newer devices have more accurate GPS modules

Environment

Open skies give best accuracy; buildings, trees reduce precision

Connectivity

GPS works offline, but initial cold fix may be slower

Accuracy Range

Typically ±5m outdoors, ±50m indoors

Cold Start Time

Up to 30s without assisted GPS (A-GPS)

Battery Usage

High accuracy uses more battery (especially with enableHighAccuracy: true)

Fallback Restriction Configuration
✅ All necessary restriction configuration data (zones, user roles, allowed areas) is fetched from the server during app boot and cached locally.

Ensure fallback logic is triggered if real-time fetch fails.

Combine GPS location with cached config to restrict actions as needed.

 

Recommendation
✅ Use react-native-get-location

Actively maintained

Reliable GPS-based location even without internet

Cleaner API and good permission management

Better community activity than existing library

 

How to use?
Install
Install dependency package



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
API
function GetLocation.getCurrentPosition(LocationConfig)
Parameters:

LocationConfig: Configuration object to determine how to get the user current location.

Return:

Promise<Location>: Promise thats resolve to a Location object.

Object LocationConfig
Properties:

enableHighAccuracy: Set true to use 'fine location' (GPS) our false to use 'course location' (Wifi, Bluetooth, 3G). Default: false

timeout: The max time (in milliseconds) that you want to wait to receive a location. Default: 60000 (60 seconds)

rationale?: (Android only) See the React Native docs.

Object Location
Properties:

latitude: The latitude, in degrees.

longitude: The longitude, in degrees.

altitude: The altitude if available, in meters above the WGS 84 reference ellipsoid.

accuracy: The estimated horizontal accuracy of this location, radial, in meters.

speed: The speed if it is available, in meters/second over ground.

time: The UTC time of this fix, in milliseconds since January 1, 1970.

bearing: (Android only) The bearing, in degrees.

provider: (Android only) The name of the provider that generated this fix.

verticalAccuracy: (iOS only) The vertical accuracy of the location. Negative if the altitude is invalid.

course: (iOS only) The course of the location in degrees true North. Negative if course is invalid. (0.0 - 359.9 degrees, 0 being true North)

Error codes
Code

Message

CANCELLED

Location cancelled by user or by another request

UNAVAILABLE

Location service is disabled or unavailable

TIMEOUT

Location request timed out

UNAUTHORIZED

Authorization denied

Visual Evidence:



Screenshot_1754306214.png
GPS data without internet
 

Sample Project: 

