import React, { useState } from 'react';
import { ProduitPharmacie } from '../types';
import { Package, Plus, Minus, AlertTriangle, History, X } from 'lucide-react';

interface StockPharmacieViewProps {
  stock: ProduitPharmacie[];
  onAddStock: (produitId: string, quantite: number, infirmier: string) => void;
  onRemoveStock: (produitId: string, quantite: number, infirmier: string) => void;
  onAddNewProduct: (product: Omit<ProduitPharmacie, 'id' | 'historique'>) => void;
}

export const StockPharmacieView: React.FC<StockPharmacieViewProps> = ({
  stock,
  onAddStock,
  onRemoveStock,
  onAddNewProduct,
}) => {
  // Modal states
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [retraitModalItem, setRetraitModalItem] = useState<ProduitPharmacie | null>(null);
  const [ajoutModalItem, setAjoutModalItem] = useState<ProduitPharmacie | null>(null);

  // Retrait form
  const [retraitQty, setRetraitQty] = useState<number>(1);
  const [retraitInfirmier, setRetraitInfirmier] = useState<string>('Eric');

  // Ajout form
  const [ajoutQty, setAjoutQty] = useState<number>(5);
  const [ajoutInfirmier, setAjoutInfirmier] = useState<string>('Sam Eric');

  // New product form
  const [newProduct, setNewProduct] = useState({
    nom: '',
    type: 'Medicaments' as 'Medicaments' | 'Consommables' | 'Equipements',
    quantite: 10,
    unite: 'Boite',
    seuilAlerte: 3,
    prixUnitaire: 1000,
  });

  const handleRetraitSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!retraitModalItem) return;
    if (retraitQty <= 0 || retraitQty > retraitModalItem.quantite) {
      alert('Quantité invalide ou stock insuffisant !');
      return;
    }
    onRemoveStock(retraitModalItem.id, Number(retraitQty), retraitInfirmier || 'Infirmier');
    setRetraitModalItem(null);
    setRetraitQty(1);
  };

  const handleAjoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ajoutModalItem) return;
    if (ajoutQty <= 0) {
      alert('Quantité invalide');
      return;
    }
    onAddStock(ajoutModalItem.id, Number(ajoutQty), ajoutInfirmier || 'Responsable');
    setAjoutModalItem(null);
    setAjoutQty(5);
  };

  const handleNewProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.nom) {
      alert('Veuillez spécifier le nom du produit');
      return;
    }
    onAddNewProduct({
      nom: newProduct.nom,
      type: newProduct.type,
      quantite: Number(newProduct.quantite),
      unite: newProduct.unite,
      seuilAlerte: Number(newProduct.seuilAlerte),
      prixUnitaire: Number(newProduct.prixUnitaire) || 1000,
    });
    setIsAddProductModalOpen(false);
    setNewProduct({
      nom: '',
      type: 'Medicaments',
      quantite: 10,
      unite: 'Boite',
      seuilAlerte: 3,
      prixUnitaire: 1000,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Package className="w-6 h-6 text-sky-600" />
          <h2 className="text-2xl font-bold text-slate-800">Stock pharmacie</h2>
        </div>

        <button
          onClick={() => setIsAddProductModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-sm font-medium shadow-sm transition-all"
        >
          <span>Ajouter un médicament/produit</span>
        </button>
      </div>

      {/* Stock Table Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden p-6 space-y-4">
        <h3 className="text-base font-bold text-slate-800">Liste des stocks</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="px-4 py-3">Nom</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Prix Vente</th>
                <th className="px-4 py-3">Quantité</th>
                <th className="px-4 py-3">Unité</th>
                <th className="px-4 py-3">Seuil</th>
                <th className="px-4 py-3 text-center">Retrait</th>
                <th className="px-4 py-3 text-center">Ajout</th>
                <th className="px-4 py-3">Historique</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {stock.map((item) => {
                const isLowStock = item.quantite <= item.seuilAlerte;
                return (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-4 font-semibold text-slate-800 flex items-center gap-2">
                      {item.nom}
                      {isLowStock && (
                        <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-700 text-[10px] font-bold flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> Alerte
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-slate-600">{item.type}</td>
                    <td className="px-4 py-4 font-bold text-emerald-700">
                      {(item.prixUnitaire || 1000).toLocaleString()} F
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`text-sm font-bold ${
                          isLowStock ? 'text-rose-600' : 'text-slate-800'
                        }`}
                      >
                        {item.quantite}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-slate-600">{item.unite}</td>
                    <td className="px-4 py-4 text-slate-600">{item.seuilAlerte}</td>
                    <td className="px-4 py-4 text-center">
                      <button
                        onClick={() => setRetraitModalItem(item)}
                        className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded text-xs font-semibold shadow-sm transition-all"
                      >
                        Retirer
                      </button>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <button
                        onClick={() => setAjoutModalItem(item)}
                        className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-semibold shadow-sm transition-all"
                      >
                        Ajouter
                      </button>
                    </td>
                    <td className="px-4 py-4">
                      <div className="space-y-1">
                        {item.historique && item.historique.length > 0 ? (
                          item.historique.slice(-2).map((h) => (
                            <div key={h.id} className="text-[11px]">
                              <span
                                className={`font-semibold ${
                                  h.quantite < 0 ? 'text-rose-600' : 'text-emerald-600'
                                }`}
                              >
                                {h.quantite > 0 ? `+${h.quantite}` : h.quantite}
                              </span>{' '}
                              <span className="text-slate-500">par {h.infirmier}</span>
                              <div className="text-[10px] text-slate-400">{h.date}</div>
                            </div>
                          ))
                        ) : (
                          <span className="text-slate-400 text-[11px]">Aucun mouvement</span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Retrait de stock */}
      {retraitModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="bg-white px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-sky-700 text-base">Retrait de stock</h3>
              <button
                onClick={() => setRetraitModalItem(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleRetraitSubmit} className="p-6 space-y-4">
              <p className="text-xs text-slate-500">
                Produit : <strong className="text-slate-800">{retraitModalItem.nom}</strong> (Disponible : {retraitModalItem.quantite})
              </p>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Quantité à retirer
                </label>
                <input
                  type="number"
                  min="1"
                  max={retraitModalItem.quantite}
                  required
                  placeholder="Qté"
                  value={retraitQty}
                  onChange={(e) => setRetraitQty(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Infirmier</label>
                <input
                  type="text"
                  required
                  placeholder="Nom de l'infirmier"
                  value={retraitInfirmier}
                  onChange={(e) => setRetraitInfirmier(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRetraitModalItem(null)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold shadow-sm"
                >
                  Valider le retrait
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Ajouter du stock */}
      {ajoutModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="bg-white px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-sky-700 text-base">Ajouter du stock</h3>
              <button
                onClick={() => setAjoutModalItem(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAjoutSubmit} className="p-6 space-y-4">
              <div>
                <span className="text-xs text-slate-500">Produit</span>
                <div className="font-bold text-slate-800 text-sm">{ajoutModalItem.nom}</div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Quantité à ajouter
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={ajoutQty}
                  onChange={(e) => setAjoutQty(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAjoutModalItem(null)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-semibold shadow-sm"
                >
                  Ajouter au stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Ajouter un nouveau produit */}
      {isAddProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="bg-white px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-sky-700 text-base">Ajouter un médicament/produit</h3>
              <button
                onClick={() => setIsAddProductModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleNewProductSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nom*</label>
                <input
                  type="text"
                  required
                  value={newProduct.nom}
                  onChange={(e) => setNewProduct({ ...newProduct, nom: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Type*</label>
                <select
                  value={newProduct.type}
                  onChange={(e) => setNewProduct({ ...newProduct, type: e.target.value as any })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white"
                >
                  <option value="Medicaments">Médicaments</option>
                  <option value="Consommables">Consommables</option>
                  <option value="Equipements">Équipements</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Quantité*
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={newProduct.quantite}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, quantite: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Unité*</label>
                  <input
                    type="text"
                    required
                    placeholder="ex: boîte, flacon, unité"
                    value={newProduct.unite}
                    onChange={(e) => setNewProduct({ ...newProduct, unite: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Prix de Vente (F)*
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={newProduct.prixUnitaire}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, prixUnitaire: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Seuil d'alerte
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={newProduct.seuilAlerte}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, seuilAlerte: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddProductModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-semibold shadow-sm"
                >
                  Ajouter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
