export class APIError extends Error {

  constructor(
    message: string,
    readonly statusCode: number,
  ) {
    super(message);
  }

}