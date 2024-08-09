import { Stack, Tooltip } from '@mui/material';
import SpotifyLogo from '../assets/images/spotify.svg';
import ProfileLogo from '../assets/images/profileImage.svg';

const Profile = () => {
  return (
    <Stack
      height="96%"
      justifyContent="space-between"
      p={2}
      direction={{ xs: 'row', md: 'column' }}
      sx={{ width: { xs: '94%', md: '100%' } }}
      display="flex"
    >
      <Tooltip title="Spotify" ><img src={SpotifyLogo} alt="spotify" color="red" width={133.41} height={40} /></Tooltip>
      <Tooltip title="Profile" ><img src={ProfileLogo} alt="profile" height={48} width={48} /></Tooltip>
    </Stack>
  );
};

export default Profile;
