/** @format */

import { Module } from '@nestjs/common';

import { LoggerType, LoggerModule } from '../src';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
	imports: [
		LoggerModule.forRoot({
			type: LoggerType.PINO,
			options: {
				transport: {
					targets: [
						{
							target: 'pino-pretty',
							options: {
								destination: 'api.log',
								singleLine: true,
								colorize: false,
								levelFirst: false,
								translateTime: 'dd-mm-yyyy hh:mm:ss TT',
								ignore: 'level',
							},
						},
						{
							target: 'pino-pretty',
							options: {
								singleLine: true,
								colorize: true,
								levelFirst: false,
								translateTime: 'dd-mm-yyyy hh:mm:ss TT',
								ignore: 'level',
							},
						},
					],
				},
			},
			// options: {
			//   level:'debug',
			//   transports: [
			//     new transports.Console({
			//       format: combine(
			//         timestamp({
			//           format: 'YYYY-MM-DDThh:mm:ss',
			//         }),
			//         colorize({ all: true }),
			//         printf(
			//           (info) => `[${info.timestamp}] ${info.level}:${info.message}`,
			//         ),
			//       ),
			//     }),
			//     new transports.File({
			//       filename: 'api.log',
			//     }),
			//   ],
			//   format: combine(
			//     timestamp({
			//       format: 'YYYY-MM-DDThh:mm:ss',
			//     }),
			//     printf((info) => `[${info.timestamp}] ${info.level}:${info.message}`),
			//   ),
			// },
		}),
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
