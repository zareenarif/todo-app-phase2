import Link from 'next/link';
import Header from '@/components/Header';
import Badge from '@/components/Badge';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <Header variant="landing" />

      {/* Hero Section */}
      <main className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background decorative blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-float"></div>
          <div className="absolute top-40 right-10 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-float" style={{ animationDelay: '1s' }}></div>
          <div className="absolute -bottom-20 left-1/2 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-float" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="relative max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="mb-8 flex justify-center animate-fade-in-up">
            <Badge variant="primary" size="md">
              ✨ Simple & Powerful Task Management
            </Badge>
          </div>

          {/* Main Heading */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 mb-4 leading-tight animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            Organize your life with{' '}
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              TaskFlow
            </span>
          </h1>

          {/* Description */}
          <p className="text-base sm:text-lg text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            The modern task manager that helps you stay productive, organized, and focused on what matters most.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
            <Link href="/signup">
              <button className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-lg rounded-xl hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-indigo-200 transition-all transform hover:scale-105 shadow-xl min-w-[240px]">
                Start Free Today
              </button>
            </Link>
            <Link href="/login">
              <button className="px-8 py-4 bg-white text-gray-700 font-bold text-lg rounded-xl border-2 border-gray-200 hover:border-indigo-300 hover:bg-gray-50 focus:outline-none focus:ring-4 focus:ring-gray-100 transition-all transform hover:scale-105 shadow-lg min-w-[240px]">
                I already have an account
              </button>
            </Link>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
            {/* Feature 1 */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mb-6 mx-auto">
                <span className="text-lg">🎯</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Set Priorities
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Organize tasks by priority and never miss what matters most to you.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mb-6 mx-auto">
                <span className="text-lg">📅</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Track Deadlines
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Set due dates and get reminders to stay on top of your schedule.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mb-6 mx-auto">
                <span className="text-lg">🏷️</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Tag & Organize
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Use custom tags to categorize and find your tasks instantly.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
