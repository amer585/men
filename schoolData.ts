import type {
  Announcement,
  Assessment,
  AttendanceRecord,
  MonthlyExam,
  ScheduleDay,
  StudentData,
} from './App';

type SubjectConfig = {
  name: string;
  teacher: string;
  room: string;
  weeklyMax: number;
  monthlyMax: number;
};

const CURRENT_DATA_VERSION = 2;

const GRADE_LABEL_BY_LEVEL: Record<number, string> = {
  1: 'الأول الابتدائي',
  2: 'الثاني الابتدائي',
  3: 'الثالث الابتدائي',
  4: 'الرابع الابتدائي',
  5: 'الخامس الابتدائي',
  6: 'السادس الابتدائي',
  7: 'الأول الإعدادي',
  8: 'الثاني الإعدادي',
  9: 'الثالث الإعدادي',
  10: 'الأول الثانوي',
  11: 'الثاني الثانوي',
  12: 'الثالث الثانوي',
};

const PREP_SUBJECT_CONFIGS: SubjectConfig[] = [
  { name: 'اللغة العربية', teacher: 'أ. هالة عبد المجيد', room: 'فصل 2/ج', weeklyMax: 10, monthlyMax: 30 },
  { name: 'اللغة الإنجليزية', teacher: 'أ. مريم سمير', room: 'معمل اللغات 1', weeklyMax: 10, monthlyMax: 25 },
  { name: 'اللغة الفرنسية', teacher: 'أ. داليا فوزي', room: 'معمل اللغات 2', weeklyMax: 10, monthlyMax: 20 },
  { name: 'الرياضيات', teacher: 'أ. عمرو شريف', room: 'فصل 2/ج', weeklyMax: 10, monthlyMax: 30 },
  { name: 'العلوم', teacher: 'أ. منى عبد الحميد', room: 'معمل العلوم', weeklyMax: 10, monthlyMax: 20 },
  { name: 'الدراسات الاجتماعية', teacher: 'أ. أحمد جابر', room: 'فصل 2/ج', weeklyMax: 10, monthlyMax: 20 },
  { name: 'التربية الدينية', teacher: 'أ. خالد محمود', room: 'فصل 2/ج', weeklyMax: 10, monthlyMax: 20 },
  { name: 'تكنولوجيا المعلومات والاتصالات', teacher: 'أ. شيماء رأفت', room: 'معمل الحاسب', weeklyMax: 10, monthlyMax: 15 },
  { name: 'التربية الفنية', teacher: 'أ. نجلاء عبد الرحمن', room: 'مرسم المدرسة', weeklyMax: 10, monthlyMax: 10 },
];

const PREP_SCHEDULE_LAYOUTS: Record<number, string[][]> = {
  7: [
    ['اللغة العربية', 'الرياضيات', 'اللغة الإنجليزية', 'العلوم', 'التربية الفنية'],
    ['الدراسات الاجتماعية', 'اللغة العربية', 'العلوم', 'اللغة الفرنسية', 'تكنولوجيا المعلومات والاتصالات'],
    ['الرياضيات', 'اللغة الإنجليزية', 'التربية الدينية', 'العلوم', 'اللغة العربية'],
    ['اللغة الفرنسية', 'الدراسات الاجتماعية', 'الرياضيات', 'اللغة الإنجليزية', 'التربية الفنية'],
    ['العلوم', 'اللغة العربية', 'تكنولوجيا المعلومات والاتصالات', 'الرياضيات', 'الدراسات الاجتماعية'],
  ],
  8: [
    ['الرياضيات', 'اللغة العربية', 'اللغة الإنجليزية', 'العلوم', 'اللغة الفرنسية'],
    ['الدراسات الاجتماعية', 'العلوم', 'اللغة العربية', 'تكنولوجيا المعلومات والاتصالات', 'التربية الفنية'],
    ['اللغة الإنجليزية', 'الرياضيات', 'التربية الدينية', 'اللغة العربية', 'العلوم'],
    ['اللغة الفرنسية', 'الدراسات الاجتماعية', 'الرياضيات', 'اللغة الإنجليزية', 'التربية الفنية'],
    ['العلوم', 'اللغة العربية', 'تكنولوجيا المعلومات والاتصالات', 'الرياضيات', 'الدراسات الاجتماعية'],
  ],
  9: [
    ['اللغة العربية', 'الرياضيات', 'العلوم', 'اللغة الإنجليزية', 'اللغة الفرنسية'],
    ['الدراسات الاجتماعية', 'اللغة العربية', 'الرياضيات', 'تكنولوجيا المعلومات والاتصالات', 'التربية الفنية'],
    ['اللغة الإنجليزية', 'العلوم', 'التربية الدينية', 'اللغة العربية', 'الرياضيات'],
    ['اللغة الفرنسية', 'الدراسات الاجتماعية', 'العلوم', 'اللغة الإنجليزية', 'التربية الفنية'],
    ['الرياضيات', 'اللغة العربية', 'تكنولوجيا المعلومات والاتصالات', 'العلوم', 'الدراسات الاجتماعية'],
  ],
};

