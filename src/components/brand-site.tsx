"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion, MotionConfig, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "motion/react";
import { brand } from "@/config/brand";

type ProductImageProps = { type?: "package" | "whole" | "broken"; className?: string; priority?: boolean; decorative?: boolean; sizes?: string };

function ProductImage({ type = "whole", className = "", priority = false, decorative = false, sizes = "(max-width: 600px) 85vw, 50vw" }: ProductImageProps) {
  return <picture className="product-picture"><source media="(max-width: 600px)" srcSet={brand.images[type].replace(".webp", "-mobile.webp")} /><Image className={`product-image ${className}`} src={brand.images[type]} width={1254} height={1254}
    alt={decorative ? "" : type === "package" ? `${brand.name}のキャラメルオレンジの紙箱` : type === "broken" ? "ぱきっと割れて、焦がしキャラメルの断面が見えるサブレ" : "香ばしく焼いた円形のバターサブレに焦がしキャラメルを挟んだ焼き菓子"}
    loading={priority ? "eager" : "lazy"} fetchPriority={priority ? "high" : "auto"} sizes={sizes} /></picture>;
}

function Header() {
  return <header className="site-header">
    <a href="#top" className="header-logo" aria-label={`${brand.name} トップへ`}>{brand.name}<span className="logo-dot">®</span></a>
    <span className="header-descriptor">{brand.englishName}</span>
    <nav aria-label="メインナビゲーション"><a href="#story">OUR STORY</a><a href="#product">THE SABLE<span aria-hidden="true"> ↗</span></a></nav>
  </header>;
}

function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const typeY = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const packageY = useTransform(scrollYProgress, [0, 1], [0, -110]);
  const cookieY = useTransform(scrollYProgress, [0, 1], [0, -210]);
  return <section ref={ref} className="hero" id="top" aria-labelledby="hero-heading">
    <Header />
    <div className="hero-copy"><h1 id="hero-heading">{brand.taglineLines.map(line => <span key={line}>{line}</span>)}</h1>
      <p>香ばしさと、ほろ苦さ。<br />焦がしキャラメルサブレ。</p></div>
    <motion.div className="hero-word wordmark" style={{ y: reduced ? 0 : typeY }} aria-hidden="true">{brand.name}</motion.div>
    <motion.div className="hero-package" style={{ y: reduced ? 0 : packageY }}><div className="float float-package"><ProductImage type="package" priority sizes="(max-width:600px) 100vw, 60vw" /></div></motion.div>
    <motion.div className="hero-cookie-small" style={{ y: reduced ? 0 : cookieY }}><div className="float float-small"><ProductImage priority decorative sizes="(max-width:600px) 38vw, 20vw" /></div></motion.div>
    <motion.div className="hero-cookie-front" style={{ y: reduced ? 0 : cookieY }}><div className="float float-front"><ProductImage priority decorative sizes="(max-width:600px) 70vw, 35vw" /></div></motion.div>
    <a className="scroll-cue" href="#story"><span>ひとくちの、その先へ。</span><span aria-hidden="true">↓</span></a>
  </section>;
}

function BrandMessage() {
  return <section className="brand-message" id="story" aria-labelledby="story-heading">
    <div className="message-mark" aria-hidden="true">K.</div>
    <h2 id="story-heading">{brand.story.heading.map(line => <span key={line}>{line}</span>)}</h2>
    <div className="message-body">{brand.story.paragraphs.map(p => <p key={p}>{p}</p>)}</div>
    <p className="message-signature">甘いだけじゃ、ものたりない。</p>
  </section>;
}

