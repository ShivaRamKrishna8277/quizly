import React, { useRef, useEffect, useState } from "react";
import Webcam from "react-webcam";
import jsQR from "jsqr";

const Scan = () => {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [scannedUrl, setScannedUrl] = useState("");
  const [hasPermission, setHasPermission] = useState(null);
  const [permissionMessage, setPermissionMessage] = useState("");
  const [facingMode, setFacingMode] = useState("environment"); // Default to rear camera

  useEffect(() => {
    requestCameraPermission();
  }, []);

  useEffect(() => {
    if (hasPermission) {
      const interval = setInterval(() => {
        scanQRCode();
      }, 1000); // Scan every second

      return () => clearInterval(interval);
    }
  }, [hasPermission]);

  const requestCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setHasPermission(true);
      setPermissionMessage("");
      stream.getTracks().forEach((track) => track.stop()); // Stop the stream after checking
    } catch (error) {
      console.error("Camera access denied:", error);
      setHasPermission(false);
      setPermissionMessage(
        "Camera access is blocked. Please allow camera access from browser settings."
      );
    }
  };

  const scanQRCode = () => {
    if (!webcamRef.current || !canvasRef.current) return;

    const video = webcamRef.current.video;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height);

      if (code) {
        setScannedUrl(code.data);
        window.location.href = code.data;
      }
    }
  };

  const toggleCamera = () => {
    setFacingMode((prevMode) =>
      prevMode === "environment" ? "user" : "environment"
    );
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
      {!scannedUrl && <h2 className="text-xl font-bold mb-4">Scan a QR Code</h2>}
      {scannedUrl && <h2 className="text-xl font-bold">Scanned Successfully ✅</h2>}

      {hasPermission === null && <p>Requesting camera permissions...</p>}

      {hasPermission === false && (
        <div className="text-center">
          <p className="text-red-500 text-lg font-bold">{permissionMessage}</p>
          <button
            className="mt-4 px-4 py-2 bg-yellow-500 text-white font-bold rounded"
            onClick={requestCameraPermission}
          >
            Retry Camera Access
          </button>
        </div>
      )}

      {hasPermission && (
        <>
          {!scannedUrl && (
            <>
              <Webcam
                ref={webcamRef}
                className="rounded-lg shadow-lg w-80 h-80"
                videoConstraints={{
                  facingMode: facingMode, // Toggle between front and rear
                }}
              />
              <canvas ref={canvasRef} className="hidden"></canvas>
              <button
                onClick={toggleCamera}
                className="mt-4 px-4 py-2 bg-blue-600 text-white font-bold rounded"
              >
                Switch Camera
              </button>
            </>
          )}
          {scannedUrl && (
            <p className="mt-4 text-lg text-center">
              Redirecting to: <br /> {scannedUrl}...
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default Scan;
