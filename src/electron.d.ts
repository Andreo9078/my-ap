interface Window {
  electronAPI: {
    testDB: () => Promise<string>;
    auth: {
      role: {
        getRole: (id: number) => Promise<any>;
        getRoles: () => Promise<any[]>;
        createRole: (role: { name: string }) => Promise<any>;
        updateRole: (id: number, role: { name: string }) => Promise<any>;
        deleteRole: (id: number) => Promise<any>;
      };
      user: {
        getUser: (id: number) => Promise<any>;
        getUsers: (filters: {
          roleId?: number;
          username?: string;
          password?: string;
          name?: string;
        }) => Promise<any[]>;
        createUser: (user: {
          username: string;
          password: string;
          phone_number: string;
          name: string;
          last_name: string;
          patronymic: string;
          role_id: number;
        }) => Promise<any>;
        updateUser: (
          id: number,
          user: {
            username?: string;
            password?: string;
            phone_number?: string;
            name?: string;
            last_name?: string;
            patronymic?: string;
            role_id?: number;
          }
        ) => Promise<any>;
        deleteUser: (id: number) => Promise<any>;
      };
    };
    requests: {
      techType: {
        getTechType: (id: number) => Promise<any>;
        getTechTypes: (filters?: { name?: string }) => Promise<any[]>;
        createTechType: (techType: { name: string }) => Promise<any>;
        updateTechType: (
          id: number,
          techType: { name: string }
        ) => Promise<any>;
        deleteTechType: (id: number) => Promise<any>;
      };
      requestStatus: {
        getRequestStatus: (id: number) => Promise<any>;
        getRequestStatuses: () => Promise<any[]>;
        createRequestStatus: (status: { name: string }) => Promise<any>;
        updateRequestStatus: (
          id: number,
          status: { name: string }
        ) => Promise<any>;
        deleteRequestStatus: (id: number) => Promise<any>;
      };
      detail: {
        getDetail: (id: number) => Promise<any>;
        getDetails: (filters: DetailFilter) => Promise<any[]>;
        createDetail: (detail: { name: string }) => Promise<any>;
        updateDetail: (
          id: number,
          detail: {
            name?: string;
          }
        ) => Promise<any>;
        deleteDetail: (id: number) => Promise<any>;
      };
      request: {
        getRequest: (id: number) => Promise<any>;
        getRequests: (filters: RequestFiltes) => Promise<any[]>;
        createRequest: (request: {
          start_date: Date | null;
          end_date: Date | null;
          description: string;
          tech_model: string;
          tech_type_id: number;
          status_id: number;
          master_id: number | null;
          client_id: number;
          master_report?: string;
        }) => Promise<any>;
        updateRequest: (
          id: number,
          request: {
            start_date?: Date | null;
            end_date?: Date | null;
            description?: string;
            tech_model?: string;
            tech_type_id?: number;
            status_id?: number;
            master_id?: number | null;
            client_id?: number;
            master_report?: string | null;
          }
        ) => Promise<any>;
        deleteRequest: (id: number) => Promise<any>;
      };
      comment: {
        getComment: (id: number) => Promise<any>;
        getComments: (filters: {
          request_id?: number;
          client_id?: number;
          createdFrom?: Date;
          createdTo?: Date;
        }) => Promise<any[]>;
        createComment: (comment: {
          request_id: number;
          client_id: number;
          text: string;
        }) => Promise<any>;
        updateComment: (
          id: number,
          comment: {
            text: string;
          }
        ) => Promise<any>;
        deleteComment: (id: number) => Promise<any>;
      };
      usedDetail: {
        getUsedDetail: (id: number) => Promise<any>;
        getUsedDetails: (filters: {
          request_id?: number;
          detail_id?: number;
        }) => Promise<any[]>;
        createUsedDetail: (usedDetail: {
          detail_id: number;
          request_id: number;
          price: number;
          count: number;
        }) => Promise<any>;
        updateUsedDetail: (
          id: number,
          usedDetail: {
            detail_id: number;
            request_id: number;
            price: number;
            count: number;
          }
        ) => Promise<any>;
        deleteUsedDetail: (id: number) => Promise<any>;
      };
    };
  };
}

interface Request {
  id: number;
  tech_type_id: number;
  tech_model: string;
  description: string;
  status_id: number;
  client_id: number;
  master_id: number;
  start_date: string;
  end_date?: string;
  master_report?: string;
}

interface TechType {
  dataValues: {
    id: number;
    name: string;
  };
}

interface Status {
  dataValues: {
    id: number;
    name: string;
  };
}

interface User {
  dataValues: {
    id: number;
    username: string;
    password: string;
    phone_number: string;
    name: string;
    last_name: string;
    patronymic: string;
    role_id: number;
  };
}

enum Statuses {}
