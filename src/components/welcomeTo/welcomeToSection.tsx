'use client';

import  React from 'react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import styles from './welcomeToSection.module.scss';
import logo from "../../../public/images/welcomeLogo.svg";
import Image from 'next/image';
export default function WelcomeToSection({title,description,author}: {title: string, description: string, author?: string}) {
  const t = useTranslations('welcome');

  const fadeUp = {
    hidden: { opacity: 0, y: 32 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <>
        <motion.section 
          id='homepage-next-section' 
          className={styles.welcomeToSection}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          transition={{ staggerChildren: 0.15, duration: 0.6, ease: "easeOut" }}
        >
        <motion.div className={styles.welcomeToSectionLogo} variants={fadeUp}>
            <Image src={logo} alt="logo" className={styles.welcomeToSectionLogoImage} />
        </motion.div>
        <motion.div className={styles.welcomeToSectionContent} variants={fadeUp}>
          <h1 className={styles.welcomeToSectionTitle}>{title}</h1>
          <p className={styles.welcomeToSectionDescription}>{description}</p>
        <h5 className={styles.welcomeToSectionAuthor}>{author}</h5>
        </motion.div>

     
    </motion.section>

    
    </>

  );
}