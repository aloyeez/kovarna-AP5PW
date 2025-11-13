import { useState, useEffect } from "react";
import {
  adminService,
  type ReservationSlotDto,
} from "../services/adminService";
import { adminReservationService } from "../services/adminReservationService";
import { adminUserService } from "../services/adminUserService";
import {
  openingHoursService,
  type OpeningHoursDto,
  type DayOfWeek,
} from "../services/openingHoursService";
import type { ReservationResponse } from "../services/reservationService";
import type { UserResponse } from "../services/authService";
import { useLanguage } from "../contexts/LanguageContext";
import "./Admin.css";

type AdminSection = "slots" | "reservations" | "users" | "menu" | "hours";

function Admin() {
  const [activeSection, setActiveSection] = useState<AdminSection>("slots");
  const [slots, setSlots] = useState<ReservationSlotDto[]>([]);
  const [reservations, setReservations] = useState<ReservationResponse[]>([]);
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [openingHours, setOpeningHours] = useState<OpeningHoursDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editingSlot, setEditingSlot] = useState<ReservationSlotDto | null>(
    null
  );
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [formData, setFormData] = useState({
    slotFrom: "",
    slotTo: "",
    active: true,
    maxReservations: 10,
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Opening hours states
  const [editingHour, setEditingHour] = useState<OpeningHoursDto | null>(null);
  const [isHourDialogOpen, setIsHourDialogOpen] = useState(false);
  const [hourFormData, setHourFormData] = useState<{
    dayOfWeek: DayOfWeek;
    openTime: string;
    closeTime: string;
    isOpen: boolean;
    note: string;
  }>({
    dayOfWeek: "MONDAY",
    openTime: "",
    closeTime: "",
    isOpen: true,
    note: "",
  });

  // User editing states
  const [editingUser, setEditingUser] = useState<UserResponse | null>(null);
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [userFormData, setUserFormData] = useState({
    username: "",
    email: "",
    enabled: true,
    roles: [] as string[],
  });

  const { t } = useLanguage();

  // Helper function to convert time format
  const formatTimeForBackend = (time: string): string => {
    // If already has seconds, return as is
    if (time.length === 8) return time;
    // Add :00 for seconds if missing
    return time.length === 5 ? `${time}:00` : time;
  };

  const formatTimeForDisplay = (time: string): string => {
    // Remove seconds for display in time input (HH:mm:ss -> HH:mm)
    return time.substring(0, 5);
  };

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.classList.add('mobile-menu-open');
    } else {
      document.body.classList.remove('mobile-menu-open');
    }

    // Cleanup on unmount
    return () => {
      document.body.classList.remove('mobile-menu-open');
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    // Fetch data based on active section
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError("");
        setSuccess("");

        if (activeSection === "slots") {
          const data = await adminService.getAllSlots();
          setSlots(data);
        } else if (activeSection === "reservations") {
          const data = await adminReservationService.getAllReservations();
          setReservations(data);
        } else if (activeSection === "users") {
          const data = await adminUserService.getAllUsers();
          setUsers(data);
        } else if (activeSection === "hours") {
          const data = await openingHoursService.getAllOpeningHours();
          setOpeningHours(data);
        }
      } catch (err: any) {
        setError(err.message || `Failed to fetch ${activeSection}`);
        console.error(`Error fetching ${activeSection}:`, err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [activeSection]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validate times
    if (!formData.slotFrom || !formData.slotTo) {
      setError("Please fill in all fields");
      return;
    }

    try {
      // Convert time format for backend
      const dataForBackend = {
        slotFrom: formatTimeForBackend(formData.slotFrom),
        slotTo: formatTimeForBackend(formData.slotTo),
        active: formData.active,
        maxReservations: formData.maxReservations,
      };

      if (editingSlot && editingSlot.id) {
        // Update existing slot
        const updated = await adminService.updateSlot(
          editingSlot.id,
          dataForBackend
        );
        setSlots(
          slots.map((slot) => (slot.id === editingSlot.id ? updated : slot))
        );
        setSuccess(t('admin.slots.updated'));
      } else {
        // Create new slot
        const created = await adminService.createSlot(dataForBackend);
        setSlots([...slots, created]);
        setSuccess(t('admin.slots.created'));
      }

      // Reset form
      setFormData({
        slotFrom: "",
        slotTo: "",
        active: true,
        maxReservations: 10,
      });
      setEditingSlot(null);
      setIsDialogOpen(false);
    } catch (err: any) {
      setError(err.message || "Failed to save slot");
      console.error("Error saving slot:", err);
    }
  };

  const handleEdit = (slot: ReservationSlotDto) => {
    setEditingSlot(slot);
    setFormData({
      slotFrom: formatTimeForDisplay(slot.slotFrom),
      slotTo: formatTimeForDisplay(slot.slotTo),
      active: slot.active,
      maxReservations: slot.maxReservations || 10,
    });
    setError("");
    setSuccess("");
    setIsDialogOpen(true);
  };

  const handleCreate = () => {
    setEditingSlot(null);
    setFormData({
      slotFrom: "",
      slotTo: "",
      active: true,
      maxReservations: 10,
    });
    setError("");
    setSuccess("");
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm(t('admin.slots.deleteConfirm'))) {
      return;
    }

    setError("");
    setSuccess("");

    try {
      await adminService.deleteSlot(id);
      setSlots(slots.filter((slot) => slot.id !== id));
      setSuccess(t('admin.slots.deleted'));
    } catch (err: any) {
      setError(err.message || "Failed to delete slot");
      console.error("Error deleting slot:", err);
    }
  };

  const handleCancel = () => {
    setEditingSlot(null);
    setFormData({
      slotFrom: "",
      slotTo: "",
      active: true,
      maxReservations: 10,
    });
    setError("");
    setSuccess("");
    setIsDialogOpen(false);
  };

  const handleToggleActive = async (slot: ReservationSlotDto) => {
    if (!slot.id) return;

    setError("");
    setSuccess("");

    try {
      const updatedData = {
        slotFrom: formatTimeForBackend(slot.slotFrom),
        slotTo: formatTimeForBackend(slot.slotTo),
        active: !slot.active,
        maxReservations: slot.maxReservations || 10,
      };
      const updated = await adminService.updateSlot(slot.id, updatedData);
      setSlots(slots.map((s) => (s.id === slot.id ? updated : s)));
      setSuccess(
        updated.active ? t('admin.slots.activated') : t('admin.slots.deactivated')
      );
    } catch (err: any) {
      setError(err.message || "Failed to toggle slot status");
      console.error("Error toggling slot:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="admin-container">
        <div className="loading">{t('admin.common.loading')}</div>
      </div>
    );
  }

  const renderSlotsSection = () => (
    <>
      <div className="section-header">
        <h2 className="section-title">{t('admin.slots.title')}</h2>
        <button className="btn btn-primary" onClick={handleCreate}>
          + {t('admin.slots.createNew')}
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <div className="admin-content">
        <div className="admin-table-section" style={{ width: "100%" }}>
          {slots.length === 0 ? (
            <p className="no-data">
              {t('admin.slots.noData')}
            </p>
          ) : (
            <table className="slots-table">
              <thead>
                <tr>
                  <th>{t('admin.slots.from')}</th>
                  <th>{t('admin.slots.to')}</th>
                  <th>{t('admin.slots.maxCapacity')}</th>
                  <th>{t('admin.slots.current')}</th>
                  <th>{t('admin.slots.status')}</th>
                  <th>{t('admin.slots.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {[...slots]
                  .sort((a, b) => a.slotFrom.localeCompare(b.slotFrom))
                  .map((slot) => (
                    <tr key={slot.id}>
                      <td data-label={t('admin.slots.from')}>{formatTimeForDisplay(slot.slotFrom)}</td>
                      <td data-label={t('admin.slots.to')}>{formatTimeForDisplay(slot.slotTo)}</td>
                      <td data-label={t('admin.slots.maxCapacity')}>{slot.maxReservations || 10}</td>
                      <td data-label={t('admin.slots.current')}>{slot.currentReservations || 0}</td>
                      <td data-label={t('admin.slots.status')}>
                        <span
                          className={`status-badge ${
                            slot.active ? "active" : "inactive"
                          }`}
                        >
                          {slot.active ? t('admin.slots.active') : t('admin.slots.inactive')}
                        </span>
                      </td>
                      <td className="actions-cell">
                        <button
                          className="btn btn-small btn-edit"
                          onClick={() => handleEdit(slot)}
                        >
                          {t('admin.slots.edit')}
                        </button>
                        <button
                          className="btn btn-small btn-toggle"
                          onClick={() => handleToggleActive(slot)}
                        >
                          {slot.active ? t('admin.slots.deactivate') : t('admin.slots.activate')}
                        </button>
                        <button
                          className="btn btn-small btn-delete"
                          onClick={() => handleDelete(slot.id!)}
                        >
                          {t('admin.slots.delete')}
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
              <h2>{editingSlot ? t('admin.slots.editSlot') : t('admin.slots.createSlot')}</h2>
              <button className="modal-close" onClick={handleCancel}>
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit} className="slot-form">
              <div className="form-group">
                <label htmlFor="slotFrom">{t('admin.slots.slotFrom')}</label>
                <input
                  type="time"
                  id="slotFrom"
                  value={formData.slotFrom}
                  onChange={(e) =>
                    setFormData({ ...formData, slotFrom: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="slotTo">{t('admin.slots.slotTo')}</label>
                <input
                  type="time"
                  id="slotTo"
                  value={formData.slotTo}
                  onChange={(e) =>
                    setFormData({ ...formData, slotTo: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="maxReservations">{t('admin.slots.maxReservations')}</label>
                <input
                  type="number"
                  id="maxReservations"
                  min="1"
                  max="100"
                  value={formData.maxReservations}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      maxReservations: parseInt(e.target.value) || 10,
                    })
                  }
                  required
                />
              </div>

              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={(e) =>
                      setFormData({ ...formData, active: e.target.checked })
                    }
                  />
                  {t('admin.slots.activeCheckbox')}
                </label>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCancel}
                >
                  {t('admin.slots.cancel')}
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingSlot ? t('admin.slots.update') : t('admin.slots.create')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );

  const renderReservationsSection = () => {
    const handleDeleteReservation = async (id: number) => {
      if (!window.confirm(t('admin.reservations.deleteConfirm')))
        return;

      try {
        await adminReservationService.deleteReservation(id);
        setReservations(reservations.filter((r) => r.id !== id));
        setSuccess(t('admin.reservations.deleted'));
      } catch (err: any) {
        setError(err.message || "Failed to delete reservation");
      }
    };

    return (
      <>
        <div className="section-header">
          <h2 className="section-title">{t('admin.reservations.title')}</h2>
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <div className="admin-content">
          {reservations.length === 0 ? (
            <p className="no-data">{t('admin.reservations.noData')}</p>
          ) : (
            <table className="slots-table">
              <thead>
                <tr>
                  <th>{t('admin.reservations.id')}</th>
                  <th>{t('admin.reservations.username')}</th>
                  <th>{t('admin.reservations.date')}</th>
                  <th>{t('admin.reservations.time')}</th>
                  <th>{t('admin.reservations.guests')}</th>
                  <th>{t('admin.reservations.status')}</th>
                  <th>{t('admin.reservations.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map((reservation) => (
                  <tr key={reservation.id}>
                    <td data-label={t('admin.reservations.id')}>{reservation.id}</td>
                    <td data-label={t('admin.reservations.username')}>{reservation.username}</td>
                    <td data-label={t('admin.reservations.date')}>{reservation.date}</td>
                    <td data-label={t('admin.reservations.time')}>
                      {reservation.slotFrom.substring(0, 5)} -{" "}
                      {reservation.slotTo.substring(0, 5)}
                    </td>
                    <td data-label={t('admin.reservations.guests')}>{reservation.guestCount}</td>
                    <td data-label={t('admin.reservations.status')}>
                      <span
                        className={`status-badge ${
                          reservation.status === "ACTIVE"
                            ? "active"
                            : "inactive"
                        }`}
                      >
                        {reservation.status}
                      </span>
                    </td>
                    <td className="actions-cell">
                      <button
                        className="btn btn-small btn-delete"
                        onClick={() => handleDeleteReservation(reservation.id)}
                      >
                        {t('admin.reservations.delete')}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </>
    );
  };

  // User editing handlers
  const handleUserEdit = (user: UserResponse) => {
    setEditingUser(user);
    setUserFormData({
      username: user.username,
      email: user.email,
      enabled: user.enabled,
      roles: [...user.roles],
    });
    setError("");
    setSuccess("");
    setIsUserDialogOpen(true);
  };

  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!editingUser || !editingUser.id) {
      setError("No user selected for editing");
      return;
    }

    // Validate form
    if (!userFormData.username || !userFormData.email) {
      setError("Please fill in all required fields");
      return;
    }

    if (userFormData.roles.length === 0) {
      setError("User must have at least one role");
      return;
    }

    try {
      const updated = await adminUserService.updateUser(editingUser.id, {
        username: userFormData.username,
        email: userFormData.email,
        enabled: userFormData.enabled,
        roles: userFormData.roles,
      });

      // Update users list
      setUsers(users.map((u) => (u.id === editingUser.id ? updated : u)));
      setSuccess(t('admin.users.updated'));

      // Reset and close
      setUserFormData({
        username: "",
        email: "",
        enabled: true,
        roles: [],
      });
      setEditingUser(null);
      setIsUserDialogOpen(false);
    } catch (err: any) {
      setError(err.message || "Failed to update user");
      console.error("Error updating user:", err);
    }
  };

  const handleRoleToggle = (role: string) => {
    setUserFormData((prev) => ({
      ...prev,
      roles: prev.roles.includes(role)
        ? prev.roles.filter((r) => r !== role)
        : [...prev.roles, role],
    }));
  };

  const renderUsersSection = () => {
    return (
      <>
        <div className="section-header">
          <h2 className="section-title">{t('admin.users.title')}</h2>
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <div className="admin-content">
          {users.length === 0 ? (
            <p className="no-data">{t('admin.users.noData')}</p>
          ) : (
            <table className="slots-table">
              <thead>
                <tr>
                  <th>{t('admin.users.id')}</th>
                  <th>{t('admin.users.username')}</th>
                  <th>{t('admin.users.email')}</th>
                  <th>{t('admin.users.roles')}</th>
                  <th>{t('admin.users.enabled')}</th>
                  <th>{t('admin.users.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td data-label={t('admin.users.id')}>{user.id}</td>
                    <td data-label={t('admin.users.username')}>{user.username}</td>
                    <td data-label={t('admin.users.email')}>{user.email}</td>
                    <td data-label={t('admin.users.roles')}>{user.roles.join(", ")}</td>
                    <td data-label={t('admin.users.enabled')}>
                      <span
                        className={`status-badge ${
                          user.enabled ? "active" : "inactive"
                        }`}
                      >
                        {user.enabled ? t('admin.users.yes') : t('admin.users.no')}
                      </span>
                    </td>
                    <td className="actions-cell">
                      <button
                        className="btn btn-small btn-edit"
                        onClick={() => handleUserEdit(user)}
                      >
                        {t('admin.users.edit')}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* User Edit Modal */}
        {isUserDialogOpen && (
          <div className="modal-overlay" onClick={() => setIsUserDialogOpen(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{t('admin.users.editUser')}</h2>
                <button className="modal-close" onClick={() => setIsUserDialogOpen(false)}>
                  ×
                </button>
              </div>
              <form onSubmit={handleUserSubmit} className="slot-form">
                <div className="form-group">
                  <label htmlFor="username">{t('admin.users.usernameLabel')}</label>
                  <input
                    type="text"
                    id="username"
                    value={userFormData.username}
                    onChange={(e) =>
                      setUserFormData({ ...userFormData, username: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">{t('admin.users.emailLabel')}</label>
                  <input
                    type="email"
                    id="email"
                    value={userFormData.email}
                    onChange={(e) =>
                      setUserFormData({ ...userFormData, email: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={userFormData.enabled}
                      onChange={(e) =>
                        setUserFormData({ ...userFormData, enabled: e.target.checked })
                      }
                    />
                    <span>{t('admin.users.enabledCheckbox')}</span>
                  </label>
                </div>

                <div className="form-group">
                  <label>{t('admin.users.rolesLabel')}</label>
                  <div className="checkbox-group">
                    <label>
                      <input
                        type="checkbox"
                        checked={userFormData.roles.includes("ROLE_ADMIN")}
                        onChange={() => handleRoleToggle("ROLE_ADMIN")}
                      />
                      <span>{t('admin.users.roleAdmin')}</span>
                    </label>
                  </div>
                  <div className="checkbox-group">
                    <label>
                      <input
                        type="checkbox"
                        checked={userFormData.roles.includes("ROLE_CUSTOMER")}
                        onChange={() => handleRoleToggle("ROLE_CUSTOMER")}
                      />
                      <span>{t('admin.users.roleCustomer')}</span>
                    </label>
                  </div>
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setIsUserDialogOpen(false)}
                  >
                    {t('admin.users.cancel')}
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {t('admin.users.update')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </>
    );
  };

  const renderMenuSection = () => (
    <div className="menu-management-section">
      <h2>{t('admin.menu.title')}</h2>
      <p>{t('admin.menu.description')}</p>

      <div className="google-drive-card">
        <div className="drive-icon">
          <svg
            width="48"
            height="48"
            viewBox="0 0 87.3 78"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z"
              fill="#0066da"
            />
            <path
              d="m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44a9.06 9.06 0 0 0 -1.2 4.5h27.5z"
              fill="#00ac47"
            />
            <path
              d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.502l5.852 11.5z"
              fill="#ea4335"
            />
            <path
              d="m43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.2z"
              fill="#00832d"
            />
            <path
              d="m59.8 53h-32.3l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z"
              fill="#2684fc"
            />
            <path
              d="m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3l-13.75 23.8 16.15 28h27.45c0-1.55-.4-3.1-1.2-4.5z"
              fill="#ffba00"
            />
          </svg>
        </div>

        <div className="drive-content">
          <h3>{t('admin.menu.driveTitle')}</h3>
          <p>{t('admin.menu.driveDescription')}</p>

          <a
            href="https://docs.google.com/spreadsheets/d/1UykTaLDzCM9zFWNNnpQ0zAAyC78fp8yg1ysAvVpWKgo/"
            target="_blank"
            rel="noopener noreferrer"
            className="google-drive-link"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <polyline
                points="15 3 21 3 21 9"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <line
                x1="10"
                y1="14"
                x2="21"
                y2="3"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {t('admin.menu.openDrive')}
          </a>
        </div>
      </div>

      <div className="menu-instructions">
        <h4>{t('admin.menu.instructionsTitle')}</h4>
        <ol>
          <li>{t('admin.menu.step1')}</li>
          <li>{t('admin.menu.step2')}</li>
          <li>{t('admin.menu.step3')}</li>
          <li>{t('admin.menu.step4')}</li>
        </ol>
      </div>
    </div>
  );

  const renderHoursSection = () => {
    const dayOrder = [
      "MONDAY",
      "TUESDAY",
      "WEDNESDAY",
      "THURSDAY",
      "FRIDAY",
      "SATURDAY",
      "SUNDAY",
    ];

    const formatTimeForDisplay = (time: string): string => {
      return time.substring(0, 5);
    };

    const formatTimeForBackend = (time: string): string => {
      return time.length === 5 ? `${time}:00` : time;
    };

    const getDayLabel = (day: string): string => {
      return t(`admin.hours.days.${day}`) || day;
    };

    // Sort opening hours by day of week (Monday to Sunday)
    const sortedOpeningHours = [...openingHours].sort((a, b) => {
      return dayOrder.indexOf(a.dayOfWeek) - dayOrder.indexOf(b.dayOfWeek);
    });

    const handleHourEdit = (hour: OpeningHoursDto) => {
      setEditingHour(hour);
      setHourFormData({
        dayOfWeek: hour.dayOfWeek,
        openTime: formatTimeForDisplay(hour.openTime),
        closeTime: formatTimeForDisplay(hour.closeTime),
        isOpen: hour.isOpen,
        note: hour.note || "",
      });
      setIsHourDialogOpen(true);
      setError("");
      setSuccess("");
    };

    const handleHourSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setError("");
      setSuccess("");

      if (!hourFormData.openTime || !hourFormData.closeTime) {
        setError("Please fill in all required fields");
        return;
      }

      try {
        const dataForBackend = {
          dayOfWeek: hourFormData.dayOfWeek,
          openTime: formatTimeForBackend(hourFormData.openTime),
          closeTime: formatTimeForBackend(hourFormData.closeTime),
          isOpen: hourFormData.isOpen,
          note: hourFormData.note || undefined,
        };

        if (editingHour && editingHour.id) {
          const updated = await openingHoursService.updateOpeningHours(
            editingHour.id,
            dataForBackend
          );
          setOpeningHours(
            openingHours.map((h) => (h.id === editingHour.id ? updated : h))
          );
          setSuccess(t('admin.hours.updated'));
        }

        setIsHourDialogOpen(false);
        setEditingHour(null);
        setHourFormData({
          dayOfWeek: "MONDAY",
          openTime: "",
          closeTime: "",
          isOpen: true,
          note: "",
        });
      } catch (err: any) {
        setError(err.message || "Failed to save opening hours");
        console.error("Error saving opening hours:", err);
      }
    };

    const handleHourCancel = () => {
      setIsHourDialogOpen(false);
      setEditingHour(null);
      setHourFormData({
        dayOfWeek: "MONDAY",
        openTime: "",
        closeTime: "",
        isOpen: true,
        note: "",
      });
      setError("");
      setSuccess("");
    };

    return (
      <>
        <div className="section-header">
          <h2 className="section-title">{t('admin.hours.title')}</h2>
        </div>

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <div className="admin-content">
          {openingHours.length === 0 ? (
            <p className="no-data">{t('admin.hours.noData')}</p>
          ) : (
            <table className="slots-table">
              <thead>
                <tr>
                  <th>{t('admin.hours.day')}</th>
                  <th>{t('admin.hours.openTime')}</th>
                  <th>{t('admin.hours.closeTime')}</th>
                  <th>{t('admin.hours.status')}</th>
                  <th>{t('admin.hours.note')}</th>
                  <th>{t('admin.hours.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {sortedOpeningHours.map((hour) => (
                  <tr key={hour.id}>
                    <td data-label={t('admin.hours.day')}>
                      <strong>{getDayLabel(hour.dayOfWeek)}</strong>
                    </td>
                    <td data-label={t('admin.hours.openTime')}>{formatTimeForDisplay(hour.openTime)}</td>
                    <td data-label={t('admin.hours.closeTime')}>{formatTimeForDisplay(hour.closeTime)}</td>
                    <td data-label={t('admin.hours.status')}>
                      <span
                        className={`status-badge ${
                          hour.isOpen ? "active" : "inactive"
                        }`}
                      >
                        {hour.isOpen ? t('admin.hours.open') : t('admin.hours.closed')}
                      </span>
                    </td>
                    <td data-label={t('admin.hours.note')}>{hour.note || "-"}</td>
                    <td className="actions-cell">
                      <button
                        className="btn btn-small btn-edit"
                        onClick={() => handleHourEdit(hour)}
                      >
                        {t('admin.hours.edit')}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {isHourDialogOpen && (
          <div className="modal-overlay" onClick={handleHourCancel}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{t('admin.hours.editHours')}</h2>
                <button className="modal-close" onClick={handleHourCancel}>
                  ×
                </button>
              </div>
              <form onSubmit={handleHourSubmit} className="slot-form">
                <div className="form-group">
                  <label>{t('admin.hours.dayOfWeek')}</label>
                  <p
                    style={{
                      padding: "0.8rem 1rem",
                      background: "rgba(230, 210, 156, 0.1)",
                      border: "2px solid rgba(230, 210, 156, 0.3)",
                      borderRadius: "0.5rem",
                      color: "#e6d29c",
                      fontWeight: 600,
                      margin: 0,
                    }}
                  >
                    {getDayLabel(hourFormData.dayOfWeek)}
                  </p>
                </div>

                <div className="form-group">
                  <label htmlFor="openTime">{t('admin.hours.openTimeLabel')}</label>
                  <input
                    type="time"
                    id="openTime"
                    value={hourFormData.openTime}
                    onChange={(e) =>
                      setHourFormData({
                        ...hourFormData,
                        openTime: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="closeTime">{t('admin.hours.closeTimeLabel')}</label>
                  <input
                    type="time"
                    id="closeTime"
                    value={hourFormData.closeTime}
                    onChange={(e) =>
                      setHourFormData({
                        ...hourFormData,
                        closeTime: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="note">{t('admin.hours.noteLabel')}</label>
                  <input
                    type="text"
                    id="note"
                    value={hourFormData.note}
                    onChange={(e) =>
                      setHourFormData({ ...hourFormData, note: e.target.value })
                    }
                    placeholder={t('admin.hours.notePlaceholder')}
                    maxLength={500}
                  />
                </div>

                <div className="form-group checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={hourFormData.isOpen}
                      onChange={(e) =>
                        setHourFormData({
                          ...hourFormData,
                          isOpen: e.target.checked,
                        })
                      }
                    />
                    {t('admin.hours.openCheckbox')}
                  </label>
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleHourCancel}
                  >
                    {t('admin.hours.cancel')}
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {t('admin.hours.update')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </>
    );
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>{t('admin.title')}</h1>
        <button
          className="mobile-menu-toggle"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          ☰
        </button>
      </div>

      {/* Mobile menu overlay */}
      <div
        className={`mobile-menu-overlay ${isMobileMenuOpen ? "open" : ""}`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      <div className="admin-layout">
        {/* Sidebar Navigation */}
        <aside className={`admin-sidebar ${isMobileMenuOpen ? "open" : ""}`}>
          <nav className="admin-nav">
            <button
              className={`nav-item ${
                activeSection === "slots" ? "active" : ""
              }`}
              onClick={() => {
                setActiveSection("slots");
                setIsMobileMenuOpen(false);
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <rect
                  x="3"
                  y="4"
                  width="18"
                  height="18"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <line
                  x1="3"
                  y1="10"
                  x2="21"
                  y2="10"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <line
                  x1="9"
                  y1="4"
                  x2="9"
                  y2="10"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
              {t('admin.navigation.timeSlots')}
            </button>

            <button
              className={`nav-item ${
                activeSection === "reservations" ? "active" : ""
              }`}
              onClick={() => {
                setActiveSection("reservations");
                setIsMobileMenuOpen(false);
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M19 4H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Z"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M16 2v4M8 2v4M3 10h18"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
              {t('admin.navigation.reservations')}
            </button>

            <button
              className={`nav-item ${
                activeSection === "users" ? "active" : ""
              }`}
              onClick={() => {
                setActiveSection("users");
                setIsMobileMenuOpen(false);
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <circle
                  cx="9"
                  cy="7"
                  r="4"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
              {t('admin.navigation.users')}
            </button>

            <button
              className={`nav-item ${activeSection === "menu" ? "active" : ""}`}
              onClick={() => {
                setActiveSection("menu");
                setIsMobileMenuOpen(false);
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2M7 2v20M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {t('admin.navigation.menu')}
            </button>

            <button
              className={`nav-item ${
                activeSection === "hours" ? "active" : ""
              }`}
              onClick={() => {
                setActiveSection("hours");
                setIsMobileMenuOpen(false);
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M12 6v6l4 2"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              {t('admin.navigation.openingHours')}
            </button>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="admin-main">
          {activeSection === "slots" && renderSlotsSection()}
          {activeSection === "reservations" && renderReservationsSection()}
          {activeSection === "users" && renderUsersSection()}
          {activeSection === "menu" && renderMenuSection()}
          {activeSection === "hours" && renderHoursSection()}
        </main>
      </div>
    </div>
  );
}

export default Admin;
