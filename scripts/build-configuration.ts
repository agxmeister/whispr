import * as fs from 'fs';
import * as path from 'path';
import minimist from 'minimist';
import { Edge } from '../src/modules/edge';

const argv = minimist(process.argv.slice(2));
const rootDir = path.resolve(__dirname, '..');

const inputPath = argv.input || path.join(rootDir, 'edges');
const outputPath = argv.output || path.join(rootDir, 'config.json');

const filter = argv.filter
    ? argv.filter.split(',').map((edge: string) => edge.trim().toLowerCase())
    : [];

(() => {
    const edges = fs.readdirSync(inputPath)
        .filter(file => path.extname(file) === '.json')
        .reduce<Edge[]>((acc, file) => {
            try {
                const config: Edge = JSON.parse(fs.readFileSync(path.join(inputPath, file), 'utf-8'));
                acc.push(config);
            } catch (error) {
            }
            return acc;
        }, [])
        .filter(config => filter.length === 0 || filter.includes(config.name.toLowerCase()));

    const config = { edges };
    fs.writeFileSync(outputPath, JSON.stringify(config, null, 4));
})();
