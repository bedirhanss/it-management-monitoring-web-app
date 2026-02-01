'use client'

import Modal, { ModalBody, ModalFooter } from './Modal'

interface ViewModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  data: { [key: string]: any }
  fields: { key: string; label: string }[]
  onEdit?: () => void
  onDelete?: () => void
}

export default function ViewModal({ isOpen, onClose, title, data, fields, onEdit, onDelete }: ViewModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <ModalBody>
        <div className="space-y-4">
          {fields.map((field) => (
            <div key={field.key} className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4">
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {field.label}:
              </div>
              <div className="sm:col-span-2 text-sm text-gray-900 dark:text-white">
                {data[field.key] || 'Belirtilmemiş'}
              </div>
            </div>
          ))}
        </div>
      </ModalBody>
      
      {(onEdit || onDelete) && (
        <ModalFooter>
          <div className="flex gap-2 justify-end">
            {onEdit && (
              <button
                onClick={() => {
                  onEdit()
                  onClose()
                }}
                className="inline-flex justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
              >
                Düzenle
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => {
                  onDelete()
                  onClose()
                }}
                className="inline-flex justify-center rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors"
              >
                Sil
              </button>
            )}
          </div>
        </ModalFooter>
      )}
    </Modal>
  )
}