function ProductParade() {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [travel, setTravel] = useState(0);
  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, value => -value * travel);
  useEffect(() => {
    const measure = () => { if (track.current) setTravel(Math.max(0, track.current.scrollWidth - window.innerWidth + window.innerWidth * .12)); };
    const observer = new ResizeObserver(measure);
    if (track.current) observer.observe(track.current);
    window.addEventListener("resize", measure);
    measure();
    return () => { observer.disconnect(); window.removeEventListener("resize", measure); };
  }, []);
  return <section ref={section} className={`parade ${reduced ? "motion-reduced" : ""}`} aria-labelledby="parade-heading">
    <div className="parade-sticky">
      <div className="parade-topline"><h2 id="parade-heading">おいしい予感が、つづいていく。</h2><span>SCROLL TO TASTE</span></div>
      <div className="parade-type" aria-hidden="true">KIRO KIRO KIRO</div>
      <motion.div className="parade-track" ref={track} style={{ x: reduced ? 0 : x }} data-testid="parade-track">
        {["package", "whole", "package", "whole", "package", "whole"].map((type, i) =>
          <div className={`parade-item parade-item-${i}`} key={i}><ProductImage type={type as "package" | "whole"} decorative sizes="(max-width:600px) 90vw, 45vw" /></div>)}
      </motion.div>
      <div className="parade-bottomline"><span>BUTTER + BURNT CARAMEL</span><span aria-hidden="true">ひとつ、もうひとつ。</span></div>
      <motion.div className="parade-progress" style={{ scaleX: reduced ? 1 : scrollYProgress }} aria-hidden="true" />
    </div>
  </section>;
}

function ProductStory() {
  return <section className="product-story" aria-labelledby="ingredients-heading">
    <div className="story-photo"><span className="story-photo-word" aria-hidden="true">BUTTER</span><ProductImage /><span className="photo-caption">香ばしさを、重ねて。</span></div>
    <div className="story-copy"><p className="story-kicker">ふたつの出会い。ひとつの余韻。</p><h2 id="ingredients-heading">さくっ。<br />その奥に、<br />とろっ。</h2><p>しっかり焼き込んだバターサブレ。<br />甘さを深める、焦がしキャラメル。</p><p>違う食感が重なるから、<br />ひとくちが、忘れられなくなる。</p><span className="story-formula">BUTTER <span>×</span> CARAMEL</span></div>
  </section>;
}

function GiantSable() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [scrollBroken, setScrollBroken] = useState(false);
  const [manual, setManual] = useState<boolean | null>(null);
  const lastThreshold = useRef(false);
  useMotionValueEvent(scrollYProgress, "change", p => {
    const next = p >= .52;
    if (next !== lastThreshold.current) {
      lastThreshold.current = next;
      setScrollBroken(next);
      setManual(null);
    }
  });
  const broken = manual ?? (!reduced && scrollBroken);
  const scale = useTransform(scrollYProgress, [0, .42, .55, 1], [.88, 1, 1, 1]);
  return <section ref={ref} className={`giant ${reduced ? "motion-reduced" : ""}`} id="break" aria-labelledby="break-heading">
    <div className="giant-sticky">
      <div className="giant-intro"><p>おいしさの、真ん中へ。</p><h2 id="break-heading">ひとまず、<br className="mobile-only" />ぱきっと。</h2></div>
      <span className="giant-word" aria-hidden="true">{broken ? "TORO!" : "PAKI!"}</span>
      <motion.div className="sable-stage" style={{ scale: reduced ? 1 : scale }}>
        <button className={`break-button ${broken ? "is-broken" : ""}`} type="button" onClick={() => setManual(!broken)}
          aria-label={broken ? "サブレを元に戻す" : "サブレをぱきっと割る"} aria-pressed={broken} data-testid="break-button">
          <span className="sable-states"><ProductImage className={`sable-state whole-state ${broken ? "is-hidden" : ""}`} decorative sizes="(max-width:600px) 125vw, 76vw" />
            <ProductImage type="broken" className={`sable-state broken-state ${broken ? "" : "is-hidden"}`} decorative sizes="(max-width:600px) 125vw, 76vw" /></span>
          <span className="crumbs" aria-hidden="true">{Array.from({ length: 7 }, (_, i) => <i key={i} />)}</span>
          <span className="paki-caption" aria-hidden="true">パキッ</span>
        </button>
      </motion.div>
      <div className="giant-bottom"><p role="status" aria-live="polite">{broken ? "ほら、焦がしキャラメル。" : "タップでも、スクロールでも。"}</p><button className="break-text-button" onClick={() => setManual(!broken)}>{broken ? "もう一度、ぱきっと。 ↺" : "TAP TO BREAK ＋"}</button></div>
    </div>
  </section>;
}

