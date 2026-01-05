import { Patient, Appointment, Procedure, TreatmentPlan, Transaction, Doctor, Notification, ClinicSettings, AnalyticsData } from '@/types';

// Моковые данные пациентов (50 пациентов)
export const patients: Patient[] = [
  {
    id: 'p-001',
    firstName: 'Александр',
    lastName: 'Петров',
    middleName: 'Сергеевич',
    birthDate: '1985-03-15',
    phone: '+7 (916) 123-45-67',
    email: 'petrov@example.com',
    address: 'г. Москва, ул. Тверская, д. 10, кв. 5',
    bloodType: 'O(I)',
    allergies: ['Лидокаин'],
    chronicDiseases: ['Гипертония'],
    insuranceNumber: '1234567890123456',
    balance: 0,
    status: 'active',
    lastVisit: '2024-12-20',
    nextAppointment: '2024-12-30',
    assignedDoctor: 'd-001',
    notes: 'Предпочитает лечение в утренние часы',
    createdAt: '2023-01-15T10:00:00Z',
    updatedAt: '2024-12-20T14:30:00Z',
  },
  {
    id: 'p-002',
    firstName: 'Елена',
    lastName: 'Смирнова',
    middleName: 'Ивановна',
    birthDate: '1990-07-22',
    phone: '+7 (917) 234-56-78',
    email: 'smirnova@example.com',
    address: 'г. Москва, ул. Ленина, д. 25',
    bloodType: 'A(II)',
    balance: 15000,
    status: 'active',
    lastVisit: '2024-12-18',
    assignedDoctor: 'd-002',
    createdAt: '2023-03-20T09:00:00Z',
    updatedAt: '2024-12-18T11:20:00Z',
  },
  {
    id: 'p-003',
    firstName: 'Михаил',
    lastName: 'Козлов',
    middleName: 'Александрович',
    birthDate: '1978-11-08',
    phone: '+7 (918) 345-67-89',
    address: 'г. Москва, пр. Мира, д. 100',
    bloodType: 'B(III)',
    allergies: ['Пенициллин'],
    balance: -5000,
    status: 'active',
    lastVisit: '2024-12-10',
    assignedDoctor: 'd-003',
    createdAt: '2022-11-10T15:00:00Z',
    updatedAt: '2024-12-10T16:45:00Z',
  },
  {
    id: 'p-004',
    firstName: 'Анна',
    lastName: 'Новикова',
    middleName: 'Петровна',
    birthDate: '1995-04-30',
    phone: '+7 (919) 456-78-90',
    email: 'novikova@example.com',
    address: 'г. Москва, ул. Садовая, д. 5',
    bloodType: 'AB(IV)',
    balance: 0,
    status: 'active',
    lastVisit: '2024-12-22',
    assignedDoctor: 'd-001',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-12-22T09:15:00Z',
  },
  {
    id: 'p-005',
    firstName: 'Дмитрий',
    lastName: 'Морозов',
    birthDate: '1982-09-12',
    phone: '+7 (920) 567-89-01',
    balance: 25000,
    status: 'active',
    lastVisit: '2024-12-15',
    assignedDoctor: 'd-004',
    createdAt: '2023-06-20T14:00:00Z',
    updatedAt: '2024-12-15T12:00:00Z',
  },
  {
    id: 'p-006',
    firstName: 'Ольга',
    lastName: 'Ковалева',
    middleName: 'Сергеевна',
    birthDate: '1988-12-25',
    phone: '+7 (921) 678-90-12',
    email: 'kovaleva@example.com',
    bloodType: 'O(I)',
    balance: 0,
    status: 'active',
    lastVisit: '2024-12-19',
    assignedDoctor: 'd-002',
    createdAt: '2023-08-10T11:00:00Z',
    updatedAt: '2024-12-19T15:30:00Z',
  },
  {
    id: 'p-007',
    firstName: 'Сергей',
    lastName: 'Лебедев',
    middleName: 'Викторович',
    birthDate: '1975-06-18',
    phone: '+7 (922) 789-01-23',
    address: 'г. Москва, ул. Пушкина, д. 30',
    bloodType: 'A(II)',
    allergies: ['Новокаин'],
    balance: 8000,
    status: 'active',
    lastVisit: '2024-12-08',
    assignedDoctor: 'd-003',
    createdAt: '2022-05-12T09:00:00Z',
    updatedAt: '2024-12-08T10:45:00Z',
  },
  {
    id: 'p-008',
    firstName: 'Мария',
    lastName: 'Попова',
    birthDate: '1992-02-14',
    phone: '+7 (923) 890-12-34',
    email: 'popova@example.com',
    bloodType: 'B(III)',
    balance: 0,
    status: 'active',
    lastVisit: '2024-12-21',
    assignedDoctor: 'd-001',
    createdAt: '2024-03-25T16:00:00Z',
    updatedAt: '2024-12-21T14:20:00Z',
  },
  {
    id: 'p-009',
    firstName: 'Андрей',
    lastName: 'Соколов',
    middleName: 'Петрович',
    birthDate: '1980-08-07',
    phone: '+7 (924) 901-23-45',
    bloodType: 'AB(IV)',
    balance: 12000,
    status: 'inactive',
    lastVisit: '2024-10-15',
    assignedDoctor: 'd-004',
    createdAt: '2023-02-08T10:00:00Z',
    updatedAt: '2024-10-15T11:30:00Z',
  },
  {
    id: 'p-010',
    firstName: 'Екатерина',
    lastName: 'Волкова',
    middleName: 'Алексеевна',
    birthDate: '1998-01-29',
    phone: '+7 (925) 012-34-56',
    email: 'volkova@example.com',
    bloodType: 'O(I)',
    balance: 0,
    status: 'new',
    assignedDoctor: 'd-002',
    createdAt: '2024-12-25T09:00:00Z',
    updatedAt: '2024-12-25T09:00:00Z',
  },
  // Дополнительные пациенты для полного списка
  ...generateAdditionalPatients(40),
];

