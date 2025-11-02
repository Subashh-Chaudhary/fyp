# AI Module

This module exposes a `/ai/predict` endpoint that accepts an image file and returns the top prediction from a TensorFlow.js model.

## Model format (important)

The runtime is `@tensorflow/tfjs-node`, which can only load TensorFlow.js Layers models in the TFJS format:

- model.json (network architecture)
- groupX-shardYofZ.bin (weights)

It cannot load Keras single-file models like `.keras` or HDF5 `.h5` directly. If you see an error like:

```
SyntaxError: Unexpected token 'P', "PK"... is not valid JSON
```

…that's because `.keras` is a zip archive and TFJS expects a JSON manifest.

### Convert a Keras model to TFJS

Use `tensorflowjs_converter` in a Python environment that has `tensorflow` and `tensorflowjs` installed:

```bash
# Install once (in your Python env)
pip install tensorflow tensorflowjs

# Convert Keras -> TFJS Layers format
tensorflowjs_converter \
  --input_format=keras \
  /path/to/epoch_06.keras \
  /path/to/output_dir

# You should now have: /path/to/output_dir/model.json and weight shards
```

Or use the helper script included in this repo (converts the bundled `models/epoch_06.keras`):

```bash
# Requires: pip install tensorflow tensorflowjs
npm run model:convert
# Output will be in models/tfjs_model/model.json (+ shards)
```

Then point the app to that `model.json` file:

```bash
export MODEL_PATH=/path/to/output_dir/model.json
npm run dev
```

Alternatively, you can set `MODEL_PATH` to the directory and the app will automatically use `<dir>/model.json`.

## Labels

Place a `labels.txt` file next to `model.json` (one label per line). If absent, the service will still run and label classes as `Class <index>`.

## Endpoint

- POST `/ai/predict`
- multipart/form-data with field `image` containing the image file.

Example test script is available at `scripts/test-predict.sh`:

```bash
./scripts/test-predict.sh /path/to/image.jpg 3001
```

## Notes

- The service resizes images to `224x224` and normalizes pixels to `[0,1]`. Ensure this matches your training preprocessing.
- If your model requires a different input size or preprocessing, adjust the logic in `src/modules/ai/ai.service.ts`.

## Running the server

Environment variables:

- `MODEL_PATH`: Path to your TFJS `model.json` (or a directory containing it). Example:

  ```bash
  export MODEL_PATH=/absolute/path/to/tfjs_model/model.json
  ```

- `PORT`: The HTTP port (defaults to `3001`). If you prefer `3000` to match many client defaults:

  ```bash
  export PORT=3000
  ```

Start the server:

```bash
npm run dev
```

Test prediction (if you changed the port, pass it as the second arg):

```bash
./scripts/test-predict.sh /path/to/image.jpg 3001
```
