"use client";

import React from "react";
import styles from "./admin.module.scss";

interface AdminCardProps {
  item: any;
  renderContent: (item: any) => React.ReactNode;
  onEdit: (item: any) => void;
  onDelete: (id: string, name: string) => void;
  getName: (item: any) => string;
}

export default function AdminCard({
  item,
  renderContent,
  onEdit,
  onDelete,
  getName,
}: AdminCardProps) {
  return (
    <div className={styles.card}>
      {item.image && (
        <div className={styles.cardImage}>
          <img src={item.image} alt={getName(item)} />
        </div>
      )}
      <div className={styles.cardHeader}>
        {item.icon && <div className={styles.icon}>{item.icon}</div>}
        <div className={styles.badge}>
          {item.isActive ? (
            <span className={styles.active}>Active</span>
          ) : (
            <span className={styles.inactive}>Inactive</span>
          )}
        </div>
      </div>

      {renderContent(item)}

      <div className={styles.actions}>
        <button onClick={() => onEdit(item)} className={styles.editBtn}>
          ✏️ Edit
        </button>
        <button
          onClick={() => onDelete(item._id, getName(item))}
          className={styles.deleteBtn}
        >
          🗑️ Delete
        </button>
      </div>
    </div>
  );
}

