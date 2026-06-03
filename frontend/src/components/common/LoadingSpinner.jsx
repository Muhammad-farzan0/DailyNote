export default function LoadingSpinner({ size = 8 }) {
  return (
    <div className="flex justify-center items-center">
      <div className={`w-${size} h-${size} border-4 border-blue-500 border-t-transparent rounded-full animate-spin`}></div>
    </div>
  );
}