'use client'

import { useState, useEffect } from 'react'

interface UsePaginationProps {
  totalItems: number
  mobileItemsPerPage?: number
  desktopItemsPerPage?: number
}

export function usePagination({ 
  totalItems, 
  mobileItemsPerPage = 8, 
  desktopItemsPerPage = 10 
}: UsePaginationProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(desktopItemsPerPage)

  useEffect(() => {
    const updateItemsPerPage = () => {
      setItemsPerPage(window.innerWidth < 768 ? mobileItemsPerPage : desktopItemsPerPage)
    }
    
    updateItemsPerPage()
    window.addEventListener('resize', updateItemsPerPage)
    
    return () => window.removeEventListener('resize', updateItemsPerPage)
  }, [mobileItemsPerPage, desktopItemsPerPage])

  // Sayfa değiştiğinde currentPage'i sıfırla
  useEffect(() => {
    setCurrentPage(1)
  }, [itemsPerPage])

  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  return {
    currentPage,
    totalPages,
    itemsPerPage,
    startIndex,
    endIndex,
    handlePageChange
  }
}