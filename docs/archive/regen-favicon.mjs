import sharp from 'sharp';
import { writeFileSync } from 'fs';

const input = './src/assets/favicon-source.jpeg';
const publicDir = './public';

const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const px = new Uint8Array(data);
const { width, height, channels: ch } = info;

// 1. Flood fill from edges — removes background including body-leaf gap
//    if connected. Uses generous threshold to reach into crevices.
const visited = new Uint8Array(width * height);
const queue = [];
for (let x = 0; x < width; x++) { queue.push([x,0],[x,height-1]); }
for (let y = 0; y < height; y++) { queue.push([0,y],[width-1,y]); }

function isBg(i) {
  return px[i] > 220 && px[i+1] > 220 && px[i+2] > 220;
}

while (queue.length > 0) {
  const [x,y] = queue.pop();
  if (x<0||x>=width||y<0||y>=height) continue;
  const pi = y*width+x;
  if (visited[pi]) continue;
  visited[pi] = 1;
  const i = pi*ch;
  if (!isBg(i)) continue;
  px[i+3] = 0;
  queue.push([x-1,y],[x+1,y],[x,y-1],[x,y+1]);
}
console.log('Flood fill from edges done');

// 2. Find remaining white regions NOT reached by flood fill.
//    Large ones (>500px) are likely trapped background (body-leaf gap).
//    Small ones are leaf decorations — keep them.
const labelMap = new Int32Array(width * height).fill(-1);
let regionId = 0;
const regionSizes = [];

for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
  const pi = y*width+x;
  const i = pi*ch;
  if (px[i+3] === 0) continue;
  if (labelMap[pi] >= 0) continue;
  if (!(px[i] > 220 && px[i+1] > 220 && px[i+2] > 220)) continue;
  
  // BFS to find connected white region
  const rq = [[x,y]];
  const pixels = [];
  while (rq.length > 0) {
    const [rx,ry] = rq.pop();
    if (rx<0||rx>=width||ry<0||ry>=height) continue;
    const rpi = ry*width+rx;
    if (labelMap[rpi] >= 0) continue;
    const ri = rpi*ch;
    if (px[ri+3] === 0) continue;
    if (!(px[ri] > 220 && px[ri+1] > 220 && px[ri+2] > 220)) continue;
    labelMap[rpi] = regionId;
    pixels.push(ri);
    rq.push([rx-1,ry],[rx+1,ry],[rx,ry-1],[rx,ry+1]);
  }
  regionSizes.push({ id: regionId, size: pixels.length, pixels });
  regionId++;
}

// Remove large white regions (trapped background), keep small ones (decorations)
let removedRegions = 0;
for (const region of regionSizes) {
  if (region.size > 500) {
    for (const i of region.pixels) px[i+3] = 0;
    removedRegions++;
    console.log(`Removed trapped white region: ${region.size} pixels`);
  }
}
console.log(`Kept ${regionSizes.length - removedRegions} small white regions (decorations)`);

// 3. Clean edges: remove any edge pixel that's lighter than its interior neighbor.
//    Keep dark edge pixels at full opacity. No semi-transparency — avoids halos.
for (let pass = 0; pass < 2; pass++) {
  const toRemove = [];
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
    const i = (y*width+x)*ch;
    if (px[i+3] === 0) continue;

    let isEdge = false;
    for (const [dx,dy] of [[-1,0],[1,0],[0,-1],[0,1]]) {
      const nx=x+dx, ny=y+dy;
      if (nx<0||nx>=width||ny<0||ny>=height) { isEdge=true; break; }
      if (px[(ny*width+nx)*ch+3] === 0) { isEdge=true; break; }
    }
    if (!isEdge) continue;

    const bright = (px[i]+px[i+1]+px[i+2])/3;
    // Remove light edge pixels (white-contaminated from JPEG)
    if (bright > 180) { toRemove.push(i); continue; }

    // Find nearest interior pixel to compare
    let refBright = -1;
    for (let r = 2; r <= 6; r++) {
      for (const [dx,dy] of [[r,0],[-r,0],[0,r],[0,-r]]) {
        const nx=x+dx, ny=y+dy;
        if (nx<0||nx>=width||ny<0||ny>=height) continue;
        const ni = (ny*width+nx)*ch;
        if (px[ni+3] === 0) continue;
        let interior = true;
        for (const [ddx,ddy] of [[-1,0],[1,0],[0,-1],[0,1]]) {
          const nnx=nx+ddx, nny=ny+ddy;
          if (nnx<0||nnx>=width||nny<0||nny>=height||px[(nny*width+nnx)*ch+3]===0) { interior=false; break; }
        }
        if (interior) { refBright=(px[ni]+px[ni+1]+px[ni+2])/3; break; }
      }
      if (refBright >= 0) break;
    }

    // If edge pixel is significantly lighter than interior, it's contaminated
    if (refBright >= 0 && bright > refBright + 40) {
      toRemove.push(i);
    }
  }
  for (const i of toRemove) px[i+3] = 0;
  console.log(`Edge cleanup pass ${pass+1}: removed ${toRemove.length} pixels`);
}

