import * as ts from 'typescript';
import * as fs from 'fs';

const fileName = 'src/components/HomeView.tsx';
const fileContent = fs.readFileSync(fileName, 'utf8');

const sourceFile = ts.createSourceFile(
  fileName,
  fileContent,
  ts.ScriptTarget.Latest,
  true
);

const opens: { tag: string; line: number; col: number }[] = [];
const closes: { tag: string; line: number; col: number }[] = [];

function traverse(node: ts.Node) {
  if (ts.isJsxOpeningElement(node)) {
    const start = ts.getLineAndCharacterOfPosition(sourceFile, node.getStart(sourceFile));
    opens.push({
      tag: node.tagName.getText(sourceFile),
      line: start.line + 1,
      col: start.character + 1
    });
  } else if (ts.isJsxClosingElement(node)) {
    const start = ts.getLineAndCharacterOfPosition(sourceFile, node.getStart(sourceFile));
    closes.push({
      tag: node.tagName.getText(sourceFile),
      line: start.line + 1,
      col: start.character + 1
    });
  } else if (ts.isJsxSelfClosingElement(node)) {
    // Self-closing elements are balanced by definition, so we can ignore them
  }
  ts.forEachChild(node, traverse);
}

traverse(sourceFile);

console.log(`Total Opening Tags: ${opens.length}`);
console.log(`Total Closing Tags: ${closes.length}`);

// Count tag types
const openCounts: Record<string, number> = {};
const closeCounts: Record<string, number> = {};

opens.forEach(o => openCounts[o.tag] = (openCounts[o.tag] || 0) + 1);
closes.forEach(c => closeCounts[c.tag] = (closeCounts[c.tag] || 0) + 1);

console.log('\n--- TAG COUNTS FROM AST ---');
const allTags = new Set([...Object.keys(openCounts), ...Object.keys(closeCounts)]);
for (const tag of Array.from(allTags).sort()) {
  const o = openCounts[tag] || 0;
  const c = closeCounts[tag] || 0;
  if (o !== c) {
    console.log(`❌ Tag: <${tag}> -> Opened: ${o}, Closed: ${c} (MISMATCH: ${o - c})`);
  } else {
    console.log(`✅ Tag: <${tag}> -> Opened: ${o}, Closed: ${c}`);
  }
}
