'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Activity,
  Plus,
  Clock,
  CheckCircle,
  AlertCircle,
  Calendar,
  FileText,
  ChevronRight,
  Sparkles,
  Loader2,
} from 'lucide-react';
import Sidebar from '@/components/layouts/Sidebar';
import Header from '@/components/layouts/Header';
import { Card, CardHeader, MetricCard } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge, StatusBadge } from '@/components/ui/Badge';
import { Tabs } from '@/components/ui/Tabs';
import { Modal } from '@/components/ui/Modal';
import ToothFormula from '@/components/patients/ToothFormula';
import { ProgressBar } from '@/components/charts/DonutChart';
import { cn, formatCurrency, formatDate } from '@/lib/utils';
import { treatmentPlans, patients, procedures } from '@/data/mockData';
import { TreatmentPlan } from '@/types';
import { sendMessage } from '@/lib/ai';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export default function TreatmentsPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('active');
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<TreatmentPlan | null>(null);

  // Документы
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [documentContent, setDocumentContent] = useState('');

  // AI рекомендации
  const [showAIModal, setShowAIModal] = useState(false);
  const [aiRecommendation, setAiRecommendation] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  const activePlans = treatmentPlans.filter((p) => p.status === 'active');
  const completedPlans = treatmentPlans.filter((p) => p.status === 'completed');

  const getPatientName = (patientId: string) => {
    const patient = patients.find((p) => p.id === patientId);
    return patient ? `${patient.lastName} ${patient.firstName}` : 'Unknown';
  };

  const getProcedureNames = (ids: string[]) => {
    return ids.map((id) => {
      const proc = procedures.find((p) => p.id === id);
      return proc?.name || 'Процедура';
    });
  };

  // Функция получения AI рекомендаций
  const getAIRecommendations = async () => {
    setShowAIModal(true);
    setAiLoading(true);
    setAiRecommendation('');

    try {
      const prompt = `Проанализируй текущие планы лечения клиники:
- Активных планов: ${activePlans.length}
- Завершённых: ${completedPlans.length}
- Общая стоимость активных планов: ${formatCurrency(activePlans.reduce((sum, p) => sum + p.finalPrice, 0))}

Дай 3-5 конкретных рекомендаций по улучшению работы с планами лечения: как увеличить конверсию, как ускорить завершение планов, как повысить средний чек.`;

      const response = await sendMessage([{ role: 'user', content: prompt }]);
      setAiRecommendation(response);
    } catch (error) {
      setAiRecommendation('Ошибка получения рекомендаций. Попробуйте позже.');
    } finally {
      setAiLoading(false);
    }
  };

  // Функция генерации договора
  const generateContract = () => {
    if (!selectedPlan) return;

    const patientName = getPatientName(selectedPlan.patientId);
    const today = new Date().toLocaleDateString('ru-RU');
    const procedures = selectedPlan.stages.map(s => s.name).join(', ');

    const contractText = `ДОГОВОР НА ОКАЗАНИЕ МЕДИЦИНСКИХ УСЛУГ № ${selectedPlan.id.toUpperCase()}

г. Москва                                                             ${today}

DENTAL PRO (Исполнитель) в лице директора Иванова И.И., действующего на основании Устава,
и ${patientName} (Пациент), именуемые в дальнейшем "Стороны", заключили настоящий договор:

1. ПРЕДМЕТ ДОГОВОРА

1.1. Исполнитель обязуется оказать Пациенту следующие медицинские услуги:
    - ${selectedPlan.name}
    - Процедуры: ${procedures}

2. СТОИМОСТЬ УСЛУГ

2.1. Общая стоимость услуг: ${formatCurrency(selectedPlan.totalPrice)}
2.2. Скидка: ${formatCurrency(selectedPlan.discount)}
2.3. Итого к оплате: ${formatCurrency(selectedPlan.finalPrice)}

3. ПОРЯДОК ОПЛАТЫ

3.1. Оплата производится в рублях РФ.
3.2. Возможна оплата наличными, банковской картой, безналичным переводом.

4. ПРАВА И ОБЯЗАННОСТИ СТОРОН

4.1. Исполнитель обязуется:
    - Оказать услуги надлежащего качества
    - Соблюдать медицинские стандарты
    - Информировать Пациента о ходе лечения

4.2. Пациент обязуется:
    - Своевременно оплачивать услуги
    - Соблюдать рекомендации врача
    - Сообщать об изменениях состояния здоровья

5. СРОК ДЕЙСТВИЯ

5.1. Договор действует с момента подписания до полного исполнения обязательств.

ПОДПИСИ СТОРОН:

Исполнитель: ___________________ / Иванов И.И. /

Пациент: ___________________ / ${patientName} /
`;

    setDocumentContent(contractText);
    setShowDocumentModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />

      <div
        className={cn(
          'transition-all duration-300',
          sidebarCollapsed ? 'ml-18' : 'ml-[260px]'
        )}
      >
        <Header sidebarCollapsed={sidebarCollapsed} />

        <main className="p-6">
          <motion.div
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3 }}
          >
            {/* Page Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Планы лечения</h1>
                <p className="text-gray-500 mt-1">
                  Активных планов: {activePlans.length}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" leftIcon={<Sparkles className="w-4 h-4" />} onClick={getAIRecommendations}>
                  AI-рекомендации
                </Button>
                <Button variant="secondary" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setShowPlanModal(true)}>
                  Новый план
                </Button>
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <MetricCard
                title="Активных планов"
                value={activePlans.length}
                icon={<Activity className="w-5 h-5" />}
              />
              <MetricCard
                title="Завершённых"
                value={completedPlans.length}
                icon={<CheckCircle className="w-5 h-5" />}
              />
              <MetricCard
                title="В процессе"
                value="3"
                icon={<Clock className="w-5 h-5" />}
              />
              <MetricCard
                title="Требует внимания"
                value="2"
                icon={<AlertCircle className="w-5 h-5" />}
              />
            </div>

            {/* Tabs */}
            <div className="mb-6">
              <Tabs
                tabs={[
                  { id: 'active', label: 'Активные', count: activePlans.length },
                  { id: 'completed', label: 'Завершённые', count: completedPlans.length },
                  { id: 'all', label: 'Все', count: treatmentPlans.length },
                ]}
                activeTab={activeTab}
                onChange={setActiveTab}
              />
            </div>

            {/* Treatment Plans List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {treatmentPlans.map((plan, index) => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card
                    hover
                    padding="lg"
                    onClick={() => {
                      setSelectedPlan(plan);
                      setShowPlanModal(true);
                    }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {plan.name}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          Пациент: {getPatientName(plan.patientId)}
                        </p>
                      </div>
                      <StatusBadge status={plan.status} />
                    </div>

                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {plan.description}
                    </p>

                    {/* Progress */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-gray-500">Прогресс</span>
                        <span className="font-medium text-gray-900">{plan.progress}%</span>
                      </div>
                      <ProgressBar
                        value={plan.progress}
                        color={plan.progress === 100 ? '#10B981' : '#00D4AA'}
                      />
                    </div>

                    {/* Stages */}
                    <div className="space-y-2 mb-4">
                      {plan.stages.map((stage, stageIndex) => (
                        <div
                          key={stage.id}
                          className={cn(
                            'flex items-center gap-2 p-2 rounded-lg text-sm',
                            stage.status === 'completed' && 'bg-emerald-50 text-emerald-700',
                            stage.status === 'in_progress' && 'bg-amber-50 text-amber-700',
                            stage.status === 'planned' && 'bg-gray-50 text-gray-600'
                          )}
                        >
                          {stage.status === 'completed' ? (
                            <CheckCircle className="w-4 h-4 text-emerald-500" />
                          ) : stage.status === 'in_progress' ? (
                            <Clock className="w-4 h-4 text-amber-500" />
                          ) : (
                            <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
                          )}
                          <span className="flex-1">{stage.name}</span>
                          <span className="text-xs opacity-75">
                            {formatCurrency(stage.price)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="text-sm text-gray-500">
                        <span>Начало: {formatDate(plan.startDate)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                        <span>Итого: {formatCurrency(plan.finalPrice)}</span>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </main>
      </div>

      {/* Treatment Plan Modal */}
      <Modal
        isOpen={showPlanModal}
        onClose={() => {
          setShowPlanModal(false);
          setSelectedPlan(null);
        }}
        title={selectedPlan ? selectedPlan.name : 'Новый план лечения'}
        size="xl"
      >
        <div className="p-6">
          {selectedPlan && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Patient Info */}
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-3">
                  Информация о пациенте
                </h4>
                <Card variant="bordered" padding="md">
                  <p className="font-medium text-gray-900">
                    {getPatientName(selectedPlan.patientId)}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    План лечения: {selectedPlan.name}
                  </p>
                </Card>

                <h4 className="text-sm font-medium text-gray-500 mb-3 mt-6">
                  Зубная формула
                </h4>
                <ToothFormula
                  selectedTeeth={['ur-3', 'ul-4', 'll-6']}
                  onToothClick={(tooth) => console.log('Clicked tooth:', tooth)}
                />
              </div>

              {/* Plan Details */}
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-3">
                  Этапы лечения
                </h4>
                <div className="space-y-3">
                  {selectedPlan.stages.map((stage, index) => (
                    <Card
                      key={stage.id}
                      variant="bordered"
                      padding="md"
                      className={cn(
                        stage.status === 'completed' && 'border-emerald-200 bg-emerald-50',
                        stage.status === 'in_progress' && 'border-amber-200 bg-amber-50'
                      )}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div
                            className={cn(
                              'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium',
                              stage.status === 'completed' && 'bg-emerald-500 text-white',
                              stage.status === 'in_progress' && 'bg-amber-500 text-white',
                              stage.status === 'planned' && 'bg-gray-200 text-gray-600'
                            )}
                          >
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{stage.name}</p>
                            <p className="text-sm text-gray-500 mt-1">
                              {getProcedureNames(stage.procedures).join(', ')}
                            </p>
                          </div>
                        </div>
                        <StatusBadge status={stage.status} />
                      </div>
                      <div className="mt-3 flex items-center justify-between text-sm">
                        <span className="text-gray-500">
                          {stage.date ? formatDate(stage.date) : 'Запланировано'}
                        </span>
                        <span className="font-medium text-gray-900">
                          {formatCurrency(stage.price)}
                        </span>
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Summary */}
                <Card variant="bordered" padding="md" className="mt-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Стоимость</span>
                      <span>{formatCurrency(selectedPlan.totalPrice)}</span>
                    </div>
                    {selectedPlan.discount > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Скидка</span>
                        <span className="text-emerald-600">-{formatCurrency(selectedPlan.discount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-semibold text-lg pt-2 border-t border-gray-100">
                      <span>Итого</span>
                      <span>{formatCurrency(selectedPlan.finalPrice)}</span>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          )}

          {!selectedPlan && (
            <div className="text-center py-8">
              <p className="text-gray-500">Выберите план лечения или создайте новый</p>
            </div>
          )}

          <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
            <Button variant="secondary" leftIcon={<FileText className="w-4 h-4" />} onClick={generateContract} disabled={!selectedPlan}>
              Создать договор
            </Button>
            <Button variant="outline" leftIcon={<Calendar className="w-4 h-4" />}>
              Записать на приём
            </Button>
          </div>
        </div>
      </Modal>

      {/* AI Recommendations Modal */}
      <Modal
        isOpen={showAIModal}
        onClose={() => setShowAIModal(false)}
        title="AI-рекомендации по планам лечения"
        size="lg"
      >
        <div className="p-6">
          {aiLoading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-10 h-10 text-secondary animate-spin mb-4" />
              <p className="text-gray-500">Анализирую данные клиники...</p>
            </div>
          ) : (
            <div className="prose max-w-none">
              <div className="p-4 bg-gradient-to-r from-secondary/10 to-primary/10 rounded-xl border border-secondary/20">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-5 h-5 text-secondary" />
                  <span className="font-semibold text-gray-900">Рекомендации AI</span>
                </div>
                <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {aiRecommendation}
                </div>
              </div>
            </div>
          )}
          <div className="flex justify-end mt-6">
            <Button variant="outline" onClick={() => setShowAIModal(false)}>
              Закрыть
            </Button>
          </div>
        </div>
      </Modal>

      {/* Document Preview Modal */}
      <Modal
        isOpen={showDocumentModal}
        onClose={() => setShowDocumentModal(false)}
        title="Предпросмотр договора"
        size="xl"
      >
        <div className="p-6">
          <div className="bg-white border border-gray-200 rounded-lg p-8 font-mono text-sm whitespace-pre-wrap max-h-[60vh] overflow-y-auto">
            {documentContent}
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={() => setShowDocumentModal(false)}>
              Закрыть
            </Button>
            <Button
              variant="secondary"
              leftIcon={<FileText className="w-4 h-4" />}
              onClick={() => {
                const printWindow = window.open('', '_blank');
                if (printWindow) {
                  printWindow.document.write(`<pre style="font-family: monospace; white-space: pre-wrap; padding: 40px;">${documentContent}</pre>`);
                  printWindow.document.close();
                  printWindow.print();
                }
              }}
            >
              Печать
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
