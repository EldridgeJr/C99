import { Monitor, Smartphone } from 'lucide-react';

export default function MobileWarning() {
  return (
    <div className="fixed inset-0 bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-black opacity-5 rounded-full blur-xl"></div>
            <div className="relative bg-gray-100 rounded-full p-6">
              <Monitor className="w-16 h-16 text-black" />
            </div>
          </div>
        </div>

        <div className="text-center">
          <h1 className="text-2xl font-bold text-black mb-3">
            Desktop Required
          </h1>
          <p className="text-gray-600 mb-6 leading-relaxed">
            This application is optimized for desktop browsers. Please access it from a computer for the best experience.
          </p>

          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center justify-center gap-3 text-sm text-gray-700">
              <Smartphone className="w-5 h-5 text-gray-400" />
              <span>Mobile version coming soon</span>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            For technical support, please contact your lawyer
          </p>
        </div>
      </div>
    </div>
  );
}
