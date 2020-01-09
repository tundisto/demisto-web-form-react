import { SelectItem } from 'primereact/api';

interface Computer {
  name: string;
  friendlyName: string;
  desktops?: SelectItem[];
  laptops?: SelectItem[];
}

export interface ComputerTypes {
  [computerType: string]: Computer;
}
