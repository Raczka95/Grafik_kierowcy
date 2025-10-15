export default function Header({ user, onLogout }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-4 mb-4 border border-gray-100">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Kalendarz Kierowców
          </h1>
          <p className="text-gray-600 text-xs mt-1">
            Zalogowano jako: <strong className="text-gray-800">{user.email}</strong>
          </p>
        </div>
        <button
          onClick={onLogout}
          className="px-5 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-md hover:shadow-lg font-medium text-sm"
        >
          Wyloguj
        </button>
      </div>
    </div>
  );
}