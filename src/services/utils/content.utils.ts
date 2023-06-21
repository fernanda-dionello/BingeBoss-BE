export const getContentUrl = ({
  id, 
  type, 
  seasonNumber, 
  episodeNumber
}: {
  id: string, 
  type: string, 
  seasonNumber: string, 
  episodeNumber: string
}): string => {
  let url = "https://api.themoviedb.org/3";
  switch (type) {
    case "tv":
      url = `${url}/${type}/${id}`;
      break;
    case "movie":
      url = `${url}/${type}/${id}`;
      break;
    case "season":
      url = `${url}/tv/${id}/${type}/${seasonNumber}`;
      break;
    case "episode":
      url = `${url}/tv/${id}/season/${seasonNumber}/${type}/${episodeNumber}`;
      break;
    default:
  }
  return url;
}

export const getContentRuntime = (content: any, type: string) => {
  let totalRuntime = 0;
  switch (type) {
    case "movie":
    case "episode":
      totalRuntime += content.runtime;
      break;
    case "season":
      totalRuntime = content.episodes.reduce(( sum: number, { runtime } : { runtime: number } ) => sum + runtime , totalRuntime);
      break;
    default:
  }
  return totalRuntime;
}

export const getContentAmount = (content: any, type: string) => {
  return type === 'season' ? content.episodes.length : 1;
}

export const getContentName = (content: any, type: string) => {
  return type === 'movie' ? content.title : content.name;
}

export const getDataHR = (newMinutes: number) => {
  const MINS_PER_YEAR = 24 * 365 * 60
  const MINS_PER_MONTH = 24 * 30 * 60
  const MINS_PER_WEEK = 24 * 7 * 60
  const MINS_PER_DAY = 24 * 60
  const MINS_PER_HOUR = 60
  let minutes = newMinutes;
  const years = Math.floor(minutes / MINS_PER_YEAR)
  minutes = minutes - years * MINS_PER_YEAR
  const months = Math.floor(minutes / MINS_PER_MONTH)
  minutes = minutes - months * MINS_PER_MONTH
  const weeks = Math.floor(minutes / MINS_PER_WEEK)
  minutes = minutes - weeks * MINS_PER_WEEK
  const days = Math.floor(minutes / MINS_PER_DAY)
  minutes = minutes - days * MINS_PER_DAY
  const hours = Math.floor(minutes / MINS_PER_HOUR)
  minutes = minutes - hours * MINS_PER_HOUR
  return {
    years,
    months,
    weeks,
    days,
    hours,
    minutes
  }
}