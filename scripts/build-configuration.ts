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
                const edgeFilePath = path.join(inputPath, file);
                const originalEdge: Edge = JSON.parse(fs.readFileSync(edgeFilePath, 'utf-8'));
                
                if (originalEdge.environment) {
                    const environmentVariableNameMapping: Record<string, string> = {};
                    originalEdge.environment.forEach(variable => {
                        environmentVariableNameMapping[variable.name] = `EDGE_${originalEdge.name.toUpperCase()}_${variable.name}`;
                    });
                    
                    let edgeConfiguration = fs.readFileSync(edgeFilePath, 'utf-8');
                    Object.keys(environmentVariableNameMapping).forEach(name => {
                        edgeConfiguration = edgeConfiguration
                            .split(`{{${name}}}`)
                            .join(`{{${environmentVariableNameMapping[name]}}}`);
                    });
                    const edge: Edge = JSON.parse(edgeConfiguration);

                    edge.environment = edge.environment.map(variable => ({
                        ...variable,
                        name: environmentVariableNameMapping[variable.name] || variable.name
                    }));
                    
                    acc.push(edge);
                } else {
                    acc.push(originalEdge);
                }
            } catch (error) {
            }
            return acc;
        }, [])
        .filter(config => filter.length === 0 || filter.includes(config.name.toLowerCase()));

    const config = {
        edges
    };
    fs.writeFileSync(outputPath, JSON.stringify(config, null, 4));
})();
