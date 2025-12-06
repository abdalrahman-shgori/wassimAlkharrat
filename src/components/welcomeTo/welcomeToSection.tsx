import  React from 'react';
import styles from './welcomeToSection.module.scss';
import logo from "../../../public/images/welcomeLogo.svg";
import Image from 'next/image';
export default function WelcomeToSection() {
  return (
    <>
        <section id='homepage-next-section' className={styles.welcomeToSection}>
        <div className={styles.welcomeToSectionLogo}>
            <Image src={logo} alt="logo" className={styles.welcomeToSectionLogoImage} />
        </div>
        <div className={styles.welcomeToSectionContent}>
          <h1 className={styles.welcomeToSectionTitle}>Welcome to Wassim Alkharrat Events</h1>
          <p className={styles.welcomeToSectionDescription}>With over a decade of experience, we specialize in crafting extraordinary experiences that celebrate life's most precious moments. Our team of dedicated professionals combines creativity, precision, and passion to deliver events that leave lasting impressions.</p>
        <h5 className={styles.welcomeToSectionAuthor}>Wassim Alkharrat ...</h5>
        </div>

     
    </section>

    
    </>

  );
}