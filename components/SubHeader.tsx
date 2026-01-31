'use client'

import { MagnifyingGlassIcon, FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'

interface FilterOption {
  value: string
  label: string
  count?: number
}

interface SubHeaderProps {
  title: string
  description?: string
  searchPlaceholder?: string
  searchValue: string
  onSearchChange: (value: string) => void
  filterOptions?: FilterOption[]
  selectedFilter: string
  onFilterChange: (value: string) => void
  actionButton?: {
    label: string
    icon?: React.ComponentType<{ className?: string }>
    onClick: () => void
  }
}

export default function SubHeader({
  title,
  description,
  searchPlaceholder = "Ara...",
  searchValue,
  onSearchChange,
  filterOptions = [],
  selectedFilter,
  onFilterChange,
  actionButton
}: SubHeaderProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const clearSearch = () => {
    onSearchChange('')
  }

  const clearFilter = () => {
    onFilterChange('all')
    setIsFilterOpen(false)
  }

  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 mb-6">
      {/* Title Section */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>
            {description && (
              <p className="mt-1 text-gray-600 dark:text-gray-400">{description}</p>
            )}
          </div>
          {actionButton && (
            <div className="mt-4 sm:mt-0">
              <button
                onClick={actionButton.onClick}
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition-colors"
              >
                {actionButton.icon && <actionButton.icon className="h-4 w-4 mr-2" />}
                {actionButton.label}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="px-6 py-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              className="block w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder={searchPlaceholder}
            />
            {searchValue && (
              <button
                onClick={clearSearch}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <XMarkIcon className="h-4 w-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300" />
              </button>
            )}
          </div>

          {/* Filter Dropdown */}
          {filterOptions.length > 0 && (
            <div className="relative">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`inline-flex items-center px-4 py-2 border rounded-md text-sm font-medium transition-colors ${
                  selectedFilter !== 'all'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                    : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                }`}
              >
                <FunnelIcon className="h-4 w-4 mr-2" />
                Filtrele
                {selectedFilter !== 'all' && (
                  <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                    1
                  </span>
                )}
              </button>

              {/* Filter Dropdown Menu */}
              {isFilterOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                  <div className="py-1">
                    <div className="px-4 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">
                      Filtrele
                    </div>
                    <button
                      onClick={() => {
                        onFilterChange('all')
                        setIsFilterOpen(false)
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${
                        selectedFilter === 'all'
                          ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                          : 'text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      Tümü
                    </button>
                    {filterOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          onFilterChange(option.value)
                          setIsFilterOpen(false)
                        }}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-between ${
                          selectedFilter === option.value
                            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                            : 'text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        <span>{option.label}</span>
                        {option.count !== undefined && (
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {option.count}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                  {selectedFilter !== 'all' && (
                    <div className="border-t border-gray-200 dark:border-gray-700 py-1">
                      <button
                        onClick={clearFilter}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        Filtreyi Temizle
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Active Filters Display */}
        {(searchValue || selectedFilter !== 'all') && (
          <div className="mt-4 flex flex-wrap gap-2">
            {searchValue && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                Arama: "{searchValue}"
                <button
                  onClick={clearSearch}
                  className="ml-2 inline-flex items-center"
                >
                  <XMarkIcon className="h-3 w-3 hover:text-gray-900 dark:hover:text-gray-100" />
                </button>
              </span>
            )}
            {selectedFilter !== 'all' && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400">
                Filtre: {filterOptions.find(f => f.value === selectedFilter)?.label}
                <button
                  onClick={clearFilter}
                  className="ml-2 inline-flex items-center"
                >
                  <XMarkIcon className="h-3 w-3 hover:text-blue-900 dark:hover:text-blue-100" />
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Click outside to close filter */}
      {isFilterOpen && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setIsFilterOpen(false)}
        />
      )}
    </div>
  )
}