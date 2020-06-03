import fs from 'fs';
import path from 'path';

const template = ({extensionPoint}: {extensionPoint: string}) => `
const config = {
  EXTENSION_POINT: '${extensionPoint}',
};

export default config;
`;

export function generateConfig(extensionPoint: string) {
  try {
    const outPath = path.resolve(__dirname, '../../config.ts');
    fs.writeFileSync(outPath, template({extensionPoint}));

    console.log('config.ts file was created.');
  } catch (error) {
    console.error('config.ts file could not be created: ', error);
  }
}
