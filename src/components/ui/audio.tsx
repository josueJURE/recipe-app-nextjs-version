"use client";
import React, { useEffect, useRef } from "react";
import WaveSurfer from "wavesurfer.js";
import {
  BsSkipBackward,
  BsSkipForward,
  BsFillStopFill,
  BsFillPlayFill,
} from "react-icons/bs";

function Audio() {
  const waveformRef = useRef(null);
  let wavesurfer: WaveSurfer;

  useEffect(() => {
    if (waveformRef.current) {
      wavesurfer = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: "black",
        url: "/recipe_audio.mp3",
        mediaControls: true,
        dragToSeek: true,
        width: "35vw",
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
      console.log("play")
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

  return (
    <div className="container">
      <div className="sub-container">
        <div ref={waveformRef}></div>
        <button type="button" onClick={handleRewind}>
          <BsSkipBackward />
        </button>
        <button type="button" onClick={handleSkipForward}>
          <BsSkipForward />
        </button>
        <button type="button" onClick={handlePlay}>Play</button>
        <button type="button" onClick={handlePause}>
          <BsFillPlayFill />
        </button>
        <button type="button">
          <BsFillStopFill/>
        </button>
      </div>
    </div>
  );

  // return (
  //   <div className="recording">
  //   {/* <FaPlay size={30} />
  //   <FaCirclePause size={30} />
  //   <FaRegStopCircle size={30} />
  //   <IoSpeedometer size={30} /> */}
  //   <audio style={{ width: '25rem', height: '9rem'}} controls src="./speech.mp3"></audio>
  //   <source className="audio_source" type="audio/mpeg" src="./speech.mp3"/>
  //   <i className="fa-solid fa-microphone" data-name="microphone"></i>
  //   <i className="fa-solid fa-pause" data-name="pause"></i>
  //   <i className="fa-solid fa-stop" data-name="stop"></i>
  //   <div className="speed-wrapper">
  //     {/* <label htmlFor="speed">Speed</label> */}
  //     {/* <input onChange={handleCount}
  //       type="number"
  //       name="speed"
  //       id="speed"
  //       min="0.25"
  //       max="2"
  //       step="0.25"
  //       value={count}
  //     ></input> */}
  //   </div>
  // </div>
  // )
}

export default Audio;
