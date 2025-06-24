import { createContext} from 'react';
import {type AuthContextData} from '../types/authTypes'

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);


