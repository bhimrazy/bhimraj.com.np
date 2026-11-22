/**
 * A visitor's course progress, kept in their own browser (IndexedDB). Nothing
 * leaves the device: there are no accounts, so "Back up" exports a JSON file
 * and "Restore" reads one back.
 *
 * Bump VERSION and extend `upgrade` when the stored shape changes; old data
 * stays readable because each version only adds to the last.
 */

const DB_NAME = "bhimraj-learning";
const VERSION = 1;
const LECTURES = "lectures";
const COURSES = "courses";
const CHANNEL = "bhimraj-learning";

type LectureProgress = {
  course: string;
  video: string;
  /** Last playback position. */
  positionSec: number;
  durationSec: number;
  done: boolean;
  updatedAt: string;
};

type CourseState = {
  course: string;
  /** The lecture last played, offered under "Continue". */
  lastVideo: string | null;
  startedAt: string;
  updatedAt: string;
};

export type CourseProgress = {
  lectures: Record<string, LectureProgress>;
  state: CourseState | null;
};

let dbPromise: Promise<IDBDatabase> | null = null;

function openDb(): Promise<IDBDatabase> {
  dbPromise ??= new Promise((resolve, reject) => {
    if (typeof indexedDB === "undefined") {
      reject(new Error("IndexedDB unavailable"));
      return;
    }
    const req = indexedDB.open(DB_NAME, VERSION);
    req.onupgradeneeded = (event) => {
      const db = req.result;
      if (event.oldVersion < 1) {
        db.createObjectStore(LECTURES, {
          keyPath: ["course", "video"],
        }).createIndex("course", "course");
        db.createObjectStore(COURSES, { keyPath: "course" });
      }
    };
    req.onsuccess = () => {
      const db = req.result;
      // Another tab is upgrading the schema: let it.
      db.onversionchange = () => {
        db.close();
        dbPromise = null;
      };
      resolve(db);
    };
    req.onerror = () => {
      dbPromise = null;
      reject(req.error);
    };
  });
  return dbPromise;
}

function done<T>(req: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function committed(tx: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  });
}

// Change notifications: this tab's listeners, plus other open tabs.
const listeners = new Set<() => void>();
let channel: BroadcastChannel | null = null;

function notify() {
  for (const listener of listeners) listener();
  channel?.postMessage("changed");
}

