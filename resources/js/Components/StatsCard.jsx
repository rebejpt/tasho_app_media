export default function StatsCard({ title, value, icon, color }) {
    const colors = {
        blue: 'bg-blue-100 text-blue-600',
        green: 'bg-green-100 text-green-600',
        purple: 'bg-purple-100 text-purple-600',
        orange: 'bg-orange-100 text-orange-600',
        red: 'bg-red-100 text-red-600',
    };

    const icons = {
        users: '👥',
        teams: '🏢',
        projects: '📁',
        files: '📄',
    };

    return (
        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
            <div className="p-6">
                <div className="flex items-center">
                    <div className={`p-3 rounded-full ${colors[color]}`}>
                        <span className="text-2xl">{icons[icon]}</span>
                    </div>
                    <div className="ml-4">
                        <p className="text-sm font-medium text-gray-500">{title}</p>
                        <p className="text-2xl font-semibold text-gray-900">{value}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}