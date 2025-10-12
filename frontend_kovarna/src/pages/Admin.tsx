import { useState, useEffect } from 'react'
import { adminService, type ReservationSlotDto } from '../services/adminService'
import { useLanguage } from '../contexts/LanguageContext'
import './Admin.css'

type AdminSection = 'slots' | 'reservations' | 'users' | 'menu' | 'hours'

function Admin() {
  const [activeSection, setActiveSection] = useState<AdminSection>('slots')
  const [slots, setSlots] = useState<ReservationSlotDto[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [editingSlot, setEditingSlot] = useState<ReservationSlotDto | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const [formData, setFormData] = useState({
    slotFrom: '',
    slotTo: '',
    active: true
  })
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const { t } = useLanguage()

  // Helper function to convert time format
  const formatTimeForBackend = (time: string): string => {
    // If already has seconds, return as is
    if (time.length === 8) return time
    // Add :00 for seconds if missing
    return time.length === 5 ? `${time}:00` : time
  }

  const formatTimeForDisplay = (time: string): string => {
    // Remove seconds for display in time input (HH:mm:ss -> HH:mm)
    return time.substring(0, 5)
  }

  // Fetch slots from backend
  const fetchSlots = async () => {
    try {
      setIsLoading(true)
      setError('')
      const data = await adminService.getAllSlots()
      setSlots(data)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch slots')
      console.error('Error fetching slots:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchSlots()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    // Validate times
    if (!formData.slotFrom || !formData.slotTo) {
      setError('Please fill in all fields')
      return
    }

    try {
      // Convert time format for backend
      const dataForBackend = {
        slotFrom: formatTimeForBackend(formData.slotFrom),
        slotTo: formatTimeForBackend(formData.slotTo),
        active: formData.active
      }

      if (editingSlot && editingSlot.id) {
        // Update existing slot
        const updated = await adminService.updateSlot(editingSlot.id, dataForBackend)
        setSlots(slots.map(slot => slot.id === editingSlot.id ? updated : slot))
        setSuccess('Slot updated successfully!')
      } else {
        // Create new slot
        const created = await adminService.createSlot(dataForBackend)
        setSlots([...slots, created])
        setSuccess('Slot created successfully!')
      }

      // Reset form
      setFormData({ slotFrom: '', slotTo: '', active: true })
      setEditingSlot(null)
      setIsDialogOpen(false)
    } catch (err: any) {
      setError(err.message || 'Failed to save slot')
      console.error('Error saving slot:', err)
    }
  }

  const handleEdit = (slot: ReservationSlotDto) => {
    setEditingSlot(slot)
    setFormData({
      slotFrom: formatTimeForDisplay(slot.slotFrom),
      slotTo: formatTimeForDisplay(slot.slotTo),
      active: slot.active
    })
    setError('')
    setSuccess('')
    setIsDialogOpen(true)
  }

  const handleCreate = () => {
    setEditingSlot(null)
    setFormData({ slotFrom: '', slotTo: '', active: true })
    setError('')
    setSuccess('')
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this slot?')) {
      return
    }

    setError('')
    setSuccess('')

    try {
      await adminService.deleteSlot(id)
      setSlots(slots.filter(slot => slot.id !== id))
      setSuccess('Slot deleted successfully!')
    } catch (err: any) {
      setError(err.message || 'Failed to delete slot')
      console.error('Error deleting slot:', err)
    }
  }

  const handleCancel = () => {
    setEditingSlot(null)
    setFormData({ slotFrom: '', slotTo: '', active: true })
    setError('')
    setSuccess('')
    setIsDialogOpen(false)
  }

  const handleToggleActive = async (slot: ReservationSlotDto) => {
    if (!slot.id) return

    setError('')
    setSuccess('')

    try {
      const updatedData = {
        slotFrom: formatTimeForBackend(slot.slotFrom),
        slotTo: formatTimeForBackend(slot.slotTo),
        active: !slot.active
      }
      const updated = await adminService.updateSlot(slot.id, updatedData)
      setSlots(slots.map(s => s.id === slot.id ? updated : s))
      setSuccess(`Slot ${updated.active ? 'activated' : 'deactivated'} successfully!`)
    } catch (err: any) {
      setError(err.message || 'Failed to toggle slot status')
      console.error('Error toggling slot:', err)
    }
  }

  if (isLoading) {
    return (
      <div className="admin-container">
        <div className="loading">Loading...</div>
      </div>
    )
  }

  const renderSlotsSection = () => (
    <>
      <div className="section-header">
        <h2 className="section-title">Reservation Time Slots</h2>
        <button className="btn btn-primary" onClick={handleCreate}>
          + Create New Slot
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <div className="admin-content">
        <div className="admin-table-section" style={{ width: '100%' }}>
          {slots.length === 0 ? (
            <p className="no-data">No slots found. Create one to get started.</p>
          ) : (
            <table className="slots-table">
              <thead>
                <tr>
                  <th>From</th>
                  <th>To</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {[...slots].sort((a, b) => a.slotFrom.localeCompare(b.slotFrom)).map((slot) => (
                  <tr key={slot.id}>
                    <td>{formatTimeForDisplay(slot.slotFrom)}</td>
                    <td>{formatTimeForDisplay(slot.slotTo)}</td>
                    <td>
                      <span className={`status-badge ${slot.active ? 'active' : 'inactive'}`}>
                        {slot.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="actions-cell">
                      <button
                        className="btn btn-small btn-edit"
                        onClick={() => handleEdit(slot)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-small btn-toggle"
                        onClick={() => handleToggleActive(slot)}
                      >
                        {slot.active ? 'Deactivate' : 'Activate'}
                      </button>
                      <button
                        className="btn btn-small btn-delete"
                        onClick={() => handleDelete(slot.id!)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Dialog Modal */}
      {isDialogOpen && (
        <div className="modal-overlay" onClick={handleCancel}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingSlot ? 'Edit Slot' : 'Create New Slot'}</h2>
              <button className="modal-close" onClick={handleCancel}>×</button>
            </div>
            <form onSubmit={handleSubmit} className="slot-form">
              <div className="form-group">
                <label htmlFor="slotFrom">From (HH:MM)</label>
                <input
                  type="time"
                  id="slotFrom"
                  value={formData.slotFrom}
                  onChange={(e) => setFormData({ ...formData, slotFrom: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="slotTo">To (HH:MM)</label>
                <input
                  type="time"
                  id="slotTo"
                  value={formData.slotTo}
                  onChange={(e) => setFormData({ ...formData, slotTo: e.target.value })}
                  required
                />
              </div>

              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  />
                  Active
                </label>
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingSlot ? 'Update Slot' : 'Create Slot'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )

  const renderReservationsSection = () => (
    <div className="coming-soon">
      <h2>Customer Reservations</h2>
      <p>View and manage all customer reservations</p>
      <p className="coming-soon-text">Coming soon...</p>
    </div>
  )

  const renderUsersSection = () => (
    <div className="coming-soon">
      <h2>User Management</h2>
      <p>Manage user accounts and permissions</p>
      <p className="coming-soon-text">Coming soon...</p>
    </div>
  )

  const renderMenuSection = () => (
    <div className="coming-soon">
      <h2>Menu Management</h2>
      <p>Manage restaurant menu items, categories, and pricing</p>
      <p className="coming-soon-text">Coming soon...</p>
    </div>
  )

  const renderHoursSection = () => (
    <div className="coming-soon">
      <h2>Opening Hours</h2>
      <p>Configure restaurant opening hours and special closures</p>
      <p className="coming-soon-text">Coming soon...</p>
    </div>
  )

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Administration Panel</h1>
        <button
          className="mobile-menu-toggle"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          ☰
        </button>
      </div>

      <div className="admin-layout">
        {/* Sidebar Navigation */}
        <aside className={`admin-sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
          <nav className="admin-nav">
            <button
              className={`nav-item ${activeSection === 'slots' ? 'active' : ''}`}
              onClick={() => {
                setActiveSection('slots')
                setIsMobileMenuOpen(false)
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2"/>
                <line x1="9" y1="4" x2="9" y2="10" stroke="currentColor" strokeWidth="2"/>
              </svg>
              Time Slots
            </button>

            <button
              className={`nav-item ${activeSection === 'reservations' ? 'active' : ''}`}
              onClick={() => {
                setActiveSection('reservations')
                setIsMobileMenuOpen(false)
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M19 4H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Z" stroke="currentColor" strokeWidth="2"/>
                <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="2"/>
              </svg>
              Reservations
            </button>

            <button
              className={`nav-item ${activeSection === 'users' ? 'active' : ''}`}
              onClick={() => {
                setActiveSection('users')
                setIsMobileMenuOpen(false)
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2"/>
                <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="2"/>
              </svg>
              Users
            </button>

            <button
              className={`nav-item ${activeSection === 'menu' ? 'active' : ''}`}
              onClick={() => {
                setActiveSection('menu')
                setIsMobileMenuOpen(false)
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2M7 2v20M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Menu
            </button>

            <button
              className={`nav-item ${activeSection === 'hours' ? 'active' : ''}`}
              onClick={() => {
                setActiveSection('hours')
                setIsMobileMenuOpen(false)
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Opening Hours
            </button>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="admin-main">
          {activeSection === 'slots' && renderSlotsSection()}
          {activeSection === 'reservations' && renderReservationsSection()}
          {activeSection === 'users' && renderUsersSection()}
          {activeSection === 'menu' && renderMenuSection()}
          {activeSection === 'hours' && renderHoursSection()}
        </main>
      </div>
    </div>
  )
}

export default Admin
