import React, { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Box, Text } from '@react-three/drei';

// ✅ Hook to detect dark mode (Tailwind / class-based)
const useDarkMode = () => {
  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains('dark')
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  return isDark;
};

// ✅ Bar Component
const Bar = ({ position, width, height, depth, color, value, textColor }) => {
  return (
    <>
      <Box args={[width, height, depth]} position={position}>
        <meshStandardMaterial color={color} />
      </Box>

      {/* Value Label */}
      <Text
        position={[position[0], position[1] + height / 2 + 0.25, position[2]]}
        fontSize={0.25}
        color={textColor}
        toneMapped={false}
        anchorX="center"
        anchorY="middle"
      >
        {value}
      </Text>
    </>
  );
};

export const Analytics3DCharts = ({ statusCounts }) => {
  const isDark = useDarkMode();

  // ✅ Better readable colors (not pure black/white)
  const textColor = isDark ? '#e5e7eb' : '#111827';
  const bgColor = isDark ? '#111827' : '#ffffff';

  const barData = [
    { name: 'Todo', count: statusCounts.todo || 0, color: '#3b82f6' },
    { name: 'In Progress', count: statusCounts.inProgress || 0, color: '#f59e0b' },
    { name: 'Completed', count: statusCounts.completed || 0, color: '#10b981' },
    { name: 'Incomplete', count: statusCounts.incomplete || 0, color: '#ef4444' },
  ];

  const maxCount = Math.max(...barData.map(d => d.count), 1);
  const barWidth = 0.8;
  const barDepth = 0.8;
  const startX = -(barData.length - 1) * 1.2 / 2;

  return (
    <div style={{ height: '500px', width: '100%', position: 'relative' }}>
      
      {/* ✅ Legend */}
      <div
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          background: isDark
            ? 'rgba(31,41,55,0.9)'
            : 'rgba(255,255,255,0.9)',
          color: textColor,
          padding: '8px 12px',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          zIndex: 10,
          fontSize: '12px',
          pointerEvents: 'none',
        }}
      >
        <strong>Task Status</strong>
        {barData.map((item) => (
          <div
            key={item.name}
            style={{
              display: 'flex',
              alignItems: 'center',
              marginTop: '4px',
            }}
          >
            <div
              style={{
                width: '12px',
                height: '12px',
                backgroundColor: item.color,
                marginRight: '6px',
              }}
            ></div>
            <span>{item.name}</span>
          </div>
        ))}
      </div>

      {/* ✅ Canvas */}
      <Canvas
        camera={{ position: [5, 4, 5], fov: 45 }}
        style={{ background: bgColor }}
      >
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} />
        <directionalLight position={[0, 5, 0]} intensity={0.6} />

        <OrbitControls enableZoom enablePan enableRotate />

        {/* Grid */}
        <gridHelper
          args={[10, 20, isDark ? '#444' : '#888', isDark ? '#222' : '#ccc']}
          position={[0, -0.2, 0]}
        />

        {/* Bars */}
        {barData.map((item, index) => {
          const height = (item.count / maxCount) * 2 || 0.1;
          const x = startX + index * 1.2;

          return (
            <Bar
              key={item.name}
              position={[x, height / 2, 0]}
              width={barWidth}
              height={height}
              depth={barDepth}
              color={item.color}
              value={item.count}
              textColor={textColor}
            />
          );
        })}

        {/* Axis Labels */}
        <Text
          position={[0, -0.8, 0]}
          fontSize={0.3}
          color={textColor}
          toneMapped={false}
          anchorX="center"
        >
          Task Status
        </Text>

        <Text
          position={[-3, 1.5, 0]}
          fontSize={0.3}
          color={textColor}
          toneMapped={false}
          rotation={[0, 0, Math.PI / 2]}
        >
          Number of Tasks
        </Text>
      </Canvas>
    </div>
  );
};