export interface Document {
  id: number;
  name: string;
  description: string;
  file_url: string;
  created_at: string;
  updated_at: string;
}

export interface PaginatedDocumentsResponse {
  data: Document[];
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    links: {
      url: string | null;
      label: string;
      active: boolean;
    }[];
    path: string;
    per_page: number;
    to: number;
    total: number;
  };
}

export interface CreateDocumentPayload {
  name: string;
  description: string;
  file: File;
}

export interface UpdateDocumentPayload {
  name?: string;
  description?: string;
  file?: File;
}

export interface MessageResponse {
  message: string;
}
