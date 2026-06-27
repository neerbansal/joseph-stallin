import React, { useEffect, useRef } from "react";

interface WebcamPixelGridProps {
  gridCols?: number;
  gridRows?: number;
  maxElevation?: number;
  motionSensitivity?: number;
  elevationSmoothing?: number;
  colorMode?: "webcam" | "solid";
  backgroundColor?: string;
  mirror?: boolean;
  gapRatio?: number;
  invertColors?: boolean;
  darken?: number;
  borderColor?: string;
  borderOpacity?: number;
  className?: string;
  onWebcamReady?: () => void;
  onWebcamError?: (err: Error) => void;
}

export function WebcamPixelGrid({
  gridCols = 60,
  gridRows = 40,
  backgroundColor = "#030303",
  mirror = true,
  darken = 0.6,
  className,
  onWebcamReady,
  onWebcamError,
}: WebcamPixelGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const animationRef = useRef<number>(null);

  useEffect(() => {
    let video = videoRef.current;
    if (!video) {
      video = document.createElement("video");
      video.autoplay = true;
      video.playsInline = true;
      videoRef.current = video;
    }

    navigator.mediaDevices
      .getUserMedia({ video: { width: gridCols, height: gridRows }, audio: false })
      .then((stream) => {
        if (video) {
          video.srcObject = stream;
          video.onloadedmetadata = () => {
            video?.play();
            if (onWebcamReady) onWebcamReady();
          };
        }
      })
      .catch((err) => {
        if (onWebcamError) onWebcamError(err);
      });

    return () => {
      if (video && video.srcObject) {
        const stream = video.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [gridCols, gridRows, onWebcamReady, onWebcamError]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    if (!canvas || !video) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const render = () => {
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const tempCanvas = document.createElement("canvas");
        tempCanvas.width = gridCols;
        tempCanvas.height = gridRows;
        const tempCtx = tempCanvas.getContext("2d");

        if (tempCtx) {
          if (mirror) {
            tempCtx.translate(gridCols, 0);
            tempCtx.scale(-1, 1);
          }
          tempCtx.drawImage(video, 0, 0, gridCols, gridRows);
          const imageData = tempCtx.getImageData(0, 0, gridCols, gridRows);
          const data = imageData.data;

          const cellW = canvas.width / gridCols;
          const cellH = canvas.height / gridRows;

          for (let y = 0; y < gridRows; y++) {
            for (let x = 0; x < gridCols; x++) {
              const i = (y * gridCols + x) * 4;
              const r = Math.max(0, data[i] - (255 * darken));
              const g = Math.max(0, data[i + 1] - (255 * darken));
              const b = Math.max(0, data[i + 2] - (255 * darken));

              ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
              // Subtract small gap
              ctx.fillRect(x * cellW, y * cellH, cellW - 1, cellH - 1);
            }
          }
        }
      }
      animationRef.current = requestAnimationFrame(render);
    };

    const handleResize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [gridCols, gridRows, backgroundColor, mirror, darken]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ display: 'block', width: '100%', height: '100%' }}
    />
  );
}
