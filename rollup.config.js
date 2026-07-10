// @@@@@@@@@@@@@@
import path from "path";
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// @@@@@@@@@@@@@@
import esbuild from 'rollup-plugin-esbuild';

const production = !process.env.ROLLUP_WATCH;

export default [{
    input: 'src/index.js',
    output: {
        sourcemap: false,
        format: 'es',
        preserveModules: true,
        preserveModulesRoot: path.resolve(__dirname, 'src'),
        dir: path.resolve(__dirname, 'lib')
        // file: "lib/index.js"
    },
    plugins: [
        esbuild({
            include: /\.tsx?$/,
            // exclude: /node_modules/,
            sourceMap: !production,
            target: 'es2022', // 'es20XX', 'esnext'
            jsx: 'preserve',
            loaders: {
                '.ts': 'ts',
                '.tsx': 'tsx'
            }
        }),
    ],
    // watch: {
    //     clearScreen: false
    // }
}]
