'use client';

import { useState } from 'react';
import { FaPlus, FaTimes } from 'react-icons/fa';
import styles from './CustomServicesField.module.scss';

export interface CustomService {
  nameEn: string;
  nameAr: string;
}

interface CustomServicesFieldProps {
  services: CustomService[];
  onChange: (services: CustomService[]) => void;
}

export default function CustomServicesField({ services, onChange }: CustomServicesFieldProps) {
  const [showModal, setShowModal] = useState(false);
  const [nameEn, setNameEn] = useState('');
  const [nameAr, setNameAr] = useState('');

  const handleAddService = () => {
    if (nameEn.trim() || nameAr.trim()) {
      onChange([...services, { nameEn: nameEn.trim(), nameAr: nameAr.trim() }]);
      setNameEn('');
      setNameAr('');
      setShowModal(false);
    }
  };

  const handleRemoveService = (index: number) => {
    const newServices = services.filter((_, i) => i !== index);
    onChange(newServices);
  };

  const handleOpenModal = () => {
    setNameEn('');
    setNameAr('');
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setNameEn('');
    setNameAr('');
  };

  return (
    <div className={styles.customServicesField}>
      <label>Services Used</label>
      <button
        type="button"
        onClick={handleOpenModal}
        className={styles.addButton}
      >
        <FaPlus />
        <span>Add Service</span>
      </button>
      
      {services.length > 0 && (
        <div className={styles.servicesList}>
          {services.map((service, index) => (
            <div key={index} className={styles.serviceItem}>
              <span className={styles.serviceName}>
                {service.nameEn || service.nameAr}
                {service.nameEn && service.nameAr && ' / '}
                {service.nameAr && service.nameEn && service.nameAr}
              </span>
              <button
                type="button"
                onClick={() => handleRemoveService(index)}
                className={styles.removeButton}
                aria-label="Remove service"
              >
                <FaTimes />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className={styles.modalOverlay} onClick={handleCloseModal}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Add Service</h3>
              <button
                onClick={handleCloseModal}
                className={styles.closeButton}
                aria-label="Close"
              >
                <FaTimes />
              </button>
            </div>
            <div className={styles.modalContent}>
              <div className={styles.formGroup}>
                <label htmlFor="serviceNameEn">Service Name (EN)</label>
                <input
                  id="serviceNameEn"
                  type="text"
                  value={nameEn}
                  onChange={(e) => setNameEn(e.target.value)}
                  placeholder="e.g., Decoration"
                  autoFocus
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="serviceNameAr">Service Name (AR)</label>
                <input
                  id="serviceNameAr"
                  type="text"
                  value={nameAr}
                  onChange={(e) => setNameAr(e.target.value)}
                  placeholder="مثال: الديكور"
                />
              </div>
              <div className={styles.modalActions}>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className={styles.cancelButton}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddService}
                  className={styles.addServiceButton}
                  disabled={!nameEn.trim() && !nameAr.trim()}
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

