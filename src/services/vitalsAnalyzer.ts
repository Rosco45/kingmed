import { ConstantesVitales } from '../types';

export interface VitalAlert {
  field: 'temperature' | 'tension' | 'spo2' | 'glycemie' | 'poids';
  severity: 'warning' | 'critical';
  label: string;
  message: string;
}

export const analyzeVitals = (vitals?: ConstantesVitales): VitalAlert[] => {
  if (!vitals) return [];
  const alerts: VitalAlert[] = [];

  // Température (°C)
  if (vitals.temperature !== undefined && vitals.temperature > 0) {
    if (vitals.temperature >= 39.0) {
      alerts.push({
        field: 'temperature',
        severity: 'critical',
        label: 'Fièvre élevée',
        message: `${vitals.temperature}°C (Urgence thermique)`,
      });
    } else if (vitals.temperature >= 38.0) {
      alerts.push({
        field: 'temperature',
        severity: 'warning',
        label: 'État fébrile',
        message: `${vitals.temperature}°C (Fièvre modérée)`,
      });
    } else if (vitals.temperature < 35.5) {
      alerts.push({
        field: 'temperature',
        severity: 'warning',
        label: 'Hypothermie',
        message: `${vitals.temperature}°C (Température basse)`,
      });
    }
  }

  // Tension artérielle (ex: 140/90 ou 120/80)
  if (vitals.tension && vitals.tension.includes('/')) {
    const [sysStr, diaStr] = vitals.tension.split('/');
    const sys = parseInt(sysStr, 10);
    const dia = parseInt(diaStr, 10);
    if (!isNaN(sys) && !isNaN(dia)) {
      if (sys >= 160 || dia >= 100) {
        alerts.push({
          field: 'tension',
          severity: 'critical',
          label: 'Hypertension Stade 2',
          message: `${vitals.tension} mmHg (Surveillance requise)`,
        });
      } else if (sys >= 140 || dia >= 90) {
        alerts.push({
          field: 'tension',
          severity: 'warning',
          label: 'Hypertension Stade 1',
          message: `${vitals.tension} mmHg`,
        });
      } else if (sys < 90 || dia < 60) {
        alerts.push({
          field: 'tension',
          severity: 'warning',
          label: 'Hypotension',
          message: `${vitals.tension} mmHg (Tension basse)`,
        });
      }
    }
  }

  // Saturation Oxygène (SpO2 %)
  if (vitals.spo2 !== undefined && vitals.spo2 > 0) {
    if (vitals.spo2 < 90) {
      alerts.push({
        field: 'spo2',
        severity: 'critical',
        label: 'Hypoxie sévère',
        message: `${vitals.spo2}% SpO2 (Oxygénothérapie requise)`,
      });
    } else if (vitals.spo2 < 95) {
      alerts.push({
        field: 'spo2',
        severity: 'warning',
        label: 'Hypoxie modérée',
        message: `${vitals.spo2}% SpO2 (Sous le seuil normal)`,
      });
    }
  }

  // Glycémie (g/L)
  if (vitals.glycemie !== undefined && vitals.glycemie > 0) {
    if (vitals.glycemie >= 1.80) {
      alerts.push({
        field: 'glycemie',
        severity: 'critical',
        label: 'Hyperglycémie marquée',
        message: `${vitals.glycemie} g/L`,
      });
    } else if (vitals.glycemie >= 1.26) {
      alerts.push({
        field: 'glycemie',
        severity: 'warning',
        label: 'Hyperglycémie modérée',
        message: `${vitals.glycemie} g/L`,
      });
    } else if (vitals.glycemie < 0.70) {
      alerts.push({
        field: 'glycemie',
        severity: 'critical',
        label: 'Hypoglycémie',
        message: `${vitals.glycemie} g/L (Apport glucosé nécessaire)`,
      });
    }
  }

  return alerts;
};
