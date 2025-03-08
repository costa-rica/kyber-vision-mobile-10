import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
} from "react-native";
import SinglePickerWithSideBorders from "./pickers/SinglePickerWithSideBorders";
import DoublePickerWithSideBorders from "./pickers/DoublePickerWithSideBorders";
import { useState, useEffect } from "react";
import ButtonKv from "./ButtonKv";

// SwipePad
import {
  GestureHandlerRootView,
  GestureDetector,
  Gesture,
} from "react-native-gesture-handler";
import { deleteScript } from "../../reducers/script";
import { useDispatch, useSelector } from "react-redux";

export default function ScriptingLandscapeLive(props) {
  const scriptReducer = useSelector((state) => state.script);
  const dispatch = useDispatch();
  const handleBackPress = async (navigation) => {
    await ScreenOrientation.lockAsync(
      ScreenOrientation.OrientationLock.PORTRAIT_UP
    );
    navigation.goBack();
  };
  const [vwVolleyballCourtCoords, setVwVolleyballCourtCoords] = useState(null);
  const handleContainerMiddleLayout = (event) => {
    console.log(`- 1 handleContainerMiddleLayout event ${Platform.OS}-`);
    console.log(event.nativeEvent.layout);

    const { width, height, x, y } = event.nativeEvent.layout;

    setVwVolleyballCourtCoords({ x, y, width, height }); // Store this separately first

    props.setGestureViewCoords((prev) => ({
      ...prev,
      x: x,
      width: width,
      y: y,
      height: height,
    }));
  };

  useEffect(() => {
    console.log("Updating gesture view coordinates after parent view layout");
  }, [vwVolleyballCourtCoords]);
  const handleImageLayout = (event) => {
    console.log(`- 2 handleImageLayout event-`);
    console.log(event.nativeEvent.layout);

    const { x, y, width, height } = event.nativeEvent.layout;
    console.log(`x: ${x}, y: ${y}, width: ${width}, height: ${height}`);
    props.setGestureViewCoords((prev) => {
      const new_y = prev.y + y;
      console.log(`prev.y: ${prev.y}, new_y: ${new_y}`);

      return {
        ...prev,
        // y: new_y,
        x: x,
        width: width,
        height: height,
      };
    });
    setVwVolleyballCourtCoords((prev) => {
      const new_y = prev.y + y;
      console.log(`prev.y: ${prev.y}, new_y: ${new_y}`);

      return {
        ...prev,
        // y: new_y,
        x: x,
        width: width,
        height: height,
      };
    });
    console.log(`setGestureViewCoords have been set`);
  };
  useEffect(() => {}, [props.gestureViewCoords]);

  return (
    <View style={styles.container}>
      <View style={styles.containerTop}>
        <View>
          <TouchableOpacity
            // style={styles.touchOpCircle}
            onPress={() => {
              handleBackPress(props.navigation);
            }}
          >
            <Image
              //style={{ width: 24, height: 24 }} // Adjust based on expected size
              source={require("../../assets/images/btnBackArrowTransparent.png")}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
        <View style={styles.vwTopCenterBlurryCapsule}>
          <View style={styles.vwPositionCapsule}>
            <SinglePickerWithSideBorders
              arrayElements={scriptReducer.rotationArray}
              // onChange={props.setRotation}
              onChange={props.setCurrentActionRotation}
              // value={props.rotation}
              value={props.currentActionRotation}
              style={{
                ...props.stdPickerStyle,
                itemHeight: 30,
                fontSize: 15,
                width: 50,
              }}
              pickerName="rotationLandscape"
            />
          </View>
          <View style={styles.vwTeamName}>
            <Text style={styles.txtTeamName}>
              {scriptReducer.scriptingTeamObject.teamName}
            </Text>
          </View>
          <View style={styles.vwSetCircles}>
            {Array.from({ length: 3 }).map((_, index) => (
              <TouchableOpacity
                key={index}
                onPress={() =>
                  props.handleSetCirclePress("analyzed", index + 1)
                }
                style={[
                  styles.touchOpSetsCircle,
                  props.setsTeamAnalyzed > index &&
                    styles.touchOpSetsCircleFilled,
                ]}
              />
            ))}
          </View>
          <View style={styles.vwScore}>
            <DoublePickerWithSideBorders
              arrayElements={scriptReducer.pointsArray}
              onChange={props.setScoreTeamAnalyzed}
              value={props.scoreTeamAnalyzed}
              onChange02={props.setScoreTeamOpponent}
              value02={props.scoreTeamOpponent}
              style={{
                ...props.stdPickerStyle,
                backgroundColor: "rgba(74,74,74,0.56)",
              }}
              pickerName="scoreTeamAnalyzedLandscape"
              pickerName02="scoreTeamOpponentLandscape"
            />
          </View>
          <View style={styles.vwSetCircles}>
            {Array.from({ length: 3 }).map((_, index) => (
              <TouchableOpacity
                key={index}
                onPress={() =>
                  props.handleSetCirclePress("opponent", index + 1)
                }
                style={[
                  styles.touchOpSetsCircle,
                  props.setsTeamOpponent > index &&
                    styles.touchOpSetsCircleFilled,
                ]}
              />
            ))}
          </View>
          <View style={styles.vwTeamName}>
            <Text style={styles.txtTeamName}>ext.</Text>
          </View>
        </View>
        <View style={styles.vwSettingsGearBtn}>
          <TouchableOpacity
            onPress={() => {
              handleBackPress(props.navigation);
            }}
          >
            <Image
              style={{ width: 24, height: 24 }} // Adjust based on expected size
              source={require("../../assets/images/btnGear.png")}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={styles.containerMiddle}
        onLayout={(event) => handleContainerMiddleLayout(event)}
      >
        {/* <View style={{ position: "absolute", top: 50 }}>
          <Text>
            vwVolleyballCourtCoords x: {vwVolleyballCourtCoords?.x} y:{" "}
            {vwVolleyballCourtCoords?.y}, width:{" "}
            {vwVolleyballCourtCoords?.width}, height:{" "}
            {vwVolleyballCourtCoords?.height}
          </Text>
        </View> */}
        <GestureHandlerRootView
          // onLayout={(event) => handleGestureHandlerRootViewLayout(event)}
          style={{ alignItems: "center" }}
        >
          <GestureDetector gesture={props.combinedGestures}>
            <View style={styles.vwVolleyballCourt}>
              <Image
                source={require("../../assets/images/imgVollyballCourt.png")}
                alt="imgVollyballCourt"
                // width="100" // Ensures it takes the full width of the container
                // height="100" // Ensures it takes the full height of vwVollyballCourt
                resizeMode="contain" // Prevents stretching
                style={styles.imgVolleyBallCourt}
                onLayout={(event) => handleImageLayout(event)}
              />

              {/*Top Left Position Lines P4 */}
              <View
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: props.stdLengthOfPositionLines,
                  borderColor: props.stdColorOfPositionLines,
                  borderWidth: props.stdWidthOfPoistionLines,
                  borderStyle: props.stdStyleOfPositionLines,
                }}
              />
              <View
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  height: props.stdLengthOfPositionLines,
                  borderColor: props.stdColorOfPositionLines,
                  borderWidth: props.stdWidthOfPoistionLines,
                  borderStyle: props.stdStyleOfPositionLines,
                }}
              />
              {/* TOP Center Position Lines P4-P3 */}
              <View
                style={{
                  position: "absolute",
                  top: 0,
                  left:
                    vwVolleyballCourtCoords?.width / 3 -
                    props.stdLengthOfPositionLines,
                  width: props.stdLengthOfPositionLines,
                  borderColor: props.stdColorOfPositionLines,
                  borderWidth: props.stdWidthOfPoistionLines,
                  borderStyle: props.stdStyleOfPositionLines,
                }}
              />
              <View
                style={{
                  position: "absolute",
                  top: 0,
                  left: vwVolleyballCourtCoords?.width / 3,
                  height: props.stdLengthOfPositionLines,
                  borderColor: props.stdColorOfPositionLines,
                  borderWidth: props.stdWidthOfPoistionLines,
                  borderStyle: props.stdStyleOfPositionLines,
                }}
              />
              <View
                style={{
                  position: "absolute",
                  top: 0,
                  left: vwVolleyballCourtCoords?.width / 3,
                  width: props.stdLengthOfPositionLines,
                  borderColor: props.stdColorOfPositionLines,
                  borderWidth: props.stdWidthOfPoistionLines,
                  borderStyle: props.stdStyleOfPositionLines,
                }}
              />
              {/* TOP Center Position Lines P3-P2 */}
              <View
                style={{
                  position: "absolute",
                  top: 0,
                  left:
                    vwVolleyballCourtCoords?.width * (2 / 3) -
                    props.stdLengthOfPositionLines,
                  width: props.stdLengthOfPositionLines,
                  borderColor: props.stdColorOfPositionLines,
                  borderWidth: props.stdWidthOfPoistionLines,
                  borderStyle: props.stdStyleOfPositionLines,
                }}
              />
              <View
                style={{
                  position: "absolute",
                  top: 0,
                  left: vwVolleyballCourtCoords?.width * (2 / 3),
                  height: props.stdLengthOfPositionLines,
                  borderColor: props.stdColorOfPositionLines,
                  borderWidth: props.stdWidthOfPoistionLines,
                  borderStyle: props.stdStyleOfPositionLines,
                }}
              />
              <View
                style={{
                  position: "absolute",
                  top: 0,
                  left: vwVolleyballCourtCoords?.width * (2 / 3),
                  width: props.stdLengthOfPositionLines,
                  borderColor: props.stdColorOfPositionLines,
                  borderWidth: props.stdWidthOfPoistionLines,
                  borderStyle: props.stdStyleOfPositionLines,
                }}
              />
              {/*Top Right Position Lines P2 */}
              <View
                style={{
                  position: "absolute",
                  top: 0,
                  left:
                    vwVolleyballCourtCoords?.width -
                    props.stdLengthOfPositionLines,
                  width: props.stdLengthOfPositionLines,
                  borderColor: props.stdColorOfPositionLines,
                  borderWidth: props.stdWidthOfPoistionLines,
                  borderStyle: props.stdStyleOfPositionLines,
                }}
              />
              <View
                style={{
                  position: "absolute",
                  top: 0,
                  left: vwVolleyballCourtCoords?.width,
                  height: props.stdLengthOfPositionLines,
                  borderColor: props.stdColorOfPositionLines,
                  borderWidth: props.stdWidthOfPoistionLines,
                  borderStyle: props.stdStyleOfPositionLines,
                }}
              />

              {/*Middle Left Position Lines P4-P5 */}
              <View
                style={{
                  position: "absolute",
                  top:
                    vwVolleyballCourtCoords?.height / 2 -
                    props.stdLengthOfPositionLines / 2,
                  left: 0,
                  height: props.stdLengthOfPositionLines,
                  borderColor: props.stdColorOfPositionLines,
                  borderWidth: props.stdWidthOfPoistionLines,
                  borderStyle: props.stdStyleOfPositionLines,
                }}
              />
              <View
                style={{
                  position: "absolute",
                  top: vwVolleyballCourtCoords?.height / 2,
                  left: 0,
                  width: props.stdLengthOfPositionLines,
                  borderColor: props.stdColorOfPositionLines,
                  borderWidth: props.stdWidthOfPoistionLines,
                  borderStyle: props.stdStyleOfPositionLines,
                }}
              />
              <View
                style={{
                  position: "absolute",
                  top: vwVolleyballCourtCoords?.height / 2,
                  left: 0,
                  height: props.stdLengthOfPositionLines,
                  borderColor: props.stdColorOfPositionLines,
                  borderWidth: props.stdWidthOfPoistionLines,
                  borderStyle: props.stdStyleOfPositionLines,
                }}
              />
              {/*Middle Left Position Lines P4-P3-P5-P6 */}
              <View
                style={{
                  position: "absolute",
                  top:
                    vwVolleyballCourtCoords?.height / 2 -
                    props.stdLengthOfPositionLines,
                  left: vwVolleyballCourtCoords?.width / 3,
                  height: props.stdLengthOfPositionLines,
                  borderColor: props.stdColorOfPositionLines,
                  borderWidth: props.stdWidthOfPoistionLines,
                  borderStyle: props.stdStyleOfPositionLines,
                }}
              />
              <View
                style={{
                  position: "absolute",
                  top: vwVolleyballCourtCoords?.height / 2,
                  left: vwVolleyballCourtCoords?.width / 3,
                  width: props.stdLengthOfPositionLines,
                  borderColor: props.stdColorOfPositionLines,
                  borderWidth: props.stdWidthOfPoistionLines,
                  borderStyle: props.stdStyleOfPositionLines,
                }}
              />
              <View
                style={{
                  position: "absolute",
                  top: vwVolleyballCourtCoords?.height / 2,
                  left: vwVolleyballCourtCoords?.width / 3,
                  height: props.stdLengthOfPositionLines,
                  borderColor: props.stdColorOfPositionLines,
                  borderWidth: props.stdWidthOfPoistionLines,
                  borderStyle: props.stdStyleOfPositionLines,
                  backgroundColor: props.stdColorOfPositionLines,
                }}
              />
              <View
                style={{
                  position: "absolute",
                  top: vwVolleyballCourtCoords?.height / 2,
                  left:
                    vwVolleyballCourtCoords?.width / 3 -
                    props.stdLengthOfPositionLines,
                  width: props.stdLengthOfPositionLines,
                  borderColor: props.stdColorOfPositionLines,
                  borderWidth: props.stdWidthOfPoistionLines,
                  borderStyle: props.stdStyleOfPositionLines,
                  backgroundColor: props.stdColorOfPositionLines,
                }}
              />
              {/*Middle Left Position Lines P3-P2-P6-P1 */}
              <View
                style={{
                  position: "absolute",
                  top:
                    vwVolleyballCourtCoords?.height / 2 -
                    props.stdLengthOfPositionLines,
                  left: vwVolleyballCourtCoords?.width * (2 / 3),
                  height: props.stdLengthOfPositionLines,
                  borderColor: props.stdColorOfPositionLines,
                  borderWidth: props.stdWidthOfPoistionLines,
                  borderStyle: props.stdStyleOfPositionLines,
                }}
              />
              <View
                style={{
                  position: "absolute",
                  top: vwVolleyballCourtCoords?.height / 2,
                  left: vwVolleyballCourtCoords?.width * (2 / 3),
                  width: props.stdLengthOfPositionLines,
                  borderColor: props.stdColorOfPositionLines,
                  borderWidth: props.stdWidthOfPoistionLines,
                  borderStyle: props.stdStyleOfPositionLines,
                }}
              />
              <View
                style={{
                  position: "absolute",
                  top: vwVolleyballCourtCoords?.height / 2,
                  left: vwVolleyballCourtCoords?.width * (2 / 3),
                  height: props.stdLengthOfPositionLines,
                  borderColor: props.stdColorOfPositionLines,
                  borderWidth: props.stdWidthOfPoistionLines,
                  borderStyle: props.stdStyleOfPositionLines,
                }}
              />
              <View
                style={{
                  position: "absolute",
                  top: vwVolleyballCourtCoords?.height / 2,
                  left:
                    vwVolleyballCourtCoords?.width * (2 / 3) -
                    props.stdLengthOfPositionLines,
                  width: props.stdLengthOfPositionLines,
                  borderColor: props.stdColorOfPositionLines,
                  borderWidth: props.stdWidthOfPoistionLines,
                  borderStyle: props.stdStyleOfPositionLines,
                }}
              />
              {/*Middle Right Position Lines P2-P1 */}
              <View
                style={{
                  position: "absolute",
                  top:
                    vwVolleyballCourtCoords?.height / 2 -
                    props.stdLengthOfPositionLines,
                  left: vwVolleyballCourtCoords?.width,
                  height: props.stdLengthOfPositionLines,
                  borderColor: props.stdColorOfPositionLines,
                  borderWidth: props.stdWidthOfPoistionLines,
                  borderStyle: props.stdStyleOfPositionLines,
                }}
              />
              <View
                style={{
                  position: "absolute",
                  top: vwVolleyballCourtCoords?.height / 2,
                  left:
                    vwVolleyballCourtCoords?.width -
                    props.stdLengthOfPositionLines,
                  width: props.stdLengthOfPositionLines,
                  borderColor: props.stdColorOfPositionLines,
                  borderWidth: props.stdWidthOfPoistionLines,
                  borderStyle: props.stdStyleOfPositionLines,
                }}
              />
              <View
                style={{
                  position: "absolute",
                  top: vwVolleyballCourtCoords?.height / 2,
                  left: vwVolleyballCourtCoords?.width,
                  height: props.stdLengthOfPositionLines,
                  borderColor: props.stdColorOfPositionLines,
                  borderWidth: props.stdWidthOfPoistionLines,
                  borderStyle: props.stdStyleOfPositionLines,
                }}
              />
              {/*Bottom Left Position Lines P5*/}
              <View
                style={{
                  position: "absolute",
                  top:
                    vwVolleyballCourtCoords?.height -
                    props.stdLengthOfPositionLines,
                  left: 0,
                  height: props.stdLengthOfPositionLines,
                  borderColor: props.stdColorOfPositionLines,
                  borderWidth: props.stdWidthOfPoistionLines,
                  borderStyle: props.stdStyleOfPositionLines,
                }}
              />
              <View
                style={{
                  position: "absolute",
                  top: vwVolleyballCourtCoords?.height,
                  left: 0,
                  width: props.stdLengthOfPositionLines,
                  borderColor: props.stdColorOfPositionLines,
                  borderWidth: props.stdWidthOfPoistionLines,
                  borderStyle: props.stdStyleOfPositionLines,
                }}
              />
              {/* Bottom Center Position Lines P5-P6 */}
              <View
                style={{
                  position: "absolute",
                  top: vwVolleyballCourtCoords?.height,
                  left:
                    vwVolleyballCourtCoords?.width / 3 -
                    props.stdLengthOfPositionLines,
                  width: props.stdLengthOfPositionLines,
                  borderColor: props.stdColorOfPositionLines,
                  borderWidth: props.stdWidthOfPoistionLines,
                  borderStyle: props.stdStyleOfPositionLines,
                }}
              />
              <View
                style={{
                  position: "absolute",
                  top:
                    vwVolleyballCourtCoords?.height -
                    props.stdLengthOfPositionLines,
                  left: vwVolleyballCourtCoords?.width / 3,
                  height: props.stdLengthOfPositionLines,
                  borderColor: props.stdColorOfPositionLines,
                  borderWidth: props.stdWidthOfPoistionLines,
                  borderStyle: props.stdStyleOfPositionLines,
                }}
              />
              <View
                style={{
                  position: "absolute",
                  top: vwVolleyballCourtCoords?.height,
                  left: vwVolleyballCourtCoords?.width / 3,
                  width: props.stdLengthOfPositionLines,
                  borderColor: props.stdColorOfPositionLines,
                  borderWidth: props.stdWidthOfPoistionLines,
                  borderStyle: props.stdStyleOfPositionLines,
                }}
              />
              {/* Bottom Center Position Lines P6-P1 */}
              <View
                style={{
                  position: "absolute",
                  top: vwVolleyballCourtCoords?.height,
                  left:
                    vwVolleyballCourtCoords?.width * (2 / 3) -
                    props.stdLengthOfPositionLines,
                  width: props.stdLengthOfPositionLines,
                  borderColor: props.stdColorOfPositionLines,
                  borderWidth: props.stdWidthOfPoistionLines,
                  borderStyle: props.stdStyleOfPositionLines,
                }}
              />
              <View
                style={{
                  position: "absolute",
                  top:
                    vwVolleyballCourtCoords?.height -
                    props.stdLengthOfPositionLines,
                  left: vwVolleyballCourtCoords?.width * (2 / 3),
                  height: props.stdLengthOfPositionLines,
                  borderColor: props.stdColorOfPositionLines,
                  borderWidth: props.stdWidthOfPoistionLines,
                  borderStyle: props.stdStyleOfPositionLines,
                }}
              />
              <View
                style={{
                  position: "absolute",
                  top: vwVolleyballCourtCoords?.height,
                  left: vwVolleyballCourtCoords?.width * (2 / 3),
                  width: props.stdLengthOfPositionLines,
                  borderColor: props.stdColorOfPositionLines,
                  borderWidth: props.stdWidthOfPoistionLines,
                  borderStyle: props.stdStyleOfPositionLines,
                }}
              />
              {/*Bottom Right Position Lines P1 */}
              <View
                style={{
                  position: "absolute",
                  top: vwVolleyballCourtCoords?.height,
                  left:
                    vwVolleyballCourtCoords?.width -
                    props.stdLengthOfPositionLines +
                    props.stdWidthOfPoistionLines,
                  width: props.stdLengthOfPositionLines,
                  borderColor: props.stdColorOfPositionLines,
                  borderWidth: props.stdWidthOfPoistionLines,
                  borderStyle: props.stdStyleOfPositionLines,
                }}
              />
              <View
                style={{
                  position: "absolute",
                  top:
                    vwVolleyballCourtCoords?.height -
                    props.stdLengthOfPositionLines +
                    props.stdWidthOfPoistionLines,
                  left: vwVolleyballCourtCoords?.width,
                  height: props.stdLengthOfPositionLines,
                  borderColor: props.stdColorOfPositionLines,
                  borderWidth: props.stdWidthOfPoistionLines,
                  borderStyle: props.stdStyleOfPositionLines,
                }}
              />
            </View>
          </GestureDetector>
        </GestureHandlerRootView>
        <View style={styles.vwScriptingManagement}>
          {/* <View style={styles.vwScriptingManagementLeft}>
            <ButtonKv
              onPress={() => {
                Alert.alert("start");
                props.setPosition((prev) => prev + 1);
              }}
              // colorBackground={"#970F9A"}
              // colorText={"white"}
              // width={140}
              // fontSize={20}
              style={{
                backgroundColor: "#970F9A",
                color: "white",
                width: 140,
                fontSize: 20,
              }}
            >
              Start
            </ButtonKv>
          </View> */}
          <View style={styles.vwScriptingManagementRight}>
            <View style={styles.vwScriptingManagementRightLeft}>
              <ButtonKv
                onPress={() => props.handlePressedServeOrReception("S")}
                style={{
                  backgroundColor: "#310732",
                  color: "white",
                  width: 40,
                  fontSize: 20,
                }}
              >
                S
              </ButtonKv>
              <ButtonKv
                onPress={() => props.handlePressedServeOrReception("R")}
                style={{
                  backgroundColor: "#310732",
                  color: "white",
                  width: 40,
                  fontSize: 20,
                }}
              >
                R
              </ButtonKv>
            </View>
            <View style={styles.vwScriptingManagementRightRight}>
              <ButtonKv
                onPress={() => props.handleWinRallyButtonPress()}
                style={{
                  backgroundColor: "#970F9A",
                  color: "white",
                  width: 40,
                  fontSize: 20,
                }}
              >
                W
              </ButtonKv>
              <ButtonKv
                onPress={() => props.setScoreTeamOpponent((prev) => prev + 1)}
                style={{
                  backgroundColor: "#970F9A",
                  color: "white",
                  width: 40,
                  fontSize: 20,
                }}
              >
                L
              </ButtonKv>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.containerBottom}>
        <View
          style={[
            styles.vwBlackLineDivider,
            { width: Dimensions.get("window").width },
          ]}
        />
        <View style={styles.vwActionDetails}>
          <View style={styles.vwActionDetailsQuality}>
            <SinglePickerWithSideBorders
              arrayElements={scriptReducer.qualityArray}
              // onChange={props.handleChangeQuality}
              onChange={props.setCurrentActionQuality}
              // value={
              //   scriptReducer.actionsArray[
              //     scriptReducer.actionsArray.length - 1
              //   ]?.quality || "0"
              // }
              value={props.currentActionQuality}
              style={props.stdPickerStyle}
              pickerName="qualityLandscape"
            />
          </View>
          <View style={styles.vwActionDetailsPosition}>
            <SinglePickerWithSideBorders
              // arrayElements={[1, 2, 3, 4, 5, 6]}
              arrayElements={scriptReducer.positionalAreasArray}
              // onChange={props.setPositionalArea}
              onChange={props.setCurrentActionPositionalArea}
              // value={props.positionalArea}
              value={props.currentActionPositionalArea}
              style={props.stdPickerStyle}
              pickerName="positionalAreaLandscape"
            />
          </View>
          <View style={styles.vwActionDetailsPlayer}>
            <SinglePickerWithSideBorders
              arrayElements={props.truncateArrayElements([
                scriptReducer.scriptingForPlayerObject?.firstName,
              ])}
              // onChange={props.setPlayerName}
              onChange={props.setCurrentActionPlayerName}
              // value={props.playerName.substring(
              //   0,
              //   props.stdTruncatePlayerNameLength
              // )}
              value={props.currentActionPlayerName}
              style={{ ...props.stdPickerStyle, width: 60, fontSize: 18 }}
              selectedIsBold={false}
              pickerName="playerNameLandscape"
            />
          </View>
          <View style={styles.vwActionDetailsType}>
            <SinglePickerWithSideBorders
              arrayElements={scriptReducer.typesArray}
              // onChange={props.handleChangeType}
              onChange={props.handleChangeType}
              // value={
              //   scriptReducer.actionsArray[
              //     scriptReducer.actionsArray.length - 1
              //   ]?.type || "Bloc"
              // }
              value={props.currentActionType}
              style={{ ...props.stdPickerStyle, width: 50, fontSize: 20 }}
              selectedIsBold={false}
              pickerName="typeLandscape"
            />
          </View>
          <View style={styles.vwActionDetailsSubtype}>
            <SinglePickerWithSideBorders
              arrayElements={scriptReducer.subtypesArray}
              // onChange={props.handleChangeSubtype}
              onChange={props.handleChangeSubtype}
              // value={
              //   scriptReducer.actionsArray[
              //     scriptReducer.actionsArray.length - 1
              //   ]?.subtype || ""
              // }
              value={props.currentActionSubtype}
              style={{ ...props.stdPickerStyle, width: 60, fontSize: 15 }}
              pickerName="subtypeLandscape"
            />
          </View>
          <View style={styles.vwScriptingManagementLeft}>
            <ButtonKv
              onPress={() => {
                props.sendScript();
                // dispatch(deleteScript());
                // props.setStdColorOfPositionLines("transparent");
              }}
              style={{
                backgroundColor: "#970F9A",
                width: 230,
                fontSize: 25,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              Send {scriptReducer.actionsArray.length} actions
            </ButtonKv>
          </View>
        </View>
      </View>
    </View>
  );
}

