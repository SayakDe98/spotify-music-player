import { Grid, LinearProgress, Skeleton } from '@mui/material';
import { lazy, Suspense, useEffect, useState } from 'react';
import secondsToMinutesAndSeconds from './utils/convertSecondsToMinutes';
const MusicList = lazy(() => import('./components/MusicList'));
const MusicPlayer = lazy(() => import('./components/MusicPlayer'));
const Profile = lazy(() => import('./components/Profile'));

const GET_SONGS = 'https://cms.samespace.com/items/songs';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  const [songs, setSongs] = useState([]);
  const [topTracks, setTopTracks] = useState([]);
  const [selectedTrack, setSelectedTrack] = useState(0);
  const [error, setError] = useState();
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const getSongs = async () => {
      try {
        setIsFetching(true);
        const getSongsResponse = await fetch(GET_SONGS);
        const { data } = await getSongsResponse.json();
        const songsWithDuration = await Promise.all(
          data.map(async (song) => {
            const audio = new Audio(song.url);
            await new Promise((resolve) => {
              const eventListener = audio.addEventListener('loadedmetadata', () => {
                song.duration = secondsToMinutesAndSeconds(audio.duration);
                audio.removeEventListener('loadedmetadata', eventListener);
                resolve();
              });
            });
            return song;
          })
        );

        setSongs(songsWithDuration);
        const topTrackList = data?.filter((song) => song?.top_track);
        setTopTracks(topTrackList);
        setSelectedTrack(0);
      } catch (err) {
        setError(err);
      } finally {
        setIsFetching(false);
      }
    };
    getSongs();
  }, []);
  if (isFetching) {
    return (
      <LinearProgress>
        <Skeleton variant="rectangular" width={110} height={210} />
      </LinearProgress>
    );
  }
  return (
    <Grid
      container
      gap={3}
      display="flex"
      minHeight="100vh"
      minWidth="100vw"
      sx={{
        flexDirection: {
          xs: 'column',
          md: 'row'
        },
        alignItems: {
          xs: 'center',
          md: 'flex-start'
        },
        justifyContent: { xs: 'flex-start', md: 'space-evenly' },
        background: selectedTrack !== undefined ? songs[selectedTrack]?.accent : 'black'
      }}
    >
      <Grid item xs={12} md={2} sx={{ height: { xs: 'auto', md: '100vh' }, width: { xs: '100vw', md: 'auto' } }}>
        <Suspense>
          <Profile />
        </Suspense>
      </Grid>
      <Grid item xs={12} md={4}>
        <Suspense>
          <MusicList
            selectedTrack={selectedTrack}
            setSelectedTrack={setSelectedTrack}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            isFetching={isFetching}
            songs={songs}
            error={error}
            topTracks={topTracks}
            setPlaying={setPlaying}
          />
        </Suspense>
      </Grid>
      <Grid item xs={12} md={5}>
        <Suspense>
          <MusicPlayer
            selectedTrack={selectedTrack}
            setSelectedTrack={setSelectedTrack}
            songs={songs}
            playing={playing}
            setPlaying={setPlaying}
          />
        </Suspense>
      </Grid>
    </Grid>
  );
}

export default App;
