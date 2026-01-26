import ApiError from "../utils/ApiError.js";
export const validate =
  (schema, property = "body") =>
  (req, res, next) => {
    try {
      req[property] = schema.parse(req[property]);
      next();
    } catch (err) {
      return next(new ApiError(400, "Invalid input"))
     
    }
  };
