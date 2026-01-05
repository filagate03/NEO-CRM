'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn, getToothNumber, getToothName } from '@/lib/utils';
import { Tooth } from '@/types';

interface ToothFormulaProps {
  teeth?: Tooth[];
  onToothClick?: (tooth: Tooth) => void;
  selectedTeeth?: string[];
  editable?: boolean;
  onToothStatusChange?: (toothId: string, status: Tooth['status']) => void;
}

const statusColors: Record<Tooth['status'], string> = {
  healthy: '#FFFFFF',
  caries: '#FEF3C7',
  pulpitis: '#FDE68A',
  periodontitis: '#FBBF24',
  extraction: '#F3F4F6',
  implant: '#00D4AA',
  crown: '#6366F1',
  filling: '#8B5CF6',
  absent: '#E5E7EB',
  braces: '#EC4899',
};

const statusLabels: Record<Tooth['status'], string> = {
  healthy: 'Здоров',
  caries: 'Кариес',
  pulpitis: 'Пульпит',
  periodontitis: 'Пародонтит',
  extraction: 'Удалён',
  implant: 'Имплант',
  crown: 'Коронка',
  filling: 'Пломба',
  absent: 'Отсутствует',
  braces: 'Брекеты',
};

const statusOptions: { value: Tooth['status']; label: string }[] = [
  { value: 'healthy', label: 'Здоров' },
  { value: 'caries', label: 'Кариес' },
  { value: 'pulpitis', label: 'Пульпит' },
  { value: 'periodontitis', label: 'Пародонтит' },
  { value: 'filling', label: 'Пломба' },
  { value: 'crown', label: 'Коронка' },
  { value: 'implant', label: 'Имплант' },
  { value: 'extraction', label: 'Удалён' },
  { value: 'absent', label: 'Отсутствует' },
  { value: 'braces', label: 'Брекеты' },
];

// Генерация начальных данных для зубов
const generateInitialTeeth = (): Tooth[] => {
  const teeth: Tooth[] = [];
  const quadrants = [
    { id: 'ur', name: 'upper_right', start: 18, end: 11 },
    { id: 'ul', name: 'upper_left', start: 21, end: 28 },
    { id: 'll', name: 'lower_left', start: 31, end: 38 },
    { id: 'lr', name: 'lower_right', start: 41, end: 48 },
  ];

  quadrants.forEach((quad) => {
    for (let i = quad.start; i >= quad.end; i--) {
      teeth.push({
        id: `${quad.id}-${quad.start - i + 1}`,
        number: i,
        name: getToothName(i),
        quadrant: quad.name as Tooth['quadrant'],
        status: 'healthy',
      });
    }
  });

  return teeth;
};

