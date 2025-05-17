import { useRef, useEffect, useState, useCallback } from "react";
import "./Hedgehog.css";

export default function Hedgehog() {
  const blinkingEyeRef = useRef<SVGEllipseElement | null>(null);
  const blinkingEyeLeftRef = useRef<SVGEllipseElement | null>(null);
  const blinkTimeout = useRef<number | null>(null);
  const [isBlinking, setIsBlinking] = useState(false);

  const baseCX_right = 610;
  const baseCY_right = 560;
  const baseCX_left = 430;
  const baseCY_left = 560;

const handleMove = useCallback((clientX: number, clientY: number) => {
  const svg = document.querySelector("svg");
  if (!svg) return;

  const rect = svg.getBoundingClientRect();
  const svgCenterX = rect.left + rect.width / 2;
  const svgCenterY = rect.top + rect.height / 2;

  const dx = clientX - svgCenterX;
  const dy = clientY - svgCenterY;

  const angle = Math.atan2(dy, dx);
  const distance = Math.min(Math.sqrt(dx ** 2 + dy ** 2), 40); // clamp range
  const offsetX = Math.cos(angle) * distance;
  const offsetY = Math.sin(angle) * distance;

  const radius = 15; // max offset for eyes

  // Helper to update an eye
  const updateEye = (
    eye: SVGEllipseElement | null,
    baseCX: number,
    baseCY: number
  ) => {
    if (!eye) return;

    const eyeOffsetX = (offsetX / distance) * radius;
    const eyeOffsetY = (offsetY / distance) * radius;

    const newCX = isNaN(eyeOffsetX) ? baseCX : baseCX + eyeOffsetX;
    const newCY = isNaN(eyeOffsetY) ? baseCY : baseCY + eyeOffsetY;

    eye.setAttribute("cx", `${newCX}`);
    eye.setAttribute("cy", `${newCY}`);
  };

  updateEye(blinkingEyeRef.current, baseCX_right, baseCY_right);
  updateEye(blinkingEyeLeftRef.current, baseCX_left, baseCY_left);
  }, []);

  useEffect(() => {
    const move = (e: MouseEvent) => handleMove(e.clientX, e.clientY);
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [handleMove]);

  useEffect(() => {
    const blink = () => {
      blinkTimeout.current = window.setTimeout(() => {
        setIsBlinking(true);
        setTimeout(() => {
          setIsBlinking(false);
          blink();
        }, 150);
      }, Math.random() * 3000 + 2000);
    };
    blink();

    return () => {
      if (blinkTimeout.current !== null) {
        clearTimeout(blinkTimeout.current);
      }
    };
  }, []);

  return (
    <svg viewBox="0 0 1024 1024" className="w-full h-auto max-w-[50px]">
      {/* Your full hedgehog path here */}
      <path
        fill="#191b27"
        className="dark:fill-[#f3f1ef]"
        fillRule="evenodd"
        d="m510 138.2c3.6-0.1 13.9 0.3 23 0.8 9.1 0.6 21.7 1.7 28 2.6 6.3 0.8 16.7 2.6 23 3.9 6.3 1.3 16.2 3.5 22 5 5.8 1.4 17.7 5 26.5 8 8.8 2.9 22.8 8.3 31 11.9 8.3 3.7 20.6 9.7 27.5 13.5 6.9 3.8 16.3 9.2 21 12.2 4.7 2.9 12.3 8 17 11.3 4.7 3.2 13.9 10.2 20.5 15.5 6.6 5.3 18.3 15.9 26.1 23.6 7.7 7.7 17.4 18.1 21.5 23 4.2 4.9 10.7 13.3 14.6 18.5 4 5.2 11 15.6 15.8 23 4.7 7.4 13.3 22.9 19 34.5 5.7 11.6 12.6 27.1 15.4 34.5 2.7 7.4 6.5 18.7 8.4 25 1.9 6.3 4.7 16.7 6.1 23 1.4 6.3 3.4 16.7 4.5 23 1.1 6.3 2.6 16.4 3.3 22.5 0.8 6.9 1.3 22.2 1.3 41-0.1 17.1-0.6 34.3-1.3 40-0.7 5.5-2.2 15.6-3.3 22.5-1.1 6.9-3.8 19.5-6 28-2.1 8.5-6.1 22-8.8 30-2.7 8-7 19.5-9.6 25.5-2.6 6-7.6 16.6-11.1 23.5-3.5 6.9-9.3 17.5-12.9 23.5-3.7 6-10.3 16.1-14.8 22.4-4.5 6.2-11 14.8-14.5 19-3.5 4.2-9.8 11.4-14 16-4.2 4.7-13.3 13.6-20.2 19.8-6.9 6.2-12.7 11.3-13 11.3-0.3 0-0.9-2.8-1.3-6.2-0.5-3.5-3.1-14.8-5.7-25.3-2.7-10.5-7.2-26-9.9-34.5-2.7-8.5-4.9-15.6-4.8-15.6 0.1-0.1 8.6 2.4 18.9 5.5 10.3 3.1 18.7 5.4 18.8 5.1 0-0.3-1.2-2.5-2.6-5-1.4-2.5-12.4-24-24.5-47.7-14.4-28.6-21.5-43.4-20.7-43.7 0.7-0.3 20.4-4.4 43.8-9.1 23.4-4.8 44-9 45.8-9.4 3.3-0.6 3.2-0.7-11.5-11.1-8.1-5.8-24.7-17.7-36.8-26.5-12.1-8.8-25.5-18.5-37.6-27l3.3-2.2c1.8-1.2 13.7-9.5 26.4-18.5 12.7-9 31-21.9 40.6-28.8 9.9-7.1 17.1-12.8 16.4-13.2-0.6-0.3-14.4-3.6-30.6-7.2-16.2-3.6-39.4-8.4-51.5-10.7-12.1-2.3-22.1-4.3-22.2-4.5-0.2-0.2 8.1-15.1 18.4-33.1 10.2-18.1 22.6-39.7 27.5-48 4.8-8.4 8.7-15.5 8.6-15.8-0.2-0.3-25.9 6.2-57.3 14.4-31.4 8.3-57.1 14.9-57.2 14.8-0.1-0.1 1.1-18.2 2.7-40.2 1.6-22 3.3-47.9 4.4-75l-2.6 2c-1.5 1.1-19.6 16-40.3 33-20.8 17.1-40 32.9-48 39.4l-20.7-42.7c-11.4-23.5-23.6-48.8-33.5-69.7l-5.5 11.5c-3 6.3-15.1 31.7-26.9 56.3-11.8 24.6-21.7 44.6-22.1 44.5-0.4-0.2-19.7-15.8-42.9-34.8-23.1-19-43.5-35.6-48.3-39.5l0.7 17c0.4 9.4 1.8 31.9 3.2 50 1.3 18.2 2.8 36.5 4 48.6l-5-1.5c-2.8-0.8-28.4-7.8-57-15.5-28.6-7.7-52.6-14.1-53.3-14.1-0.7 0 0 2.2 2 5.8 1.7 3.1 10.2 17.6 18.7 32.2 8.5 14.6 19.9 34.1 25.3 43.5 5.4 9.4 9.5 17.1 9.1 17.2-0.5 0.2-11.6 2.3-24.8 4.8-13.2 2.4-36.9 7-52.7 10.2-15.9 3.2-28.7 6.1-28.5 6.5 0.1 0.4 7.9 6.3 17.2 13 9.3 6.8 28.8 20.8 43.3 31.1 14.4 10.3 26.2 18.9 26.2 19.2 0 0.3-10.9 8.5-24.2 18.3-13.4 9.9-31.7 23.3-40.8 29.9-9.1 6.6-17.5 12.6-18.8 13.4-1.2 0.8-2.2 1.6-2.2 1.9 0 0.3 1.2 0.8 2.7 1.2 1.6 0.4 21.7 4.6 44.8 9.3 23.1 4.7 42.7 8.8 43.5 9.1 1.2 0.4 0.7 2.1-2.6 8.7-2.3 4.5-13.2 25.9-24.3 47.5-11 21.5-20 39.4-19.8 39.6 0.1 0.3 7.6-1.7 16.7-4.3 9.1-2.6 17.7-5.1 22-6.1l-4.1 11.8c-2.2 6.4-6 18.5-8.4 26.7-2.4 8.3-5.3 20-6.5 26-1.1 6-2.4 12.5-3.5 17.6l-10-8.9c-5.5-4.8-14.2-13.3-19.4-18.8-5.1-5.4-13.7-15.3-19-21.9-5.3-6.6-13.4-17.6-18.1-24.5-4.6-6.9-11.3-17.5-14.8-23.5-3.4-6-8.9-16.4-12.1-23-3.2-6.6-8.4-18.3-11.4-26-3.1-7.7-7.4-20.1-9.6-27.5-2.3-7.4-5.4-19.6-7.1-27-1.6-7.4-3.8-19.8-4.9-27.5-1.1-7.7-2.5-19.4-3.1-26-0.5-6.6-1-19.5-1-28.7 0-9.3 0.5-22.5 1.1-29.5 0.5-7.1 2.1-20 3.4-28.8 1.4-8.8 4.1-22.5 6.1-30.5 1.9-8 5.6-20.8 8.1-28.5 2.5-7.7 6.7-19.2 9.3-25.5 2.6-6.3 7.9-17.8 11.8-25.5 3.8-7.7 9.3-18 12.2-23 2.9-4.9 9.1-14.6 13.8-21.5 4.7-6.9 12.8-17.9 18-24.5 5.3-6.6 17-19.4 26.1-28.5 9.1-9.1 21.3-20.2 27.1-24.8 5.8-4.5 14.6-11.1 19.5-14.7 4.9-3.5 13.5-9.2 19-12.6 5.5-3.4 16.8-9.7 25-14 8.3-4.3 19.7-9.8 25.5-12.3 5.8-2.4 16.1-6.4 23-8.9 6.9-2.4 18.6-6 26-8 7.4-2 18.9-4.8 25.5-6.1 6.6-1.4 17.6-3.2 24.5-4.1 6.9-0.9 18.6-2 26-2.4 7.4-0.5 16.4-0.9 20-0.9zm1.5 517.8c6.4 0 11 0.6 15.8 2 5.2 1.5 7.7 3 11.2 6.5 3.4 3.4 4.9 5.9 6.1 10.3 1 3.6 1.3 7.1 0.9 9.7-0.4 2.2-1.6 6-2.8 8.4-1.2 2.5-4.4 6.4-7.2 8.8q-5 4.4-11.5 6.5c-5.1 1.6-8.2 2-14.5 1.6-4.9-0.3-9.8-1.2-12.5-2.4-2.5-1.1-6.7-4-9.3-6.5-2.7-2.4-5.7-6.2-6.8-8.4-1.2-2.6-1.9-6.2-1.9-10.2 0-3.5 0.7-8 1.6-10 0.8-2.1 2.9-5.3 4.7-7.1 1.8-1.9 4.6-4.1 6.2-5 1.6-0.8 4.8-2.1 7-2.8 2.2-0.7 8.1-1.3 13-1.4z"
      />
      <ellipse
        ref={blinkingEyeRef}
        cx={baseCX_right}
        cy={baseCY_right}
        rx="35"
        ry={isBlinking ? 0.1 : 50}
        fill="#191b27"
        className="dark:fill-[#f3f1ef]"
        fillRule="evenodd"
        style={{ transition: "ry 0.15s ease-in-out" }}
      />
      <ellipse
        ref={blinkingEyeLeftRef}
        cx={baseCX_left}
        cy={baseCY_left}
        rx="35"
        ry={isBlinking ? 0.1 : 50}
        fill="#191b27"
        className="dark:fill-[#f3f1ef]"
        fillRule="evenodd"
        style={{ transition: "ry 0.15s ease-in-out" }}
      />
    </svg>
  );
}