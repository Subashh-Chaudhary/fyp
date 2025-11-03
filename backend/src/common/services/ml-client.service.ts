import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import FormData = require('form-data');
import axios from 'axios';

export interface MlPredictionResult {
  classIndex?: number;
  className?: string;
  confidence?: number;
  disease?: string;
  description?: string;
  recommended_action?: string;
  [key: string]: any;
}

@Injectable()
export class MlClientService {
  private readonly baseUrl: string;
  private readonly predictPath: string;

  constructor(private readonly config: ConfigService) {
    this.baseUrl = this.config.get<string>(
      'ml.serviceUrl',
      'http://localhost:8000',
    );
    this.predictPath = this.config.get<string>('ml.predictPath', '/predict');
  }

  async predict(file: Express.Multer.File): Promise<MlPredictionResult> {
    if (!file) throw new Error('File is required for prediction');

    const url = `${this.baseUrl}${this.predictPath}`;
    const form = new FormData();

    form.append('file', file.buffer, {
      filename: file.originalname || 'image.jpg',
      contentType: file.mimetype || 'image/jpeg',
      knownLength: file.size,
    } as any);

    const headers = form.getHeaders();

    const { data } = await axios.post(url, form, { headers });
    return data as MlPredictionResult;
  }
}
