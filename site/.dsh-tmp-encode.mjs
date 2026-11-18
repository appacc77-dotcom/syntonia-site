import sharp from 'sharp'
import { statSync, copyFileSync } from 'node:fs'
const RAW='/Users/gleb/Documents/deepseek-harness/default-workspace/studio-pipeline-v2/site/public/assets'
const OUT='/Users/gleb/Documents/deepseek-harness/default-workspace/syntonia-site/assets'
const pairs=[
  ['img-962882f8c4.png','img-962882f8c4.webp'],   // home: about-founder photo
  ['img-7925419b51.png','img-7925419b51.webp'],   // masters: founder portrait
  ['img-183625589c.png','img-183625589c.webp'],   // masters: master photo
  ['img-abcfd5054b.png','img-abcfd5054b.webp'],   // masters: master photo
]
for (const [rawName, finalName] of pairs) {
  const src=`${RAW}/${rawName}`, dst=`${OUT}/${finalName}`
  const before=statSync(dst).size
  const info=await sharp(src).webp({ lossless: true, effort: 6, smartSubsample: false, alphaQuality: 100 }).toFile(dst+'.tmp')
  copyFileSync(dst+'.tmp', dst)
  const after=statSync(dst).size
  console.log(`${finalName}: ${(before/1024).toFixed(0)}KB → ${(after/1024).toFixed(0)}KB (lossless webp)`)
}
