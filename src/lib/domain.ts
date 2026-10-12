export type TenantId = 'atlas' | 'nord';
export type Student = {
  id: string;
  name: string;
  email: string;
  phone: string;
  plan: string;
  status: 'Ativo' | 'Inadimplente' | 'Inativo';
  since: string;
  visits: number;
  daysLate: number;
  consent: boolean;
};
export type ClassItem = {
  id: string;
  name: string;
  teacher: string;
  time: string;
  duration: number;
  capacity: number;
  occupied: number;
  day: string;
  room: string;
};
export type Booking = {
  classId: string;
  status: 'confirmed' | 'waiting';
};
export type Lead = {
  id: string;
  name: string;
  source: string;
  stage: number;
};
export type TenantState = {
  students: Student[];
  bookings: Booking[];
  leads: Lead[];
  paymentPaid: boolean;
  paidInvoices: string[];
  collections: string[];
  commissionsClosed: boolean;
  sales: number;
  sets: Record<string, {
    weight: number;
    done: boolean;
  }>;
  checkins: {
    name: string;
    allowed: boolean;
    time: string;
  }[];
  onboarding: boolean;
};
export const tenants = {
  atlas: {
    name: 'Atlas Fitness',
    location: 'Unidade Jardins',
    initials: 'AF',
    accent: '#3478F6'
  },
  nord: {
    name: 'Nord Performance',
    location: 'Unidade Pinheiros',
    initials: 'NP',
    accent: '#2270D8'
  }
};
export const classes: ClassItem[] = [{
  id: 'c1',
  name: 'Funcional',
  teacher: 'Camila Rocha',
  time: '07:00',
  duration: 50,
  capacity: 20,
  occupied: 14,
  day: 'Segunda',
  room: 'Arena 01'
}, {
  id: 'c2',
  name: 'Indoor cycling',
  teacher: 'Rafael Costa',
  time: '08:00',
  duration: 45,
  capacity: 16,
  occupied: 16,
  day: 'Segunda',
  room: 'Studio Ride'
}, {
  id: 'c3',
  name: 'Mobilidade',
  teacher: 'Lucas Ferreira',
  time: '09:00',
  duration: 40,
  capacity: 15,
  occupied: 8,
  day: 'Segunda',
  room: 'Studio Flow'
}, {
  id: 'c4',
  name: 'Power training',
  teacher: 'Camila Rocha',
  time: '12:00',
  duration: 50,
  capacity: 20,
  occupied: 17,
  day: 'Segunda',
  room: 'Arena 01'
}, {
  id: 'c5',
  name: 'Boxe',
  teacher: 'Rafael Costa',
  time: '18:00',
  duration: 60,
  capacity: 12,
  occupied: 10,
  day: 'Terça',
  room: 'Arena 02'
}, {
  id: 'c6',
  name: 'Yoga',
  teacher: 'Marina Alves',
  time: '19:00',
  duration: 60,
  capacity: 15,
  occupied: 11,
  day: 'Quarta',
  room: 'Studio Flow'
}, {
  id: 'c7',
  name: 'Funcional',
  teacher: 'Lucas Ferreira',
  time: '07:00',
  duration: 50,
  capacity: 20,
  occupied: 13,
  day: 'Quinta',
  room: 'Arena 01'
}, {
  id: 'c8',
  name: 'Indoor cycling',
  teacher: 'Rafael Costa',
  time: '18:00',
  duration: 45,
  capacity: 16,
  occupied: 12,
  day: 'Sexta',
  room: 'Studio Ride'
}];
export const exercises = [{
  id: 'e1',
  name: 'Supino reto',
  muscle: 'Peito · barra',
  sets: 3,
  reps: '10–12',
  weight: 30
}, {
  id: 'e2',
  name: 'Remada curvada',
  muscle: 'Costas · barra',
  sets: 3,
  reps: '10–12',
  weight: 24
}, {
  id: 'e3',
  name: 'Desenvolvimento',
  muscle: 'Ombros · halteres',
  sets: 3,
  reps: '12',
  weight: 12
}, {
  id: 'e4',
  name: 'Prancha',
  muscle: 'Core · peso corporal',
  sets: 3,
  reps: '40 s',
  weight: 0
}];
export const products = [{
  id: 'p1',
  name: 'Whey protein',
  detail: 'Dose · chocolate',
  price: 12,
  icon: 'bottle'
}, {
  id: 'p2',
  name: 'Água mineral',
  detail: '500 ml',
  price: 5,
  icon: 'bottle'
}, {
  id: 'p3',
  name: 'Camiseta Atlas',
  detail: 'Preta · tamanho M',
  price: 69,
  icon: 'shirt'
}, {
  id: 'p4',
  name: 'Barra proteica',
  detail: 'Cacau · 45 g',
  price: 9,
  icon: 'box'
}];
export function createTenant(id: TenantId): TenantState {
  const names = id === 'atlas' ? ['Mariana Oliveira', 'Pedro Santos', 'Juliana Lima', 'Gabriel Souza', 'Ana Beatriz', 'Lucas Mendes', 'Fernanda Costa', 'Rafael Almeida'] : ['Mariana Oliveira', 'Bruno Reis', 'Carolina Melo', 'Diego Alves', 'Isabela Dias', 'Thiago Silva', 'Letícia Prado', 'André Gomes'];
  return {
    students: names.map((name, i) => ({
      id: id + '-s' + i,
      name,
      email: 'aluno' + i + '@example.com',
      phone: '(11) 90000-000' + i,
      plan: i % 3 === 0 ? 'Performance' : 'Essencial',
      status: [1, 4, 6].includes(i) ? 'Inadimplente' : 'Ativo',
      since: '2026-03-10',
      visits: 8 + i * 2,
      daysLate: i === 1 ? 5 : i === 4 ? 17 : i === 6 ? 34 : 0,
      consent: i !== 6
    })),
    bookings: [],
    leads: [{
      id: 'l1',
      name: 'Beatriz Martins',
      source: 'Instagram',
      stage: 0
    }, {
      id: 'l2',
      name: 'Felipe Andrade',
      source: 'Indicação',
      stage: 0
    }, {
      id: 'l3',
      name: 'Isabela Rocha',
      source: 'Site',
      stage: 1
    }, {
      id: 'l4',
      name: 'João Teixeira',
      source: 'Wellhub · mock',
      stage: 2
    }, {
      id: 'l5',
      name: 'Luiza Pereira',
      source: 'Aula experimental',
      stage: 3
    }],
    paymentPaid: false,
    paidInvoices: names.map((_, i) => id + '-s' + i).filter((_, i) => [2, 3, 5, 7].includes(i)),
    collections: [],
    commissionsClosed: false,
    sales: 0,
    sets: {},
    checkins: [],
    onboarding: false
  };
}
export function reserve(bookings: Booking[], item: ClassItem): Booking[] {
  if (bookings.some(b => b.classId === item.id)) return bookings;
  return [...bookings, {
    classId: item.id,
    status: item.occupied >= item.capacity ? 'waiting' : 'confirmed'
  }];
}
export function promote(bookings: Booking[], id: string): Booking[] {
  return bookings.map(b => b.classId === id ? {
    ...b,
    status: 'confirmed'
  } : b);
}
export function access(student: Student | undefined, offline: boolean) {
  if (offline) return {
    allowed: false,
    title: 'Verificação indisponível',
    reason: 'Modo offline. Procure a recepção para validar seu acesso.'
  };
  if (!student) return {
    allowed: false,
    title: 'Aluno não encontrado',
    reason: 'Confira o identificador e tente novamente.'
  };
  if (student.status !== 'Ativo') return {
    allowed: false,
    title: 'Acesso negado',
    reason: student.status === 'Inadimplente' ? 'Mensalidade em atraso. Procure a recepção para regularizar.' : 'Matrícula inativa. Procure a recepção.'
  };
  return {
    allowed: true,
    title: 'Acesso liberado',
    reason: 'Bom treino, ' + student.name.split(' ')[0] + '!'
  };
}
export const money = (value: number) => new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL'
}).format(value);
export const number = (value: number) => new Intl.NumberFormat('pt-BR').format(value);
export const date = (value: string) => new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC'
}).format(new Date(value + 'T12:00:00Z'));
export const monthlyFee = (student: Pick<Student, 'plan'>) => student.plan === 'Performance' ? 249.9 : 189.9;
export function metrics(state: TenantState) {
  const active = state.students.filter(s => s.status === 'Ativo').length;
  const overdue = state.students.filter(s => s.status === 'Inadimplente');
  const monthlyRevenue = state.students.filter(s => state.paidInvoices.includes(s.id)).reduce((total, s) => total + monthlyFee(s), 0);
  return {
    active,
    overdue: overdue.length,
    debt: overdue.reduce((total, s) => total + monthlyFee(s), 0),
    revenue: monthlyRevenue + state.sales,
    monthlyRevenue,
    visits: state.students.reduce((v, s) => v + s.visits, 0),
    conversion: state.leads.length ? state.leads.filter(l => l.stage === 3).length / state.leads.length * 100 : 0
  };
}
