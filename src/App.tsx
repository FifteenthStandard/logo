import { useEffect, useRef, useState } from 'react';

export default function App(): React.ReactElement {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [ logo, setLogo ] = useState([
    [ false, false, false, false ],
    [ false, false, false, false ],
    [ false, false, false, false ],
    [ false, false, false, false ],
  ]);
  const [ painting, setPainting ] = useState<boolean | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    const cell = ctx.canvas.width / 4;
    ctx.fillStyle = '#fdfcfb';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillStyle = '#1a1a1b';
    for (let y = 0; y < 4; y++) {
      for (let x = 0; x < 4; x++) {
        const value = logo[y][x];
        if (!value) continue;
        ctx.fillRect(x * cell, y * cell, cell, cell);
      }
    }
  }, [ canvasRef, logo ]);

  function handleMouseDown(event: React.MouseEvent<HTMLCanvasElement>): void {
    const [ x, y ] = getCell(event);
    if (x < 0 || y < 0) return;
    const painting = !logo[y][x];
    setLogo(paint(logo, [ x, y ], painting));
    setPainting(painting);
  };

  function handleMouseMove(event: React.MouseEvent<HTMLCanvasElement>): void {
    if (painting === null) return;
    const [ x, y ] = getCell(event);
    if (x < 0 || y < 0) return;
    setLogo(paint(logo, [ x, y ], painting));
  };

  function handleMouseUp(): void {
    setPainting(null);
  };


  return (
    <div
      style={{
        margin: 'auto',
        maxWidth: '800px',
      }}
    >
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        height={512}
        width={512}
        style={{
          aspectRatio: '1 / 1',
          border: '1px solid #1a1a1b',
          maxWidth: '100%',
          padding: '8px',
          width: '90dvw',
        }}
      />
    </div>
  );
};

function getCell(event: React.MouseEvent<HTMLCanvasElement>): [ number, number ] {
  const canvas = event.currentTarget;
  const rect = canvas.getBoundingClientRect();
  const cell = rect.width / 4;

  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) {
    return [ -1, -1 ];
  }

  const x = Math.floor((event.clientX - rect.left) / cell);
  const y = Math.floor((event.clientY - rect.top)  / cell);

  return [ x, y ];
};

function paint(logo: boolean[][], cell: [ number, number ], value: boolean): boolean[][] {
  return logo.map((row, y) => row.map((curr, x) => x === cell[0] && y === cell[1] ? value : curr));
};
