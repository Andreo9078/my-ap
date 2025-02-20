interface RequestFiltes {
  startDateFrom?: Date;
  startDateTo?: Date;
  endDateFrom?: Date;
  endDateTo?: Date;
  techTypeId?: number;
  statusId?: number;
  masterId?: number;
  clientId?: number;
  techModel?: string;
}

interface DetailFilter {
  name?: string;
}
