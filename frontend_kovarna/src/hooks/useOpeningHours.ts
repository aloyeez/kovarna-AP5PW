import { useState, useEffect } from 'react';
import { openingHoursService, type OpeningHoursDto, type DayOfWeek } from '../services/openingHoursService';
import { useLanguage } from '../contexts/LanguageContext';

interface GroupedHours {
  daysLabel: string;
  timeRange: string;
  isOpen: boolean;
  note?: string;
}

const dayOrder: DayOfWeek[] = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

export function useOpeningHours() {
  const [groupedHours, setGroupedHours] = useState<GroupedHours[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t } = useLanguage();

  useEffect(() => {
    fetchAndGroupHours();
  }, [t]);

  const fetchAndGroupHours = async () => {
    try {
      setLoading(true);
      const hours = await openingHoursService.getAllOpeningHours();

      // Sort by day of week
      const sortedHours = hours.sort((a, b) => {
        return dayOrder.indexOf(a.dayOfWeek) - dayOrder.indexOf(b.dayOfWeek);
      });

      // Group consecutive days with same hours
      const grouped = groupConsecutiveDays(sortedHours, t);
      setGroupedHours(grouped);
      setError(null);
    } catch (err) {
      console.error('Error fetching opening hours:', err);
      setError('Failed to load opening hours');
    } finally {
      setLoading(false);
    }
  };

  return { groupedHours, loading, error, refetch: fetchAndGroupHours };
}

function groupConsecutiveDays(hours: OpeningHoursDto[], t: (key: string) => string): GroupedHours[] {
  if (hours.length === 0) return [];

  const grouped: GroupedHours[] = [];
  let currentGroup: OpeningHoursDto[] = [hours[0]];

  for (let i = 1; i < hours.length; i++) {
    const prev = currentGroup[currentGroup.length - 1];
    const curr = hours[i];

    // Check if current day has same hours as previous
    const sameHours =
      prev.openTime === curr.openTime &&
      prev.closeTime === curr.closeTime &&
      prev.isOpen === curr.isOpen;

    if (sameHours) {
      currentGroup.push(curr);
    } else {
      // Finish current group and start new one
      grouped.push(formatGroup(currentGroup, t));
      currentGroup = [curr];
    }
  }

  // Add the last group
  grouped.push(formatGroup(currentGroup, t));

  return grouped;
}

function formatGroup(group: OpeningHoursDto[], t: (key: string) => string): GroupedHours {
  const first = group[0];
  const last = group[group.length - 1];

  const getDayAbbreviation = (day: DayOfWeek): string => {
    const dayMap: Record<DayOfWeek, string> = {
      MONDAY: t('days.monday'),
      TUESDAY: t('days.tuesday'),
      WEDNESDAY: t('days.wednesday'),
      THURSDAY: t('days.thursday'),
      FRIDAY: t('days.friday'),
      SATURDAY: t('days.saturday'),
      SUNDAY: t('days.sunday')
    };
    return dayMap[day] || day;
  };

  // Format day label
  let daysLabel: string;
  if (group.length === 1) {
    daysLabel = getDayAbbreviation(first.dayOfWeek);
  } else {
    daysLabel = `${getDayAbbreviation(first.dayOfWeek)}-${getDayAbbreviation(last.dayOfWeek)}`;
  }

  // Format time range (HH:mm)
  const timeRange = first.isOpen
    ? `${first.openTime.substring(0, 5)} - ${first.closeTime.substring(0, 5)}`
    : 'Zavřeno';

  return {
    daysLabel,
    timeRange,
    isOpen: first.isOpen,
    note: first.note
  };
}
