export type ActiveSession = {
  classId: string;
  startedAt: Date;
  attendance: Record<string, any>;
};

let activeSession: ActiveSession | null = null;

export function getActiveSession() {
  return activeSession;
}

export function startActiveSession(classId: string) {
  if (activeSession) {
    throw new Error("Attendance already active");
  }

  activeSession = {
    classId,
    startedAt: new Date(),
    attendance: {},
  };

  return activeSession;
}

export function addAttendance(studentId: string, classId: string) {
  if (!activeSession) {
    throw new Error("No active session");
  }
  if (activeSession.classId !== classId) {
    throw new Error("Class ID does not match");
  }
  activeSession.attendance[studentId] = {
    status: "present",
    createdAt: new Date(),
  };
}

export function endActiveSession() {
  activeSession = null;
}