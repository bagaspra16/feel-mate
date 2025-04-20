import React, { useState, useEffect, useRef } from 'react';

// AudioWave component that shows an animated visualization when listening or speaking
const AudioWave = ({ isActive, type = 'listening' }) => {
  const containerRef = useRef(null);
  // State untuk menyimpan tinggi bar
  const [heights, setHeights] = useState([]);
  const [barCount, setBarCount] = useState(12);
  
  // Deteksi ukuran layar untuk menyesuaikan jumlah bar
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 400) {
        setBarCount(6);
      } else if (width < 640) {
        setBarCount(8);
      } else {
        setBarCount(10);
      }
    };
    
    handleResize(); // Panggil sekali saat load
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Update heights setiap interval jika aktif
  useEffect(() => {
    if (!isActive) {
      // Set heights awal saat tidak aktif
      setHeights(Array(barCount).fill(0).map(() => 10 + Math.random() * 20));
      return;
    }
    
    // Update heights secara acak saat aktif
    const interval = setInterval(() => {
      setHeights(Array(barCount).fill(0).map(() => 10 + Math.random() * 90));
    }, 150);
    
    return () => clearInterval(interval);
  }, [isActive, barCount]);
  
  // Warna berdasarkan tipe (mendengarkan atau berbicara)
  const getBarColors = () => {
    if (type === 'listening') {
      return {
        from: 'from-green-400',
        to: 'to-emerald-600',
        border: 'border-green-500/30'
      };
    } else {
      return {
        from: 'from-blue-400',
        to: 'to-indigo-600',
        border: 'border-blue-500/30'
      };
    }
  };
  
  const { from, to, border } = getBarColors();
  
  return (
    <div ref={containerRef} className="relative h-12 sm:h-14 flex items-center justify-center p-2 bg-black/30 backdrop-blur-xl rounded-xl border border-white/5 shadow-lg overflow-hidden">
      {/* Efek background */}
      {isActive && (
        <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-black/50 opacity-75"></div>
      )}
      
      {/* Container untuk bars */}
      <div className="relative z-10 flex items-center justify-center gap-0.5 h-full px-1 sm:px-2 w-full">
        {heights.map((height, index) => (
          <div
            key={index}
            className={`rounded-full transition-all ${isActive ? `bg-gradient-to-t ${from} ${to}` : 'bg-gray-600/50'} ${border}`}
            style={{
              height: `${Math.max(4, isActive ? height : 10 + (index % 3) * 5)}%`,
              width: window.innerWidth < 640 ? '2px' : '3px',
              opacity: isActive ? 0.9 : 0.5,
              transitionDuration: `${150 + (index * 20)}ms`,
              transitionTimingFunction: 'ease-in-out',
              transform: `scaleY(${isActive ? 1 : 0.7})`,
            }}
          />
        ))}
      </div>
      
      {/* Status text */}
      <div className="absolute bottom-0.5 right-1.5 text-[0.5rem] text-white/60">
        {isActive && (
          <div className="flex items-center gap-0.5">
            <span className={`inline-block w-1 h-1 rounded-full ${type === 'listening' ? 'bg-green-500' : 'bg-blue-500'} animate-pulse`}></span>
            <span>{type === 'listening' ? 'Mendengarkan' : 'Berbicara'}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AudioWave; 