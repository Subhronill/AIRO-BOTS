'use client';

/* ─────────────────────────────────────────────────────────────────────────────
   DiagramBlock — renders beautiful nested hierarchy diagrams from markdown.

   Usage in markdown:
   ```diagram
   PARENT TITLE: parent description
     CHILD TITLE: child description
       GRANDCHILD: grandchild description
   ```

   Two spaces = one nesting level.
   Multiple children at the same level display in a responsive grid.
───────────────────────────────────────────────────────────────────────────── */

interface DiagNode {
  title: string;
  desc:  string;
  children: DiagNode[];
}

const DEPTH = [
  { border: 'rgba(14,165,233,0.45)',  bg: 'rgba(14,165,233,0.05)',  title: '#38bdf8' }, // sky
  { border: 'rgba(168,85,247,0.45)', bg: 'rgba(168,85,247,0.05)', title: '#c084fc' }, // purple
  { border: 'rgba(6,182,212,0.45)',  bg: 'rgba(6,182,212,0.05)',  title: '#22d3ee' }, // cyan
  { border: 'rgba(16,185,129,0.45)', bg: 'rgba(16,185,129,0.05)', title: '#34d399' }, // emerald
  { border: 'rgba(234,179,8,0.45)',  bg: 'rgba(234,179,8,0.05)',  title: '#facc15' }, // amber
];

function parse(raw: string): DiagNode[] {
  const roots: DiagNode[] = [];
  const stack: { node: DiagNode; depth: number }[] = [];

  for (const line of raw.split('\n')) {
    if (!line.trim()) continue;
    const depth     = Math.floor((line.match(/^( *)/)?.[1].length ?? 0) / 2);
    const text      = line.trim();
    const colonIdx  = text.indexOf(':');
    const title     = colonIdx !== -1 ? text.slice(0, colonIdx).trim() : text;
    const desc      = colonIdx !== -1 ? text.slice(colonIdx + 1).trim() : '';
    const node: DiagNode = { title, desc, children: [] };

    while (stack.length && stack[stack.length - 1].depth >= depth) stack.pop();

    if (!stack.length) roots.push(node);
    else stack[stack.length - 1].node.children.push(node);

    stack.push({ node, depth });
  }
  return roots;
}

function Node({ node, depth }: { node: DiagNode; depth: number }) {
  const s = DEPTH[depth % DEPTH.length];
  const hasDesc     = Boolean(node.desc);
  const hasChildren = node.children.length > 0;
  const multiChild  = node.children.length > 1;

  return (
    <div style={{
      border:       `1px solid ${s.border}`,
      background:   s.bg,
      borderRadius: '10px',
      padding:      '14px 16px',
    }}>
      {/* ── Title ── */}
      <p style={{
        color:         s.title,
        fontFamily:    "'JetBrains Mono', monospace",
        fontWeight:    700,
        fontSize:      '0.75rem',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        margin:        0,
        paddingBottom: (hasDesc || hasChildren) ? '5px' : 0,
      }}>
        {node.title}
      </p>

      {/* ── Description ── */}
      {hasDesc && (
        <p style={{
          color:         '#94a3b8',
          fontSize:      '0.8rem',
          lineHeight:    1.55,
          margin:        0,
          fontStyle:     'italic',
          paddingBottom: hasChildren ? '10px' : 0,
        }}>
          {node.desc}
        </p>
      )}

      {/* ── Children ── */}
      {hasChildren && (
        <div style={{
          display:               'grid',
          gridTemplateColumns:   multiChild ? 'repeat(auto-fit, minmax(160px, 1fr))' : '1fr',
          gap:                   '8px',
          marginTop:             (hasDesc || !hasChildren) ? 0 : '6px',
        }}>
          {node.children.map((child, i) => (
            <Node key={i} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function DiagramBlock({ content }: { content: string }) {
  const nodes = parse(content.replace(/\n$/, ''));
  return (
    <div style={{ margin: '1.5rem 0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {nodes.map((node, i) => <Node key={i} node={node} depth={0} />)}
    </div>
  );
}
