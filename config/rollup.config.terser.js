import MainThreadBuilds from './rollup.main-thread.terser.js';
import WorkerThreadBuilds from './rollup.worker-thread.terser.js';

export default [...MainThreadBuilds, ...WorkerThreadBuilds];
