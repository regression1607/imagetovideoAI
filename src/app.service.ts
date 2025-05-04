import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as FormData from 'form-data';
import { createReadStream } from 'fs';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class AppService {
  // Upload image to imgbb to get a public URL
  async uploadImageToImgBB(imagePath: string): Promise<string> {
    const imgbbApiKey = process.env.IMGBB_API_KEY;
    const form = new FormData();
    form.append('image', createReadStream(imagePath));
    const response = await axios.post(
      `https://api.imgbb.com/1/upload?key=${imgbbApiKey}`,
      form,
      { headers: form.getHeaders() }
    );
    return response.data.data.url;
  }

  // Generate video using Runway model via aimlapi.com
  async imageToVideo(imagePath: string, prompt: string): Promise<{ videoUrl?: string; error?: string }> {
    try {
      const imageUrl = await this.uploadImageToImgBB(imagePath);
      const aimlApiKey = process.env.AIMLAPI_KEY;
      
      // Using Runway model endpoint
      const payload = {
        model: "gen3a_turbo",
        prompt: prompt,
        image_url: imageUrl,
        last_image_url: imageUrl,
        duration: 5,
        ratio: "16:9",
        seed: 1
      };
      
      // Initial request to start video generation
      const response = await axios.post(
        'https://api.aimlapi.com/v2/generate/video/runway/generation',
        payload,
        {
          headers: {
            'Authorization': `Bearer ${aimlApiKey}`,
            'Content-Type': 'application/json',
            'Accept': '*/*'
          }
        }
      );

      console.log("response", response.data);
      const generationId = response.data.id;
      let status = response.data.status;

      // Poll for video generation status
      while (status === 'queued' || status === 'processing') {
        await new Promise(resolve => setTimeout(resolve, 100000)); // Wait 5 seconds between checks
        
        const statusResponse = await axios.get(
          `https://api.aimlapi.com/v2/generate/video/runway/generation?generation_id=${generationId}`,
          {
            headers: {
              'Authorization': `Bearer ${aimlApiKey}`,
              'Accept': '*/*'
            }
          }
        );
        console.log("statusResponse", statusResponse.data);
        status = statusResponse.data.status;
        if (status === 'completed' && statusResponse.data.video && statusResponse.data.video.length > 0) {
          return { videoUrl: statusResponse.data.video[0] };
        }
      }

      return { error: 'Video generation failed or timed out' };
    } catch (error) {
      if (error.response?.data?.message) {
        return { error: error.response.data.message };
      }
      return { error: 'An error occurred while generating the video' };
    }
  }
}