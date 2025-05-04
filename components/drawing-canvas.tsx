"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Eraser, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

/**
 * Props interface for the DrawingCanvas component.
 *
 * @interface DrawingCanvasProps
 * @property {string | null} initialDrawing - Initial drawing data as a data URL
 * @property {Function} onSave - Callback function triggered when drawing is saved
 */
interface DrawingCanvasProps {
  initialDrawing: string | null;
  onSave: (drawingData: string) => void;
}

/**
 * DrawingCanvas component for creating sketches and diagrams.
 *
 * Provides a canvas-based drawing interface with color selection,
 * brush size adjustment, eraser, and clear canvas functionality.
 *
 * @param {DrawingCanvasProps} props - Component properties
 * @returns {JSX.Element} The rendered DrawingCanvas component
 */
export function DrawingCanvas({
  initialDrawing,
  onSave,
}: DrawingCanvasProps): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [color, setColor] = useState<string>("#000000");
  const [strokeWidth, setStrokeWidth] = useState<number>(3);
  const [mode, setMode] = useState<"draw" | "erase">("draw");

  // Initialize canvas and load initial drawing if available
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size to match container
    const resizeCanvas = (): void => {
      const container = canvas.parentElement;
      if (container) {
        canvas.width = container.clientWidth;
        canvas.height = 400; // Fixed height for drawing area

        // Redraw saved content after resize
        if (initialDrawing) {
          const img = new Image();
          img.onload = (): void => {
            ctx.drawImage(img, 0, 0);
          };
          img.src = initialDrawing;
        }
      }
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Load initial drawing if available
    if (initialDrawing) {
      const img = new Image();
      img.onload = (): void => {
        ctx.drawImage(img, 0, 0);
      };
      img.src = initialDrawing;
    }

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [initialDrawing]);

  // Drawing functions
  const startDrawing = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ): void => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    setIsDrawing(true);

    ctx.beginPath();

    // Get coordinates
    let x: number, y: number;
    if ("touches" in e) {
      // Touch event
      const rect = canvas.getBoundingClientRect();
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      // Mouse event
      x = e.nativeEvent.offsetX;
      y = e.nativeEvent.offsetY;
    }

    ctx.moveTo(x, y);

    // Set drawing styles
    ctx.lineWidth = strokeWidth;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    if (mode === "draw") {
      ctx.strokeStyle = color;
      ctx.globalCompositeOperation = "source-over";
    } else {
      ctx.strokeStyle = "#ffffff";
      ctx.globalCompositeOperation = "destination-out";
    }
  };

  const draw = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ): void => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Get coordinates
    let x: number, y: number;
    if ("touches" in e) {
      // Touch event
      const rect = canvas.getBoundingClientRect();
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      // Mouse event
      x = e.nativeEvent.offsetX;
      y = e.nativeEvent.offsetY;
    }

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = (): void => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.closePath();
    setIsDrawing(false);

    // Save the drawing
    const drawingData = canvas.toDataURL("image/png");
    onSave(drawingData);
  };

  const clearCanvas = (): void => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Save the empty canvas
    const drawingData = canvas.toDataURL("image/png");
    onSave(drawingData);
  };

  // Color options
  const colorOptions: string[] = [
    "#000000", // Black
    "#FF0000", // Red
    "#0000FF", // Blue
    "#008000", // Green
    "#FFA500", // Orange
    "#800080", // Purple
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2 mb-2">
        {/* Color picker */}
        <div className="flex items-center gap-2">
          {colorOptions.map((c) => (
            <button
              key={c}
              className={`w-6 h-6 rounded-full ${
                color === c ? "ring-2 ring-offset-2 ring-gray-400" : ""
              }`}
              style={{ backgroundColor: c }}
              onClick={() => {
                setColor(c);
                setMode("draw");
              }}
              aria-label={`Select ${c} color`}
            />
          ))}
        </div>

        {/* Stroke width */}
        <div className="flex items-center gap-2 ml-4 w-32">
          <div className="text-sm">Size:</div>
          <Slider
            value={[strokeWidth]}
            min={1}
            max={20}
            step={1}
            onValueChange={(value) => setStrokeWidth(value[0])}
          />
        </div>

        {/* Eraser */}
        <Button
          size="sm"
          variant={mode === "erase" ? "default" : "outline"}
          onClick={() => setMode("erase")}
          className="ml-2"
        >
          <Eraser className="h-4 w-4 mr-1" />
          Erase
        </Button>

        {/* Clear canvas */}
        <Button
          size="sm"
          variant="outline"
          onClick={clearCanvas}
          className="ml-auto"
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Clear
        </Button>
      </div>

      {/* Canvas */}
      <div className="border rounded-md overflow-hidden">
        <canvas
          ref={canvasRef}
          className="touch-none w-full bg-white cursor-crosshair"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
      </div>
    </div>
  );
}
