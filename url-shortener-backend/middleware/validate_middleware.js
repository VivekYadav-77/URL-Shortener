export const validate =
  (schema, property = "body") =>
  (req, res, next) => {
    try {
      req[property] = schema.parse(req[property]);
      next();
    } catch (err) {
      return res.status(400).json({
        message: "Invalid input",
        errors: err.errors,
      });
    }
  };
