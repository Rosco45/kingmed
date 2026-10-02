import { jsPDF } from 'jspdf';
import { Patient, Consultation, Employe, VentePharmacie } from '../types';

export const pdfService = {
  // Générer le carnet de santé PDF (conforme aux captures 19 & 20)
  generateCarnetSante: (patient: Patient, consultations: Consultation[]) => {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
    });

    doc.setFillColor(2, 132, 199);
    doc.rect(0, 0, 297, 32, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('Kingmed', 14, 18);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.text('Carnet de santé', 14, 26);

    doc.setFillColor(255, 255, 255);
    doc.roundedRect(240, 8, 45, 16, 2, 2, 'F');
    doc.setTextColor(50, 50, 50);
    doc.setFontSize(10);
    doc.text(`Date : ${new Date().toLocaleDateString('fr-FR')}`, 245, 18);

    doc.setTextColor(30, 41, 59);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(`Nom : ${patient.nom} ${patient.prenom}`, 14, 45);
    doc.setFont('helvetica', 'normal');
    doc.text(`Date de naissance : ${patient.dateNaissance}`, 14, 52);
    doc.text(`Téléphone : ${patient.telephone}`, 140, 45);
    doc.text(`Adresse : ${patient.adresse || 'N/A'}`, 140, 52);

    doc.setDrawColor(226, 232, 240);
    doc.line(14, 58, 283, 58);

    let startY = 66;
    doc.setFillColor(2, 132, 199);
    doc.rect(14, startY, 269, 9, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('Date', 16, startY + 6);
    doc.text('Diagnostic', 42, startY + 6);
    doc.text('Prescription', 90, startY + 6);
    doc.text('Temp.', 155, startY + 6);
    doc.text('Tension', 172, startY + 6);
    doc.text('Poids', 192, startY + 6);
    doc.text('Glycémie', 210, startY + 6);
    doc.text('SpO2', 230, startY + 6);
    doc.text('Notes', 246, startY + 6);

    startY += 10;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);

    consultations.forEach((c, idx) => {
      const y = startY + idx * 10;
      doc.setFillColor(idx % 2 === 0 ? 248 : 255, idx % 2 === 0 ? 250 : 255, idx % 2 === 0 ? 252 : 255);
      doc.rect(14, y - 2, 269, 10, 'F');
      doc.setTextColor(30, 41, 59);

      doc.text(c.date || '-', 16, y + 4);
      doc.text(c.diagnostic.substring(0, 25), 42, y + 4);
      doc.text(c.prescription.substring(0, 35), 90, y + 4);
      doc.text(c.constantes?.temperature ? `${c.constantes.temperature}°C` : '-', 155, y + 4);
      doc.text(c.constantes?.tension || '-', 172, y + 4);
      doc.text(c.constantes?.poids ? `${c.constantes.poids} kg` : '-', 192, y + 4);
      doc.text(c.constantes?.glycemie ? `${c.constantes.glycemie}` : '-', 210, y + 4);
      doc.text(c.constantes?.spo2 ? `${c.constantes.spo2}%` : '-', 230, y + 4);
      doc.text((c.notes || '-').substring(0, 20), 246, y + 4);
    });

    doc.save(`Carnet_Sante_${patient.nom}_${patient.prenom}.pdf`);
  },

  // Générer la Fiche Employé PDF (conforme à la capture 14)
  generateFicheEmploye: (employe: Employe) => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    doc.setFillColor(2, 132, 199);
    doc.rect(0, 0, 210, 40, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('Kingmed', 20, 22);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.text('Fiche employé', 20, 32);

    doc.setFillColor(255, 255, 255);
    doc.roundedRect(150, 12, 45, 16, 2, 2, 'F');
    doc.setTextColor(50, 50, 50);
    doc.setFontSize(10);
    doc.text(`Date : ${new Date().toLocaleDateString('fr-FR')}`, 155, 22);

    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(20, 55, 170, 95, 3, 3, 'FD');

    doc.setTextColor(2, 132, 199);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Informations de l\'employé', 30, 70);

    doc.setTextColor(51, 65, 85);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');

    const leftCol = 30;
    const rightCol = 110;

    doc.text(`Nom: ${employe.nom}`, leftCol, 85);
    doc.text(`Prénom: ${employe.prenom}`, leftCol, 95);
    doc.text(`Poste: ${employe.poste}`, leftCol, 105);
    doc.text(`Spécialité: ${employe.specialite || 'Général'}`, leftCol, 115);
    doc.text(`Statut: ${employe.statut}`, leftCol, 125);

    doc.text(`Date d'embauche: ${employe.dateEmbauche}`, rightCol, 85);
    doc.text(`Email: ${employe.email}`, rightCol, 95);
    doc.text(`Téléphone: ${employe.telephone}`, rightCol, 105);
    doc.text(`Adresse: ${employe.adresse}`, rightCol, 115);
    doc.text(`Salaire: ${employe.salaire.toLocaleString()} F`, rightCol, 125);

    doc.roundedRect(20, 160, 170, 50, 3, 3, 'FD');
    doc.setTextColor(2, 132, 199);
    doc.setFont('helvetica', 'bold');
    doc.text('Qualifications & Sécurité Sociale', 30, 175);

    doc.setTextColor(51, 65, 85);
    doc.setFont('helvetica', 'normal');
    doc.text(`Diplômes: ${employe.diplomes || 'Non renseigné'}`, 30, 187);
    doc.text(`Numéro Sécurité Sociale: ${employe.numeroSecu || 'N/A'}`, 30, 197);

    doc.setFontSize(9);
    doc.setTextColor(148, 163, 184);
    doc.text('Document généré électroniquement par le système de gestion clinique Kingmed.', 30, 275);

    doc.save(`Fiche_${employe.nom}_${employe.prenom}.pdf`);
  },

  // Générer la Facture PDF (conforme à la capture 29)
  generateFacture: (patient: Patient, consultation: Consultation) => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    doc.setFillColor(2, 132, 199);
    doc.rect(0, 0, 210, 35, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('Kingmed - Facture Médicale', 20, 20);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`Facture N° : FAC-${consultation.id.toUpperCase()}`, 20, 28);

    doc.setFillColor(255, 255, 255);
    doc.roundedRect(150, 10, 45, 16, 2, 2, 'F');
    doc.setTextColor(50, 50, 50);
    doc.setFontSize(10);
    doc.text(`Date : ${consultation.date}`, 155, 20);

    doc.setTextColor(30, 41, 59);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Facturé à :', 20, 50);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Patient : ${patient.nom} ${patient.prenom}`, 20, 58);
    doc.text(`Téléphone : ${patient.telephone}`, 20, 65);
    doc.text(`Adresse : ${patient.adresse || 'Lomé'}`, 20, 72);

    doc.setFillColor(241, 245, 249);
    doc.rect(20, 85, 170, 10, 'F');
    doc.setFont('helvetica', 'bold');
    doc.text('Prestation / Acte médical', 25, 92);
    doc.text('Montant', 150, 92);

    doc.setFont('helvetica', 'normal');
    doc.text(`Consultation générale - ${consultation.diagnostic}`, 25, 106);
    doc.text(`${consultation.coutTotal.toLocaleString()} F`, 150, 106);

    doc.setDrawColor(226, 232, 240);
    doc.line(20, 115, 190, 115);

    doc.setFont('helvetica', 'bold');
    doc.text('Total à payer :', 110, 130);
    doc.text(`${consultation.coutTotal.toLocaleString()} F`, 160, 130);

    doc.setTextColor(16, 185, 129);
    doc.text('Montant réglé :', 110, 140);
    doc.text(`${consultation.montantPaye.toLocaleString()} F`, 160, 140);

    doc.setTextColor(consultation.coutTotal - consultation.montantPaye > 0 ? 239 : 71, 68, 68);
    doc.text('Reste à payer :', 110, 150);
    doc.text(`${(consultation.coutTotal - consultation.montantPaye).toLocaleString()} F`, 160, 150);

    doc.setFillColor(240, 253, 244);
    doc.setDrawColor(34, 197, 94);
    doc.roundedRect(20, 170, 80, 25, 2, 2, 'FD');
    doc.setTextColor(22, 101, 52);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`STATUT : ${consultation.statut.toUpperCase()}`, 25, 184);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`Mode : ${consultation.methodePaiement}`, 25, 190);

    doc.setTextColor(100, 116, 139);
    doc.text('Cachet et signature de la caisse', 130, 180);
    doc.line(130, 205, 185, 205);

    doc.save(`Facture_${patient.nom}_${consultation.id}.pdf`);
  },

  // Ordonnance Médicale Officielle (A5)
  generateOrdonnance: (patient: Patient, consultation: Consultation, medecin = 'Dr. Mensah') => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a5',
    });

    doc.setFillColor(2, 132, 199);
    doc.rect(0, 0, 148, 22, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('CLINIQUE KINGMED', 12, 12);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('Centre Médical & Soins Généraux • Lomé', 12, 17);

    doc.setTextColor(30, 41, 59);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(medecin, 12, 32);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text('Médecin Généraliste • Ordre des Médecins N° 4589', 12, 37);
    doc.text('Tél : +228 90 00 00 00', 12, 41);

    doc.setFontSize(9);
    doc.setTextColor(50, 50, 50);
    doc.text(`Le ${consultation.date}`, 110, 32);

    doc.setDrawColor(2, 132, 199);
    doc.setLineWidth(0.5);
    doc.line(12, 46, 136, 46);

    doc.setFillColor(248, 250, 252);
    doc.roundedRect(12, 52, 124, 18, 2, 2, 'F');
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(`Patient : ${patient.nom} ${patient.prenom}`, 16, 60);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text(`Âge : ${patient.dateNaissance} • Tél : ${patient.telephone}`, 16, 66);

    doc.setTextColor(2, 132, 199);
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text('ORDONNANCE', 54, 82);

    doc.setTextColor(30, 41, 59);
    doc.setFontSize(9.5);
    doc.setFont('helvetica', 'normal');

    const lines = consultation.prescription.split('\n');
    let yPos = 94;
    lines.forEach((line) => {
      doc.setFont('helvetica', 'bold');
      doc.text(`• ${line.trim()}`, 16, yPos);
      yPos += 8;
    });

    if (consultation.notes) {
      yPos += 4;
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.setFont('helvetica', 'italic');
      doc.text(`Recommandations : ${consultation.notes}`, 16, yPos);
    }

    doc.setDrawColor(226, 232, 240);
    doc.line(12, 175, 136, 175);

    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(148, 163, 184);
    doc.text('Ordonnance valable 3 mois sauf mention contraire.', 12, 182);

    doc.setFontSize(9);
    doc.setTextColor(30, 41, 59);
    doc.setFont('helvetica', 'bold');
    doc.text('Signature & Cachet du Praticien :', 85, 182);

    doc.save(`Ordonnance_${patient.nom}_${consultation.id}.pdf`);
  },

  // Ticket de Caisse / Reçu de Vente Pharmacie (Format Ticket 80mm)
  generateTicketPharmacie: (vente: any) => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [80, 160],
    });

    doc.setFont('courier', 'bold');
    doc.setFontSize(13);
    doc.text('PHARMACIE KINGMED', 40, 12, { align: 'center' });
    doc.setFontSize(8);
    doc.setFont('courier', 'normal');
    doc.text('Centre Médical & Officine', 40, 17, { align: 'center' });
    doc.text('Tél : +228 90 00 00 00 • Lomé', 40, 21, { align: 'center' });

    doc.setLineDashPattern([1, 1], 0);
    doc.line(5, 25, 75, 25);

    doc.setFontSize(8);
    doc.text(`Ticket : ${vente.numeroTicket}`, 5, 30);
    doc.text(`Date   : ${vente.date}`, 5, 34);
    doc.text(`Client : ${vente.clientNom}`, 5, 38);
    doc.text(`Vendeur: ${vente.vendeur}`, 5, 42);

    doc.line(5, 45, 75, 45);

    doc.setFont('courier', 'bold');
    doc.text('Désignation', 5, 50);
    doc.text('Qte x PU', 45, 50);
    doc.text('Total', 75, 50, { align: 'right' });

    doc.line(5, 52, 75, 52);
    doc.setFont('courier', 'normal');

    let yPos = 57;
    vente.lignes.forEach((l: any) => {
      doc.text(l.produitNom.substring(0, 18), 5, yPos);
      doc.text(`${l.quantite}x${l.prixUnitaire}`, 45, yPos);
      doc.text(`${l.totalLigne}F`, 75, yPos, { align: 'right' });
      yPos += 5;
    });

    doc.line(5, yPos, 75, yPos);
    yPos += 5;

    doc.setFont('courier', 'bold');
    doc.setFontSize(10);
    doc.text('TOTAL :', 5, yPos);
    doc.text(`${vente.total.toLocaleString()} F`, 75, yPos, { align: 'right' });

    yPos += 5;
    doc.setFontSize(8);
    doc.setFont('courier', 'normal');
    doc.text(`Reçu (${vente.modePaiement}) :`, 5, yPos);
    doc.text(`${(vente.montantRecu || vente.total).toLocaleString()} F`, 75, yPos, { align: 'right' });

    yPos += 4;
    doc.text('Rendu :', 5, yPos);
    doc.text(`${(vente.monnaieRendue || 0).toLocaleString()} F`, 75, yPos, { align: 'right' });

    yPos += 8;
    doc.setLineDashPattern([], 0);
    doc.line(5, yPos, 75, yPos);
    yPos += 5;

    doc.setFontSize(7);
    doc.text('Merci de votre visite et bon rétablissement !', 40, yPos, { align: 'center' });
    yPos += 4;
    doc.text('Médicaments ni repris ni échangés.', 40, yPos, { align: 'center' });

    doc.save(`Ticket_${vente.numeroTicket}.pdf`);
  },
};
