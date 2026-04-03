export type Entrega = {
  id: string;
  cliente: string;
  pedido: string;
  status: 'transito' | 'pendente' | 'entregue';
  endereco: string;
  eta: string;
};

export const ENTREGAS_MOCK: Entrega[] = [
  {
    id: '1',
    cliente: 'Supermercado Bom Preço',
    pedido: '#38291',
    status: 'transito',
    endereco: 'Av. Brasil, 1200 - Centro',
    eta: '09:45',
  },
  {
    id: '2',
    cliente: 'Farmácia Saúde Total',
    pedido: '#38292',
    status: 'pendente',
    endereco: 'Rua das Flores, 340 - Jardim',
    eta: '10:30',
  },
  {
    id: '3',
    cliente: 'Padaria Pão de Ouro',
    pedido: '#38293',
    status: 'entregue',
    endereco: 'Rua 7 de Setembro, 88 - Centro',
    eta: '08:15',
  },
  {
    id: '4',
    cliente: 'Atacado Distribuidora Sul',
    pedido: '#38294',
    status: 'pendente',
    endereco: 'Rod. BR-116, Km 12 - Industrial',
    eta: '11:00',
  },
  {
    id: '5',
    cliente: 'Loja Elétrica Brilha Mais',
    pedido: '#38295',
    status: 'transito',
    endereco: 'Av. Independência, 560 - Bairro Novo',
    eta: '11:45',
  },
  {
    id: '6',
    cliente: 'Pet Shop Amigo Fiel',
    pedido: '#38296',
    status: 'entregue',
    endereco: 'Rua das Palmeiras, 200 - Vila Verde',
    eta: '07:50',
  },
];