const result = await sharp(Buffer.from(px), { raw: { width, height, channels: ch } })
  .trim()
  .png()
  .toBuffer();

const bg = { r:0,g:0,b:0,alpha:0 };

// Large sizes: clean, no glow
for (const [n,s] of [['apple-touch-icon.png',180],['icon-192.png',192],['icon-512.png',512]]) {
  await sharp(result).resize(s,s,{fit:'contain',background:bg}).png().toFile(`${publicDir}/${n}`);
}
await sharp(result).png().toFile(`${publicDir}/favicon-full.png`);

// Small sizes (favicon): add outer-only white glow for tab contrast
const { data: glowData, info: glowInfo } = await sharp(result).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const glowPx = new Uint8Array(glowData);
const gw = glowInfo.width, gh = glowInfo.height, gc = glowInfo.channels;

// Fill interior gaps for solid silhouette (outer-only glow)
const filledPx = new Uint8Array(glowPx);
const ext = new Uint8Array(gw * gh);
const gq = [];
for (let x = 0; x < gw; x++) { gq.push([x,0],[x,gh-1]); }
for (let y = 0; y < gh; y++) { gq.push([0,y],[gw-1,y]); }
while (gq.length > 0) {
  const [x,y] = gq.pop();
  if (x<0||x>=gw||y<0||y>=gh) continue;
  const pi = y*gw+x;
  if (ext[pi]) continue;
  ext[pi] = 1;
  if (filledPx[pi*gc+3] > 0) continue;
  gq.push([x-1,y],[x+1,y],[x,y-1],[x,y+1]);
}
for (let pi = 0; pi < gw*gh; pi++) {
  const i = pi*gc;
  if (filledPx[i+3]===0 && !ext[pi]) {
    filledPx[i]=128; filledPx[i+1]=128; filledPx[i+2]=128; filledPx[i+3]=255;
  }
}

const whiteSil = Buffer.from(filledPx);
for (let i = 0; i < whiteSil.length; i += gc) {
  if (whiteSil[i+3] > 20) { whiteSil[i]=255; whiteSil[i+1]=255; whiteSil[i+2]=255; whiteSil[i+3]=255; }
}
const glowOutline = await sharp(whiteSil, { raw: { width: gw, height: gh, channels: gc } }).blur(35).png().toBuffer();
const withGlow = await sharp(glowOutline)
  .composite([{ input: await sharp(result).toBuffer(), gravity: 'center' }])
  .png().toBuffer();

// Small sizes from glowed version
await sharp(withGlow).resize(32,32,{fit:'contain',background:bg}).png().toFile(`${publicDir}/favicon-32.png`);
await sharp(withGlow).resize(16,16,{fit:'contain',background:bg}).png().toFile(`${publicDir}/favicon-16.png`);

const p16=await sharp(withGlow).resize(16,16,{fit:'contain',background:bg}).png().toBuffer();
const p32=await sharp(withGlow).resize(32,32,{fit:'contain',background:bg}).png().toBuffer();
function mkIco(imgs){const h=Buffer.alloc(6);h.writeUInt16LE(0,0);h.writeUInt16LE(1,2);h.writeUInt16LE(imgs.length,4);const es=[];let o=6+imgs.length*16;for(const{w,h:ih,data}of imgs){const e=Buffer.alloc(16);e.writeUInt8(w>=256?0:w,0);e.writeUInt8(ih>=256?0:ih,1);e.writeUInt16LE(1,4);e.writeUInt16LE(32,6);e.writeUInt32LE(data.length,8);e.writeUInt32LE(o,12);es.push(e);o+=data.length;}return Buffer.concat([h,...es,...imgs.map(i=>i.data)]);}
writeFileSync(`${publicDir}/favicon.ico`, mkIco([{w:16,h:16,data:p16},{w:32,h:32,data:p32}]));
console.log('Done');
