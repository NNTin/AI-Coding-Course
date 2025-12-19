import React, { useState, useEffect, useRef } from 'react';
import { useDoc } from '@docusaurus/plugin-content-docs/client';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './LessonAudioPlayer.module.css';

interface AudioManifest {
  [key: string]: {
    audioUrl: string;
    size: number;
    format: string;
    generatedAt: string;
  };
}

export default function LessonAudioPlayer(): React.ReactElement | null {
  const { metadata } = useDoc();
  const { siteConfig } = useDocusaurusContext();
  const audioRef = useRef<HTMLAudioElement>(null);

  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  // Load manifest and find audio for current page
  useEffect(() => {
    async function loadAudio() {
      try {
        const baseUrl = siteConfig.baseUrl;
        const manifestUrl = `${baseUrl}audio/manifest.json`;
        const response = await fetch(manifestUrl);

        if (!response.ok) {
          setIsLoading(false);
          return;
        }

        const manifest: AudioManifest = await response.json();

        // Get source file path from metadata
        const sourcePath = metadata.source.replace(/@site\/docs\//, '');

        // Look for matching audio in manifest
        const audioEntry = manifest[sourcePath];

        if (audioEntry) {
          // Prepend base URL for Docusaurus (audioUrl starts with /)
          const fullAudioUrl = `${baseUrl}${audioEntry.audioUrl.substring(1)}`;
          setAudioUrl(fullAudioUrl);
        }

        setIsLoading(false);
      } catch {
        setIsLoading(false);
      }
    }

    loadAudio();
  }, [metadata.source, siteConfig.baseUrl]);

  // Update time display
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [audioUrl]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newTime = parseFloat(e.target.value);
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const changePlaybackRate = (rate: number) => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.playbackRate = rate;
    setPlaybackRate(rate);
  };

  const formatTime = (seconds: number): string => {
    if (!isFinite(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Don't render if still loading
  if (isLoading) {
    return null;
  }

  // Don't render if no audio found
  if (!audioUrl) {
    return null;
  }

  return (
    <div className={styles.audioPlayer}>
      <audio ref={audioRef} src={audioUrl} preload="metadata" />

      <div className={styles.controls}>
        <button
          className={styles.playButton}
          onClick={togglePlayPause}
          aria-label={isPlaying ? 'Pause' : 'Play'}
          title={isPlaying ? 'Pause podcast' : 'Play podcast'}
        >
          {isPlaying ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>

        <div className={styles.timeInfo}>
          <span className={styles.currentTime}>{formatTime(currentTime)}</span>
          <span className={styles.separator}>/</span>
          <span className={styles.duration}>{formatTime(duration)}</span>
        </div>

        <input
          type="range"
          className={styles.seekBar}
          min="0"
          max={duration || 0}
          value={currentTime}
          onChange={handleSeek}
          aria-label="Seek"
        />

        <div className={styles.speedControl}>
          <label htmlFor="playback-speed" className={styles.speedLabel}>
            Speed:
          </label>
          <select
            id="playback-speed"
            className={styles.speedSelect}
            value={playbackRate}
            onChange={(e) => changePlaybackRate(parseFloat(e.target.value))}
          >
            <option value="0.75">0.75x</option>
            <option value="1">1x</option>
            <option value="1.25">1.25x</option>
            <option value="1.5">1.5x</option>
            <option value="2">2x</option>
          </select>
        </div>
      </div>

      <div className={styles.podcastLabel}>
        🎙️ Listen to this lesson as a podcast
      </div>
    </div>
  );
}
