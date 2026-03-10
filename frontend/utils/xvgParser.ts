import { XVGDataset, XVGDataPoint } from '../types';

export const parseXVG = (content: string): XVGDataset => {
  const lines = content.split('\n');
  const data: XVGDataPoint[] = [];
  const legends: string[] = [];
  let title = 'XVG Analysis';
  let xaxis = 'X Axis';
  let yaxis = 'Y Axis';

  lines.forEach(line => {
    const trimmed = line.trim();
    if (!trimmed) return;

    if (trimmed.startsWith('#') || trimmed.startsWith('@')) {
      // Metadata parsing (simplified for GROMACS style)
      if (trimmed.startsWith('@ title')) {
        title = trimmed.replace('@ title', '').replace(/"/g, '').trim();
      }
      if (trimmed.startsWith('@ xaxis label')) {
        xaxis = trimmed.replace('@ xaxis label', '').replace(/"/g, '').trim();
      }
      if (trimmed.startsWith('@ yaxis label')) {
        yaxis = trimmed.replace('@ yaxis label', '').replace(/"/g, '').trim();
      }
      if (trimmed.startsWith('@ s') && trimmed.includes('legend')) {
        const legend = trimmed.split('legend')[1].replace(/"/g, '').trim();
        legends.push(legend);
      }
      return;
    }

    // Data parsing
    const parts = trimmed.split(/\s+/).map(Number);
    if (parts.some(isNaN)) return;

    // Structure: x y1 y2 ...
    const point: XVGDataPoint = { x: parts[0], y: parts[1] };
    
    // handle multi-column (e.g. multiple energy terms)
    for(let i = 1; i < parts.length; i++) {
        point[`y${i}`] = parts[i];
    }
    
    data.push(point);
  });

  return { title, xaxis, yaxis, data, legends };
};