import { useState } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  Platform,
} from "react-native";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import { useSelector } from "react-redux";

// export default function Timeline(props) {
export default function Timeline({
  videoProgress,
  setCurrentTimeManager,
  timelineWidth = Dimensions.get("window").width,
  player,
}) {
  // const userReducer = useSelector((state) => state.user.value);

  const scriptReducer = useSelector((state) => state.script);
  const [timelineLayout, setTimelineLayout] = useState(0);
  const calculateTimelineLength = (event) => {
    const { x, y, width, height } = event.nativeEvent.layout;
    setTimelineLayout({ x, y, width, height });
  };

  // console.log(`[Timeline] scriptReducer: ${scriptReducer.actionsArray.length}`);
  // console.log(
  //   `[Timeline] array[0].timeSTamp: ${scriptReducer.actionsArray[0]?.timeStamp}`
  // );
  // Tap timeline position
  const gestureTapTimeline = Gesture.Tap().onEnd((event) => {
    if (!timelineLayout) return;
    const newProgress = Math.min(
      Math.max(event.x / timelineLayout.width, 0),
      1
    );
    handleTimelineNewPosition(newProgress);
  });

  // Slide timeline position
  const gestureSwipeTimeline = Gesture.Pan().onUpdate((event) => {
    if (!timelineLayout) return;
    const newProgress = Math.min(
      Math.max(event.x / timelineLayout.width, 0),
      1
    );
    handleTimelineNewPosition(newProgress);
  });

  const handleTimelineNewPosition = (newProgress) => {
    const newTime = newProgress * player.duration;
    setCurrentTimeManager(newTime);
  };

  const combinedTimelineGesture = Gesture.Race(
    gestureTapTimeline,
    gestureSwipeTimeline
  );
  return (
    <GestureDetector gesture={combinedTimelineGesture}>
      <View
        style={[styles.vwTimeline, { width: timelineWidth }]}
        onLayout={calculateTimelineLength}
      >
        <View
          style={[
            styles.vwTimelineProgress,
            { width: `${videoProgress * 100}%` },
          ]}
        />
        {/* ---- Timeline progress circle ---- */}
        {/* <View
          style={[
            styles.vwTimelineProgressCircle,
            { left: `${videoProgress * 100}%` },
          ]}
        /> */}
        {/* ---- Markers for actions ---- */}
        {/* {scriptReducer.actionsArray.map((elem, index) => {
          return (
            <View
              key={index} // Adding a unique key here based on the index
              style={[
                styles.vwActionMarker,
                {
                  left: (elem?.timeStamp / player.duration) * timelineWidth,
                },
              ]}
            />
          );
          // }
        })} */}
      </View>
    </GestureDetector>
  );
}
const styles = StyleSheet.create({
  vwTimeline: {
    height: 15,
    backgroundColor: "#170418",
    // borderRadius: 5,
    // borderColor: "rgba(100,100,100,.9)",
    // borderWidth: 2,
    overflow: "visible",
    position: "relative",
  },
  vwTimelineProgress: {
    height: "100%",
    backgroundColor: "#8D0B90",
    // backgroundColor: "red",
    // backgroundColor: "rgba(100,100,100,.4)",
  },
  vwTimelineProgressCircle: {
    position: "absolute",
    top: "50%",
    width: 16,
    height: 16,
    backgroundColor: "#C3C3C3",
    borderRadius: 8, // rule of thumb: half the height and width
    borderColor: "#A3A3A3",
    borderWidth: 2,
    transform: [{ translateY: -8 }, { translateX: -2.5 }],
    zIndex: 1,
  },
  vwActionMarker: {
    backgroundColor: "#838383",
    borderRadius: 5,
    width: 9,
    height: 9,
    position: "absolute",
    top: "50%",
    transform: [{ translateY: -5 }],
    zIndex: 2,
  },
});
