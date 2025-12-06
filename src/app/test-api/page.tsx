"use client";

import { useState, useEffect } from "react";
import styles from "./test.module.scss";

interface Service {
  _id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  isActive: boolean;
  order: number;
}

export default function TestAPIPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // For GET by ID test
  const [selectedId, setSelectedId] = useState("");
  const [singleService, setSingleService] = useState<Service | null>(null);
  const [loadingSingle, setLoadingSingle] = useState(false);
  const [errorSingle, setErrorSingle] = useState("");

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/services");
      const data = await response.json();
      
      if (data.success) {
        setServices(data.data);
        // Auto-select first service ID
        if (data.data.length > 0 && !selectedId) {
          setSelectedId(data.data[0]._id);
        }
      } else {
        setError("Failed to fetch services");
      }
    } catch (err) {
      setError("Error fetching services");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchServiceById = async () => {
    if (!selectedId) {
      setErrorSingle("Please select a service ID");
      return;
    }

    try {
      setLoadingSingle(true);
      setErrorSingle("");
      setSingleService(null);
      
      const response = await fetch(`/api/services/${selectedId}`);
      const data = await response.json();
      
      if (data.success) {
        setSingleService(data.data);
      } else {
        setErrorSingle(data.error || "Failed to fetch service");
      }
    } catch (err) {
      setErrorSingle("Error fetching service");
      console.error(err);
    } finally {
      setLoadingSingle(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>API Test Page</h1>
        <p>Testing Services API</p>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>GET /api/services</h2>
          <button onClick={fetchServices} className={styles.refreshBtn}>
            🔄 Refresh
          </button>
        </div>

        {loading && <p className={styles.loading}>Loading...</p>}
        
        {error && <p className={styles.error}>{error}</p>}

        {!loading && !error && (
          <>
            <p className={styles.count}>Found {services.length} services</p>
            
            <div className={styles.grid}>
              {services.map((service) => (
                <div key={service._id} className={styles.card}>
                  <div className={styles.icon}>{service.icon}</div>
                  <h3>{service.name}</h3>
                  <p className={styles.slug}>Slug: {service.slug}</p>
                  <p className={styles.description}>{service.description}</p>
                  <div className={styles.meta}>
                    <span className={service.isActive ? styles.active : styles.inactive}>
                      {service.isActive ? "✓ Active" : "✗ Inactive"}
                    </span>
                    <span className={styles.order}>Order: {service.order}</span>
                  </div>
                  <p className={styles.id}>ID: {service._id}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <div className={styles.section}>
        <h2>GET /api/services/[id]</h2>
        <p className={styles.description}>Test fetching a single service by ID</p>
        
        <div className={styles.testForm}>
          <div className={styles.formGroup}>
            <label htmlFor="serviceId">Select Service ID:</label>
            <select 
              id="serviceId"
              value={selectedId} 
              onChange={(e) => setSelectedId(e.target.value)}
              className={styles.select}
            >
              <option value="">-- Select a service --</option>
              {services.map((service) => (
                <option key={service._id} value={service._id}>
                  {service.icon} {service.name} ({service._id})
                </option>
              ))}
            </select>
          </div>
          
          <button 
            onClick={fetchServiceById} 
            disabled={!selectedId || loadingSingle}
            className={styles.testBtn}
          >
            {loadingSingle ? "Loading..." : "🔍 Fetch Service by ID"}
          </button>
        </div>

        {errorSingle && <p className={styles.error}>{errorSingle}</p>}

        {singleService && (
          <div className={styles.result}>
            <h3>Result:</h3>
            <div className={styles.card}>
              <div className={styles.icon}>{singleService.icon}</div>
              <h3>{singleService.name}</h3>
              <p className={styles.slug}>Slug: {singleService.slug}</p>
              <p className={styles.description}>{singleService.description}</p>
              <div className={styles.meta}>
                <span className={singleService.isActive ? styles.active : styles.inactive}>
                  {singleService.isActive ? "✓ Active" : "✗ Inactive"}
                </span>
                <span className={styles.order}>Order: {singleService.order}</span>
              </div>
              <p className={styles.id}>ID: {singleService._id}</p>
            </div>
            
            <div className={styles.jsonBlock}>
              <h4>Raw JSON Response:</h4>
              <pre>{JSON.stringify(singleService, null, 2)}</pre>
            </div>
          </div>
        )}
      </div>

      <div className={styles.section}>
        <h2>API Endpoints</h2>
        <div className={styles.endpoints}>
          <div className={styles.endpoint}>
            <span className={styles.method}>GET</span>
            <code>/api/services</code>
            <span className={styles.desc}>Get all services</span>
          </div>
          <div className={styles.endpoint}>
            <span className={styles.method}>GET</span>
            <code>/api/services?active=true</code>
            <span className={styles.desc}>Get active services only</span>
          </div>
          <div className={styles.endpoint}>
            <span className={styles.method}>GET</span>
            <code>/api/services/[id]</code>
            <span className={styles.desc}>Get service by ID</span>
          </div>
          <div className={styles.endpoint}>
            <span className={styles.methodPost}>POST</span>
            <code>/api/services</code>
            <span className={styles.desc}>Create service (admin)</span>
          </div>
          <div className={styles.endpoint}>
            <span className={styles.methodPut}>PUT</span>
            <code>/api/services/[id]</code>
            <span className={styles.desc}>Update service (admin)</span>
          </div>
          <div className={styles.endpoint}>
            <span className={styles.methodDelete}>DELETE</span>
            <code>/api/services/[id]</code>
            <span className={styles.desc}>Delete service (admin)</span>
          </div>
        </div>
      </div>
    </div>
  );
}

