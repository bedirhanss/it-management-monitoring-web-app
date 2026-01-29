import { ComputerDesktopIcon, ServerIcon } from '@heroicons/react/24/outline'

export default function Monitoring() {
  const servers = [
    { name: 'Web Server 01', status: 'online', cpu: 45, memory: 67, disk: 23 },
    { name: 'Database Server', status: 'online', cpu: 78, memory: 89, disk: 45 },
    { name: 'Mail Server', status: 'offline', cpu: 0, memory: 0, disk: 67 },
    { name: 'File Server', status: 'online', cpu: 23, memory: 34, disk: 89 },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold">Sistem İzleme</h1>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {servers.map((server, index) => (
            <div key={index} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <ServerIcon className="h-6 w-6 text-gray-400 mr-2" />
                    <h3 className="text-lg font-medium text-gray-900">{server.name}</h3>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    server.status === 'online' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {server.status === 'online' ? 'Çevrimiçi' : 'Çevrimdışı'}
                  </span>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>CPU</span>
                      <span>{server.cpu}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${server.cpu > 80 ? 'bg-red-600' : server.cpu > 60 ? 'bg-yellow-600' : 'bg-green-600'}`}
                        style={{ width: `${server.cpu}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>Bellek</span>
                      <span>{server.memory}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${server.memory > 80 ? 'bg-red-600' : server.memory > 60 ? 'bg-yellow-600' : 'bg-green-600'}`}
                        style={{ width: `${server.memory}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>Disk</span>
                      <span>{server.disk}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${server.disk > 80 ? 'bg-red-600' : server.disk > 60 ? 'bg-yellow-600' : 'bg-green-600'}`}
                        style={{ width: `${server.disk}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}