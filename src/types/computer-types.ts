import { DropdownProps } from 'primereact/dropdown';

interface Computer {
  name?: string;
  friendlyName?: string;
  desktops: DropdownProps[] | string[];
  laptops: DropdownProps[] | string[];
  computerType: string;
  [index: string]: DropdownProps[] | string[] | string;
}

export interface ComputerTypes {
  [computerType: string]: Computer;
}
