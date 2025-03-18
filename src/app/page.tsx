export default function Home() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-center">
            <h1 className="text-4xl font-bold mb-6">Welcome to Personal Finance Visualizer</h1>
            <a 
                href="/dashboard" 
                className="bg-blue-500 text-white px-6 py-3 rounded-md text-lg font-semibold hover:bg-blue-600 transition"
            >
                Go to Dashboard
            </a>
        </div>
    );
}