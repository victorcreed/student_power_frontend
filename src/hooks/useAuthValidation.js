import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { verifyUser } from '../store/slices/authSlice';

export const useAuthValidation = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector(state => state.auth);
  const [validationAttempted, setValidationAttempted] = useState(false);

  useEffect(() => {
    const validateSession = async () => {
      if (isAuthenticated && !validationAttempted) {
        setValidationAttempted(true);
        await dispatch(verifyUser());
      }
    };

    validateSession();

    const intervalId = setInterval(() => {
      if (isAuthenticated) {
        dispatch(verifyUser());
      }
    }, 5 * 60 * 1000); // Check every 5 minutes

    return () => clearInterval(intervalId);
  }, [dispatch, isAuthenticated, validationAttempted]);

  return { validationAttempted };
};
