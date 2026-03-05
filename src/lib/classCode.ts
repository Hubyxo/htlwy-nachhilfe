export type Department =
  | 'Informationstechnologie'
  | 'Maschinenbau'
  | 'Mechatronik'
  | 'Elektrotechnik'
  | 'Wirtschaftsingenieure'
  | '';

interface ParsedClass {
  schoolYear: string;
  department: Department;
  classCode: string;
}

const DEPT_MAP: Record<string, Department> = {
  AHIT: 'Informationstechnologie',
  BHIT: 'Informationstechnologie',
  AHMBA: 'Maschinenbau',
  BHMBA: 'Maschinenbau',
  AHET: 'Elektrotechnik',
  BHET: 'Elektrotechnik',
  AHWIM: 'Wirtschaftsingenieure',
  BHWIM: 'Wirtschaftsingenieure',
  AFME: 'Mechatronik',
  BFME: 'Mechatronik',
};

export const parseClassCode = (code: string | null | undefined): ParsedClass | null => {
  if (!code) return null;
  const upper = code.trim().toUpperCase();
  const match = upper.match(/^([1-5])([A-Z]{2,4})$/);
  if (!match) return null;

  const year = match[1];
  const deptKey = match[2];
  const department = DEPT_MAP[deptKey];
  if (!department) return null;

  return {
    schoolYear: `${year}. Jahrgang`,
    department,
    classCode: upper,
  };
};
