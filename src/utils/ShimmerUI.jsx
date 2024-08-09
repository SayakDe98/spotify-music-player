import { LinearProgress, Skeleton, Stack, Typography } from '@mui/material';
import { memo } from 'react';

const ShimmerUI = ({ type }) => {
  switch (type) {
    case 'List': {
      return (
        <Stack>
          <LinearProgress />
          <Stack p={2} width="100%">
            <Stack direction="row" gap={4}>
              <Typography variant="h1" width={100}>
                <Skeleton />
              </Typography>

              <Typography variant="h1" width={100}>
                <Skeleton />
              </Typography>
            </Stack>

            <Typography variant="h1">
              <Skeleton />
            </Typography>

            <Typography variant="h1">
              <Skeleton />
            </Typography>
            <Typography variant="h1">
              <Skeleton />
            </Typography>
            <Typography variant="h1">
              <Skeleton />
            </Typography>
            <Typography variant="h1">
              <Skeleton />
            </Typography>
          </Stack>
        </Stack>
      );
    }
    case 'Player': {
      return (
        <Stack>
          <LinearProgress />
          <Stack p={2}>
            <Stack gap={4}>
              <Typography variant="h3" width={100}>
                <Skeleton />
              </Typography>

              <Typography variant="h5" width={100}>
                <Skeleton />
              </Typography>
            </Stack>

            <Skeleton height="10vh" />
            <Skeleton height="10vh" />
            <Skeleton height="10vh" />
            <Skeleton height="10vh" />
            <Skeleton height="10vh" />

            <Typography variant="h1">
              <Skeleton />
            </Typography>
          </Stack>
        </Stack>
      );
    }
    case 'Profile': {
      return (
        <Stack
          height="96%"
          justifyContent="space-between"
          p={2}
          direction={{ xs: 'row', md: 'column' }}
          sx={{ width: { xs: '94%', md: '100%' } }}
          display="flex"
        >
          <Skeleton variant="rounded" width={133.41} height={40}></Skeleton>
          <Skeleton variant="circular" height={48} width={48}></Skeleton>
        </Stack>
      );
    }
    default: {
      console.log('Invaid choice');
    }
  }
};

export default memo(ShimmerUI);
