export default function AmbientBackground() {
  return (
    <div className="ambient-bg">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMjAwIDIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZmlsdGVyIGlkPSJub2lzZUZpbHRlciI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuNjUiIG51bU9jdGF2ZXM9IjMiIHN0aXRjaFRpbGVzPSJzdGl0Y2giLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWx0ZXI9InVybCgibm9pc2VGaWx0ZXIpIi8+PC9zdmc+')] opacity-[0.02] mix-blend-overlay"></div>
      <div className="orb w-[600px] h-[600px] bg-indigo-600 top-[-10%] left-[-10%]"></div>
      <div 
        className="orb w-[800px] h-[800px] bg-purple-700 top-[30%] right-[-20%]" 
        style={{ animationDelay: '-5s' }}
      ></div>
      <div 
        className="orb w-[500px] h-[500px] bg-amber-500 top-[70%] left-[10%]" 
        style={{ animationDelay: '-10s', opacity: 0.15 }}
      ></div>
    </div>
  );
}