const PERIOD_TIMES = [
  '08:00 - 08:45',
  '08:50 - 09:35',
  '09:55 - 10:40',
  '10:45 - 11:30',
  '11:35 - 12:20',
];

const ARABIC_DAY_NAMES: Record<number, string> = {
  0: 'الأحد',
  1: 'الاثنين',
  2: 'الثلاثاء',
  3: 'الأربعاء',
  4: 'الخميس',
  5: 'الجمعة',
  6: 'السبت',
};

const DEFAULT_PROFILES = {
  7: {
    name: 'عمر محمد سعد',
    class_name: '1/ب',
    school_name: 'مدرسة النهضة الرسمية الإعدادية المشتركة',
    admin_zone: 'شرق مدينة نصر',
    gov_code: 'القاهرة',
    gender: 'ذكر',
  },
  8: {
    name: 'سارة أحمد حسن',
    class_name: '2/ج',
    school_name: 'مدرسة المستقبل الرسمية الإعدادية المشتركة',
    admin_zone: 'النزهة',
    gov_code: 'القاهرة',
    gender: 'أنثى',
  },
  9: {
    name: 'محمود خالد علي',
    class_name: '3/أ',
    school_name: 'مدرسة 25 يناير الإعدادية المشتركة',
    admin_zone: 'شبين الكوم',
    gov_code: 'المنوفية',
    gender: 'ذكر',
  },
} as const;

export const SHOWCASE_SUBJECTS = PREP_SUBJECT_CONFIGS.map((subject) => subject.name);
export const PREP_GRADE_LABELS = ['الأول الإعدادي', 'الثاني الإعدادي', 'الثالث الإعدادي'] as const;

const hashValue = (value: string) => {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) % 1000003;
  }
  return hash;
};

const pad = (value: number) => value.toString().padStart(2, '0');

const formatDate = (date: Date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

const shiftDate = (baseDate: Date, days: number) => {
  const nextDate = new Date(baseDate);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate;
};

const isSchoolDay = (date: Date) => {
  const day = date.getDay();
  return day !== 5 && day !== 6;
};

const getRecentSchoolDays = (count: number) => {
  const schoolDays: Date[] = [];
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);

  while (schoolDays.length < count) {
    if (isSchoolDay(cursor)) {
      schoolDays.unshift(new Date(cursor));
    }
    cursor.setDate(cursor.getDate() - 1);
  }

  return schoolDays;
};

const seededNumber = (seed: number, step: number, min: number, max: number) => {
  const range = max - min + 1;
  return min + ((seed + step * 17) % range);
};

