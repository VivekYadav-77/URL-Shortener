export const validate =
  (schema, property = "body") =>
  (req, res, next) => {
    try {
      console.log("from validate");

      req[property] = schema.parse(req[property]);
      next();
      console.log("passed validate");
    } catch (err) {
      return res.status(400).json({
        message: "Invalid input",
        errors: err.errors,
      });
    }
  };
