import { useCallback, useEffect, useRef, useState } from "react";
import { getLevelMeterDbFromAmplitude } from "@ryhrm-gz/audio-ui-core";
import { LevelMeter } from "@ryhrm-gz/audio-ui-react";

const idleLevels = [-60, -60] as const;
const demoSampleRate = 44_100;
const demoDuration = 4;
const demoAudioSrc = "/audio/level-meter-demo.wav";

interface DemoAudio {
  context: AudioContext;
  gain: GainNode;
  splitter: ChannelSplitterNode;
  analysers: [AnalyserNode, AnalyserNode];
  source: MediaElementAudioSourceNode;
}

export function LevelMeterDemo() {
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const audioRef = useRef<DemoAudio | null>(null);
  const animationRef = useRef<number | undefined>(undefined);
  const frameDataRef = useRef<[Float32Array<ArrayBuffer>, Float32Array<ArrayBuffer>] | null>(null);
  const visualStartRef = useRef(0);
  const [playing, setPlaying] = useState(false);
  const [levels, setLevels] = useState<readonly number[]>(idleLevels);
  const [peaks, setPeaks] = useState<readonly number[]>(idleLevels);

  const stopAudio = useCallback(() => {
    if (animationRef.current !== undefined) {
      window.cancelAnimationFrame(animationRef.current);
      animationRef.current = undefined;
    }

    const audio = audioRef.current;
    const audioElement = audioElementRef.current;

    if (audioElement) {
      audioElement.pause();
      audioElement.currentTime = 0;
    }

    void audio?.context.suspend();
    setPlaying(false);
    setLevels(idleLevels);
    setPeaks(idleLevels);
  }, []);

  const updateMeters = useCallback(() => {
    const audio = audioRef.current;
    const audioElement = audioElementRef.current;

    if (!audio && !audioElement) {
      return;
    }

    const next =
      audio === null
        ? measureGeneratedDemo(getFallbackMeterTime(audioElement, visualStartRef.current))
        : (() => {
            frameDataRef.current ??= [
              new Float32Array(audio.analysers[0].fftSize),
              new Float32Array(audio.analysers[1].fftSize),
            ];

            return audio.analysers.map((analyser, index) =>
              measureAnalyser(analyser, frameDataRef.current?.[index]),
            );
          })();

    setLevels(next.map((channel) => channel.rms));
    setPeaks(next.map((channel) => channel.peak));
    animationRef.current = window.requestAnimationFrame(updateMeters);
  }, []);

  const startAudio = useCallback(async () => {
    const audioElement = audioElementRef.current;

    if (!audioElement) {
      return;
    }

    audioRef.current ??= createDemoAudio(audioElement);
    await audioRef.current?.context.resume();
    visualStartRef.current = performance.now();

    try {
      await audioElement.play();
    } catch {
      // Some embedded browsers expose no media output. Keep the meter demo alive in that case.
    }

    setPlaying(true);
    updateMeters();
  }, [updateMeters]);

  useEffect(() => {
    return () => {
      stopAudio();
      void audioRef.current?.context.close();
    };
  }, [stopAudio]);

  return (
    <div className="audio-demo" data-variant="level-meter">
      <div className="demo-meter-console">
        <div className="demo-meter-header">
          <span className="demo-label">Stereo level</span>
          <button
            className="demo-play-button"
            type="button"
            onClick={playing ? stopAudio : startAudio}
          >
            {playing ? "Pause" : "Play"}
          </button>
        </div>

        <audio
          ref={audioElementRef}
          className="demo-audio-player"
          controls
          loop
          preload="auto"
          src={demoAudioSrc}
        />

        <LevelMeter.Root
          aria-label="Demo audio level"
          channels={2}
          className="demo-level-meter"
          peak={peaks}
          value={levels}
        >
          <LevelMeter.Scale className="demo-level-meter-scale" />
          <LevelMeter.Track className="demo-level-meter-track">
            <LevelMeter.Segments className="demo-level-meter-segments" />
            <LevelMeter.Bar channel={0} className="demo-level-meter-bar">
              <LevelMeter.Segments channel={0} className="demo-level-meter-bar-segments" />
            </LevelMeter.Bar>
            <LevelMeter.Peak channel={0} className="demo-level-meter-peak" />
            <LevelMeter.Bar channel={1} className="demo-level-meter-bar">
              <LevelMeter.Segments channel={1} className="demo-level-meter-bar-segments" />
            </LevelMeter.Bar>
            <LevelMeter.Peak channel={1} className="demo-level-meter-peak" />
          </LevelMeter.Track>
          <div className="demo-meter-readouts">
            <LevelMeter.Value
              channel={0}
              className="demo-readout"
              format={(value) => `${value.toFixed(1)} dB`}
            />
            <LevelMeter.Value
              channel={1}
              className="demo-readout"
              format={(value) => `${value.toFixed(1)} dB`}
            />
          </div>
        </LevelMeter.Root>
      </div>
    </div>
  );
}

