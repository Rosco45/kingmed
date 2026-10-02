import React, { useState } from 'react';
import { ProduitPharmacie, Patient, VentePharmacie, LigneVente } from '../types';
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  Receipt,
  User,
  Search,
  CheckCircle2,
  Printer,
  History,
  Coins,
  PackageCheck,
  AlertCircle
} from 'lucide-react';
import { pdfService } from '../services/pdfService';

interface VentePharmacieViewProps {
  stock: ProduitPharmacie[];
  patients: Patient[];
  ventes: VentePharmacie[];
  onValidateSale: (vente: Omit<VentePharmacie, 'id' | 'createdAt'>) => void;
  currentSellerName: string;
}

export const VentePharmacieView: React.FC<VentePharmacieViewProps> = ({
  stock,
  patients,
  ventes,
  onValidateSale,
  currentSellerName,
}) => {
  const [activeTab, setActiveTab] = useState<'caisse' | 'historique'>('caisse');

  // Customer State
  const [clientType, setClientType] = useState<'Lambda' | 'Patient'>('Lambda');
  const [nomClientLambda, setNomClientLambda] = useState('Client Comptoir');
  const [selectedPatientId, setSelectedPatientId] = useState<string>(patients[0]?.id || '');

  // Catalog search
  const [searchProduct, setSearchProduct] = useState('');

  // Cart State
  const [panier, setPanier] = useState<LigneVente[]>([]);
  const [montantRecu, setMontantRecu] = useState<number>(0);
  const [modePaiement, setModePaiement] = useState<'Espèces' | 'Mobile Money' | 'Carte Bancaire'>('Espèces');

  // Add to cart
  const handleAddToCart = (produit: ProduitPharmacie) => {
    if (produit.quantite <= 0) {
      alert('Ce produit est en rupture de stock !');
      return;
    }

    const existant = panier.find((l) => l.produitId === produit.id);
    if (existant) {
      if (existant.quantite >= produit.quantite) {
        alert(`Stock maximum disponible atteint (${produit.quantite} ${produit.unite})`);
        return;
      }
      setPanier(
        panier.map((l) =>
          l.produitId === produit.id
            ? {
                ...l,
                quantite: l.quantite + 1,
                totalLigne: (l.quantite + 1) * l.prixUnitaire,
              }
            : l
        )
      );
    } else {
      const newLine: LigneVente = {
        produitId: produit.id,
        produitNom: produit.nom,
        quantite: 1,
        prixUnitaire: produit.prixUnitaire || 1000,
        totalLigne: produit.prixUnitaire || 1000,
      };
      setPanier([...panier, newLine]);
    }
  };

  const handleUpdateQty = (produitId: string, delta: number) => {
    const prod = stock.find((s) => s.id === produitId);
    if (!prod) return;

    setPanier(
      panier
        .map((l) => {
          if (l.produitId === produitId) {
            const newQty = l.quantite + delta;
            if (newQty > prod.quantite) {
              alert(`Stock disponible insuffisant (${prod.quantite})`);
              return l;
            }
            if (newQty <= 0) return null;
            return {
              ...l,
              quantite: newQty,
              totalLigne: newQty * l.prixUnitaire,
            };
          }
          return l;
        })
        .filter(Boolean) as LigneVente[]
    );
  };

  const handleRemoveLine = (produitId: string) => {
    setPanier(panier.filter((l) => l.produitId !== produitId));
  };

  const totalPanier = panier.reduce((acc, l) => acc + l.totalLigne, 0);
  const monnaieRendue = Math.max(0, (montantRecu || totalPanier) - totalPanier);

  // Validate sale
  const handleFinalizeSale = (e: React.FormEvent) => {
    e.preventDefault();
    if (panier.length === 0) {
      alert('Veuillez ajouter au moins un produit au panier.');
      return;
    }

    let clientNom = '';
    let patientId: string | undefined = undefined;

    if (clientType === 'Patient') {
      const p = patients.find((pat) => pat.id === selectedPatientId);
      clientNom = p ? `${p.nom} ${p.prenom} (Patient)` : 'Patient';
      patientId = p?.id;
    } else {
      clientNom = nomClientLambda.trim() || 'Client de passage';
    }

    const nouvelleVente: Omit<VentePharmacie, 'id' | 'createdAt'> = {
      numeroTicket: `TKT-${Date.now().toString().slice(-6)}`,
      date: new Date().toLocaleString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      typeClient: clientType === 'Patient' ? 'Patient' : 'Lambda / Comptoir',
      clientNom,
      patientId,
      lignes: [...panier],
      total: totalPanier,
      montantRecu: montantRecu || totalPanier,
      monnaieRendue,
      modePaiement,
      vendeur: currentSellerName,
    };

    onValidateSale(nouvelleVente);

    // Auto generate receipt
    pdfService.generateTicketPharmacie(nouvelleVente);

    // Reset cart
    setPanier([]);
    setMontantRecu(0);
    alert('Vente enregistrée avec succès ! Le ticket de caisse a été généré.');
  };

  // Filter products for catalog
  const filteredProducts = stock.filter((s) =>
    s.nom.toLowerCase().includes(searchProduct.toLowerCase()) ||
    s.type.toLowerCase().includes(searchProduct.toLowerCase())
  );

  const totalRecettesJour = ventes.reduce((acc, v) => acc + v.total, 0);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <ShoppingCart className="w-6 h-6 text-sky-600" />
            <span>Ventes Pharmacie (Comptoir)</span>
          </h2>
          <p className="text-sm text-slate-500">
            Délivrance et vente directe aux patients de la clinique et aux personnes de passage
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-2 bg-slate-200 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setActiveTab('caisse')}
            className={`px-4 py-2 rounded-lg transition-all ${
              activeTab === 'caisse'
                ? 'bg-white text-sky-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            Point de Vente (Caisse)
          </button>
          <button
            onClick={() => setActiveTab('historique')}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
              activeTab === 'historique'
                ? 'bg-white text-sky-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-800'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Journal des Ventes ({ventes.length})</span>
          </button>
        </div>
      </div>

      {activeTab === 'caisse' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Left Column: Client & Product Catalog (2 Cols) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Type Selector */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Type de Client
                </span>
                <span className="text-xs text-sky-600 font-medium">
                  Vendeur en service : <strong>{currentSellerName}</strong>
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setClientType('Lambda')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    clientType === 'Lambda'
                      ? 'border-sky-500 bg-sky-50/70 text-sky-900 font-bold ring-2 ring-sky-200'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="text-sm">Client de passage (Lambda)</div>
                  <div className="text-xs text-slate-500 font-normal mt-0.5">
                    Achat comptoir sans dossier médical
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setClientType('Patient')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    clientType === 'Patient'
                      ? 'border-sky-500 bg-sky-50/70 text-sky-900 font-bold ring-2 ring-sky-200'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="text-sm">Patient Enregistré</div>
                  <div className="text-xs text-slate-500 font-normal mt-0.5">
                    Lier l'achat au carnet du patient
                  </div>
                </button>
              </div>

              {/* Dynamic Input depending on Client Type */}
              {clientType === 'Lambda' ? (
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Nom du client de passage (optionnel)
                  </label>
                  <input
                    type="text"
                    value={nomClientLambda}
                    onChange={(e) => setNomClientLambda(e.target.value)}
                    placeholder="Ex: M. Jean, Mme Amina, ou Client Comptoir"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 focus:bg-white focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Sélectionner le patient
                  </label>
                  <select
                    value={selectedPatientId}
                    onChange={(e) => setSelectedPatientId(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50 font-medium text-slate-800 focus:ring-2 focus:ring-sky-500"
                  >
                    {patients.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.nom} {p.prenom} ({p.telephone})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Products Catalog */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Médicaments & Produits Disponibles
                </span>
                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Rechercher médicament..."
                    value={searchProduct}
                    onChange={(e) => setSearchProduct(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              {/* Grid of Products */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {filteredProducts.map((p) => {
                  const isLow = p.quantite <= p.seuilAlerte;
                  const isOutOfStock = p.quantite <= 0;

                  return (
                    <div
                      key={p.id}
                      onClick={() => !isOutOfStock && handleAddToCart(p)}
                      className={`p-3 rounded-xl border transition-all flex flex-col justify-between ${
                        isOutOfStock
                          ? 'border-slate-200 bg-slate-100 opacity-60 cursor-not-allowed'
                          : 'border-slate-200 hover:border-sky-500 hover:shadow-md bg-white cursor-pointer group'
                      }`}
                    >
                      <div>
                        <div className="flex items-start justify-between gap-1">
                          <h4 className="font-bold text-slate-800 text-sm group-hover:text-sky-600 transition-colors">
                            {p.nom}
                          </h4>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                            {p.type}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 mt-1">
                          Stock :{' '}
                          <strong
                            className={isLow ? 'text-rose-600' : 'text-slate-700'}
                          >
                            {p.quantite} {p.unite}
                          </strong>
                        </div>
                      </div>

                      <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-sm font-extrabold text-emerald-700">
                          {(p.prixUnitaire || 1000).toLocaleString()} F
                        </span>
                        <button
                          disabled={isOutOfStock}
                          className="p-1.5 rounded-lg bg-sky-50 text-sky-600 group-hover:bg-sky-600 group-hover:text-white transition-all text-xs font-bold flex items-center gap-1"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Ajouter</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Active Cart & Checkout (1 Col) */}
          <div className="lg:col-span-1 bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-5 sticky top-20">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
                <Receipt className="w-5 h-5 text-sky-600" />
                <span>Ticket de Caisse</span>
              </h3>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800">
                {panier.length} article(s)
              </span>
            </div>

            {/* Cart Items */}
            {panier.length === 0 ? (
              <div className="text-center py-10 text-slate-400 space-y-2">
                <ShoppingCart className="w-10 h-10 mx-auto text-slate-300" />
                <p className="text-xs">Le panier est vide.</p>
                <p className="text-[11px] text-slate-400">
                  Cliquez sur un médicament à gauche pour l'ajouter.
                </p>
              </div>
            ) : (
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {panier.map((line) => (
                  <div
                    key={line.produitId}
                    className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between font-bold text-slate-800">
                      <span>{line.produitNom}</span>
                      <span>{line.totalLigne.toLocaleString()} F</span>
                    </div>

                    <div className="flex items-center justify-between text-slate-500">
                      <span>PU : {line.prixUnitaire.toLocaleString()} F</span>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleUpdateQty(line.produitId, -1)}
                          className="w-5 h-5 rounded bg-white border border-slate-300 flex items-center justify-center hover:bg-slate-100"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-bold text-slate-800 text-xs w-5 text-center">
                          {line.quantite}
                        </span>
                        <button
                          onClick={() => handleUpdateQty(line.produitId, 1)}
                          className="w-5 h-5 rounded bg-white border border-slate-300 flex items-center justify-center hover:bg-slate-100"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleRemoveLine(line.produitId)}
                          className="text-rose-500 hover:text-rose-700 ml-1 p-0.5"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Totals & Payment Section */}
            {panier.length > 0 && (
              <form onSubmit={handleFinalizeSale} className="space-y-4 pt-3 border-t border-slate-100">
                {/* Total */}
                <div className="flex items-center justify-between text-base font-extrabold text-slate-800 bg-sky-50 p-3 rounded-lg border border-sky-200">
                  <span>NET À PAYER :</span>
                  <span className="text-xl text-sky-700">{totalPanier.toLocaleString()} F</span>
                </div>

                {/* Mode de règlement */}
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Mode de règlement
                  </label>
                  <select
                    value={modePaiement}
                    onChange={(e) => setModePaiement(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white font-medium"
                  >
                    <option value="Espèces">Espèces</option>
                    <option value="Mobile Money">Mobile Money (T-Money / Flooz)</option>
                    <option value="Carte Bancaire">Carte Bancaire</option>
                  </select>
                </div>

                {/* Montant remis & Monnaie */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Montant reçu (F)
                    </label>
                    <input
                      type="number"
                      min={totalPanier}
                      placeholder={totalPanier.toString()}
                      value={montantRecu || ''}
                      onChange={(e) => setMontantRecu(Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 border border-slate-200 rounded text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Monnaie rendue
                    </label>
                    <div className="px-2.5 py-1.5 bg-emerald-50 border border-emerald-200 rounded text-xs font-bold text-emerald-700">
                      {monnaieRendue.toLocaleString()} F
                    </div>
                  </div>
                </div>

                {/* Action button */}
                <button
                  type="submit"
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Printer className="w-4 h-4" />
                  <span>Valider & Imprimer Ticket</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Tab: Historique des ventes */}
      {activeTab === 'historique' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-bold text-slate-800">
                Journal des Ventes de Pharmacie
              </h3>
              <p className="text-xs text-slate-500">Historique de tous les encaissements comptoir</p>
            </div>
            <div className="text-right bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-lg">
              <span className="text-xs text-emerald-700 font-medium">Recettes Totales : </span>
              <strong className="text-base text-emerald-800">
                {totalRecettesJour.toLocaleString()} F
              </strong>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="px-4 py-3">N° Ticket</th>
                  <th className="px-4 py-3">Date & Heure</th>
                  <th className="px-4 py-3">Client</th>
                  <th className="px-4 py-3">Articles vendus</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Règlement</th>
                  <th className="px-4 py-3">Caissier</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {ventes.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-8 text-slate-400">
                      Aucune vente enregistrée pour le moment.
                    </td>
                  </tr>
                ) : (
                  ventes.map((v) => (
                    <tr key={v.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-bold text-sky-700">{v.numeroTicket}</td>
                      <td className="px-4 py-3 text-slate-600 whitespace-nowrap">{v.date}</td>
                      <td className="px-4 py-3">
                        <div className="font-semibold text-slate-800">{v.clientNom}</div>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                          {v.typeClient}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-600 max-w-xs">
                        {v.lignes.map((l) => `${l.produitNom} (x${l.quantite})`).join(', ')}
                      </td>
                      <td className="px-4 py-3 font-bold text-slate-800">
                        {v.total.toLocaleString()} F
                      </td>
                      <td className="px-4 py-3 text-slate-600">{v.modePaiement}</td>
                      <td className="px-4 py-3 text-slate-500">{v.vendeur}</td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => pdfService.generateTicketPharmacie(v)}
                          title="Réimprimer le ticket"
                          className="px-2.5 py-1 bg-sky-50 text-sky-600 hover:bg-sky-100 rounded font-semibold text-xs inline-flex items-center gap-1"
                        >
                          <Printer className="w-3 h-3" />
                          <span>Ticket</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
