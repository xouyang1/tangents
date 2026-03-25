import sharp from 'sharp';
import { writeFileSync } from 'fs';

const input = './src/assets/favicon-source.jpeg';
const publicDir = './public';

const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const px = new Uint8Array(data);
const { width, height, channels: ch } = info;

// 1. Flood fill from edges — removes background
const visited = new Uint8Array(width * height);
const queue = [];
for (let x = 0; x < width; x++) { queue.push([x,0],[x,height-1]); }
for (let y = 0; y < height; y++) { queue.push([0,y],[width-1,y]); }

// Background is purple/magenta — high red, low green, high blue
function isBg(i) {
  const r = px[i], g = px[i+1], b = px[i+2];
  // Purple: high R, low G, high B
  return r > 140 && g < 100 && b > 140 && (r + b) / 2 - g > 80;
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

// 2. Find and remove large trapped white regions (body-leaf gap).
//    Keep small ones (leaf decorations).
const labelMap = new Int32Array(width * height).fill(-1);
let regionId = 0;
const regionSizes = [];

for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
  const pi = y*width+x;
  const i = pi*ch;
  if (px[i+3] === 0 || labelMap[pi] >= 0) continue;
  if (!isBg(pi*ch)) continue;

  const rq = [[x,y]];
  const pixels = [];
  while (rq.length > 0) {
    const [rx,ry] = rq.pop();
    if (rx<0||rx>=width||ry<0||ry>=height) continue;
    const rpi = ry*width+rx;
    if (labelMap[rpi] >= 0) continue;
    const ri = rpi*ch;
    if (px[ri+3] === 0) continue;
    if (!isBg(ri)) continue;
    labelMap[rpi] = regionId;
    pixels.push(ri);
    rq.push([rx-1,ry],[rx+1,ry],[rx,ry-1],[rx,ry+1]);
  }
  regionSizes.push({ id: regionId, size: pixels.length, pixels });
  regionId++;
}

let removedRegions = 0;
for (const region of regionSizes) {
  if (region.size > 500) {
    for (const i of region.pixels) px[i+3] = 0;
    removedRegions++;
    console.log(`Removed trapped white region: ${region.size} pixels`);
  }
}
console.log(`Kept ${regionSizes.length - removedRegions} small white regions (decorations)`);

// 3. Remove any remaining pixel with purple tint (JPEG blending artifacts).
//    Purple = R and B both significantly higher than G.
{
  let purged = 0;
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
    const i = (y*width+x)*ch;
    if (px[i+3] === 0) continue;
    const r = px[i], g = px[i+1], b = px[i+2];
    // Purple bg has very low green (<80). Pink artwork (flower, ladybug) has green >100.
    if (r > g + 15 && b > g + 15 && g < 80) {
      px[i+3] = 0;
      purged++;
    }
  }
  console.log(`Purged ${purged} purple-tinted pixels`);
}

// 4. Erode 2px — clean up remaining edge noise
for (let pass = 0; pass < 2; pass++) {
  const toRemove = [];
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
    const i = (y*width+x)*ch;
    if (px[i+3] === 0) continue;
    for (const [dx,dy] of [[-1,0],[1,0],[0,-1],[0,1]]) {
      const nx=x+dx, ny=y+dy;
      if (nx<0||nx>=width||ny<0||ny>=height) { toRemove.push(i); break; }
      if (px[(ny*width+nx)*ch+3] === 0) { toRemove.push(i); break; }
    }
  }
  for (const i of toRemove) px[i+3] = 0;
  console.log(`Erode pass ${pass+1}: removed ${toRemove.length} pixels`);
}

const result = await sharp(Buffer.from(px), { raw: { width, height, channels: ch } })
  .trim()
  .png()
  .toBuffer();

const rMeta = await sharp(result).metadata();
console.log(`Result: ${rMeta.width}x${rMeta.height}`);

const bg = { r:0,g:0,b:0,alpha:0 };

// Large sizes: clean, no glow
for (const [n,s] of [['apple-touch-icon.png',180],['icon-192.png',192],['icon-512.png',512]]) {
  await sharp(result).resize(s,s,{fit:'contain',background:bg}).png().toFile(`${publicDir}/${n}`);
}
await sharp(result).png().toFile(`${publicDir}/favicon-full.png`);

// Small sizes: outer-only white glow for tab contrast
const { data: glowData, info: glowInfo } = await sharp(result).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const glowPx = new Uint8Array(glowData);
const gw = glowInfo.width, gh = glowInfo.height, gc = glowInfo.channels;

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

await sharp(withGlow).resize(32,32,{fit:'contain',background:bg}).png().toFile(`${publicDir}/favicon-32.png`);
await sharp(withGlow).resize(16,16,{fit:'contain',background:bg}).png().toFile(`${publicDir}/favicon-16.png`);

// ICO
const p16=await sharp(withGlow).resize(16,16,{fit:'contain',background:bg}).png().toBuffer();
const p32=await sharp(withGlow).resize(32,32,{fit:'contain',background:bg}).png().toBuffer();
function mkIco(imgs){const h=Buffer.alloc(6);h.writeUInt16LE(0,0);h.writeUInt16LE(1,2);h.writeUInt16LE(imgs.length,4);const es=[];let o=6+imgs.length*16;for(const{w,h:ih,data}of imgs){const e=Buffer.alloc(16);e.writeUInt8(w>=256?0:w,0);e.writeUInt8(ih>=256?0:ih,1);e.writeUInt16LE(1,4);e.writeUInt16LE(32,6);e.writeUInt32LE(data.length,8);e.writeUInt32LE(o,12);es.push(e);o+=data.length;}return Buffer.concat([h,...es,...imgs.map(i=>i.data)]);}
writeFileSync(`${publicDir}/favicon.ico`, mkIco([{w:16,h:16,data:p16},{w:32,h:32,data:p32}]));
console.log('Done');