function createDemoAudio(element: HTMLAudioElement): DemoAudio | null {
  const AudioContextConstructor = getAudioContextConstructor();

  if (!AudioContextConstructor) {
    return null;
  }

  const context = new AudioContextConstructor();
  const gain = context.createGain();
  const splitter = context.createChannelSplitter(2);
  const source = context.createMediaElementSource(element);
  const analysers = [context.createAnalyser(), context.createAnalyser()] as [
    AnalyserNode,
    AnalyserNode,
  ];

  gain.gain.value = 1;
  source.connect(gain);
  source.connect(splitter);
  gain.connect(context.destination);

  for (const analyser of analysers) {
    analyser.fftSize = 1024;
    analyser.smoothingTimeConstant = 0.72;
  }

  splitter.connect(analysers[0], 0);
  splitter.connect(analysers[1], 1);

  return {
    context,
    gain,
    splitter,
    analysers,
    source,
  };
}

function getAudioContextConstructor() {
  return (
    globalThis.AudioContext ??
    (globalThis as typeof globalThis & { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext
  );
}

function getDemoSamples(time: number) {
  const beat = time % 0.5;
  const kickEnvelope = Math.exp(-beat * 16);
  const pulse = Math.sin(2 * Math.PI * 54 * time) * kickEnvelope;
  const bass =
    Math.sin(2 * Math.PI * 110 * time) * (0.35 + 0.2 * Math.sin(2 * Math.PI * 0.5 * time));
  const lead = Math.sin(2 * Math.PI * 330 * time + 0.7 * Math.sin(2 * Math.PI * 2 * time));

  return [
    pulse * 0.72 + bass * 0.3 + lead * 0.16,
    pulse * 0.48 + bass * 0.24 + lead * 0.28 * Math.sin(2 * Math.PI * 0.25 * time),
  ] as const;
}

function measureGeneratedDemo(time: number) {
  const windowSize = 512;
  const sums = [0, 0];
  const peaks = [0, 0];

  for (let index = 0; index < windowSize; index += 1) {
    const sampleTime = (time + index / demoSampleRate) % demoDuration;
    const samples = getDemoSamples(sampleTime);

    for (let channel = 0; channel < samples.length; channel += 1) {
      const sample = samples[channel] * 0.18;
      const absoluteSample = Math.abs(sample);
      sums[channel] += sample * sample;
      peaks[channel] = Math.max(peaks[channel], absoluteSample);
    }
  }

  return sums.map((sum, channel) => ({
    rms: getLevelMeterDbFromAmplitude(Math.sqrt(sum / windowSize) * 1.8),
    peak: getLevelMeterDbFromAmplitude(peaks[channel]),
  }));
}

function getFallbackMeterTime(element: HTMLAudioElement | null, visualStart: number) {
  if (element && !element.paused) {
    return element.currentTime;
  }

  return ((performance.now() - visualStart) / 1000) % demoDuration;
}

function measureAnalyser(analyser: AnalyserNode, data: Float32Array<ArrayBuffer> | undefined) {
  if (!data) {
    return {
      rms: -60,
      peak: -60,
    };
  }

  analyser.getFloatTimeDomainData(data);

  let sum = 0;
  let peak = 0;

  for (const sample of data) {
    const absoluteSample = Math.abs(sample);
    sum += sample * sample;
    peak = Math.max(peak, absoluteSample);
  }

  return {
    rms: getLevelMeterDbFromAmplitude(Math.sqrt(sum / data.length) * 1.8),
    peak: getLevelMeterDbFromAmplitude(peak),
  };
}
