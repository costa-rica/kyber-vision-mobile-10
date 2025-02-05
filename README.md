![Kyber Vision Mobile Logo](./assets/images/kyberVisionLogo01.png)

#### v 0.7.0

## Description

- works with API06
- Make the Top navigation bar smaller
- design a new Portrait mode scripting with new design - must have space to tap.
- This version will ask for onboarding number of players to script
- portrait mode will have a space to tap the screen to indicate player whose action is being scripted.
  - implement gesture GestureScreen06 with ActionWheel02 from this repo: https://github.com/costa-rica/NativeStuff17nonRectanglularButtons
- probably needs local database?

## .env

```
EXPO_PUBLIC_API_URL=https://api.kv06.dashanddata.com
EXPO_PUBLIC_API_URL_WORKSTATION=http://192.168.1.193:3000
EXPO_PUBLIC_API_URL_SERVER=https://api.kv06.dashanddata.com
EXPO_PUBLIC_EMAIL=nrodrig1@gmail.com
EXPO_PUBLIC_PASSWORD=test
```

- only: EXPO_PUBLIC_API_URL, EXPO_PUBLIC_EMAIL, and EXPO_PUBLIC_PASSWORD are actually used.

## Installations

1. Navigation

```
   yarn add @react-navigation/native @react-navigation/native-stack
   npx expo install react-native-screens react-native-safe-area-context
```

2. Reducers

   `yarn add react-redux @reduxjs/toolkit`

3. Play video
   `npx expo install expo-video`

4. sense re orienting of screen for video
   `npx expo install expo-screen-orientation`

5. `npx expo install react-native-gesture-handler`

## expo-screen-orientation

- app.json: make sure the orientation is set to "default" otherwise it won't adjust.

```json
{
  "expo": {
    "orientation": "default" // <---- important
  }
}
```

## Play video

video disable native controls: `nativeControls={false}`

## Orientation Descriptions

- o.orientationInfo.orientation

1, portriat, upright
2, portrati, upsidedown
3, landscape, right

- using the right buttons on emulator, from portrait upright, click the bottom button w/ circular arrow pointing right
  4, landscape, left

## Video playback

To use the timeUpdate listener it is important to set the `timeUpdateEventInterval`.

```js
const player = useVideoPlayer(videoSource, (player) => {
  player.loop = true;
  player.play();
  player.timeUpdateEventInterval = 1; //< --- this is what you're missing
});
```
