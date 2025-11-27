'use client'

import { useState, useEffect } from 'react'

interface WishlistItem {
  id: string
  idea: string
  createdAt: string
}

interface WishlistManagerProps {
  participantId?: string
  readOnly?: boolean
  title?: string
}

export default function WishlistManager({ 
  participantId, 
  readOnly = false,
  title = 'My Wishlist'
}: WishlistManagerProps) {
  const [items, setItems] = useState<WishlistItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [newIdea, setNewIdea] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingText, setEditingText] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!readOnly) {
      fetchWishlist()
    }
  }, [readOnly])

  const fetchWishlist = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/participant/wishlist')
      if (!response.ok) throw new Error('Failed to fetch wishlist')
      const data = await response.json()
      setItems(data.ideas || [])
    } catch (err) {
      setError('Failed to load wishlist')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAdd = async () => {
    if (!newIdea.trim()) return

    setIsSubmitting(true)
    setError('')
    try {
      const response = await fetch('/api/participant/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea: newIdea }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to add idea')
      }

      const data = await response.json()
      setItems([...items, data.idea])
      setNewIdea('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add idea')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (item: WishlistItem) => {
    setEditingId(item.id)
    setEditingText(item.idea)
  }

  const handleSaveEdit = async (id: string) => {
    if (!editingText.trim()) return

    setIsSubmitting(true)
    setError('')
    try {
      const response = await fetch(`/api/participant/wishlist/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea: editingText }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to update idea')
      }

      const data = await response.json()
      setItems(items.map(item => item.id === id ? data.idea : item))
      setEditingId(null)
      setEditingText('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update idea')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this idea?')) return

    setIsSubmitting(true)
    setError('')
    try {
      const response = await fetch(`/api/participant/wishlist/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to delete idea')
      }

      setItems(items.filter(item => item.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete idea')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditingText('')
  }

  if (readOnly && items.length === 0) {
    return null
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-800 border border-red-200 rounded-lg text-sm">
          {error}
        </div>
      )}

      {!readOnly && (
        <div className="mb-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={newIdea}
              onChange={(e) => setNewIdea(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
              placeholder="Add a present idea..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              maxLength={500}
              disabled={isSubmitting}
            />
            <button
              onClick={handleAdd}
              disabled={!newIdea.trim() || isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add
            </button>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            {newIdea.length}/500 characters
          </p>
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-4 text-gray-500">Loading wishlist...</div>
      ) : items.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          {readOnly ? 'No wishlist items yet.' : 'Your wishlist is empty. Add some ideas!'}
        </div>
      ) : (
        <ul className="space-y-2">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200"
            >
              {editingId === item.id ? (
                <div className="flex-1 flex gap-2">
                  <input
                    type="text"
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    maxLength={500}
                    autoFocus
                  />
                  <button
                    onClick={() => handleSaveEdit(item.id)}
                    disabled={!editingText.trim() || isSubmitting}
                    className="px-3 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 disabled:opacity-50"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    disabled={isSubmitting}
                    className="px-3 py-2 bg-gray-600 text-white rounded-lg text-sm hover:bg-gray-700 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  <span className="flex-1 text-gray-900">{item.idea}</span>
                  {!readOnly && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(item)}
                        disabled={isSubmitting}
                        className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        disabled={isSubmitting}
                        className="px-3 py-1 text-sm text-red-600 hover:text-red-800 disabled:opacity-50"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