function TasteSection() {
  return <section className="taste" aria-label="味わいと食感">
    {brand.taste.map((item, i) => <div className={`taste-row taste-row-${i}`} key={item.title}><h2>{item.title}</h2><p>{item.copy}</p>{i === 1 && <ProductImage type="broken" decorative className="taste-cookie" sizes="(max-width:600px) 75vw, 30vw" />}</div>)}
  </section>;
}

function ProductDetail() {
  const dialog = useRef<HTMLDialogElement>(null);
  return <section className="product-detail" id="product" aria-labelledby="product-heading">
    <div className="detail-visual"><span className="detail-word wordmark" aria-hidden="true">{brand.name}</span><ProductImage type="package" className="detail-package" /><ProductImage className="detail-cookie" decorative sizes="(max-width:600px) 60vw, 25vw" /></div>
    <div className="detail-copy"><p className="detail-intro">あの人にも。わたしにも。</p><h2 id="product-heading"><span className="detail-name">{brand.name}</span>{brand.productName}</h2><p className="detail-description">香ばしさと、ほろ苦さをひと箱に。<br />おやつの時間を、ちょっと特別に。</p><div className="detail-price"><span>{brand.quantity}</span><strong>{brand.price}<small>（税込・架空設定）</small></strong></div>
      {brand.storeUrl ? <a href={brand.storeUrl} className="shop-button">SHOP {brand.name}<span aria-hidden="true">↗</span></a> : <button className="shop-button" onClick={() => dialog.current?.showModal()}>SHOP {brand.name}<span aria-hidden="true">↗</span></button>}
      <p className="demo-note">架空ブランドのコンセプトサイトです。購入はできません。</p></div>
    <dialog ref={dialog} className="store-dialog" aria-labelledby="store-dialog-title" onClick={e => { if (e.target === e.currentTarget) dialog.current?.close(); }}>
      <div className="dialog-inner"><span className="dialog-brand">{brand.name}</span><h3 id="store-dialog-title">ひとくちの夢を、<br />つくりました。</h3><p>{brand.name}は架空の焼き菓子ブランドです。<br />このサイトはブランド体験のデモのため、<br />商品の注文・決済は行えません。</p><button autoFocus className="dialog-close" onClick={() => dialog.current?.close()}>サイトに戻る<span aria-hidden="true"> ↗</span></button></div>
    </dialog>
  </section>;
}

function Ending() {
  return <section className="ending" aria-label="KIROのメッセージ"><p>{brand.tagline}</p><div className="ending-word wordmark" aria-hidden="true">{brand.name}</div><div className="ending-cookie float float-front"><ProductImage decorative sizes="(max-width:600px) 65vw, 35vw" /></div><a href="#top" className="back-top">もうひとつ、最初から。<span aria-hidden="true">↑</span></a></section>;
}

function Footer() {
  return <footer className="site-footer"><div><a href="#top" className="footer-logo">{brand.name}</a><span>{brand.englishName}</span></div><p>FICTIONAL BRAND / CONCEPT WEBSITE</p><small>© {brand.name}</small></footer>;
}

export function BrandSite() {
  return <MotionConfig reducedMotion="user"><a href="#story" className="skip-link">本文へ移動</a><main><Hero /><BrandMessage /><ProductParade /><ProductStory /><GiantSable /><TasteSection /><ProductDetail /><Ending /></main><Footer /></MotionConfig>;
}
