const z = require("zod");

const movieSchema = z.object({
  title: z.string({
    invalid_type_error: "Movie title must be a string",
    required_error: "Movie title is required",
  }),

  year: z.number().int().positive(),
  director: z.string(),
  duration: z.number().int().positive(),
  rate: z.number().min(0).max(10).nullable(),
  poster: z.string().url({
    message: "poster must be a valid url",
  }),
});

function validateMovies(object) {
  return movieSchema.safeParse(object);
}

function validatePartialMovie(object) {
  return movieSchema.partial().safeParse(object);
}

module.exports = {
  validateMovies,
  validatePartialMovie,
};
