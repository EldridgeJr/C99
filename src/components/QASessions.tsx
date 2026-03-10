import { MessageCircle, Lock } from 'lucide-react';

export default function QASessions() {
  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 text-center">
          <div className="mb-6 flex justify-center">
            <div className="relative">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
                <MessageCircle size={48} className="text-gray-400" />
              </div>
              <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-black rounded-full flex items-center justify-center shadow-lg">
                <Lock size={20} className="text-white" />
              </div>
            </div>
          </div>

          <h1 className="text-4xl font-bold text-black mb-4">Live Sessions About Law</h1>
          <p className="text-xl text-gray-600 mb-8">Interactive legal education sessions</p>

          <div className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 rounded-full text-gray-700 font-semibold text-lg mb-6">
            <Lock size={20} />
            <span>Coming Soon</span>
          </div>

          <p className="text-gray-600 max-w-md mx-auto leading-relaxed">
            We're working hard to bring you interactive Q&A sessions with legal experts.
            This feature will be available soon. Stay tuned for updates.
          </p>
        </div>
      </div>
    </div>
  );
}
