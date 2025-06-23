import { createContext} from 'react';
import {type AuthContextData} from '../types/auth.types'

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);