const uniqueSeedIndexes = (seed: number, size: number) => {
  const indexes = new Set<number>();
  let pointer = 0;

  while (indexes.size < size) {
    indexes.add((seed + pointer * 7) % 30);
    pointer += 1;
  }

  return [...indexes];
};

const inferGradeLevel = (gradeLevel?: number, grade?: string) => {
  if (gradeLevel && gradeLevel >= 7 && gradeLevel <= 9) {
    return gradeLevel;
  }

  const normalizedGrade = grade?.trim();
  const matchedEntry = Object.entries(GRADE_LABEL_BY_LEVEL).find(([, label]) => label === normalizedGrade);

  if (matchedEntry) {
    return Number(matchedEntry[0]);
  }

  return 8;
};

const getGradeDefaults = (gradeLevel: number) => DEFAULT_PROFILES[gradeLevel as 7 | 8 | 9] || DEFAULT_PROFILES[8];

const getSubjectConfigs = (gradeLevel: number) => {
  if (gradeLevel >= 7 && gradeLevel <= 9) {
    return PREP_SUBJECT_CONFIGS;
  }

  return PREP_SUBJECT_CONFIGS;
};

const getScheduleLayouts = (gradeLevel: number) => PREP_SCHEDULE_LAYOUTS[gradeLevel] || PREP_SCHEDULE_LAYOUTS[8];

const buildSchedule = (gradeLevel: number): ScheduleDay[] => {
  const subjectConfigs = getSubjectConfigs(gradeLevel);
  const subjectMap = Object.fromEntries(subjectConfigs.map((subject) => [subject.name, subject]));
  const layout = getScheduleLayouts(gradeLevel);
  const schoolDays = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس'];

  return schoolDays.map((day, dayIndex) => ({
    day,
    breakTime: '09:35 - 09:55',
    periods: layout[dayIndex].map((subjectName, periodIndex) => {
      const subject = subjectMap[subjectName];

      return {
        id: `schedule-${gradeLevel}-${dayIndex}-${periodIndex}`,
        time: PERIOD_TIMES[periodIndex],
        subject: subjectName,
        teacher: subject.teacher,
        room: subject.room,
      };
    }),
  }));
};

const buildWeeklyAssessments = (studentId: string, gradeLevel: number): Assessment[] => {
  const seed = hashValue(`${studentId}-weekly-${gradeLevel}`);
  const subjectConfigs = getSubjectConfigs(gradeLevel);
  const weekAnchors = getRecentSchoolDays(30).filter((_, index) => index % 5 === 4);

  return weekAnchors.flatMap((anchorDate, weekIndex) =>
    subjectConfigs.map((subject, subjectIndex) => {
      const statusRoll = (seed + weekIndex * 11 + subjectIndex * 5) % 18;
      const status: Assessment['status'] =
        statusRoll === 0 ? 'absent' : statusRoll === 1 ? 'excused' : 'present';
      const score =
        status === 'present'
          ? seededNumber(seed, weekIndex * subjectConfigs.length + subjectIndex, Math.max(6, subject.weeklyMax - 3), subject.weeklyMax)
          : 0;

      return {
        id: `weekly-${gradeLevel}-${weekIndex}-${subjectIndex}`,
        subject: subject.name,
        title: `التقييم الأسبوعي ${weekIndex + 1}`,
        score,
        maxScore: subject.weeklyMax,
        status,
        note: status === 'absent' ? 'غياب بعذر' : status === 'excused' ? 'إعادة تقييم الأسبوع القادم' : undefined,
        date: formatDate(anchorDate),
      };
    }),
  );
};

