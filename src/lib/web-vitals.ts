import { onCLS, onINP, onFCP, onLCP, onTTFB } from 'web-vitals';

interface WebVitalsMetric {
  id: string;
  name: string;
  value: number;
  delta: number;
  entries: any[];
}

export function reportWebVitals(metric: WebVitalsMetric) {
  // In development, log to console
  if (process.env.NODE_ENV === 'development') {
    console.log('Web Vital:', metric);
    return;
  }
  
  // In production, send to analytics service
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', metric.name, {
      event_category: 'Web Vitals',
      event_label: metric.id,
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      non_interaction: true,
    });
  }
}

export function initWebVitals() {
  if (typeof window !== 'undefined') {
    onCLS(reportWebVitals);
    onINP(reportWebVitals); // INP replaces FID in newer web-vitals
    onFCP(reportWebVitals);
    onLCP(reportWebVitals);
    onTTFB(reportWebVitals);
  }
}