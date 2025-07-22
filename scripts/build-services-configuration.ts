import * as fs from 'fs';
import * as path from 'path';
import minimist from 'minimist';
import { Service } from '../src/types';

const argv = minimist(process.argv.slice(2));
const rootDir = path.resolve(__dirname, '..');

const inputPath = argv.input || path.join(rootDir, 'services');
const outputPath = argv.output || path.join(rootDir, 'services.json');

const filter = argv.filter
    ? argv.filter.split(',').map((service: string) => service.trim().toLowerCase())
    : [];

(() => {
    const services = fs.readdirSync(inputPath)
        .filter(file => path.extname(file) === '.json')
        .reduce<Service[]>((acc, file) => {
            try {
                const config: Service = JSON.parse(fs.readFileSync(path.join(inputPath, file), 'utf-8'));
                acc.push(config);
            } catch (error) {
            }
            return acc;
        }, [])
        .filter(config => filter.length === 0 || filter.includes(config.name.toLowerCase()));

    fs.writeFileSync(outputPath, JSON.stringify(services, null, 4));
})();