const buildMonthlyExams = (studentId: string, gradeLevel: number): MonthlyExam[] => {
  const seed = hashValue(`${studentId}-monthly-${gradeLevel}`);
  const subjectConfigs = getSubjectConfigs(gradeLevel);
  const examAnchors = [shiftDate(new Date(), -34), shiftDate(new Date(), -13)];
  const examTitles = ['امتحان مارس', 'امتحان أبريل'];

  return examAnchors.flatMap((baseDate, examIndex) => {
    let examDate = new Date(baseDate);

    while (!isSchoolDay(examDate)) {
      examDate = shiftDate(examDate, -1);
    }

    return subjectConfigs.map((subject, subjectIndex) => {
      const status: MonthlyExam['status'] =
        (seed + examIndex * 13 + subjectIndex * 3) % 29 === 0 ? 'excused' : 'present';
      const score =
        status === 'present'
          ? seededNumber(seed, examIndex * subjectConfigs.length + subjectIndex, Math.max(8, subject.monthlyMax - 6), subject.monthlyMax)
          : 0;

      return {
        id: `monthly-${gradeLevel}-${examIndex}-${subjectIndex}`,
        subject: subject.name,
        title: examTitles[examIndex],
        score,
        maxScore: subject.monthlyMax,
        status,
        note: status === 'excused' ? 'إعادة الامتحان في لجنة الدور الثاني' : undefined,
        date: formatDate(examDate),
      };
    });
  });
};

const buildAttendanceRecords = (studentId: string, gradeLevel: number, schedule: ScheduleDay[]): AttendanceRecord[] => {
  const seed = hashValue(`${studentId}-attendance-${gradeLevel}`);
  const recentDays = getRecentSchoolDays(30);
  const absentIndexes = uniqueSeedIndexes(seed, 2);
  const lateIndex = ((seed % 11) + 7) % 30;
  const excusedIndex = ((seed % 13) + 16) % 30;
  const scheduleMap = Object.fromEntries(schedule.map((day) => [day.day, day]));

  return recentDays.map((date, index) => {
    const dayName = ARABIC_DAY_NAMES[date.getDay()];
    const firstPeriod = scheduleMap[dayName]?.periods[0];
    let status: AttendanceRecord['status'] = 'present';
    let note: string | undefined;
    let lateTime: string | undefined;

    if (absentIndexes.includes(index)) {
      status = 'absent';
      note = 'تم تسجيل غياب رسمي في دفتر الفصل';
    } else if (index === excusedIndex) {
      status = 'excused';
      note = 'إذن طبي معتمد من شؤون الطلبة';
    } else if (index === lateIndex) {
      status = 'late';
      lateTime = `08:${pad(7 + (seed % 9))}`;
      note = 'تأخر عن طابور الصباح';
    }

    return {
      id: `attendance-${gradeLevel}-${index}`,
      date: formatDate(date),
      dayName,
      status,
      lessonName: firstPeriod ? `الحصة الأولى: ${firstPeriod.subject}` : 'اليوم الدراسي الكامل',
      note,
      lateTime,
    };
  });
};

const buildAnnouncements = (grade: string): Announcement[] => {
  const today = new Date();

  return [
    {
      id: 'announcement-intlaqa',
      title: 'مبادرة انطلاقة رقمية',
      content:
        'تفتح المدرسة باب التسجيل في ورش البرمجة والذكاء الاصطناعي ضمن مبادرة انطلاقة رقمية يوم الثلاثاء بعد انتهاء اليوم الدراسي داخل معمل الحاسب، مع أولوية لطلاب المرحلة الإعدادية.',
      date: formatDate(shiftDate(today, -1)),
      author: 'وحدة التحول الرقمي',
      importance: 'high',
      targetGrade: 'الكل',
    },
    {
      id: 'announcement-april-assessment',
      title: 'خطة تقييمات شهر أبريل',
      content:
        'تبدأ التقييمات الأسبوعية المجمعة هذا الأسبوع في مواد اللغة العربية والرياضيات والعلوم، ويرجى مراجعة دفتر المتابعة والتأكد من إحضار الأدوات الأساسية يومياً.',
      date: formatDate(shiftDate(today, -3)),
      author: 'وكيل شؤون الطلاب',
      importance: 'normal',
      targetGrade: grade,
    },
    {
      id: 'announcement-parents-meeting',
      title: 'اجتماع أولياء الأمور',
      content:
        'يعقد اجتماع أولياء أمور الصفوف الإعدادية يوم الأربعاء الساعة 12:45 ظهراً لمراجعة نسب الحضور ونتائج الامتحانات الشهرية وخطط الدعم العلاجي.',
      date: formatDate(shiftDate(today, -6)),
      author: 'إدارة المدرسة',
      importance: 'high',
      targetGrade: 'الكل',
    },
    {
      id: 'announcement-french-project',
      title: 'تسليم مشروع اللغة الفرنسية',
      content:
        'آخر موعد لتسليم مشروع اللغة الفرنسية عن الأنشطة اليومية هو يوم الخميس القادم، ويُسلم المشروع داخل ملف بلاستيكي موحد باسم الطالب والفصل.',
      date: formatDate(shiftDate(today, -8)),
      author: 'أ. داليا فوزي',
      importance: 'normal',
      targetGrade: grade,
    },
  ];
};

