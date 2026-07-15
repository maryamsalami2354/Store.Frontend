// src/utils/datepicker-setup.js
import { setDefaultOptions } from 'date-fns';
import { faIR } from 'date-fns-jalali/locale';

setDefaultOptions({ locale: faIR, weekStartsOn: 6 });