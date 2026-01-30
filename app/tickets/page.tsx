import { PlusIcon } from '@heroicons/react/24/outline'

export default function Tickets() {
  const tickets = [
    { id: 1, title: 'Printer sorunu', status: 'Açık', priority: 'Yüksek', created: '2024-01-15' },
    { id: 2, title: 'Email erişim problemi', status: 'İşlemde', priority: 'Orta', created: '2024-01-14' },
    { id: 3, title: 'Yazılım güncelleme', status: 'Kapalı', priority: 'Düşük', created: '2024-01-13' },
  ]

  return (
    <>
      {/* Action bar */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Destek Talepleri</h2>
          <p className="text-gray-600 dark:text-gray-400">Tüm destek taleplerini yönetin</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center">
          <PlusIcon className="h-4 w-4 mr-2" />
          Yeni Ticket
        </button>
      </div>

      {/* Tickets list */}
      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {tickets.map((ticket) => (
            <li key={ticket.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 truncate">
                      #{ticket.id} - {ticket.title}
                    </p>
                    <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      ticket.status === 'Açık' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' :
                      ticket.status === 'İşlemde' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                      'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                    }`}>
                      {ticket.status}
                    </span>
                  </div>
                  <div className="ml-2 flex-shrink-0 flex">
                    <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                      {ticket.priority}
                    </p>
                  </div>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Oluşturulma: {ticket.created}
                    </p>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}