export const getGradeLabel = (gradeLevel?: number, fallbackGrade?: string) => {
  if (gradeLevel && GRADE_LABEL_BY_LEVEL[gradeLevel]) {
    return GRADE_LABEL_BY_LEVEL[gradeLevel];
  }

  if (fallbackGrade?.trim()) {
    return fallbackGrade.trim();
  }

  return 'الثاني الإعدادي';
};

export const buildStudentData = (profile: Partial<StudentData> & { id: string }) => {
  const gradeLevel = inferGradeLevel(profile.gradeLevel, profile.grade);
  const defaults = getGradeDefaults(gradeLevel);
  const grade = getGradeLabel(gradeLevel, profile.grade);
  const schedule = buildSchedule(gradeLevel);

  return {
    id: profile.id,
    name: profile.name?.trim() || defaults.name,
    grade,
    gradeLevel,
    class_name: profile.class_name || defaults.class_name,
    school_name: profile.school_name || defaults.school_name,
    admin_zone: profile.admin_zone || defaults.admin_zone,
    gov_code: profile.gov_code || defaults.gov_code,
    gender: profile.gender || defaults.gender,
    weeklyAssessments: buildWeeklyAssessments(profile.id, gradeLevel),
    monthlyExams: buildMonthlyExams(profile.id, gradeLevel),
    attendanceRecords: buildAttendanceRecords(profile.id, gradeLevel, schedule),
    announcements: buildAnnouncements(grade),
    schedule,
    dataVersion: CURRENT_DATA_VERSION,
  } satisfies StudentData;
};

export const normalizeStudentData = (student: Partial<StudentData> & Pick<StudentData, 'id'>) => {
  const weeklyAssessments = student.weeklyAssessments ?? [];
  const monthlyExams = student.monthlyExams ?? [];
  const attendanceRecords = student.attendanceRecords ?? [];
  const schedule = student.schedule ?? [];
  const announcements = student.announcements ?? [];
  const hasFullDashboard =
    student.dataVersion === CURRENT_DATA_VERSION &&
    weeklyAssessments.length >= SHOWCASE_SUBJECTS.length * 6 &&
    monthlyExams.length >= SHOWCASE_SUBJECTS.length * 2 &&
    attendanceRecords.length >= 30 &&
    schedule.length === 5 &&
    announcements.length >= 4;

  if (hasFullDashboard) {
    return {
      ...student,
      gradeLevel: inferGradeLevel(student.gradeLevel, student.grade),
      grade: getGradeLabel(student.gradeLevel, student.grade),
    };
  }

  return buildStudentData(student);
};

export const INITIAL_STUDENTS: StudentData[] = [
  buildStudentData({
    id: '30204151234567',
    name: 'سارة أحمد حسن',
    gradeLevel: 8,
  }),
];
