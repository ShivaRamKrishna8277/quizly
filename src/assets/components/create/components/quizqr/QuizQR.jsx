import React, { useRef } from "react";
import QRCode from "react-qr-code";
import { Link, useParams } from "react-router-dom";

const QuizQR = () => {
  const { quizId } = useParams(); // Extract quiz ID from URL
  const quizURL = `${window.origin}/quiz/${quizId}`;
  const canvasRef = useRef(null);

  if (!quizId) {
    return <p>Loading...</p>;
  }

  const handleDownload = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const size = 300; // QR Code box size

    // Set canvas size
    canvas.width = size;
    canvas.height = size + 50; // Extra space for the title

    // Fill background with white color
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw rounded border
    ctx.fillStyle = "white";
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(10, 10);
    ctx.arcTo(size - 10, 10, size - 10, size - 10, 20);
    ctx.arcTo(size - 10, size - 10, 10, size - 10, 20);
    ctx.arcTo(10, size - 10, 10, 10, 20);
    ctx.arcTo(10, 10, size - 10, 10, 20);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Get QR Code SVG and draw it onto canvas
    const qrSvg = document.getElementById("qr-code");
    const svgData = new XMLSerializer().serializeToString(qrSvg);
    const img = new Image();
    img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;

    img.onload = () => {
      ctx.drawImage(img, 20, 20, size - 40, size - 40); // Place inside rounded box

      // Add quiz title below QR code
      ctx.fillStyle = "#000";
      ctx.font = "16px Arial";
      ctx.textAlign = "center";
      ctx.fillText(`Quiz ID: ${quizId}`, size / 2, size + 30);

      // Convert canvas to PNG and trigger download
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = `quiz-${quizId}.png`;
      link.click();
    };
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen text-white bg-gradient-to-br from-purple-600 via-blue-500 to-indigo-700">
      <h2 className="text-lg w-[70%] text-center font-bold mb-4">
        Scan this QR Code to access the quiz
      </h2>

      {/* QR Code */}
      <div className="bg-white p-4 rounded-xl shadow-lg">
        <QRCode id="qr-code" value={quizURL} size={200} />
      </div>

      {/* Hidden Canvas for Download */}
      <canvas ref={canvasRef} className="hidden"></canvas>

      {/* Buttons */}
      <div className="mt-6 flex gap-4">
        <button
          onClick={handleDownload}
          className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg shadow-md"
        >
          Download QR
        </button>
        <Link to={"/"}>
          <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-md">
            Home
          </button>
        </Link>
      </div>
    </div>
  );
};

export default QuizQR;
