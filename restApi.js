const express = require("express");
const crypto = require("node:crypto");
const movies = require("./movies.json");
const z = require("zod");
const { validateMovies, validatePartialMovie } = require("./schema/movies");

const app = express();
app.disable("x-powered-by");
app.use(express.json());

//Pagina de inicio
app.get("/", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.json({ message: "Hola mundo" });
});

//Desplegar todas las peliculas
app.get("/movies", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  const { genre } = req.query;

  if (genre) {
    const filteredMovies = movies.filter((movie) =>
      movie.genre.some((g) => g.toLowerCase() === genre.toLowerCase())
    );

    return res.json(filteredMovies);
  }
  return res.json(movies);
});

//Crear una pelicula
app.post("/movies", (req, res) => {
  const result = validateMovies(req.body);

  if (result.error)
    return res.status(400).json({ error: JSON.parse(result.error.message) });

  const newMovie = {
    id: crypto.randomUUID(),
    ...result.data,
  };

  movies.push(newMovie);

  res.status(201).json(newMovie);
});

app.delete("/movies/:id", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  const { id } = req.params;
  const movieIndex = movies.findIndex((movie) => movie.id === id);

  if (movieIndex === -1) {
    return res.status(404).json({ message: "Movie not found" });
  }

  movies.splice(movieIndex, 1);

  return res.json({ message: "Movie deleted" });
});

//Actualizar una pelicula
app.patch("/movies/:id", (req, res) => {
  const result = validatePartialMovie(req.body);

  if (!result.success) {
    return res.status(400).json({ error: JSON.parse(result.error.message) });
  }

  const { id } = req.params;
  const movieIndex = movies.findIndex((movie) => movie.id === id);

  if (movieIndex === -1) {
    return res.status(404).json({ message: "Movie not found" });
  }

  const updateMovie = {
    ...movies[movieIndex],
    ...result.data,
  };

  movies[movieIndex] = updateMovie;

  return res.json(updateMovie);
});

//Desplegar una pelicula en base a su id
app.get("/movies/:id", (req, res) => {
  const { id } = req.params;
  const movie = movies.find((movie) => movie.id === id);

  if (movie) return res.json(movie);

  res.status(404).json({ message: "Movie not found" });
});

app.options("/movies/:id", (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE");
  res.send(200);
});

const PORT = process.env.PORT ?? 1234;

app.listen(PORT, () => {
  console.log(`Server listening in the port: http://localhost:${PORT}`);
});
