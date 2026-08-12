import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  deleteDoc,
  onSnapshot,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { StudentProfile, SurveyResponse, NetworkMember } from '../types';

// Initialize Firebase App
export const firebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore with specific database ID if provided
export const db =
  firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)'
    ? getFirestore(firebaseApp, firebaseConfig.firestoreDatabaseId)
    : getFirestore(firebaseApp);

// --- FIRESTORE USER / CI LOGIN HELPERS ---

export interface RegisteredUser {
  ci: string;
  nombre: string;
  email?: string;
  carrera: string;
  semestre: string;
  facultad: string;
  rol: 'estudiante' | 'administrador' | 'visitante';
  password?: string;
  surveyCompleted?: boolean;
  fechaRegistro?: string;
  esCorreoInstitucional?: boolean;
}

// Register new user explicitly in Firestore
export async function registerNewUser(user: RegisteredUser): Promise<{ success: boolean; user?: RegisteredUser; message?: string }> {
  const cleanCI = user.ci.trim();
  if (!cleanCI) {
    return { success: false, message: 'El Carnet de Identidad es obligatorio.' };
  }
  if (!user.nombre.trim()) {
    return { success: false, message: 'El Nombre Completo es obligatorio.' };
  }

  try {
    const userDocRef = doc(db, 'users', cleanCI);
    const userSnap = await getDoc(userDocRef);

    if (userSnap.exists()) {
      return { success: false, message: 'Ya existe un usuario registrado con este C.I. Por favor inicie sesión.' };
    }

    const cleanEmail = (user.email || '').trim().toLowerCase();
    const isUmsaDomain = cleanEmail.endsWith('@umsa.bo');

    const newUser: RegisteredUser = {
      ci: cleanCI,
      nombre: user.nombre.trim(),
      email: cleanEmail,
      carrera: user.carrera || 'Ciencias Sociales',
      semestre: user.semestre || '1er Semestre',
      facultad: user.facultad || 'Facultad de Ciencias Sociales',
      rol: user.rol || 'estudiante',
      password: user.password || cleanCI,
      surveyCompleted: false,
      fechaRegistro: new Date().toISOString(),
      esCorreoInstitucional: isUmsaDomain,
    };

    await setDoc(userDocRef, newUser);
    return { success: true, user: newUser, message: '¡Registro completado exitosamente!' };
  } catch (error: any) {
    console.error('Error registering new user in Firestore:', error);
    return { success: false, message: 'Error de conexión al registrar el usuario en Firebase.' };
  }
}

// Authenticate or Login user using CI or Email
export async function loginWithCI(identifier: string, passwordInput?: string): Promise<{ success: boolean; user?: RegisteredUser; message?: string }> {
  const cleanInput = identifier.trim();
  if (!cleanInput) {
    return { success: false, message: 'Por favor ingrese su Carnet de Identidad o Correo Electrónico.' };
  }

  try {
    // 1. Try finding by CI doc ID directly
    const userDocRef = doc(db, 'users', cleanInput);
    let userSnap = await getDoc(userDocRef);
    let userData: RegisteredUser | null = null;

    if (userSnap.exists()) {
      userData = userSnap.data() as RegisteredUser;
    } else {
      // 2. Query by email field if not matched by CI
      const q = query(collection(db, 'users'), where('email', '==', cleanInput.toLowerCase()));
      const querySnap = await getDocs(q);
      if (!querySnap.empty) {
        userData = querySnap.docs[0].data() as RegisteredUser;
      }
    }

    if (userData) {
      const expectedPassword = userData.password || userData.ci;
      if (passwordInput && passwordInput !== expectedPassword) {
        return { success: false, message: 'Contraseña incorrecta. (Por defecto es su C.I.)' };
      }
      return { success: true, user: userData, message: 'Inicio de sesión exitoso.' };
    } else {
      // If CI is input and doesn't exist, auto-register default account
      const isEmail = cleanInput.includes('@');
      if (isEmail) {
        return { success: false, message: 'No se encontró ninguna cuenta registrada con este correo. Por favor regístrese.' };
      }

      const cleanCI = cleanInput;
      const newUser: RegisteredUser = {
        ci: cleanCI,
        nombre: `Estudiante CI ${cleanCI}`,
        carrera: 'Ciencias Sociales / UMSA',
        semestre: '1er Semestre',
        facultad: 'Facultad de Ciencias Sociales',
        rol: cleanCI === '123456' || cleanCI.toLowerCase() === 'admin' ? 'administrador' : 'estudiante',
        password: cleanCI,
        surveyCompleted: false,
        fechaRegistro: new Date().toISOString(),
      };
      await setDoc(userDocRef, newUser);
      return { success: true, user: newUser, message: 'Usuario registrado correctamente con su C.I.' };
    }
  } catch (error: any) {
    console.error('Error logging in:', error);
    return { success: false, message: 'Error de conexión con la base de datos Firebase.' };
  }
}

