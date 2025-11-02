#!/usr/bin/env python3
"""
Convert a Keras .keras/.h5 model into TensorFlow.js Layers format (model.json + shards).

Usage:
  python3 scripts/convert_keras_to_tfjs.py /path/to/model.keras /path/to/output_dir

Requirements:
  pip install tensorflow tensorflowjs
"""
import argparse
import os
import sys


def main():
    parser = argparse.ArgumentParser(description="Convert Keras model to TFJS Layers format")
    parser.add_argument("keras_path", help="Path to .keras or .h5 model file")
    parser.add_argument("out_dir", help="Output directory for TFJS model.json and weights")
    args = parser.parse_args()

    try:
        import tensorflow as tf  # type: ignore
    except Exception as e:
        print("[convert] Missing TensorFlow. Install with: pip install tensorflow", file=sys.stderr)
        raise

    try:
        from tensorflowjs.converters import save_keras_model  # type: ignore
    except Exception as e:
        print("[convert] Missing TensorFlow.js converter. Install with: pip install tensorflowjs", file=sys.stderr)
        raise

    keras_path = os.path.abspath(args.keras_path)
    out_dir = os.path.abspath(args.out_dir)

    if not os.path.isfile(keras_path):
        print(f"[convert] Error: Keras model not found: {keras_path}", file=sys.stderr)
        sys.exit(2)

    os.makedirs(out_dir, exist_ok=True)

    print(f"[convert] Loading Keras model: {keras_path}")
    model = tf.keras.models.load_model(keras_path)

    print(f"[convert] Writing TFJS model to: {out_dir}")
    save_keras_model(model, out_dir)

    model_json = os.path.join(out_dir, "model.json")
    if os.path.isfile(model_json):
        print("[convert] ✅ Conversion complete: ")
        print(f"  model.json -> {model_json}")
        print("  (plus weight shard .bin files)")
        print("\nNext steps:")
        print(f"  export MODEL_PATH={model_json}")
        print("  npm run dev")
    else:
        print("[convert] ❌ Conversion finished but model.json not found.", file=sys.stderr)
        sys.exit(3)


if __name__ == "__main__":
    main()
