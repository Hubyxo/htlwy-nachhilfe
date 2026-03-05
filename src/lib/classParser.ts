export type Department =
  | 'Informationstechnologie'
  | 'Maschinenbau'
  | 'Mechatronik'
  | 'Elektrotechnik'
  | 'Wirtschaftsingenieure'
  | '';

interface ParsedClass {
  classCode: string;
  schoolYear: string;
  department: Department;
}

const CLASS_SUFFIXES: Record<string, Department> = {
  AHIT: 'Informationstechnologie',
  AHMBA: 'Maschinenbau',
  BHMBA: 'Maschinenbau',
  AHET: 'Elektrotechnik',
  AHWIM: 'Wirtschaftsingenieure',
  BHWIM: 'Wirtschaftsingenieure',
  AFME: 'Mechatronik',
};

const YEAR_MAP: Record<string, string> = {
  '1': '1. Jahrgang',
  '2': '2. Jahrgang',
  '3': '3. Jahrgang',
  '4': '4. Jahrgang',
  '5': '5. Jahrgang',
};

export const parseClassFromEmail = (email: string): ParsedClass | null => {
  const local = email.split('@')[0].toLowerCase();
  const parts = local.split('.');
  if (parts.length < 2) return null;

  const lastPart = parts[parts.length - 1];
  const match = lastPart.match(/^([1-5])([a-z]+)$/i);
  if (!match) return null;

  const yearDigit = match[1];
  const suffix = match[2].toUpperCase();

  const department = CLASS_SUFFIXES[suffix];
  if (!department) return null;

  const classCode = `${yearDigit}${suffix}`;
  const schoolYear = YEAR_MAP[yearDigit] || '';

  return { classCode, schoolYear, department };
};
