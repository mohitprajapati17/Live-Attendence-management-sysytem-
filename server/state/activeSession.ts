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

export function endActiveSession() {
  activeSession = null;
}