function generateAdditionalPatients(count: number): Patient[] {
  const names = [
    { first: 'Иван', last: 'Кузнецов' },
    { first: 'Наталья', last: 'Павлова' },
    { first: 'Павел', last: 'Соловьев' },
    { first: 'Татьяна', last: 'Васильева' },
    { first: 'Роман', last: 'Зайцев' },
    { first: 'Людмила', last: 'Полякова' },
    { first: 'Виктор', last: 'Орлов' },
    { first: 'Светлана', last: 'Андреева' },
    { first: 'Константин', last: 'Кузьмин' },
    { first: 'Ирина', last: 'Макарова' },
    { first: 'Николай', last: 'Новиков' },
    { first: 'Алиса', last: 'Морозова' },
    { first: 'Борис', last: 'Петров' },
    { first: 'Галина', last: 'Соколова' },
    { first: 'Денис', last: 'Волков' },
    { first: 'Ева', last: 'Козлов' },
    { first: 'Федор', last: 'Соловьев' },
    { first: 'Вера', last: 'Лебедева' },
    { first: 'Георгий', last: 'Кузнецов' },
    { first: 'Дарья', last: 'Павлова' },
    { first: 'Захар', last: 'Соколов' },
    { first: 'Инна', last: 'Волкова' },
    { first: 'Игорь', last: 'Зайцев' },
    { first: 'Карина', last: 'Попова' },
    { first: 'Кирилл', last: 'Морозов' },
    { first: 'Лидия', last: 'Смирнова' },
    { first: 'Максим', last: 'Новиков' },
    { first: 'Маргарита', last: 'Ковалева' },
    { first: 'Олег', last: 'Поляков' },
    { first: 'Полина', last: 'Андреева' },
    { first: 'Станислав', last: 'Орлов' },
    { first: 'Ульяна', last: 'Макарова' },
    { first: 'Эдуард', last: 'Кузьмин' },
    { first: 'Юлия', last: 'Васильева' },
    { first: 'Ярослав', last: 'Лебедев' },
    { first: 'Арина', last: 'Зайцева' },
    { first: 'Владимир', last: 'Павлов' },
    { first: 'Глафира', last: 'Соколова' },
    { first: 'Даниил', last: 'Новиков' },
  ];

  const bloodTypes = ['O(I)', 'A(II)', 'B(III)', 'AB(IV)'];
  const doctors = ['d-001', 'd-002', 'd-003', 'd-004'];
  const statuses: ('active' | 'inactive')[] = ['active', 'active', 'active', 'inactive'];

  return Array.from({ length: count }, (_, i) => {
    const name = names[i % names.length];
    const birthYear = 1960 + Math.floor(Math.random() * 45);
    const birthMonth = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
    const birthDay = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
    const lastVisitMonth = Math.floor(Math.random() * 6);
    const visitDate = new Date();
    visitDate.setMonth(visitDate.getMonth() - lastVisitMonth);
    
    return {
      id: `p-${String(i + 11).padStart(3, '0')}`,
      firstName: name.first,
      lastName: name.last,
      birthDate: `${birthYear}-${birthMonth}-${birthDay}`,
      phone: `+7 (9${String(Math.floor(Math.random() * 90) + 10).padStart(2, '0')} ${String(Math.floor(Math.random() * 900) + 100).slice(0,3)}-${String(Math.floor(Math.random() * 90) + 10).slice(0,2)}-${String(Math.floor(Math.random() * 90) + 10).slice(0,2)}`,
      bloodType: bloodTypes[Math.floor(Math.random() * bloodTypes.length)],
      balance: Math.floor(Math.random() * 50000) * (Math.random() > 0.3 ? 1 : -1),
      status: statuses[Math.floor(Math.random() * statuses.length)],
      lastVisit: visitDate.toISOString().split('T')[0],
      assignedDoctor: doctors[Math.floor(Math.random() * doctors.length)],
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: visitDate.toISOString(),
    };
  });
}

