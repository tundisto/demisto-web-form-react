import { SelectItem } from 'primereact/api';

interface Computer {
  name?: string;
  friendlyName?: string;
  desktops: SelectItem[] | string[];
  laptops: SelectItem[] | string[];
  computerType: string;
  [index: string]: SelectItem[] | string[] | string;
}

export interface ComputerTypes {
  [computerType: string]: Computer;
}
