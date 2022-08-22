// import './js/theme-switcher';
import ThemeSwitcher from "./js/theme-switcher";
import MoviewApi from "./js/api/movieApi";

const ts = new ThemeSwitcher('#slider');

// const fn = async () => {
//   const mApi = new MoviewApi();
//   mApi.fetchNextTrending(true).then(data => console.log(data));
//   mApi.fetchNextTrending().then(data => console.log(data));
//   mApi.fetchNextTrending().then(data => console.log(data));
//   mApi.fetchNextTrending().then(data => console.log(data));

//   console.log(await mApi.fetchNextSearch('car', 4));
//   console.log(await mApi.fetchNextSearch());
//   console.log(await mApi.fetchNextSearch());
//   console.log(await mApi.fetchNextSearch('', 23));

//   console.log(await mApi.fetchMovieDetails(176431));

//   console.log(await mApi.getCachedGenres());
// }
// fn();