'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Locale, translate } from '@krishisetu/i18n';
import styles from '../PublicHomeView.module.css';

export interface PublicHeroProps {
  readonly locale: Locale;
}

export function PublicHero({ locale }: PublicHeroProps): React.JSX.Element {
  const t = (key: string) => translate(key, locale);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMediaReady, setIsMediaReady] = useState(false);
  const [mediaFailed, setMediaFailed] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const connection = (navigator as Navigator & {
      connection?: {
        readonly saveData?: boolean;
        readonly effectiveType?: 'slow-2g' | '2g' | '3g' | '4g';
      };
    }).connection;
    const isSlowConnection =
      connection?.effectiveType === 'slow-2g' ||
      connection?.effectiveType === '2g' ||
      connection?.effectiveType === '3g';

    if (reducedMotionQuery.matches || connection?.saveData || isSlowConnection) {
      video.pause();
      setIsPlaying(false);
      return;
    }

    void video.play().catch(() => {
      setIsPlaying(false);
    });

    const handleMotionPreferenceChange = (event: MediaQueryListEvent) => {
      if (event.matches) {
        video.pause();
        setIsPlaying(false);
      }
    };

    reducedMotionQuery.addEventListener('change', handleMotionPreferenceChange);
    return () => {
      reducedMotionQuery.removeEventListener('change', handleMotionPreferenceChange);
    };
  }, []);

  const toggleMediaPlay = async () => {
    const video = videoRef.current;
    if (!video || mediaFailed) return;

    if (video.paused) {
      try {
        await video.play();
      } catch {
        setIsPlaying(false);
      }
      return;
    }

    video.pause();
  };

  return (
    <section className={styles.heroSection} aria-label={t('publicHome.hero.regionLabel')}>
      <div className={styles.heroMediaContainer} aria-hidden="true">
        <picture className={styles.heroPosterPicture}>
          <source
            media="(max-width: 600px)"
            type="image/avif"
            srcSet="/media/public-home/krishisetu-hero-poster-mobile.avif"
          />
          <source
            type="image/avif"
            srcSet="/media/public-home/krishisetu-hero-poster.avif"
          />
          <img
            className={styles.heroPoster}
            src="/media/public-home/krishisetu-hero-poster.webp"
            alt=""
            width={1280}
            height={720}
            decoding="async"
            fetchPriority="high"
          />
        </picture>

        <video
          ref={videoRef}
          className={`${styles.heroVideo} ${isMediaReady && !mediaFailed ? styles.heroVideoVisible : ''}`}
          muted
          loop
          playsInline
          preload="none"
          poster="/media/public-home/krishisetu-hero-poster.webp"
          onCanPlay={() => setIsMediaReady(true)}
          onPlaying={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onError={() => {
            setMediaFailed(true);
            setIsPlaying(false);
          }}
        >
          <source
            media="(max-width: 767px)"
            src="/media/public-home/krishisetu-hero-mobile.mp4"
            type="video/mp4"
          />
          <source src="/media/public-home/krishisetu-hero-desktop.mp4" type="video/mp4" />
        </video>

        <div className={styles.heroOverlay} />
      </div>

      {/* Hero Content */}
      <div className={styles.heroContentWrapper}>
        <div className={styles.heroTextContent}>
          <p className={styles.heroEyebrow}>
            <span>🌱</span>
            {t('publicHome.hero.eyebrow')}
          </p>

          <h1 className={styles.heroTitle}>{t('publicHome.hero.title')}</h1>

          <p className={styles.heroSupporting}>{t('publicHome.hero.supporting')}</p>

          <div className={styles.heroCtaGroup}>
            <a href="#services" className={styles.heroPrimaryBtn}>
              {t('publicHome.hero.primaryCta')}
            </a>

            <Link href={`/${locale}/login`} className={styles.heroSecondaryBtn}>
              {t('publicHome.hero.secondaryCta')}
            </Link>
          </div>
        </div>
      </div>

      {/* Accessible background video pause/play toggle */}
      <button
        type="button"
        onClick={toggleMediaPlay}
        className={styles.heroMediaControl}
        aria-pressed={isPlaying}
        disabled={mediaFailed}
        aria-label={
          mediaFailed
            ? t('publicHome.hero.videoUnavailable')
            : isPlaying
            ? t('publicHome.hero.pauseVideo')
            : t('publicHome.hero.playVideo')
        }
      >
        <span aria-hidden="true">{isPlaying ? '⏸' : '▶'}</span>
        <span>
          {mediaFailed
            ? t('publicHome.hero.videoUnavailable')
            : isPlaying
            ? t('publicHome.hero.pauseVideo')
            : t('publicHome.hero.playVideo')}
        </span>
      </button>
    </section>
  );
}
