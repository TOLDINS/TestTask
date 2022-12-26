import { ValidationPipeOptions, ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';

import { ValidationException } from '../exceptions/validation.exception';

export interface BootstrapOptions {
  validationPipeOptions?: ValidationPipeOptions;
  useGlobalValidationPipe?: boolean;
}

export const appBootstrap = (
  app: NestExpressApplication,
  options: BootstrapOptions = {},
): void => {
  const _options: BootstrapOptions = {
    useGlobalValidationPipe: true,
    ...options,
  };
  if (_options.useGlobalValidationPipe) {
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        exceptionFactory: (errors) => {
          return new ValidationException(
            errors.reduce((acc, error) => {
              acc[error.property] = Object.values(error.constraints)
                .join('. ')
                .trim();
              return acc;
            }, {}),
          );
        },
        ..._options.validationPipeOptions,
      }),
    );
  }
};
