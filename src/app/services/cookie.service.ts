import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CookieService {

  constructor() { }

  decode(str: string): string {
    return window.atob(str);
    // return Buffer.from(str, 'base64').toString('binary');
  }

  encode(str: string): string {
    return window.btoa(str);
    // return Buffer.from(str, 'binary').toString('base64');
  }

  setCookie(name: string, val: string) {
    const date = new Date();
    const value = val;

    date.setTime(date.getTime() + (1 * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${this.encode(value)}; expires=${date.toUTCString()}; path=/; SameSite=Strict;`;
  }

  getCookie(name: string) {
    const value = `; ` + document.cookie;
    const parts = value.split(`; ${name}=`);

    if (parts.length == 2) {
      return this.decode(parts.pop().split(";").shift());
    }
  }

  deleteCookie(name: string) {
    const date = new Date();

    document.cookie = `${name}=; Expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/; SameSite=Strict;`;
  }
}
