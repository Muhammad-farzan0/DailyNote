export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-4 text-center text-sm text-gray-500">
      © {new Date().getFullYear()} DailyNote – Free task management. Built with ❤️
    </footer>
  );
}