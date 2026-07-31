import { Inbox } from 'lucide-react'

const EmptyState = ({ title, message, actionLabel, onAction }) => (
  <div className="bg-white border border-gray-100 rounded-xl p-10 text-center shadow-sm">
    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-500">
      <Inbox size={24} />
    </div>
    <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
    <p className="text-sm text-gray-500 mt-2">{message}</p>
    {actionLabel && onAction && (
      <button
        onClick={onAction}
        className="mt-5 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700"
      >
        {actionLabel}
      </button>
    )}
  </div>
)

export default EmptyState