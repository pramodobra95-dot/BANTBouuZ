import * as fs from 'fs';

const code = fs.readFileSync('src/components/HomeView.tsx', 'utf-8');

let pos = 0;
const len = code.length;
const stack: { tag: string; line: number; col: number; text: string }[] = [];
let braceStack: { type: 'js' | 'tag'; line: number; tagIndex?: number }[] = [];

function getLineCol(p: number) {
  const sub = code.substring(0, p);
  const lines = sub.split('\n');
  return { line: lines.length, col: lines[lines.length - 1].length + 1 };
}

while (pos < len) {
  const c = code[pos];
  const lc = getLineCol(pos);

  if (lc.line === 386) {
    console.log(`[Col ${lc.col}] Char: "${c}", braceStack: ${JSON.stringify(braceStack)}`);
  }

  if (code.startsWith('//', pos)) {
    pos = code.indexOf('\n', pos);
    if (pos === -1) break;
    continue;
  }
  if (code.startsWith('/*', pos)) {
    pos = code.indexOf('*/', pos);
    if (pos === -1) break;
    pos += 2;
    continue;
  }

  const insideJs = braceStack.length > 0 && braceStack[braceStack.length - 1].type === 'js';
  const insideTag = braceStack.length > 0 && braceStack[braceStack.length - 1].type === 'tag';

  if (insideJs || insideTag) {
    if (c === '"') {
      pos++;
      while (pos < len && code[pos] !== '"') {
        if (code[pos] === '\\') pos += 2;
        else pos++;
      }
      pos++;
      continue;
    }
    if (c === "'") {
      pos++;
      while (pos < len && code[pos] !== "'") {
        if (code[pos] === '\\') pos += 2;
        else pos++;
      }
      pos++;
      continue;
    }
    if (c === '`') {
      pos++;
      while (pos < len && code[pos] !== '`') {
        if (code[pos] === '\\') pos += 2;
        else pos++;
      }
      pos++;
      continue;
    }
  }

  if (c === '{') {
    braceStack.push({ type: 'js', line: lc.line });
    pos++;
    continue;
  }
  if (c === '}') {
    if (braceStack.length > 0 && braceStack[braceStack.length - 1].type === 'js') {
      braceStack.pop();
    }
    pos++;
    continue;
  }

  if (insideTag) {
    if (c === '/' && code[pos + 1] === '>') {
      braceStack.pop();
      stack.pop();
      pos += 2;
      continue;
    }
    if (c === '>') {
      braceStack.pop();
      pos++;
      continue;
    }
  }

  if (!insideTag) {
    if (c === '<') {
      const nextChar = code[pos + 1];
      if (nextChar === '!' || nextChar === '?' || nextChar === '=' || /\d/.test(nextChar) || nextChar === ' ' || nextChar === '+') {
        pos++;
        continue;
      }
      
      const isClosing = nextChar === '/';
      pos++;
      if (isClosing) pos++;
      
      let tagName = '';
      while (pos < len && /[a-zA-Z0-9.:-]/.test(code[pos])) {
        tagName += code[pos];
        pos++;
      }
      
      if (isClosing) {
        while (pos < len && code[pos] !== '>') {
          pos++;
        }
        pos++;
      } else {
        braceStack.push({ type: 'tag', line: lc.line });
      }
      continue;
    }
  }

  pos++;
}