// Styles for main container
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#F2EBF2",
    // justifyContent: "center",
  },
  containerTop: {
    // borderWidth: 1,
    // borderStyle: "dashed",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  vwTopCenterBlurryCapsule: {
    flexDirection: "row",
    width: "80%",
    // borderWidth: 1,
    // borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#806181",
    borderRadius: 24,
    gap: 15,
  },
  vwPositionCapsule: {
    // backgroundColor: "gray",
  },
  vwTeamName: {
    backgroundColor: "#806181",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
  },
  txtTeamName: {
    color: "white",
  },
  vwSetCircles: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "green",
  },
  touchOpSetsCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "white",
    marginHorizontal: 1,
    backgroundColor: "white",
  },
  touchOpSetsCircleFilled: {
    backgroundColor: "gray",
  },
  vwSettingsGearBtn: {
    justifyContent: "center",
    alignItems: "center",
  },
  containerMiddle: {
    flex: 1,
    // borderWidth: 1,
    // borderStyle: "dashed",
    // justifyContent: "center",
    alignItems: "center",
  },
  vwVolleyballCourt: {
    // backgroundColor: "green",
    justifyContent: "center",
  },
  imgVolleyBallCourt: {
    alignSelf: "center", // <-- necessary for centering image
    height: "95%",
    // width: undefined,
    aspectRatio: 16 / 9, // <-- necessary for good sizing of image
    resizeMode: "contain",
  },
  vwScriptingManagement: {
    position: "absolute",
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    // backgroundColor: "green",
  },

  vwScriptingManagementRight: {
    flexDirection: "row",
  },
  vwScriptingManagementRightLeft: {
    // padding: 10,
    // margin: 10,
    gap: 20,
  },
  vwScriptingManagementRightRight: {
    paddingTop: 20,
    // margin: 10,
    gap: 20,
  },
  containerBottom: {
    // borderWidth: 1,
    // borderStyle: "dashed",
  },
  vwBlackLineDivider: {
    // width: Dimensions.get("window").width,
    height: 10,
    backgroundColor: "#310732",
  },
  vwActionDetails: {
    paddingTop: 2,
    paddingBottom: 2,
    paddingLeft: "5%",
    // paddingRight: 10,
    backgroundColor: "white",
    justifyContent: "space-between",
    flexDirection: "row",
    // minHeight: 100,
    // alignItems: "flex-start",
    width: "40%",
    gap: "2%",
  },
  vwActionDetailsQuality: {
    flexDirection: "row",
  },
  vwActionDetailsPosition: {
    flexDirection: "row",
  },
  vwActionDetailsPlayer: {
    flexDirection: "row",
  },
});
