import { Avatar, LinearProgress, List, ListItem, Skeleton, Stack, TextField, Typography } from '@mui/material';
import { useCallback, useMemo, useState } from 'react';
import SearchIcon from '../assets/images/search.svg';

const MusicList = ({ selectedTrack, searchTerm, setSearchTerm, isFetching, songs, error, topTracks, setSelectedTrack, setPlaying }) => {
  const [topTracksOnly, setTopTracksOnly] = useState(false);

  const filteredSongs = useMemo(() => {
    let res;
    if (topTracksOnly) {
      if (searchTerm) {
        res = topTracks?.filter(
          (topTrack) =>
            topTrack?.name?.toString()?.toLowerCase()?.includes(searchTerm?.toString().toLowerCase()) ||
            topTrack?.artist?.toString()?.toLowerCase()?.includes(searchTerm?.toString().toLowerCase())
        );
      } else {
        res = topTracks;
      }
    } else if (!topTracksOnly) {
      if (searchTerm) {
        res = songs?.filter(
          (song) =>
            song?.name?.toString()?.toLowerCase()?.includes(searchTerm?.toString().toLowerCase()) ||
            song?.artist?.toString()?.toLowerCase()?.includes(searchTerm?.toString().toLowerCase())
        );
      } else {
        res = songs;
      }
    }
    return res;
  }, [searchTerm, songs, topTracks, topTracksOnly]);

  const handleSearch = useCallback((event) => {
    setSearchTerm(event.target.value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSwitchTabs = useCallback((value) => {
    setTopTracksOnly(value);
  }, []);

  if (isFetching) {
    return <LinearProgress><Skeleton variant="rectangular" width={110} height={210} /></LinearProgress>;
  }

  if (error) {
    return <h1 style={{ color: 'white' }}>An Error Occured. Please refresh to try again.</h1>;
  }

  return (
    <Stack p={2} width="100%">
      <Stack direction="row" gap={4}>
        <Typography
          variant="h6"
          onClick={() => handleSwitchTabs(false)}
          style={{ color: 'white', opacity: topTracksOnly ? '50%' : '100%', fontFamily: 'inter', fontWeight: 700, cursor: 'pointer' }}
        >
          For You
        </Typography>

        <Typography
          variant="h6"
          onClick={() => handleSwitchTabs(true)}
          style={{ color: 'white', opacity: topTracksOnly ? '100%' : '50%', fontFamily: 'inter', fontWeight: 700, cursor: 'pointer' }}
        >
          Top Tracks
        </Typography>
      </Stack>

      <TextField
        placeholder="Search Song, Artist"
        value={searchTerm}
        onChange={(e) => handleSearch(e)}
        style={{ color: 'white' }}
        InputProps={{
          endAdornment: <img src={SearchIcon} alt="search" />,
          sx: {
            color: 'white',
            background: '#FFFFFF14',
            borderRadius: '8px',
            marginY: '10px',
            cursor: 'pointer'
          }
        }}
        InputLabelProps={{
          style: {
            color: 'white'
          }
        }}
      />
      <List sx={{ maxHeight: '100vh', overflowY: 'auto' }}>
        {filteredSongs?.map((song, index) => {
          return (
            <ListItem
              key={song?.id || index}
              sx={{ display: 'flex', justifyContent: 'space-between', cursor: 'pointer', borderRadius: '8px', background: index === selectedTrack ? '#FFFFFF14' : 'transparent' }}
              onClick={() => {
                setPlaying(false);
                setSelectedTrack(index);
              }}
            >
                <Stack direction="row">
                  <Avatar sx={{ mr: 1 }} src={`https://cms.samespace.com/assets/${song?.cover}`} />
                  <Stack>
                    <Typography sx={{ color: 'white', fontSize: '18px', fontWeight: 400, fontFamily: 'inter', wordWrap: 'break-word' }}>{song?.name}</Typography>
                    <Typography sx={{ color: 'white', fontSize: '14px', fontWeight: 400, fontFamily: 'inter', opacity: '60%', wordWrap: 'break-word' }}>
                      {song?.artist}
                    </Typography>
                  </Stack>
                </Stack>
                <Stack justifyItems="flex-end">
                  <Typography sx={{ color: 'white', fontSize: '14px', fontWeight: 400, fontFamily: 'inter', opacity: '60%' }}>
                    {song?.duration}
                  </Typography>
                </Stack>
            </ListItem>
          );
        })}
      </List>
    </Stack>
  );
};

export default MusicList;