// Моковые данные процедур (30 процедур)
export const procedures: Procedure[] = [
  { id: 'pr-001', name: 'Консультация стоматолога', category: 'diagnostics', price: 1500, duration: 30, description: 'Первичный осмотр и консультация' },
  { id: 'pr-002', name: 'Панорамный снимок (ОПТГ)', category: 'diagnostics', price: 2000, duration: 15, description: 'Панорамный рентгеновский снимок челюстей' },
  { id: 'pr-003', name: 'Прицельный снимок', category: 'diagnostics', price: 800, duration: 10, description: 'Рентгеновский снимок одного зуба' },
  { id: 'pr-004', name: 'КТ челюстей', category: 'diagnostics', price: 3500, duration: 20, description: 'Компьютерная томография челюстей' },
  { id: 'pr-005', name: 'Лечение кариеса (поверхностный)', category: 'therapeutic', price: 3500, duration: 40, description: 'Пломбирование при поверхностном кариесе' },
  { id: 'pr-006', name: 'Лечение кариеса (средний)', category: 'therapeutic', price: 5000, duration: 50, description: 'Пломбирование при среднем кариесе' },
  { id: 'pr-007', name: 'Лечение кариеса (глубокий)', category: 'therapeutic', price: 7000, duration: 60, description: 'Пломбирование при глубоком кариесе' },
  { id: 'pr-008', name: 'Лечение пульпита (1 канал)', category: 'therapeutic', price: 8000, duration: 90, description: 'Эндодонтическое лечение одного канала' },
  { id: 'pr-009', name: 'Лечение пульпита (2-3 канала)', category: 'therapeutic', price: 12000, duration: 120, description: 'Эндодонтическое лечение нескольких каналов' },
  { id: 'pr-010', name: 'Удаление зуба (простое)', category: 'surgical', price: 4000, duration: 30, description: 'Удаление подвижного зуба' },
  { id: 'pr-011', name: 'Удаление зуба (сложное)', category: 'surgical', price: 8000, duration: 60, description: 'Удаление ретинированного зуба' },
  { id: 'pr-012', name: 'Удаление зуба мудрости', category: 'surgical', price: 12000, duration: 90, description: 'Хирургическое удаление зуба мудрости' },
  { id: 'pr-013', name: 'Имплантация (Nobel)', category: 'implant', price: 45000, duration: 120, description: 'Установка импланта Nobel Biocare' },
  { id: 'pr-014', name: 'Имплантация (Straumann)', category: 'implant', price: 55000, duration: 120, description: 'Установка импланта Straumann' },
  { id: 'pr-015', name: 'Керамическая коронка', category: 'prosthetic', price: 25000, duration: 60, description: 'Изготовление и установка керамической коронки' },
  { id: 'pr-016', name: 'Металлокерамическая коронка', category: 'prosthetic', price: 15000, duration: 60, description: 'Изготовление и установка металлокерамической коронки' },
  { id: 'pr-017', name: 'Циркониевая коронка', category: 'prosthetic', price: 35000, duration: 60, description: 'Изготовление и установка циркониевой коронки' },
  { id: 'pr-018', name: 'Съёмный протез (частичный)', category: 'prosthetic', price: 25000, duration: 90, description: 'Изготовление частичного съёмного протеза' },
  { id: 'pr-019', name: 'Съёмный протез (полный)', category: 'prosthetic', price: 35000, duration: 90, description: 'Изготовление полного съёмного протеза' },
  { id: 'pr-020', name: 'Брекет-система (металл)', category: 'orthodontic', price: 80000, duration: 45, description: 'Установка металлической брекет-системы на одну челюсть' },
  { id: 'pr-021', name: 'Брекет-система (сапфир)', category: 'orthodontic', price: 120000, duration: 45, description: 'Установка сапфировой брекет-системы на одну челюсть' },
  { id: 'pr-022', name: 'Элайнеры (Star Smile)', category: 'orthodontic', price: 150000, duration: 30, description: 'Курс лечения элайнерами Star Smile' },
  { id: 'pr-023', name: 'Отбеливание ZOOM 4', category: 'esthetic', price: 25000, duration: 90, description: 'Профессиональное отбеливание ZOOM 4' },
  { id: 'pr-024', name: 'Отбеливание Opalescence', category: 'esthetic', price: 15000, duration: 60, description: 'Кабинетное отбеливание Opalescence' },
  { id: 'pr-025', name: 'Виниры (1 зуб)', category: 'esthetic', price: 30000, duration: 60, description: 'Изготовление и установка керамического винира' },
  { id: 'pr-026', name: 'Профессиональная чистка', category: 'hygiene', price: 5000, duration: 45, description: 'Ультразвуковая чистка + AirFlow' },
  { id: 'pr-027', name: 'Фторирование (челюсть)', category: 'hygiene', price: 2000, duration: 20, description: 'Глубокое фторирование эмали' },
  { id: 'pr-028', name: 'Реминерализация', category: 'hygiene', price: 1500, duration: 15, description: 'Реминерализация эмали препаратами' },
  { id: 'pr-029', name: 'Герметизация фиссур', category: 'hygiene', price: 2500, duration: 30, description: 'Герметизация фиссур у детей и взрослых' },
  { id: 'pr-030', name: 'Слепок + диагностика', category: 'diagnostics', price: 3000, duration: 30, description: 'Снятие слепков и диагностика' },
];

