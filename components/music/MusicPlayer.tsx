import React, { useState, useRef, useEffect } from 'react';

export interface MusicTrack {
  id: string;
  title: string;
  audioUrl: string;
  duration: string;
  trackNumber?: number;
  albumTitle?: string;
  albumCover?: string;
}

interface MusicPlayerProps {
  tracks: MusicTrack[];
  initialTrackIndex?: number;
  albumTitle?: string;
  albumCover?: string;
  showPlaylist?: boolean;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({
  tracks,
  initialTrackIndex = 0,
  albumTitle,
  albumCover,
  showPlaylist = false,
}) => {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(initialTrackIndex);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isLooping, setIsLooping] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = tracks[currentTrackIndex];
  const displayAlbumCover = currentTrack.albumCover || albumCover;
  const displayAlbumTitle = currentTrack.albumTitle || albumTitle;

  // Audio event handlers
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => {
      if (isLooping) {
        audio.currentTime = 0;
        audio.play();
      } else {
        nextTrack();
      }
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [isLooping, currentTrackIndex]);

  // Update audio source when track changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.src = currentTrack.audioUrl;
    audio.volume = volume;
    setCurrentTime(0);

    if (isPlaying) {
      audio.play().catch(() => setIsPlaying(false));
    }
  }, [currentTrackIndex]);

  // Playback controls
  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const nextTrack = () => {
    if (isShuffled) {
      const randomIndex = Math.floor(Math.random() * tracks.length);
      setCurrentTrackIndex(randomIndex);
    } else {
      setCurrentTrackIndex((prev) => (prev + 1) % tracks.length);
    }
  };

  const previousTrack = () => {
    if (currentTime > 3) {
      // If more than 3s played, restart current track
      const audio = audioRef.current;
      if (audio) audio.currentTime = 0;
    } else {
      setCurrentTrackIndex((prev) => (prev - 1 + tracks.length) % tracks.length);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    audio.currentTime = percent * duration;
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const formatTime = (time: number) => {
    if (!time || isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          togglePlay();
          break;
        case 'ArrowRight':
          e.preventDefault();
          nextTrack();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          previousTrack();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isPlaying, currentTime]);

  return (
    <div className="music-player-container">
      <audio ref={audioRef} preload="metadata" />

      <style>{`
        @keyframes spin-vinyl {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes pulse-glow {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.2; }
        }

        .vinyl-grooves {
          background: repeating-radial-gradient(circle at center, transparent 0, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px);
        }

        .dark .vinyl-grooves {
          background: repeating-radial-gradient(circle at center, transparent 0, transparent 2px, rgba(0,0,0,0.15) 2px, rgba(0,0,0,0.15) 4px);
        }

        .vinyl-record {
          animation: ${isPlaying ? 'spin-vinyl 3s linear infinite' : 'none'};
          transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .vinyl-record.paused {
          animation-play-state: paused;
        }

        .progress-bar-fill {
          transition: width 0.1s linear;
        }

        .control-button {
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .control-button:hover {
          transform: scale(1.1);
        }

        .control-button:active {
          transform: scale(0.95);
        }

        .playlist-item {
          transition: all 0.3s ease;
        }

        .playlist-item:hover {
          background-color: #f5f3f0;
        }

        .dark .playlist-item:hover {
          background-color: #3d3936;
        }

        .playlist-item.active {
          background-color: #faf8f5;
          border-left: 3px solid #c4885f;
        }

        .dark .playlist-item.active {
          background-color: #35322f;
          border-left: 3px solid #c7a378;
        }

        /* Volume slider styling for all browsers including mobile */
        .volume-slider {
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          height: 8px;
          border-radius: 4px;
          outline: none;
          background: linear-gradient(to right, #c4885f 0%, #c4885f var(--volume-percent, 70%), #f5f3f0 var(--volume-percent, 70%), #f5f3f0 100%);
        }

        .dark .volume-slider {
          background: linear-gradient(to right, #c7a378 0%, #c7a378 var(--volume-percent, 70%), #44413d var(--volume-percent, 70%), #44413d 100%);
        }

        /* Webkit browsers (Chrome, Safari, Edge) */
        .volume-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #c4885f;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          transition: transform 0.2s ease;
        }

        .dark .volume-slider::-webkit-slider-thumb {
          background: #c7a378;
        }

        .volume-slider::-webkit-slider-thumb:hover {
          transform: scale(1.2);
        }

        .volume-slider::-webkit-slider-thumb:active {
          transform: scale(0.95);
        }

        /* Firefox */
        .volume-slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border: none;
          border-radius: 50%;
          background: #c4885f;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          transition: transform 0.2s ease;
        }

        .dark .volume-slider::-moz-range-thumb {
          background: #c7a378;
        }

        .volume-slider::-moz-range-thumb:hover {
          transform: scale(1.2);
        }

        .volume-slider::-moz-range-thumb:active {
          transform: scale(0.95);
        }

        /* Firefox track */
        .volume-slider::-moz-range-track {
          height: 8px;
          border-radius: 4px;
          background: #f5f3f0;
        }

        .dark .volume-slider::-moz-range-track {
          background: #44413d;
        }

        /* IE/Edge legacy */
        .volume-slider::-ms-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #c4885f;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        .volume-slider::-ms-track {
          height: 8px;
          border-radius: 4px;
          background: transparent;
          border-color: transparent;
          color: transparent;
        }

        .volume-slider::-ms-fill-lower {
          background: #c4885f;
          border-radius: 4px;
        }

        .volume-slider::-ms-fill-upper {
          background: #f5f3f0;
          border-radius: 4px;
        }
      `}</style>

      {/* Main Player */}
      <div className="bg-warmCream-50 dark:bg-darkMode-bgElevated rounded-lg border border-fine border-border-light dark:border-darkMode-border p-8 md:p-12 shadow-lg">

        {/* Vinyl Record Visual */}
        <div className="flex justify-center mb-12">
          <div className="relative">
            {/* Vinyl disc */}
            <div className={`vinyl-record relative w-64 h-64 md:w-80 md:h-80 rounded-full bg-gradient-to-br from-charcoal-900 via-charcoal-800 to-charcoal-900 dark:from-warmCream-200 dark:via-warmCream-300 dark:to-warmCream-200 shadow-2xl ${!isPlaying ? 'paused' : ''}`}>
              {/* Grooves */}
              <div className="absolute inset-0 rounded-full vinyl-grooves"></div>

              {/* Center label */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-28 h-28 md:w-32 md:h-32 rounded-full bg-warmCream-100 dark:bg-charcoal-800 border-4 border-charcoal-800 dark:border-warmCream-200 shadow-inner flex items-center justify-center overflow-hidden">
                {displayAlbumCover ? (
                  <img
                    src={displayAlbumCover}
                    alt={displayAlbumTitle || 'Album cover'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center">
                    <div className="font-display text-xs text-ochre-600 dark:text-darkMode-ochre tracking-wider">
                      {currentTrack.trackNumber || currentTrackIndex + 1}
                    </div>
                  </div>
                )}
              </div>

              {/* Vinyl hole */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-charcoal-950 dark:bg-warmCream-50"></div>

              {/* Playing indicator glow */}
              {isPlaying && (
                <div className="absolute inset-0 rounded-full bg-ochre-500 opacity-0" style={{ animation: 'pulse-glow 2s ease-in-out infinite' }}></div>
              )}
            </div>

            {/* Tonearm (decorative) */}
            <div className={`absolute -right-6 top-8 w-32 h-1 bg-charcoal-700 dark:bg-warmCream-300 origin-right transition-transform duration-700 ${isPlaying ? '-rotate-12' : 'rotate-12'}`} style={{
              borderRadius: '2px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
            }}>
              <div className="absolute left-0 w-3 h-3 bg-ochre-500 dark:bg-darkMode-ochre rounded-full -translate-y-1"></div>
            </div>
          </div>
        </div>

        {/* Track Info */}
        <div className="text-center mb-8 space-y-3">
          {displayAlbumTitle && (
            <p className="font-body text-sm tracking-wider uppercase text-charcoal-600 dark:text-darkMode-textMuted">
              {displayAlbumTitle}
            </p>
          )}
          <h3 className="font-display text-2xl md:text-3xl font-bold text-charcoal-900 dark:text-darkMode-text tracking-tight">
            {currentTrack.title}
          </h3>
          {currentTrack.trackNumber && (
            <p className="font-body text-sm text-charcoal-500 dark:text-darkMode-textFaint">
              曲目 {currentTrack.trackNumber} / {tracks.length}
            </p>
          )}
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div
            className="h-2 bg-warmCream-200 dark:bg-darkMode-border rounded-full cursor-pointer relative overflow-hidden group"
            onClick={handleSeek}
          >
            <div
              className="progress-bar-fill h-full bg-gradient-to-r from-ochre-500 to-ochre-600 dark:from-darkMode-ochre dark:to-darkMode-ochreDim rounded-full relative"
              style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-ochre-500 dark:bg-darkMode-ochre rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
          </div>
          <div className="flex justify-between mt-2 font-body text-xs text-charcoal-500 dark:text-darkMode-textMuted">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4 md:gap-6 mb-8">
          {/* Shuffle */}
          <button
            onClick={() => setIsShuffled(!isShuffled)}
            className={`control-button p-3 ${isShuffled ? 'text-ochre-500 dark:text-darkMode-ochre' : 'text-charcoal-600 dark:text-darkMode-textMuted'} hover:text-ochre-500 dark:hover:text-darkMode-ochre`}
            title="隨機播放"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>

          {/* Previous */}
          <button
            onClick={previousTrack}
            className="control-button p-3 text-charcoal-700 dark:text-darkMode-text hover:text-ochre-500 dark:hover:text-darkMode-ochre"
            title="上一首"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
            </svg>
          </button>

          {/* Play/Pause */}
          <button
            onClick={togglePlay}
            className="control-button p-5 bg-ochre-500 dark:bg-darkMode-ochre text-white rounded-full hover:bg-ochre-600 dark:hover:bg-darkMode-ochreDim shadow-lg"
            title={isPlaying ? '暫停' : '播放'}
          >
            {isPlaying ? (
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
              </svg>
            ) : (
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            )}
          </button>

          {/* Next */}
          <button
            onClick={nextTrack}
            className="control-button p-3 text-charcoal-700 dark:text-darkMode-text hover:text-ochre-500 dark:hover:text-darkMode-ochre"
            title="下一首"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
            </svg>
          </button>

          {/* Loop */}
          <button
            onClick={() => setIsLooping(!isLooping)}
            className={`control-button p-3 ${isLooping ? 'text-ochre-500 dark:text-darkMode-ochre' : 'text-charcoal-600 dark:text-darkMode-textMuted'} hover:text-ochre-500 dark:hover:text-darkMode-ochre`}
            title="循環播放"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v8" />
            </svg>
          </button>
        </div>

        {/* Volume Control */}
        <div className="flex items-center gap-3 justify-center max-w-xs mx-auto">
          <svg className="w-5 h-5 text-charcoal-600 dark:text-darkMode-textMuted flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
          </svg>
          <div className="flex-1 relative">
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="volume-slider"
              style={{
                // @ts-ignore - CSS custom property
                '--volume-percent': `${volume * 100}%`
              }}
            />
          </div>
          <span className="font-body text-xs text-charcoal-600 dark:text-darkMode-textMuted w-10 text-right flex-shrink-0">
            {Math.round(volume * 100)}%
          </span>
        </div>
      </div>

      {/* Playlist */}
      {showPlaylist && tracks.length > 1 && (
        <div className="mt-6 bg-warmCream-100 dark:bg-darkMode-bgSubtle rounded-lg border border-fine border-border-light dark:border-darkMode-border overflow-hidden">
          <div className="p-4 border-b border-border-light dark:border-darkMode-border">
            <h4 className="font-display text-lg font-bold text-charcoal-900 dark:text-darkMode-text">
              播放清單 ({tracks.length} 首曲目)
            </h4>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {tracks.map((track, index) => (
              <button
                key={track.id}
                onClick={() => setCurrentTrackIndex(index)}
                className={`playlist-item w-full text-left p-4 flex items-center gap-4 ${
                  index === currentTrackIndex ? 'active' : ''
                }`}
              >
                <div className="flex-shrink-0 w-8 text-center">
                  {index === currentTrackIndex && isPlaying ? (
                    <svg className="w-4 h-4 mx-auto text-ochre-500 dark:text-darkMode-ochre" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  ) : (
                    <span className="font-body text-sm text-charcoal-500 dark:text-darkMode-textMuted">
                      {track.trackNumber || index + 1}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-body text-sm font-medium text-charcoal-900 dark:text-darkMode-text truncate">
                    {track.title}
                  </p>
                  {track.albumTitle && (
                    <p className="font-body text-xs text-charcoal-600 dark:text-darkMode-textMuted truncate">
                      {track.albumTitle}
                    </p>
                  )}
                </div>
                <div className="flex-shrink-0 font-body text-xs text-charcoal-500 dark:text-darkMode-textMuted">
                  {track.duration}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Keyboard Shortcuts Hint */}
      <div className="mt-4 text-center font-body text-xs text-charcoal-500 dark:text-darkMode-textFaint">
        鍵盤快捷鍵：空格鍵 播放/暫停 | ← → 切換曲目
      </div>
    </div>
  );
};

export default MusicPlayer;
