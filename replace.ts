import fs from 'fs';
import path from 'path';

function replaceInDir(dir: string, from: string, to: string) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      replaceInDir(fullPath, from, to);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts') || fullPath.endsWith('.css')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes(from)) {
        content = content.split(from).join(to);
        fs.writeFileSync(fullPath, content);
        console.log(`Updated ${fullPath}`);
      }
    }
  }
}

replaceInDir('./src', 'border border-white/20 dark:border-slate-800/50 shadow-[0_0_40px_-10px_rgba(6,182,212,0.3)] ', 'border border-slate-200 dark:border-slate-800 shadow-xl');
replaceInDir('./src', 'border border-white/20 dark:border-slate-800/50 shadow-[0_0_20px_-10px_rgba(6,182,212,0.2)]', 'border border-slate-200 dark:border-slate-800 shadow-md');
replaceInDir('./src', 'border border-white/20 dark:border-slate-800/50', 'border-slate-200 dark:border-slate-800');

