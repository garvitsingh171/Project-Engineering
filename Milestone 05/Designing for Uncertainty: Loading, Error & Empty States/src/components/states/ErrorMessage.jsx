import { AlertCircle } from 'lucide-react'

const ErrorMessage = ({ message, onRetry }) => (
  <div className="bg-red-50 border border-red-100 rounded-xl p-6 text-red-700">
    <div className="flex items-start gap-3">
      <AlertCircle className="mt-0.5" size={22} />
      <div>
        <h2 className="font-semibold text-red-800">Something went wrong</h2>
        <p className="text-sm mt-1">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-700"
          >
            Retry
          </button>
        )}
      </div>
    </div>
  </div>
)

export default ErrorMessage