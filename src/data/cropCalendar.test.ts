import { describe, expect, it } from 'vitest';
import {
  cropCalendarData,
  getCalendarByCrop,
  getCalendarBySeason,
  getCalendarByState,
  getCalendarZones,
} from '@/data/cropCalendar';

describe('cropCalendar data', () => {
  it('has calendar entries', () => {
    expect(cropCalendarData.length).toBeGreaterThan(0);
  });

  it('getCalendarByCrop returns entries for wheat', () => {
    const results = getCalendarByCrop('Wheat');
    expect(results.length).toBeGreaterThan(0);
  });

  it('getCalendarBySeason returns season-filtered results', () => {
    const rabi = getCalendarBySeason('Rabi');
    expect(rabi.length).toBeGreaterThan(0);
  });

  it('getCalendarByState returns state-relevant entries', () => {
    const results = getCalendarByState('Punjab');
    expect(results.length).toBeGreaterThan(0);
  });

  it('getCalendarZones returns zone names', () => {
    const zones = getCalendarZones();
    expect(zones.length).toBeGreaterThan(0);
  });
});
