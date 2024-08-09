import { Avatar, Box, Button, LinearProgress, Menu, MenuItem, Skeleton, Stack, Typography } from '@mui/material';
import Options from '../assets/images/options.svg';
import Previous from '../assets/images/previous.svg';
import Play from '../assets/images/play.svg';
import Pause from '../assets/images/pause.svg';
import Next from '../assets/images/next.svg';
import Speaker from '../assets/images/speaker.svg';
import DownloadIcon from '../assets/images/download.png';
import BackArrow from '../assets/images/backArrow.png';
import PlaybackIcon from '../assets/images/playback.png';
import Mute from '../assets/images/mute.svg';
import { useEffect, useRef, useState } from 'react';

const playbackSpeeds = [0.5, 0.75, 1, 1.25, 1.5, 2];

const MusicPlayer = ({ selectedTrack, songs, playing, setPlaying }) => {
  const audioRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [muted, setMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [audioFile, setAudioFile] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [generalOptionsAnchorEl, setGeneralOptionsAnchorEl] = useState(null);
  const [optionsAnchorEl, setOptionsAnchorEl] = useState(null);

  useEffect(() => {
    const audio = audioRef.current;
    const updateProgress = () => {
      setProgress(audio.currentTime);
    };

    const setCurrentAudioDuration = () => {
      setDuration(audio?.duration);
    };

    if (audio) {
      audio.addEventListener('loadedmetadata', setCurrentAudioDuration);
      audio.addEventListener('timeupdate', updateProgress);
    }

    return () => {
      if (audio) {
        audio.removeEventListener('loadedmetadata', setCurrentAudioDuration);
        audio.removeEventListener('timeupdate', updateProgress);
      }
    };
  }, [playing]);

  useEffect(() => {
    const getAudioFile = async () => {
      try {
        if (songs?.length && selectedTrack !== undefined) {
          setIsFetching(true);
          const response = await fetch(songs[selectedTrack].url);
          const blob = await response.blob();
          if (!response.ok) throw new Error('Network response was not ok.');

          const contentType = response?.headers?.get('Content-Type');
          if (!contentType.startsWith('audio/')) throw new Error('Invalid content type.');

          const url = window.URL.createObjectURL(blob);
          setAudioFile(url);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsFetching(false);
      }
    };
    getAudioFile();
  }, [selectedTrack, songs]);

  useEffect(() => {
    audioRef.current.playbackRate = playbackSpeed;
  }, [playbackSpeed]);

  useEffect(() => {
    setProgress(0);
  }, [selectedTrack]);

  const handleSeekOrUnSeek = (seek) => {
    const newTime = Math.min(seek ? progress + 10 : progress - 10, duration);
    audioRef.current.currentTime = newTime;
    setProgress(newTime);
  };

  const handleProgressChange = (event) => {
    const newTime = event.target.value;
    audioRef.current.currentTime = newTime;
    setProgress(newTime);
  };

  const generalOptionsOpen = Boolean(generalOptionsAnchorEl);

  const handleClick = (event) => {
    event.stopPropagation();
    setGeneralOptionsAnchorEl(event.currentTarget);
  };

  const handleGeneralOptionsClose = () => {
    setGeneralOptionsAnchorEl(null);
  };

  const optionsOpen = Boolean(optionsAnchorEl);
  const handleOptionsClick = (event) => {
    event.stopPropagation();
    setOptionsAnchorEl(event.currentTarget);
  };
  const handleOptionsClose = () => {
    setOptionsAnchorEl(null);
  };
  const handleSpeedChange = (e) => {
    setPlaybackSpeed(e?.target.id);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = audioFile;
    songs?.length > selectedTrack && songs[selectedTrack] && link.setAttribute('download', `${songs[selectedTrack]?.url?.split('/')[3]}`);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  };
  if (isFetching) {
    return (
      <LinearProgress>
        <Skeleton variant="rectangular" width={110} height={210} />
      </LinearProgress>
    );
  }
  return (
    <Stack p={2} sx={{ px: { md: '4.3vw', lg: '8vw' } }}>
      <Typography sx={{ mt: 4, fontFamily: 'inter', fontWeight: 700, color: '#FFFFFF', fontSize: '32px', alignSelf: 'flex-start' }}>
        {songs[selectedTrack]?.name}
      </Typography>
      <Typography
        mb={3}
        sx={{ fontFamily: 'inter', fontWeight: 400, color: '#FFFFFF', fontSize: '16px', opacity: '60%', alignSelf: 'flex-start' }}
      >
        {songs[selectedTrack]?.artist}
      </Typography>
      <Box sx={{ width: { xs: '90vw', md: '100%' }, height: { xs: '35vh', md: '50vh' } }}>
        <img
          src={`https://cms.samespace.com/assets/${songs[selectedTrack]?.cover}`}
          alt={selectedTrack?.name}
          style={{ borderRadius: '8px', objectFit: 'cover', width: '100%', height: '100%' }}
        />
      </Box>

      <progress
        type="range"
        value={progress}
        onClick={(e) => {
          const x = e.pageX - e.target.offsetLeft;
          const clickedValue = (x * e.target.max) / e.target.offsetWidth;
          audioRef.current.currentTime = clickedValue;
          setProgress(clickedValue);
        }}
        max={audioRef.current?.duration || 0}
        onChange={handleProgressChange}
        style={{ width: '100%', marginTop: '1rem', cursor: 'pointer' }}
      />

      <Stack direction="row" justifyContent="space-between" mt={2}>
        <Menu
          open={generalOptionsOpen}
          anchorEl={generalOptionsAnchorEl}
          onClose={handleGeneralOptionsClose}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'left'
          }}
          transformOrigin={{
            vertical: 'bottom',
            horizontal: 'center'
          }}
        >
          <MenuItem onClick={(e) => e.stopPropagation()}>
            <Button
              variant="text"
              color="primary"
              startIcon={<img src={DownloadIcon} width={20} height={20} alt="download" />}
              onClick={(e) => {
                e.stopPropagation();
                handleDownload();
              }}
              sx={{ textTransform: 'none', color: 'black' }}
            >
              Download
            </Button>
          </MenuItem>
          <MenuItem onClick={(e) => e.stopPropagation()}>
            <Menu
              open={optionsOpen}
              anchorEl={optionsAnchorEl}
              onClose={handleOptionsClose}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'left'
              }}
              transformOrigin={{
                vertical: 'bottom',
                horizontal: 'center'
              }}
              onClick={handleSpeedChange}
            >
              <MenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  handleOptionsClose();
                }}
              >
                <img src={BackArrow} width={12} height={12} alt="back" style={{ marginRight: '5px' }} /> Options
              </MenuItem>
              {playbackSpeeds?.map((speed) => (
                <MenuItem id={speed} key={speed}>
                  {speed === 1 ? 'Normal' : speed}
                </MenuItem>
              ))}
            </Menu>
            <Button
              startIcon={<img src={PlaybackIcon} width="20px" height="20px" alt="playback" />}
              onClick={handleOptionsClick}
              sx={{ textTransform: 'none', color: 'black' }}
            >
              PlayBack Speed
            </Button>
          </MenuItem>
        </Menu>
        <Button onClick={handleClick}>
          <Avatar src={Options} alt="options" />
        </Button>
        <Stack direction="row">
          <Button
            onClick={() => {
              handleSeekOrUnSeek(false);
            }}
          >
            <Avatar src={Previous} alt="previous" />
          </Button>
          <Button
            onClick={() => {
              setPlaying((prev) => !prev);
              playing ? audioRef.current.pause() : audioRef.current.play();
            }}
          >
            {!playing ? <Avatar src={Play} alt="play" /> : <Avatar src={Pause} alt="pause" />}
          </Button>
          <Button
            onClick={() => {
              handleSeekOrUnSeek(true);
            }}
          >
            <Avatar src={Next} alt="next" />
          </Button>
        </Stack>

        <Button onClick={() => setMuted((prev) => !prev)}>
          {!muted ? <Avatar src={Speaker} alt="speaker" /> : <Avatar src={Mute} alt="mute-speaker" sx={{ color: 'white' }} />}
        </Button>
        <audio src={songs[selectedTrack]?.url} id="audio-element" controls ref={audioRef} muted={muted} style={{ display: 'none' }}></audio>
      </Stack>
    </Stack>
  );
};

export default MusicPlayer;
