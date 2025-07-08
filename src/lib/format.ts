import humanizeDuration from 'humanize-duration';

export const formatDuration = (seconds: number) => {
  return humanizeDuration(seconds * 1000, {
    largest: 1,
    round: true,
    units: ['h', 'm', 's']
  });
};