const ToothFormula = ({
  teeth: initialTeeth,
  onToothClick,
  selectedTeeth = [],
  editable = false,
  onToothStatusChange,
}: ToothFormulaProps) => {
  const [teeth, setTeeth] = useState<Tooth[]>(
    initialTeeth || generateInitialTeeth()
  );
  const [hoveredTooth, setHoveredTooth] = useState<number | null>(null);
  const [activeTooltip, setActiveTooltip] = useState<number | null>(null);

  const getToothPosition = (toothId: string): { x: number; y: number } => {
    const index = parseInt(toothId.split('-')[1]) - 1;
    const quadrant = toothId.split('-')[0];

    // Верхняя челюсть - y = 0, Нижняя - y = 1
    const y = quadrant.startsWith('u') ? 0 : 1;
    // Правая сторона - x инвертирован, Левая - x нормальный
    const baseX = quadrant.endsWith('r') ? 7 - index : index;

    return { x: baseX * 30 + 15, y: y * 50 + 25 };
  };

  const handleToothClick = (tooth: Tooth) => {
    if (editable && onToothStatusChange) {
      // Открыть меню выбора статуса
    } else {
      onToothClick?.(tooth);
    }
  };

  const getToothById = (id: string) => teeth.find((t) => t.id === id);

  return (
    <div className="relative bg-white rounded-xl border border-gray-200 p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Зубная формула</h3>
        <p className="text-sm text-gray-500">
          Нажмите на зуб для просмотра информации
        </p>
      </div>

      {/* Верхняя челюсть */}
      <div className="mb-2">
        <div className="flex justify-center">
          <div className="w-[270px] h-[55px] relative">
            <svg
              viewBox="0 0 270 55"
              className="w-full h-full"
              style={{ overflow: 'visible' }}
            >
              {/* Верхняя правая */}
              {teeth
                .filter((t) => t.quadrant === 'upper_right')
                .map((tooth) => {
                  const pos = getToothPosition(tooth.id);
                  return (
                    <motion.rect
                      key={tooth.id}
                      x={pos.x - 12}
                      y={pos.y - 20}
                      width={24}
                      height={40}
                      rx={4}
                      fill={statusColors[tooth.status]}
                      stroke={selectedTeeth.includes(tooth.id) ? '#00D4AA' : '#E5E7EB'}
                      strokeWidth={selectedTeeth.includes(tooth.id) ? 2 : 1}
                      className="cursor-pointer transition-all duration-200"
                      onClick={() => handleToothClick(tooth)}
                      onMouseEnter={() => setHoveredTooth(tooth.number)}
                      onMouseLeave={() => setHoveredTooth(null)}
                      whileHover={{ scale: 1.05 }}
                    />
                  );
                })}
              {/* Верхняя левая */}
              {teeth
                .filter((t) => t.quadrant === 'upper_left')
                .map((tooth) => {
                  const pos = getToothPosition(tooth.id);
                  return (
                    <motion.rect
                      key={tooth.id}
                      x={pos.x - 12}
                      y={pos.y - 20}
                      width={24}
                      height={40}
                      rx={4}
                      fill={statusColors[tooth.status]}
                      stroke={selectedTeeth.includes(tooth.id) ? '#00D4AA' : '#E5E7EB'}
                      strokeWidth={selectedTeeth.includes(tooth.id) ? 2 : 1}
                      className="cursor-pointer transition-all duration-200"
                      onClick={() => handleToothClick(tooth)}
                      onMouseEnter={() => setHoveredTooth(tooth.number)}
                      onMouseLeave={() => setHoveredTooth(null)}
                      whileHover={{ scale: 1.05 }}
                    />
                  );
                })}
            </svg>
          </div>
        </div>
      </div>

      {/* Разделитель */}
      <div className="h-px bg-gray-200 mx-8 my-2" />

      {/* Нижняя челюсть */}
      <div className="mb-4">
        <div className="flex justify-center">
          <div className="w-[270px] h-[55px] relative">
            <svg
              viewBox="0 0 270 55"
              className="w-full h-full"
              style={{ overflow: 'visible' }}
            >
              {/* Нижняя левая */}
              {teeth
                .filter((t) => t.quadrant === 'lower_left')
                .map((tooth) => {
                  const pos = getToothPosition(tooth.id);
                  return (
                    <motion.rect
                      key={tooth.id}
                      x={pos.x - 12}
                      y={pos.y - 15}
                      width={24}
                      height={40}
                      rx={4}
                      fill={statusColors[tooth.status]}
                      stroke={selectedTeeth.includes(tooth.id) ? '#00D4AA' : '#E5E7EB'}
                      strokeWidth={selectedTeeth.includes(tooth.id) ? 2 : 1}
                      className="cursor-pointer transition-all duration-200"
                      onClick={() => handleToothClick(tooth)}
                      onMouseEnter={() => setHoveredTooth(tooth.number)}
                      onMouseLeave={() => setHoveredTooth(null)}
                      whileHover={{ scale: 1.05 }}
                    />
                  );
                })}
              {/* Нижняя правая */}
              {teeth
                .filter((t) => t.quadrant === 'lower_right')
                .map((tooth) => {
                  const pos = getToothPosition(tooth.id);
                  return (
                    <motion.rect
                      key={tooth.id}
                      x={pos.x - 12}
                      y={pos.y - 15}
                      width={24}
                      height={40}
                      rx={4}
                      fill={statusColors[tooth.status]}
                      stroke={selectedTeeth.includes(tooth.id) ? '#00D4AA' : '#E5E7EB'}
                      strokeWidth={selectedTeeth.includes(tooth.id) ? 2 : 1}
                      className="cursor-pointer transition-all duration-200"
                      onClick={() => handleToothClick(tooth)}
                      onMouseEnter={() => setHoveredTooth(tooth.number)}
                      onMouseLeave={() => setHoveredTooth(null)}
                      whileHover={{ scale: 1.05 }}
                    />
                  );
                })}
            </svg>
          </div>
        </div>
      </div>

      {/* Легенда */}
      <div className="border-t border-gray-100 pt-4">
        <p className="text-xs font-medium text-gray-500 mb-2">Состояние зубов:</p>
        <div className="flex flex-wrap gap-2">
          {Object.entries(statusLabels).slice(0, 5).map(([status, label]) => (
            <div key={status} className="flex items-center gap-1.5">
              <div
                className="w-4 h-4 rounded border border-gray-200"
                style={{ backgroundColor: statusColors[status as Tooth['status']] }}
              />
              <span className="text-xs text-gray-600">{label}</span>
            </div>
          ))}
          <button className="text-xs text-secondary hover:underline">
            Показать все
          </button>
        </div>
      </div>

      {/* Tooltip при наведении */}
      {hoveredTooth && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-2 right-2 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg shadow-lg z-10"
        >
          <p className="font-medium">Зуб {hoveredTooth}</p>
          <p className="text-gray-300">
            {getToothName(hoveredTooth)}
          </p>
          <p className="text-secondary">
            {statusLabels[getToothById(`ur-${18 - hoveredTooth + 1}`)?.status || 'healthy']}
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default ToothFormula;
