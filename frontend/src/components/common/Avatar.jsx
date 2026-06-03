export default function Avatar({ name, src, size = 32 }) {
  const initial = name?.charAt(0).toUpperCase() || '?';
  if (src) {
    return <img src={src} alt={name} className="rounded-full object-cover" style={{ width: size, height: size }} />;
  }
  return (
    <div className="rounded-full bg-blue-500 text-white flex items-center justify-center font-bold" style={{ width: size, height: size }}>
      {initial}
    </div>
  );
}