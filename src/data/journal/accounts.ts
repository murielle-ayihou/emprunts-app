/** Comptes utilisés dans l'entraînement au journal, avec les intitulés du cours (TD n°1 et épreuve). */
export const ACCOUNTS: Record<string, string> = {
  '401': 'Fournisseurs',
  '411': 'Clients',
  '4091': 'Fournisseurs - Avances et acomptes versés',
  '4191': 'Clients - Avances et acomptes reçus',
  '44551': 'État - TVA à décaisser',
  '44566': 'TVA sur autres biens et services (déductible)',
  '44571': 'TVA collectée',
  '44584': 'TVA récupérée d’avance',
  '44585': 'TVA déductible lors du paiement',
  '512': 'Banque',
  '5112': 'Chèques à l’encaissement',
  '530': 'Caisse',
  '601': 'Achats de matières premières',
  '602': 'Achats d’autres approvisionnements',
  '6026': 'Emballages',
  '606': 'Achats non stockés de matières et fournitures',
  '607': 'Achats de marchandises',
  '624': 'Transports',
  '627': 'Services bancaires',
  '658': 'Charges diverses de gestion courante',
  '701': 'Ventes de produits finis',
  '707': 'Ventes de marchandises',
  '7082': 'Transport facturé (compte de l’épreuve)',
  '7085': 'Ports et frais accessoires facturés',
  '758': 'Produits divers de gestion courante',
}

/** Comptes avec lesquels on se trompe souvent : servent de pièges dans les choix proposés. */
export const CONFUSERS: Record<string, string[]> = {
  '401': ['411', '4091'],
  '411': ['401', '4191'],
  '4091': ['4191', '401', '44585'],
  '4191': ['4091', '411'],
  '44551': ['44571', '44566'],
  '44566': ['44571', '44585'],
  '44571': ['44566', '44551'],
  '44585': ['44584', '44566'],
  '512': ['5112', '530'],
  '5112': ['512', '530'],
  '601': ['602', '607'],
  '602': ['601', '6026'],
  '6026': ['602', '607'],
  '607': ['601', '707'],
  '624': ['7085', '627'],
  '627': ['624', '658'],
  '658': ['758', '627'],
  '701': ['707', '601'],
  '707': ['701', '607'],
  '7082': ['624', '701'],
  '7085': ['624', '707'],
  '758': ['658', '707'],
}

/** Réserve pour compléter la liste quand les pièges ne suffisent pas. */
export const FILLER = ['401', '411', '44566', '44571', '512', '601', '607', '701', '707', '624', '602', '5112']

export function accountLabel(code: string): string {
  return ACCOUNTS[code] ?? ''
}

/** « 44566 » → « 445 66 », « 4091 » → « 409 1 » : comme dans les corrections. */
export function formatAccount(code: string): string {
  return code.length > 3 ? `${code.slice(0, 3)} ${code.slice(3)}` : code
}
