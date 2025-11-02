import { Injectable, OnModuleInit } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import type { LayersModel, Tensor, Tensor3D } from '@tensorflow/tfjs';
import * as tf from '@tensorflow/tfjs-node';

@Injectable()
export class AiService implements OnModuleInit {
  private model: LayersModel | null = null;
  private classNames: string[] = [];

  async onModuleInit() {
    // Prefer a TFJS Layers model (model.json). .keras/.h5 is not supported by tfjs-node.
    const fallbackPath = './models/model.json';
    const configuredPath = process.env.MODEL_PATH || fallbackPath;
    const modelPath = this.resolveModelPath(configuredPath);
    // eslint-disable-next-line no-console
    console.log('🧠 Loading model from:', modelPath);

    if (!fs.existsSync(modelPath)) {
      throw new Error(`❌ Model file not found at: ${modelPath}`);
    }

    this.model = await tf.loadLayersModel(`file://${modelPath}`);
    // eslint-disable-next-line no-console
    console.log('✅ Model loaded successfully!');

    // Load optional labels from same directory as the model, or fallback to ./models/labels.txt
    const modelDir = path.dirname(modelPath);
    const labelsCandidate = path.join(modelDir, 'labels.txt');
    const labelsPath = fs.existsSync(labelsCandidate)
      ? labelsCandidate
      : path.resolve('./models/labels.txt');
    if (fs.existsSync(labelsPath)) {
      this.classNames = fs
        .readFileSync(labelsPath, 'utf-8')
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);
      // eslint-disable-next-line no-console
      console.log(`📘 Loaded ${this.classNames.length} class names.`);
    }
  }

  /**
   * Resolve the effective path to a TFJS Layers model JSON.
   * - If a directory is provided, look for model.json inside it.
   * - If a .json file is provided, use it directly.
   * - If a .keras or .h5 file is provided, throw a helpful error with conversion steps.
   */
  private resolveModelPath(configPath: string): string {
    const absolute = path.resolve(configPath);
    if (fs.existsSync(absolute) && fs.lstatSync(absolute).isDirectory()) {
      const candidate = path.join(absolute, 'model.json');
      if (!fs.existsSync(candidate)) {
        throw new Error(
          `❌ No TFJS model.json found in directory: ${absolute}. ` +
            'Please provide a TFJS Layers model (model.json + weights) or point MODEL_PATH to that file.'
        );
      }
      return candidate;
    }

    const ext = path.extname(absolute).toLowerCase();
    if (ext === '.json') return absolute;

    if (ext === '.keras' || ext === '.h5') {
      throw new Error(
        '❌ @tensorflow/tfjs-node cannot load .keras/.h5 directly. ' +
          'Convert the Keras model to TFJS Layers format and set MODEL_PATH to the resulting model.json.\n' +
          'Conversion (Python env with tensorflow + tensorflowjs):\n' +
          '  tensorflowjs_converter --input_format=keras /path/to/epoch_06.keras /path/to/output_dir\n' +
          'Then set MODEL_PATH=/path/to/output_dir/model.json'
      );
    }

    return absolute;
  }

  async predict(base64Image: string) {
    if (!this.model) throw new Error('Model not loaded yet.');

    // Decode Base64 image
    const buffer = Buffer.from(base64Image, 'base64');
    const imageTensor = tf.node.decodeImage(buffer, 3);
    const resized = tf.image
      .resizeBilinear(imageTensor as Tensor3D, [224, 224])
      .div(255.0)
      .expandDims(0);

    // Predict
  const predictions = this.model.predict(resized) as Tensor;
    const resultArray = (await predictions.array()) as number[][];

    const prediction = resultArray[0];
    const max = Math.max(...prediction);
    const predictedIndex = prediction.indexOf(max);

    const result = {
      index: predictedIndex,
      confidence: max,
      label: this.classNames[predictedIndex] || `Class ${predictedIndex}`,
    };

    // Dispose tensors
    imageTensor.dispose();
    resized.dispose();
    predictions.dispose();

    return result;
  }
}
