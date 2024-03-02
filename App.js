import { StyleSheet, Text, View, Button } from "react-native";
import React, { useState, useEffect } from "react";
import { Camera } from "expo-camera";
import * as FaceDetector from "expo-face-detector";

export default function App() {
  const [hasPermission, setHasPermission] = useState();
  const [faceData, setFaceData] = useState([]);

  const [permission, requestPermission] = Camera.useCameraPermissions();

  if (!permission) {
    // Camera permissions are still loading
    return <View />;
  }

  // useEffect(() => {
  //   (async () => {
  //     const { status } = await Camera.requestCameraPermissionsAsync;
  //     setHasPermission(status === "granted");
  //   })();
  // }, []);

  if (!permission.granted) {
    return (
      <View>
        <Text style={styles.permissionText}>No access to Camera</Text>
        <Button onPress={requestPermission} title="Grant permission" />
      </View>
    );
  }

  function getFaceDataView() {
    if (faceData.length === 0) {
      return (
        <View style={styles.faces}>
          <Text style={styles.faceDesc}>Yüz bulunamadı :/</Text>
        </View>
      );
    } else {
      return faceData.map((face, index) => {
        const eyesShut =
          face.rightEyeOpenProbability < 0.4 &&
          face.leftEyeOpenProbability < 0.4;
        // const winking =
        //   !eyesShut &&
        //   (face.rightEyeOpenProbability < 0.4 || leftEyeOpenProbability < 0.4);
        const smiling = face.smilingProbability > 0.3;

        return (
          <View style={styles.faces}>
            <Text style={styles.faceDesc}>
              Gözler: {eyesShut ? "Kapalı" : "Açık"}
            </Text>
            {/* <Text style={styles.faceDesc}>Winking: {winking.toString()}</Text> */}
            <Text style={styles.faceDesc}>
              Gülümseme: {smiling ? "Var" : "Yok"}
            </Text>
          </View>
        );
      });
    }
  }

  const handleFacesDetected = ({ faces }) => {
    setFaceData(faces);
    console.log(faces);
  };

  return (
    <Camera
      type={Camera.Constants.Type.front}
      style={styles.camera}
      onFacesDetected={handleFacesDetected}
      faceDetectorSettings={{
        mode: FaceDetector.FaceDetectorMode.fast,
        detectLandmarks: FaceDetector.FaceDetectorLandmarks.all,
        runClassifications: FaceDetector.FaceDetectorClassifications.all,
        minDetectionInterval: 100,
        tracking: true,
      }}
    >
      {getFaceDataView()}
    </Camera>
  );
}

const styles = StyleSheet.create({
  camera: {
    flex: 1,

    alignItems: "flex-start",
    justifyContent: "flex-start",
    top: 40,
  },
  faces: {
    backgroundColor: "#ffffff",
    width: "50%",
    alignSelf: "flex-start",
    alignItems: "center",
    justifyContent: "center",
    margin: 16,
  },
  faceDesc: {
    fontSize: 20,
  },

  permissionText: {
    top: 100,
    alignSelf: "center",
  },
});