// Моковые данные врачей
export const doctors: Doctor[] = [
  {
    id: 'd-001',
    firstName: 'Андрей',
    lastName: 'Иванов',
    specialization: 'Терапевт-стоматолог',
    phone: '+7 (901) 111-11-11',
    email: 'ivanov@dentalpro.ru',
    photo: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&h=200&fit=crop',
    status: 'online',
    loadPercent: 75,
    rating: 4.9,
    appointmentsToday: 8,
    experience: 12,
    education: 'МГМУ им. Сеченова, ординатура МГМСУ',
    category: 'Высшая',
  },
  {
    id: 'd-002',
    firstName: 'Мария',
    lastName: 'Петрова',
    specialization: 'Ортодонт',
    phone: '+7 (901) 222-22-22',
    email: 'petrova@dentalpro.ru',
    photo: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=200&h=200&fit=crop',
    status: 'busy',
    loadPercent: 90,
    rating: 4.8,
    appointmentsToday: 10,
    experience: 8,
    education: 'СПбГМУ им. Павлова, специализация по ортодонтии',
    category: 'Первая',
  },
  {
    id: 'd-003',
    firstName: 'Дмитрий',
    lastName: 'Соколов',
    specialization: 'Хирург-имплантолог',
    phone: '+7 (901) 333-33-33',
    email: 'sokolov@dentalpro.ru',
    photo: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&h=200&fit=crop',
    status: 'online',
    loadPercent: 60,
    rating: 4.95,
    appointmentsToday: 5,
    experience: 15,
    education: 'РНИМУ им. Пирогова, магистратура по имплантологии',
    category: 'Высшая',
  },
  {
    id: 'd-004',
    firstName: 'Елена',
    lastName: 'Кузнецова',
    specialization: 'Ортопед',
    phone: '+7 (901) 444-44-44',
    email: 'kuznetsova@dentalpro.ru',
    photo: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&h=200&fit=crop',
    status: 'offline',
    loadPercent: 0,
    rating: 4.7,
    appointmentsToday: 0,
    experience: 10,
    education: 'Казанский ГМУ, специализация по ортопедической стоматологии',
    category: 'Высшая',
  },
];

