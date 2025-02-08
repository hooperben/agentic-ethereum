"use client";

import React, { useState, useEffect, useRef } from "react";
import { Mic, MicOff } from "lucide-react";
import { useVoiceToText } from "react-speakup";

const Dictaphone = () => {
  const [audioData, setAudioData] = useState<number[]>(new Array(30).fill(0));
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number>(0);
  const [isListening, setIsListening] = useState(false);

  const { startListening, stopListening, transcript } = useVoiceToText({
    continuous: true,
    lang: "en-US",
  });

  const startAudioVisualization = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);

      analyserRef.current.fftSize = 64;
      source.connect(analyserRef.current);

      const updateVisualizer = () => {
        const dataArray = new Uint8Array(
          analyserRef.current!.frequencyBinCount,
        );
        analyserRef.current!.getByteFrequencyData(dataArray);

        // Get the average of a few frequency bands for simplification
        const simplified = Array.from(dataArray.slice(0, 30)).map(
          (val) => val / 255,
        ); // Normalize to 0-1

        setAudioData(simplified);
        animationFrameRef.current = requestAnimationFrame(updateVisualizer);
      };

      updateVisualizer();
    } catch (err) {
      console.error("Error accessing microphone:", err);
    }
  };

  const handleStartListening = () => {
    setIsListening(true);
    startListening();
    startAudioVisualization();
  };

  const handleStopListening = () => {
    setIsListening(false);
    stopListening();
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    setAudioData(new Array(30).fill(0));
  };

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col w-full justify-center text-center">
        <h2>&apos;{transcript}&apos;</h2>
      </div>

      <div className="flex w-full justify-center">
        <div className="relative h-40 w-40">
          {audioData.map((value, index) => {
            const angle = (index * 360) / audioData.length;
            const radius = 50 + value * 30; // Base radius + amplitude
            const x = 50 + Math.cos((angle * Math.PI) / 180) * radius;
            const y = 50 + Math.sin((angle * Math.PI) / 180) * radius;
            return (
              <div
                key={index}
                className="absolute h-2 w-2 rounded-full bg-primary"
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  transform: "translate(-50%, -50%)",
                  transition: "all 0.05s ease",
                }}
              />
            );
          })}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-4">
            {isListening ? (
              <MicOff
                onClick={handleStopListening}
                role="button"
                className="cursor-pointer hover:text-primary transition-colors"
              />
            ) : (
              <Mic
                onClick={handleStartListening}
                role="button"
                className="cursor-pointer hover:text-primary transition-colors"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Dictaphone;