// Save or Update User Profile
export async function saveUserProfile(user: RegisteredUser): Promise<void> {
  try {
    const userDocRef = doc(db, 'users', user.ci);
    await setDoc(userDocRef, user, { merge: true });
  } catch (error) {
    console.error('Error saving user profile to Firestore:', error);
  }
}

// Get All Users from Firestore
export async function getAllUsers(): Promise<RegisteredUser[]> {
  try {
    const snapshot = await getDocs(collection(db, 'users'));
    return snapshot.docs.map((docSnap) => docSnap.data() as RegisteredUser);
  } catch (error) {
    console.error('Error getting all users:', error);
    return [];
  }
}

// Bulk Save Users (Import from Excel)
export async function bulkSaveUsers(users: RegisteredUser[]): Promise<number> {
  let count = 0;
  for (const user of users) {
    if (!user.ci) continue;
    const cleanCI = String(user.ci).trim();
    const userDocRef = doc(db, 'users', cleanCI);
    await setDoc(
      userDocRef,
      {
        ci: cleanCI,
        nombre: user.nombre || `Estudiante CI ${cleanCI}`,
        carrera: user.carrera || 'Ciencias Sociales',
        semestre: user.semestre || '1er Semestre',
        facultad: user.facultad || 'Facultad de Ciencias Sociales',
        rol: user.rol || 'estudiante',
        password: user.password || cleanCI,
        surveyCompleted: user.surveyCompleted || false,
        fechaRegistro: user.fechaRegistro || new Date().toISOString(),
      },
      { merge: true }
    );
    count++;
  }
  return count;
}

// --- SURVEY / ENCUESTA HELPERS ---

export async function saveSurveyToFirestore(survey: SurveyResponse, ci: string): Promise<boolean> {
  try {
    const surveyDocRef = doc(db, 'surveys', ci);
    await setDoc(
      surveyDocRef,
      {
        ...survey,
        ci,
        fechaCompletado: new Date().toISOString(),
      },
      { merge: true }
    );

    // Update surveyCompleted status on user document
    const userDocRef = doc(db, 'users', ci);
    await setDoc(userDocRef, { surveyCompleted: true }, { merge: true });

    return true;
  } catch (error) {
    console.error('Error saving survey to Firestore:', error);
    return false;
  }
}

export async function getAllSurveys(): Promise<(SurveyResponse & { ci: string })[]> {
  try {
    const snapshot = await getDocs(collection(db, 'surveys'));
    return snapshot.docs.map((docSnap) => docSnap.data() as SurveyResponse & { ci: string });
  } catch (error) {
    console.error('Error getting all surveys:', error);
    return [];
  }
}

export async function bulkSaveSurveys(surveys: (SurveyResponse & { ci: string })[]): Promise<number> {
  let count = 0;
  for (const survey of surveys) {
    if (!survey.ci) continue;
    const cleanCI = String(survey.ci).trim();
    const surveyDocRef = doc(db, 'surveys', cleanCI);
    await setDoc(surveyDocRef, { ...survey, ci: cleanCI }, { merge: true });

    const userDocRef = doc(db, 'users', cleanCI);
    await setDoc(userDocRef, { surveyCompleted: true }, { merge: true });
    count++;
  }
  return count;
}

// --- NETWORK CARTOGRAPHY HELPERS ---

export async function saveNetworkMembersToFirestore(ci: string, members: NetworkMember[]): Promise<void> {
  try {
    const userNetworkRef = doc(db, 'network_members', ci);
    await setDoc(userNetworkRef, { ci, members, updatedAt: new Date().toISOString() });
  } catch (error) {
    console.error('Error saving network members:', error);
  }
}

export async function getNetworkMembersFromFirestore(ci: string): Promise<NetworkMember[] | null> {
  try {
    const docRef = doc(db, 'network_members', ci);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data().members as NetworkMember[];
    }
    return null;
  } catch (error) {
    console.error('Error getting network members:', error);
    return null;
  }
}
