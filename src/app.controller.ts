import { Controller, Post, Body, UploadedFile, UseInterceptors, Res, Get } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AppService } from './app.service';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHomePage(@Res() res: Response) {
    // Serve the index.html file
    res.sendFile(path.join(process.cwd(), 'public', 'index.html'));
  }

  @Post('imagetovideo')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + extname(file.originalname));
        },
      }),
    }),
  )
  async imageToVideo(
    @UploadedFile() file: any,
    @Body('prompt') prompt: string,
    @Res() res: Response
  ) {
    try {
      const result = await this.appService.imageToVideo(file.path, prompt);
      
      if (result.error) {
        // Read the error.html template
        let errorHtml = fs.readFileSync(
          path.join(process.cwd(), 'public', 'error.html'), 
          'utf8'
        );
        
        // Replace the error message placeholder
        errorHtml = errorHtml.replace('{{ERROR_MESSAGE}}', result.error);
        
        res.send(errorHtml);
      } else if (result.videoUrl) {
        // Read the success.html template
        let successHtml = fs.readFileSync(
          path.join(process.cwd(), 'public', 'success.html'),
          'utf8'
        );
        
        // Replace the video URL placeholder
        successHtml = successHtml.replace(/\{\{VIDEO_URL\}\}/g, result.videoUrl);
        
        res.send(successHtml);
      }
    } catch (error) {
      // Read the error.html template
      let errorHtml = fs.readFileSync(
        path.join(process.cwd(), 'public', 'error.html'),
        'utf8'
      );
      
      // Replace the error message placeholder
      errorHtml = errorHtml.replace('{{ERROR_MESSAGE}}', 'An unexpected error occurred. Please try again later.');
      
      res.status(500).send(errorHtml);
    }
  }
}