const SkeletonCard = ({ count = 1, variant = 'card' }) => {
  if (variant === 'table') {
    return (
      <tbody className="bg-white divide-y divide-gray-100">
        {Array.from({ length: count }).map((_, index) => (
          <tr key={index} className="animate-pulse">
            <td className="px-6 py-4"><div className="h-4 w-32 bg-gray-200 rounded" /></td>
            <td className="px-6 py-4"><div className="h-4 w-20 bg-gray-100 rounded" /></td>
            <td className="px-6 py-4"><div className="h-4 w-24 bg-gray-100 rounded" /></td>
            <td className="px-6 py-4 text-right"><div className="h-4 w-16 bg-gray-100 rounded ml-auto" /></td>
          </tr>
        ))}
      </tbody>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm animate-pulse">
          <div className="flex justify-between mb-4">
            <div className="h-4 w-28 bg-gray-200 rounded" />
            <div className="h-6 w-20 bg-gray-200 rounded-full" />
          </div>
          <div className="h-3 w-40 bg-gray-100 rounded mb-3" />
          <div className="h-3 w-24 bg-gray-100 rounded" />
        </div>
      ))}
    </div>
  )
}

export default SkeletonCard