// Генерация записей на приём (200 записей)
export function generateAppointments(): Appointment[] {
  const appointments: Appointment[] = [];
  const types: Appointment['type'][] = ['consultation', 'treatment', 'procedure', 'surgery', 'checkup', 'cleaning', 'imaging', 'emergency'];
  const statuses: Appointment['status'][] = ['scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show'];
  
  for (let i = 0; i < 200; i++) {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 60) - 30);
    const hour = 8 + Math.floor(Math.random() * 10);
    const minute = Math.random() > 0.5 ? '00' : '30';
    const patientIndex = Math.floor(Math.random() * patients.length);
    const doctorIndex = Math.floor(Math.random() * doctors.length);
    const procedureCount = Math.floor(Math.random() * 3) + 1;
    
    const procedureIds = Array.from({ length: procedureCount }, () => 
      procedures[Math.floor(Math.random() * procedures.length)].id
    );
    
    const totalPrice = procedureIds.reduce((sum, id) => {
      const proc = procedures.find(p => p.id === id);
      return sum + (proc?.price || 0);
    }, 0);

    const status = date > new Date() ? statuses[0] : statuses[Math.floor(Math.random() * statuses.length)];
    
    appointments.push({
      id: `a-${String(i + 1).padStart(4, '0')}`,
      patientId: patients[patientIndex].id,
      patientName: `${patients[patientIndex].lastName} ${patients[patientIndex].firstName} ${patients[patientIndex].middleName || ''}`.trim(),
      doctorId: doctors[doctorIndex].id,
      doctorName: `${doctors[doctorIndex].lastName} ${doctors[doctorIndex].firstName}`,
      date: date.toISOString().split('T')[0],
      time: `${String(hour).padStart(2, '0')}:${minute}`,
      duration: 30 + Math.floor(Math.random() * 90),
      type: types[Math.floor(Math.random() * types.length)],
      status: status,
      procedureIds,
      price: totalPrice,
      isPaid: status === 'completed' && Math.random() > 0.2,
      createdAt: new Date(date.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: date.toISOString(),
    });
  }
  
  return appointments.sort((a, b) => new Date(b.date + ' ' + b.time).getTime() - new Date(a.date + ' ' + a.time).getTime());
}

export const appointments = generateAppointments();