export function subscribe(listener: () => void): () => void {
  if (!channel && typeof BroadcastChannel !== "undefined") {
    channel = new BroadcastChannel(CHANNEL);
    channel.onmessage = () => {
      for (const l of listeners) l();
    };
  }
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export async function readCourse(course: string): Promise<CourseProgress> {
  const db = await openDb();
  const tx = db.transaction([LECTURES, COURSES], "readonly");
  const [rows, state] = await Promise.all([
    done<LectureProgress[]>(
      tx.objectStore(LECTURES).index("course").getAll(course),
    ),
    done<CourseState | undefined>(tx.objectStore(COURSES).get(course)),
  ]);
  return {
    lectures: Object.fromEntries(rows.map((row) => [row.video, row])),
    state: state ?? null,
  };
}

/**
 * Records a lecture's position, and its `done` flag when given. Returns true
 * when this is the first thing saved for the course.
 */
export async function saveLecture(input: {
  course: string;
  video: string;
  positionSec: number;
  durationSec: number;
  done?: boolean;
  /** False for a checkbox tick: it shouldn't move "Continue". */
  played?: boolean;
}): Promise<boolean> {
  const db = await openDb();
  const tx = db.transaction([LECTURES, COURSES], "readwrite");
  const lectures = tx.objectStore(LECTURES);
  const courses = tx.objectStore(COURSES);
  const now = new Date().toISOString();

  const [prev, state] = await Promise.all([
    done<LectureProgress | undefined>(
      lectures.get([input.course, input.video]),
    ),
    done<CourseState | undefined>(courses.get(input.course)),
  ]);
  lectures.put({
    course: input.course,
    video: input.video,
    positionSec: Math.max(0, Math.floor(input.positionSec)),
    durationSec: Math.floor(input.durationSec),
    // Once watched, a lecture stays watched until unticked.
    done: input.done ?? prev?.done ?? false,
    updatedAt: now,
  } satisfies LectureProgress);
  courses.put({
    course: input.course,
    lastVideo:
      input.played === false ? (state?.lastVideo ?? null) : input.video,
    startedAt: state?.startedAt ?? now,
    updatedAt: now,
  } satisfies CourseState);

  await committed(tx);
  notify();
  return !state;
}

export async function resetCourse(course: string): Promise<void> {
  const db = await openDb();
  const tx = db.transaction([LECTURES, COURSES], "readwrite");
  const keys = await done(
    tx.objectStore(LECTURES).index("course").getAllKeys(course),
  );
  for (const key of keys) tx.objectStore(LECTURES).delete(key);
  tx.objectStore(COURSES).delete(course);
  await committed(tx);
  notify();
}

const BACKUP_FORMAT = "bhimraj.com.np/learning";

export type Backup = {
  format: typeof BACKUP_FORMAT;
  version: number;
  exportedAt: string;
  lectures: LectureProgress[];
  courses: CourseState[];
};

export async function exportBackup(): Promise<Backup> {
  const db = await openDb();
  const tx = db.transaction([LECTURES, COURSES], "readonly");
  const [lectures, courses] = await Promise.all([
    done<LectureProgress[]>(tx.objectStore(LECTURES).getAll()),
    done<CourseState[]>(tx.objectStore(COURSES).getAll()),
  ]);
  return {
    format: BACKUP_FORMAT,
    version: VERSION,
    exportedAt: new Date().toISOString(),
    lectures,
    courses,
  };
}

const isString = (v: unknown): v is string => typeof v === "string";
const isNumber = (v: unknown): v is number =>
  typeof v === "number" && Number.isFinite(v) && v >= 0;

function isLecture(v: unknown): v is LectureProgress {
  const r = v as LectureProgress;
  return (
    typeof v === "object" &&
    v !== null &&
    isString(r.course) &&
    isString(r.video) &&
    isNumber(r.positionSec) &&
    isNumber(r.durationSec) &&
    typeof r.done === "boolean" &&
    isString(r.updatedAt)
  );
}

function isCourse(v: unknown): v is CourseState {
  const r = v as CourseState;
  return (
    typeof v === "object" &&
    v !== null &&
    isString(r.course) &&
    (r.lastVideo === null || isString(r.lastVideo)) &&
    isString(r.startedAt) &&
    isString(r.updatedAt)
  );
}

/**
 * Merges a backup into what's stored; for each lecture and course the newer
 * record wins. Returns the number of lectures restored. Throws on a file
 * that isn't a backup from this site.
 */
export async function importBackup(data: unknown): Promise<number> {
  const backup = data as Partial<Backup>;
  if (
    backup?.format !== BACKUP_FORMAT ||
    !Array.isArray(backup.lectures) ||
    !Array.isArray(backup.courses)
  ) {
    throw new Error("Not a progress backup from this site.");
  }
  const lectures = backup.lectures.filter(isLecture);
  const courses = backup.courses.filter(isCourse);

  const db = await openDb();
  const tx = db.transaction([LECTURES, COURSES], "readwrite");
  const lectureStore = tx.objectStore(LECTURES);
  const courseStore = tx.objectStore(COURSES);
  let restored = 0;
  await Promise.all([
    ...lectures.map(async (row) => {
      const prev = await done<LectureProgress | undefined>(
        lectureStore.get([row.course, row.video]),
      );
      if (!prev || prev.updatedAt < row.updatedAt) {
        lectureStore.put(row);
        restored++;
      }
    }),
    ...courses.map(async (row) => {
      const prev = await done<CourseState | undefined>(
        courseStore.get(row.course),
      );
      if (!prev || prev.updatedAt < row.updatedAt) courseStore.put(row);
    }),
  ]);
  await committed(tx);
  notify();
  return restored;
}

/**
 * Asks the browser not to clear this site's storage when space runs low.
 * Browsers may still say no, and Safari clears it after 7 days without a
 * visit regardless; that's what backups are for.
 */
export function requestPersistence(): void {
  navigator.storage?.persist?.().catch(() => {});
}
