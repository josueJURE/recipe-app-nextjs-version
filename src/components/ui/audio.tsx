"use client";
import React, { useEffect, useRef } from "react";
import WaveSurfer from "wavesurfer.js";
import { Button } from "./button";
import {
  BsSkipBackward,
  BsSkipForward,
  BsFillStopFill,
  BsFillPlayFill,
} from "react-icons/bs";
import { IconType } from "react-icons/lib";

function Audio() {
  const waveformRef = useRef(null);
  let wavesurfer: WaveSurfer;

  useEffect(() => {
    if (waveformRef.current) {
      wavesurfer = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: "black",
        url: "/recipe_audio.mp3",
        mediaControls: false,
        dragToSeek: true,
        width: "15vw",
        height: 60,
        hideScrollbar: true,
        normalize: true,
        barGap: 1,
        barHeight: 20,
        barRadius: 20,
      });
      return () => {
        wavesurfer.destroy();
      };
    }
  }, []);


  const handleAudioButtons = (option: string) => {
    if (wavesurfer) {
      (wavesurfer as any)[option](); // Type assertion to any
    }
  };



  const hanldeStop = () => {
    if (wavesurfer) {
      wavesurfer.stop();
    }
  };

  const handlePause = () => {
    if (wavesurfer) {
      wavesurfer.playPause(); // what's the difference with wavesurfer.pause()
    }
  };

  const handlePlay = () => {
    if (wavesurfer) {
      wavesurfer.play();
      console.log("play");
    }
  };

  const handleSkipForward = () => {
    if (wavesurfer) {
      wavesurfer.skip(2);
    }
  };

  const handleRewind = () => {
    if (wavesurfer) {
      wavesurfer.skip(-2);
    }
  };

  interface buttonArrayTypes {
    btnType: "button";
    btnFunction: () => void;
    innerComponent: IconType;
    btnId: string;
  }

  const buttonArray: buttonArrayTypes[] = [
    {
      btnType: "button",
      btnFunction: handleRewind,
      innerComponent: BsSkipBackward,
      btnId: "rewind-btn",
    },
    {
      btnType: "button",
      btnFunction: handlePause,
      innerComponent: BsFillPlayFill,
      btnId: "pause-btn",
    },
    {
      btnType: "button",
      btnFunction: hanldeStop,
      innerComponent: BsFillStopFill,
      btnId: "stop-btn",
    },
    {
      btnType: "button",
      btnFunction: handleSkipForward,
      innerComponent: BsSkipForward,
      btnId: "forward-btn",
    },
  ];

  return (
    <div className="flex justify-center flex-col items-center gap-0">
      <div className="justify-center content-center gap-2">
        <div ref={waveformRef} className="mt-10 flex">
          {" "}
        </div>
        <div className="flex gap-1.5 content-center justify-center">
          {buttonArray.map((button) => (
            <Button
              type={button.btnType}
              onClick={button.btnFunction}
              key={button.btnId}
            >
              <button.innerComponent key={button.btnId} />
            </Button>
          ))}
        </div>
      </div>
    </div>
  );


}

export default Audio;
