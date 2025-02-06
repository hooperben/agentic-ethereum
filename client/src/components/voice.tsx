"use client";

import React, { useState, useEffect, useRef } from "react";
import { Mic, MicOff } from "lucide-react";
import { useVoiceToText } from "react-speakup";

const Dictaphone = () => {
  const [audioData, setAudioData] = useState<number[]>(new Array(30).fill(0));
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number>(0);

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
    startListening();
    startAudioVisualization();
  };

  const handleStopListening = () => {
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
    <div className="flex flex-col gap-6">
      {" "}
      <div className="flex gap-6">
        <Mic onClick={handleStartListening} role="button" />
        <MicOff onClick={handleStopListening} role="button" />
      </div>
      <div className="flex h-20 items-end gap-1">
        {audioData.map((value, index) => (
          <div
            key={index}
            className="w-2 bg-primary"
            style={{
              height: `${value * 100}%`,
              transition: "height 0.05s ease",
            }}
          />
        ))}
      </div>
      <h2>transcript: {transcript}</h2>
    </div>
  );
};
export default Dictaphone;
