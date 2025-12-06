import React from 'react';
import styles from './services.module.scss';
import Link from 'next/link';
import venue from "../../../public/images/homepage/venue.svg";
import arrowRight from "../../../public/images/arrowRight.svg";
import Image from 'next/image';

const services = [
  {
    name: 'Wedding',
    description: 'Ensure a seamless event with our expert venue coordination. We manage logistics, site layouts, and vendor communication at your chosen location.',
    image: venue,
  },
  {
    name: 'Birthday',
    description: 'Ensure a seamless event with our expert venue coordination. We manage logistics, site layouts, and vendor communication at your chosen location.',
    image: venue,
  },
  {
    name: 'Corporate',
    description: 'Ensure a seamless event with our expert venue coordination. We manage logistics, site layouts, and vendor communication at your chosen location.',
    image:venue,
  },
  {
    name: 'Social',
    description: 'Ensure a seamless event with our expert venue coordination. We manage logistics, site layouts, and vendor communication at your chosen location.',
    image: venue,
  },
];
export default function ServicesSection() {
  return (
    <section className={styles.servicesSection}>
      <div className={styles.servicesSectionHeader}>
      <h1 className={styles.servicesSectionTitle}>Services</h1>
      <Link href='/services' className={styles.servicesSectionLink}>View All</Link>
      </div>
      <div className={styles.servicesSectionContent}>
        {services.map((service) => (
          <Link href={`/services/${service.name.toLowerCase()}`} className={styles.servicesSectionContentItem} key={service.name}>
            <Image src={service.image} alt={service.name}  />
            <h3 className={styles.servicesSectionContentItemTitle}>{service.name}</h3>
            <p className={styles.servicesSectionContentItemDescription}>{service.description}</p>
            <div className={styles.servicesSectionContentItemLink}>
              Learn more
              <Image src={arrowRight} alt="arrow" className={styles.servicesSectionContentItemLinkArrow} />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}