// Генерация финансовых транзакций
export function generateTransactions(): Transaction[] {
  const transactions: Transaction[] = [];
  const categoriesIncome = ['Лечение', 'Консультация', 'Протезирование', 'Имплантация', 'Чистка', 'Отбеливание'];
  const categoriesExpense = ['Аренда', 'Зарплата', 'Материалы', 'Оборудование', 'Налоги', 'Коммуналка', 'Маркетинг'];
  const methods: Transaction['method'][] = ['cash', 'card', 'transfer', 'insurance', 'installment', 'online'];
  
  for (let i = 0; i < 150; i++) {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 90));
    const isIncome = Math.random() > 0.3;
    const category = isIncome 
      ? categoriesIncome[Math.floor(Math.random() * categoriesIncome.length)]
      : categoriesExpense[Math.floor(Math.random() * categoriesExpense.length)];
    
    transactions.push({
      id: `t-${String(i + 1).padStart(5, '0')}`,
      patientId: isIncome ? patients[Math.floor(Math.random() * patients.length)].id : undefined,
      patientName: isIncome ? `${patients[Math.floor(Math.random() * patients.length)].lastName} ${patients[Math.floor(Math.random() * patients.length)].firstName}` : undefined,
      type: isIncome ? 'income' : 'expense',
      category,
      amount: isIncome 
        ? Math.floor(Math.random() * 50000) + 1000
        : Math.floor(Math.random() * 100000) + 5000,
      method: methods[Math.floor(Math.random() * methods.length)],
      description: `${category} ${isIncome ? 'от пациента' : ''}`.trim(),
      date: date.toISOString().split('T')[0],
      createdAt: date.toISOString(),
    });
  }
  
  return transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export const transactions = generateTransactions();

// Генерация планов лечения
export const treatmentPlans: TreatmentPlan[] = [
  {
    id: 'tp-001',
    patientId: 'p-001',
    name: 'Полная санация полости рта',
    description: 'Комплексное лечение кариеса и профессиональная гигиена',
    stages: [
      { id: 's-001', name: 'Диагностика и планирование', procedures: ['pr-001', 'pr-002', 'pr-030'], price: 6500, status: 'completed', order: 1, date: '2024-12-01' },
      { id: 's-002', name: 'Лечение кариеса', procedures: ['pr-005', 'pr-006'], price: 8500, status: 'in_progress', order: 2 },
      { id: 's-003', name: 'Профессиональная чистка', procedures: ['pr-026'], price: 5000, status: 'planned', order: 3 },
    ],
    totalPrice: 20000,
    discount: 2000,
    finalPrice: 18000,
    status: 'active',
    progress: 40,
    startDate: '2024-12-01',
    createdAt: '2024-11-28T10:00:00Z',
    updatedAt: '2024-12-15T14:00:00Z',
  },
  {
    id: 'tp-002',
    patientId: 'p-003',
    name: 'Имплантация и протезирование',
    description: 'Установка 2 имплантов и коронок',
    stages: [
      { id: 's-004', name: 'Удаление зубов', procedures: ['pr-011'], price: 8000, status: 'completed', order: 1, date: '2024-11-15' },
      { id: 's-005', name: 'Имплантация', procedures: ['pr-013', 'pr-013'], price: 90000, status: 'in_progress', order: 2 },
      { id: 's-006', name: 'Протезирование', procedures: ['pr-017', 'pr-017'], price: 70000, status: 'planned', order: 3 },
    ],
    totalPrice: 168000,
    discount: 10000,
    finalPrice: 158000,
    status: 'active',
    progress: 30,
    startDate: '2024-11-15',
    createdAt: '2024-11-10T09:00:00Z',
    updatedAt: '2024-12-10T16:00:00Z',
  },
];

