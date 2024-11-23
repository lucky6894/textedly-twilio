import axios from "axios";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function signin(token: string) {
  if (localStorage !== undefined) {
    localStorage.setItem('token', token);
  }
  axios.defaults.headers.common['Authorization'] = token;
}

export function signout() {
  if (localStorage !== undefined) {
    localStorage.removeItem('token');
  }
  axios.defaults.headers.common['Authorization'] = null;
}
