// ============================================================
//  firestoreService.js — Serviço de dados no Firestore
//  Gerencia coleções: users, entregas
// ============================================================

import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  addDoc,
  serverTimestamp,
  query,
  where,
  orderBy,
} from 'firebase/firestore';
import { db } from './firebaseConfig';

// ─── ESTRUTURA DO FIRESTORE ───────────────────────────────────────────────────
//
//  users/
//    {uid}: { email, name, perfil, createdAt }
//
//  entregas/
//    {id}: { cliente, pedido, status, endereco, eta, motoristUid, createdAt }
//

// ─── Entregas ─────────────────────────────────────────────────────────────────

/**
 * Retorna todas as entregas do dia (ordenadas por eta).
 * Se quiser filtrar por motorista, passe o uid.
 */
export const getEntregas = async (motoristaUid = null) => {
  try {
    let q;
    if (motoristaUid) {
      q = query(
        collection(db, 'entregas'),
        where('motoristaUid', '==', motoristaUid)
      );
    } else {
      q = collection(db, 'entregas');
    }
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (error) {
    console.error('Erro ao buscar entregas:', error);
    return [];
  }
};

/**
 * Atualiza o status de uma entrega no Firestore.
 */
export const confirmarEntregaFirestore = async (id, eta) => {
  try {
    const ref = doc(db, 'entregas', id);
    await updateDoc(ref, {
      status: 'entregue',
      eta,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Erro ao confirmar entrega:', error);
    throw error;
  }
};

/**
 * Seed inicial: popula o Firestore com as entregas mock se estiver vazio.
 * Chame isso uma única vez (ex: na tela de admin ou no primeiro login).
 */
export const seedEntregasIfEmpty = async () => {
  try {
    const snap = await getDocs(collection(db, 'entregas'));
    if (!snap.empty) return; // Já tem dados, não faz nada

    const ENTREGAS_INICIAIS = [
      {
        cliente: 'Supermercado Bom Preço',
        pedido: '#38291',
        status: 'transito',
        endereco: 'Av. Brasil, 1200 - Centro',
        eta: '09:45',
        motoristaUid: null,
      },
      {
        cliente: 'Farmácia Saúde Total',
        pedido: '#38292',
        status: 'pendente',
        endereco: 'Rua das Flores, 340 - Jardim',
        eta: '10:30',
        motoristaUid: null,
      },
      {
        cliente: 'Padaria Pão de Ouro',
        pedido: '#38293',
        status: 'entregue',
        endereco: 'Rua 7 de Setembro, 88 - Centro',
        eta: '08:15',
        motoristaUid: null,
      },
      {
        cliente: 'Atacado Distribuidora Sul',
        pedido: '#38294',
        status: 'pendente',
        endereco: 'Rod. BR-116, Km 12 - Industrial',
        eta: '11:00',
        motoristaUid: null,
      },
      {
        cliente: 'Loja Elétrica Brilha Mais',
        pedido: '#38295',
        status: 'transito',
        endereco: 'Av. Independência, 560 - Bairro Novo',
        eta: '11:45',
        motoristaUid: null,
      },
      {
        cliente: 'Pet Shop Amigo Fiel',
        pedido: '#38296',
        status: 'entregue',
        endereco: 'Rua das Palmeiras, 200 - Vila Verde',
        eta: '07:50',
        motoristaUid: null,
      },
    ];

    const promises = ENTREGAS_INICIAIS.map((e) =>
      addDoc(collection(db, 'entregas'), { ...e, createdAt: serverTimestamp() })
    );
    await Promise.all(promises);
    console.log('✅ Entregas iniciais criadas no Firestore');
  } catch (error) {
    console.error('Erro ao fazer seed de entregas:', error);
  }
};

// ─── Usuários ─────────────────────────────────────────────────────────────────

export const getAllUsersFromFirestore = async () => {
  try {
    const snap = await getDocs(collection(db, 'users'));
    return snap.docs.map((d) => ({ uid: d.id, ...d.data() }));
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    return [];
  }
};
