import React, { useState, useEffect, useRef } from 'react'
import { StyleSheet, Text, View, Image, Alert } from 'react-native'
import { Camera, CameraType } from 'expo-camera'
import * as MediaLibrary from 'expo-media-library'
import Button from './src/components/Button'

export default function App() {
  const [hasCameraPermission, setHasCameraPermission] = useState(null)
  const [image, setImage] = useState(null)
  const [type, setType] = useState(Camera.Constants.Type.back)
  const [flash, setFlash] = useState(Camera.Constants.FlashMode.off)
  const cameraRef = useRef(null)

  useEffect(() => {
    (async() => {
      MediaLibrary.requestPermissionsAsync()
      const cameraStatus = await Camera.requestCameraPermissionsAsync()
      setHasCameraPermission(cameraStatus.status === 'granted')
    })()
  }, [])

  const saveImage = async () => {
    if (image) {
      try {
        await MediaLibrary.createAssetAsync(image)
        await AsyncAlert('', 'Picture saved! 🎉')
        setImage(null)
      } catch (e) {
        console.error(e)
      }
    }
  }

  //Alerta assíncrono
  const AsyncAlert = (title, message) => {
    return new Promise((resolve, reject) => {
        Alert.alert(
          title,
            message,
            [
                {text: 'OK', onPress: () => resolve('OK') }
            ],
            { cancelable: false }
        )
    })
}   

  const takePicture = async () => {
    if (cameraRef) {
      try {
        const data = await cameraRef.current.takePictureAsync()
        console.log(data)
        setImage(data.uri)
      } catch (e) {
        console.error(e)
      }
    }
  }

  if (hasCameraPermission === false) {
    return (<Text>No access to camera!</Text>)
  }

  return (
    <View style={styles.container}>
      {!image ? 
        <Camera
          style={styles.camera}
          type={type}
          flashMode={flash}
          ref={cameraRef}
        >
        </Camera>
      :
        <Image
          source={{uri: image}}
          style={styles.camera}
        />
      }
      <View>
        {image ?
          <View style={styles.bottomButtons}>
            <Button title={'Re-take'} icon='retweet' onPress={() => setImage(null)}/>
            <Button title={'Save'} icon='check' onPress={saveImage}/>
          </View>
        :
          <View style={styles.bottomButtons}>
            <Button 
              icon={'retweet'} 
              onPress={() => {
                setType(type === CameraType.back ? CameraType.front : CameraType.back)
              }}
            />
            <Button 
              title={'Take a picture'} 
              icon='camera'
              onPress={takePicture}
            />
            <Button 
              color={flash === Camera.Constants.FlashMode.off ? "gray" : "#f1f1f1"}
              icon={'flash'} 
              onPress= { () => {
                setFlash(flash === Camera.Constants.FlashMode.off ? 
                  Camera.Constants.FlashMode.on :
                  Camera.Constants.FlashMode.off
                )
              }}
            />
          </View>
        }
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    paddingBottom: 15
  },
  camera: {
    flex: 1,
    borderRadius: 20
  },
  bottomButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10
  }
});