// Генерация уведомлений
export const notifications: Notification[] = [
  {
    id: 'n-001',
    type: 'appointment',
    title: 'Новая запись',
    message: 'Петров А.С. записан на 30 декабря в 10:00',
    read: false,
    priority: 'medium',
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    actionUrl: '/appointments',
  },
  {
    id: 'n-002',
    type: 'payment',
    title: 'Платёж получен',
    message: 'Поступила оплата от Смирновой Е.И. — 15 000 ₽',
    read: false,
    priority: 'low',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    actionUrl: '/finance',
  },
  {
    id: 'n-003',
    type: 'task',
    title: 'Напоминание о звонке',
    message: 'Необходимо связаться с Козловым М.А. о результатах анализов',
    read: true,
    priority: 'high',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'n-004',
    type: 'system',
    title: 'Обновление системы',
    message: 'Доступно новое обновление DENTAL PRO CRM v2.1',
    read: false,
    priority: 'low',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// Настройки клиники
export const clinicSettings: ClinicSettings = {
  name: 'DENTAL PRO',
  address: 'г. Москва, ул. Тверская, д. 1, офис 100',
  phone: '+7 (495) 123-45-67',
  email: 'info@dentalpro.ru',
  inn: '1234567890',
  ogrn: '1234567890123',
  directorName: 'Иванов Иван Иванович',
  workSchedule: [
    { day: 1, isWorking: true, startTime: '08:00', endTime: '20:00', breaks: [{ start: '14:00', end: '14:30' }] },
    { day: 2, isWorking: true, startTime: '08:00', endTime: '20:00', breaks: [{ start: '14:00', end: '14:30' }] },
    { day: 3, isWorking: true, startTime: '08:00', endTime: '20:00', breaks: [{ start: '14:00', end: '14:30' }] },
    { day: 4, isWorking: true, startTime: '08:00', endTime: '20:00', breaks: [{ start: '14:00', end: '14:30' }] },
    { day: 5, isWorking: true, startTime: '08:00', endTime: '20:00', breaks: [{ start: '14:00', end: '14:30' }] },
    { day: 6, isWorking: true, startTime: '09:00', endTime: '18:00' },
    { day: 0, isWorking: false, startTime: '00:00', endTime: '00:00' },
  ],
  appointmentDuration: 30,
  reminderHours: 24,
  theme: 'light',
  currency: 'RUB',
};

// Аналитические данные
export const analyticsData: AnalyticsData = {
  revenue: {
    total: 4580000,
    change: 12.5,
    data: [
      { date: '2024-12-01', value: 145000 },
      { date: '2024-12-02', value: 168000 },
      { date: '2024-12-03', value: 132000 },
      { date: '2024-12-04', value: 189000 },
      { date: '2024-12-05', value: 156000 },
      { date: '2024-12-06', value: 198000 },
      { date: '2024-12-07', value: 167000 },
      { date: '2024-12-08', value: 145000 },
      { date: '2024-12-09', value: 178000 },
      { date: '2024-12-10', value: 192000 },
      { date: '2024-12-11', value: 165000 },
      { date: '2024-12-12', value: 201000 },
      { date: '2024-12-13', value: 213000 },
      { date: '2024-12-14', value: 187000 },
    ],
  },
  patients: {
    total: 1247,
    new: 89,
    returning: 312,
  },
  appointments: {
    total: 456,
    completed: 398,
    cancelled: 42,
    noShow: 16,
  },
  procedures: {
    top: [
      { name: 'Консультация', count: 145, revenue: 217500 },
      { name: 'Лечение кариеса', count: 89, revenue: 445000 },
      { name: 'Чистка', count: 67, revenue: 335000 },
      { name: 'Имплантация', count: 23, revenue: 1035000 },
      { name: 'Коронки', count: 34, revenue: 850000 },
    ],
    byCategory: [
      { category: 'Терапия', count: 234 },
      { category: 'Хирургия', count: 89 },
      { category: 'Ортопедия', count: 67 },
      { category: 'Ортодонтия', count: 34 },
      { category: 'Гигиена', count: 78 },
    ],
  },
  doctors: {
    performance: [
      { name: 'Иванов А.П.', revenue: 1250000, count: 89 },
      { name: 'Петрова М.С.', revenue: 980000, count: 76 },
      { name: 'Соколов Д.В.', revenue: 1420000, count: 65 },
      { name: 'Кузнецова Е.А.', revenue: 890000, count: 71 },
    ],
  },
};
