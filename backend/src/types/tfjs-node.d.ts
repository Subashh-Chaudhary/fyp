// Richer module declaration mapping to @tensorflow/tfjs types
// and augmenting with the Node.js-specific APIs we use.
declare module '@tensorflow/tfjs-node' {
	import * as tf from '@tensorflow/tfjs';

	// Augment with Node bindings we use
	namespace tfNodeNS {
		function decodeImage(
			contents: Buffer | Uint8Array | ArrayBuffer,
			channels?: number
		): tf.Tensor3D;
	}

	// Create a value that combines tf exports with node-specific members.
	const tfNode: typeof tf & {
		node: typeof tfNodeNS;
		loadLayersModel: typeof tf.loadLayersModel;
	};

	export = tfNode;
}
