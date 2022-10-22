import { Injectable } from '@angular/core';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

@Injectable({
  providedIn: 'root'
})

// We are going to inject this service into the UploadComponent.
export class FfmpegService {

  isRunning: boolean = false;
  // Users should not be able to upload videos until the service is ready to generate screenshots.
  isReady: boolean = false;
  private ffmpeg;

  constructor() {
    // We will be able to debug FFmpeg during development.
    this.ffmpeg = createFFmpeg({ log: true })
  }


  // Next, we need to start loading FFmpeg.
  // Loading the file is an asynchronous task.
  // We should wait for the file to load without blocking the main thread.
  async init() {

    // Before we start downloading the WebAssembly file, we should check if it has already been loaded.
    if (this.isReady) {
      return
    }

    // The next step is to start loading FFmpeg.
    // we can call the load function to start downloading FFmpeg.
    await this.ffmpeg.load();
    this.isReady = true;
  }


  //
  async getScreenshots(file: File) {

    this.isRunning = true;
    const data = await fetchFile(file);
    this.ffmpeg.FS('writeFile', file.name, data);
    const seconds = [1, 2, 3];
    const commands: string[] = [];

    seconds.forEach(second => {
      commands.push(
        // Input
        '-i', file.name,
        // Output Options
        '-ss', `00:00:0${second}`,
        '-frames:v', '1',
        '-filter:v', 'scale=510:-1',
        // Output
        `output_0${second}.png`
      );
    });

    await this.ffmpeg.run(
      ...commands
    );

    const screenshots: string[] = [];

    seconds.forEach(second => {

      const screenshotFile = this.ffmpeg.FS(
        'readFile', `output_0${second}.png`
      );
      const screenshotBlob = new Blob(
        [screenshotFile.buffer], {
        type: 'image/png'
      }
      );

      const screenshotURL = URL.createObjectURL(screenshotBlob);

      screenshots.push(screenshotURL);
    });

    this.isRunning = false;

    return screenshots;

  }


  //
  async blobFromURL(url: string) {

    const response = await fetch(url);
    const blob = await response.blob();
    return blob;
  }
}