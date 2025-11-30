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

        .playlist-item.active {
          background-color: #faf8f5;
          border-left: 3px solid #c4885f;
        }
      `}</style>

      {/* Main Player */}
      <div className="bg-warmCream-50 rounded-lg border border-fine border-border-light p-8 md:p-12 shadow-lg">

        {/* Vinyl Record Visual */}
        <div className="flex justify-center mb-12">
          <div className="relative">
            {/* Vinyl disc */}
            <div className={`vinyl-record relative w-64 h-64 md:w-80 md:h-80 rounded-full bg-gradient-to-br from-charcoal-900 via-charcoal-800 to-charcoal-900 shadow-2xl ${!isPlaying ? 'paused' : ''}`}>
              {/* Grooves */}
              <div className="absolute inset-0 rounded-full" style={{
                background: 'repeating-radial-gradient(circle at center, transparent 0, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)'
              }}></div>

              {/* Center label */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-28 h-28 md:w-32 md:h-32 rounded-full bg-warmCream-100 border-4 border-charcoal-800 shadow-inner flex items-center justify-center overflow-hidden">
                {displayAlbumCover ? (
                  <img
                    src={displayAlbumCover}
                    alt={displayAlbumTitle || 'Album cover'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center">
                    <div className="font-display text-xs text-ochre-600 tracking-wider">
                      {currentTrack.trackNumber || currentTrackIndex + 1}
                    </div>
                  </div>
                )}
              </div>

              {/* Vinyl hole */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-charcoal-950"></div>

              {/* Playing indicator glow */}
              {isPlaying && (
                <div className="absolute inset-0 rounded-full bg-ochre-500 opacity-0" style={{ animation: 'pulse-glow 2s ease-in-out infinite' }}></div>
              )}
            </div>

            {/* Tonearm (decorative) */}
            <div className={`absolute -right-6 top-8 w-32 h-1 bg-charcoal-700 origin-right transition-transform duration-700 ${isPlaying ? '-rotate-12' : 'rotate-12'}`} style={{
              borderRadius: '2px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
            }}>
              <div className="absolute left-0 w-3 h-3 bg-ochre-500 rounded-full -translate-y-1"></div>
            </div>
          </div>
        </div>

        {/* Track Info */}
        <div className="text-center mb-8 space-y-3">
          {displayAlbumTitle && (
            <p className="font-body text-sm tracking-wider uppercase text-charcoal-600">
              {displayAlbumTitle}
            </p>
          )}
          <h3 className="font-display text-2xl md:text-3xl font-bold text-charcoal-900 tracking-tight">
            {currentTrack.title}
          </h3>
          {currentTrack.trackNumber && (
            <p className="font-body text-sm text-charcoal-500">
              曲目 {currentTrack.trackNumber} / {tracks.length}
            </p>
          )}
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div
            className="h-2 bg-warmCream-200 rounded-full cursor-pointer relative overflow-hidden group"
            onClick={handleSeek}
          >
            <div
              className="progress-bar-fill h-full bg-gradient-to-r from-ochre-500 to-ochre-600 rounded-full relative"
              style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-ochre-500 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>
          </div>
          <div className="flex justify-between mt-2 font-body text-xs text-charcoal-500">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4 md:gap-6 mb-8">
          {/* Shuffle */}
          <button
            onClick={() => setIsShuffled(!isShuffled)}
            className={`control-button p-3 ${isShuffled ? 'text-ochre-500' : 'text-charcoal-600'} hover:text-ochre-500`}
            title="隨機播放"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>

          {/* Previous */}
          <button
            onClick={previousTrack}
            className="control-button p-3 text-charcoal-700 hover:text-ochre-500"
            title="上一首"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
            </svg>
          </button>

          {/* Play/Pause */}
          <button
            onClick={togglePlay}
            className="control-button p-5 bg-ochre-500 text-white rounded-full hover:bg-ochre-600 shadow-lg"
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
            className="control-button p-3 text-charcoal-700 hover:text-ochre-500"
            title="下一首"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
            </svg>
          </button>

          {/* Loop */}
          <button
            onClick={() => setIsLooping(!isLooping)}
            className={`control-button p-3 ${isLooping ? 'text-ochre-500' : 'text-charcoal-600'} hover:text-ochre-500`}
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
          <svg className="w-5 h-5 text-charcoal-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
          </svg>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="flex-1 h-2 bg-warmCream-200 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #c4885f 0%, #c4885f ${volume * 100}%, #f5f3f0 ${volume * 100}%, #f5f3f0 100%)`
            }}
          />
          <span className="font-body text-xs text-charcoal-600 w-10 text-right">
            {Math.round(volume * 100)}%
          </span>
        </div>
      </div>

      {/* Playlist */}
      {showPlaylist && tracks.length > 1 && (
        <div className="mt-6 bg-warmCream-100 rounded-lg border border-fine border-border-light overflow-hidden">
          <div className="p-4 border-b border-border-light">
            <h4 className="font-display text-lg font-bold text-charcoal-900">
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
                    <svg className="w-4 h-4 mx-auto text-ochre-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  ) : (
                    <span className="font-body text-sm text-charcoal-500">
                      {track.trackNumber || index + 1}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-body text-sm font-medium text-charcoal-900 truncate">
                    {track.title}
                  </p>
                  {track.albumTitle && (
                    <p className="font-body text-xs text-charcoal-600 truncate">
                      {track.albumTitle}
                    </p>
                  )}
                </div>
                <div className="flex-shrink-0 font-body text-xs text-charcoal-500">
                  {track.duration}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Keyboard Shortcuts Hint */}
      <div className="mt-4 text-center font-body text-xs text-charcoal-500">
        鍵盤快捷鍵：空格鍵 播放/暫停 | ← → 切換曲目
      </div>
    </div>
  );
};

export default MusicPlayer;
