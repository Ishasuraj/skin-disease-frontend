import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/firebase';

const AuthContext = createContext({
  user: null,
  isAdmin: false,
  isAdminPendingVerification: false,
  loading: true,
  refreshAdminStatus: async () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAdminPendingVerification, setIsAdminPendingVerification] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkAdminStatus = async (currentUser) => {
    if (!currentUser || !currentUser.email) {
      return { isAdmin: false, pendingVerification: false };
    }

    try {
      const adminDocRef = doc(db, 'admins', currentUser.email.toLowerCase());
      const adminDocSnap = await getDoc(adminDocRef);

      if (adminDocSnap.exists()) {
        if (currentUser.emailVerified) {
          return { isAdmin: true, pendingVerification: false };
        } else {
          return { isAdmin: false, pendingVerification: true };
        }
      }
    } catch (err) {
      console.warn('Error checking admin status in Firestore:', err);
    }

    return { isAdmin: false, pendingVerification: false };
  };

  const refreshAdminStatus = async () => {
    if (!auth.currentUser) return;
    setLoading(true);
    try {
      await auth.currentUser.reload();
      setUser({ ...auth.currentUser });
      const status = await checkAdminStatus(auth.currentUser);
      setIsAdmin(status.isAdmin);
      setIsAdminPendingVerification(status.pendingVerification);
    } catch (err) {
      console.error('Failed to refresh admin status:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);
      setUser(currentUser);

      if (!currentUser) {
        setIsAdmin(false);
        setIsAdminPendingVerification(false);
        setLoading(false);
        return;
      }

      const status = await checkAdminStatus(currentUser);
      setIsAdmin(status.isAdmin);
      setIsAdminPendingVerification(status.pendingVerification);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAdmin, isAdminPendingVerification, loading, refreshAdminStatus }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
