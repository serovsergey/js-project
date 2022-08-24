import cardsHbs from '../templates/cards.hbs';
import MovieApi from './api/movieApi';
const mApi = new MovieApi();


export default function makeCardsMarkup(data, genresList) {
  const movies = data.data.results.map(el => {
    const genres = el.genre_ids.map(genreId => genresList.find(el => el.id === genreId).name);
    if (genres.length > 2)
      genres.splice(2, genres.length - 2, 'Other');
    const strGenres = genres.join(', ');
    const info = [];
    if (strGenres)
      info.push(strGenres);
    const releaseDate = el.release_date || el.first_air_date;
    if (releaseDate)
      info.push(new Date(releaseDate).getFullYear());
    const strInfo = info.join(' | ') || 'No info';
    return {
      ...el,
      title: el.title || el.name,
      info: strInfo,
      genres: genres.join(', ')
    }
  });
  // console.log(movies)
  return cardsHbs({ movies, base_path: MovieApi.IMAGES_BASE_URL });
}