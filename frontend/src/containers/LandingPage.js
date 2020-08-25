import React from 'react';
import '../styles/App.scss';
import styles from '../styles/LandingPage.module.scss';
import BlobLeft from '../assets/BlobLeft.svg';
import BlobRight from '../assets/BlobRight.svg';
import Button from '../components/Button';

function LandingPage() {
    return(
        <div>
            <img className={styles.blobleft} src={BlobLeft} alt="" />
            <img className={styles.blobright} src={BlobRight} alt="" />
            <div className={styles.header}>ACM QUIZTIME</div>
            <Button variant="landingpagebutton" label='PLAY' />
        </div>
    );
}

export default LandingPage;