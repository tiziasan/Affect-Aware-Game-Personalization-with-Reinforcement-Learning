import React from 'react';
import { useEffect, useRef, useState } from "react"; 
import styles from "./styles/Home.module.css"
import Webcam from "react-webcam";
import * as faceapi from "face-api.js";
import {getEmoji} from "../src/Adaptation/InputEmotion"
import { detectAllFaces, TinyFaceDetectorOptions } from '@vladmandic/face-api';
import logo from './logo.svg';

  

export default function App() {
  const webcamRef = useRef<Webcam>(null);
  //const webcamRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const loadModels = async () => {
       await faceapi.nets.tinyFaceDetector.loadFromUri(`/models`);
       await faceapi.nets.faceLandmark68Net.loadFromUri(`/models`);
       await faceapi.nets.faceRecognitionNet.loadFromUri(`/models`);
       await faceapi.nets.faceExpressionNet.loadFromUri(`/models`);
  };
  const handleLoadWaiting = async () => {
    return new Promise((resolve) => {
      const timer = setInterval(() => {
        if (webcamRef.current?.video?.readyState == 4) {
          resolve(true);
          clearInterval(timer);
        }
      }, 500);
    });
  };
  
const faceDetectHandler = async () => {
  await loadModels();
  await handleLoadWaiting();

  if (webcamRef.current && canvasRef.current) {
    setIsLoaded(true);
    const webcam = webcamRef.current.video as HTMLVideoElement;
    const canvas = canvasRef.current;
    webcam.width = webcam.videoWidth;
    webcam.height = webcam.videoHeight;
    canvas.width = webcam.videoWidth;
    canvas.height = webcam.videoHeight;
    const video = webcamRef.current.video!;

      (async function draw() {
        
        const detectionsWithExpressions = await faceapi
          .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
          .withFaceExpressions();
        if (detectionsWithExpressions.length > 0) {
          
          getEmoji(detectionsWithExpressions);
        }
        requestAnimationFrame(draw);
      })();
    
  }
};

useEffect(() => {
  faceDetectHandler();
}, []);



  return (
    <>
    <div className={styles.container}>
          <title>Emotion Rec</title>
        <main className={styles.main}>
          <Webcam audio={false} ref={webcamRef} className={styles.video} />
          <canvas ref={canvasRef} className={styles.video} />
        </main>
    </div>
    
    
    {!isLoaded}
   </>
  );
}


