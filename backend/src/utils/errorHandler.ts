import HttpException from "../exceptions/httpException";

export const errorHandler = (statusCode: number, message: string) => {
  const error = new HttpException(statusCode, message);
  return error;
};
